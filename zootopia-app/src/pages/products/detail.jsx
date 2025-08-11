import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchProductDetail } from '../../apis/products';
import { addToCart } from '../../apis/cart';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    loadProductDetail();
  }, [id]);

  const loadProductDetail = async () => {
    setLoading(true);
    try {
      const response = await fetchProductDetail(id);
      if (response.success) {
        setProduct(response.product);
        // 이미지가 없는 경우 기본 이미지 배열 생성
        if (!response.product.images) {
          response.product.images = [
            response.product.imageUrl || '/assets/dist/img/products/default.jpg'
          ];
        }
      }
    } catch (error) {
      console.error('Failed to load product detail:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-4xl text-red-400 mb-4"></i>
          <p>상품 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-exclamation-triangle text-4xl text-gray-400 mb-4"></i>
          <p className="text-xl text-gray-600">상품을 찾을 수 없습니다.</p>
          <button 
            onClick={() => window.history.back()}
            className="mt-4 bg-red-400 text-white px-6 py-2 rounded-lg hover:bg-red-500"
          >
            뒤로 가기
          </button>
        </div>
      </div>
    );
  }

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= (product.stock || 50)) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = async () => {
    if (!product || product.status === '품절') return;

    setAddingToCart(true);
    try {
      const response = await addToCart(1, product.no || product.id, quantity); // 임시로 userId 1 사용
      if (response.success) {
        alert(`${product.name}이(가) 장바구니에 추가되었습니다.`);
      } else {
        alert(response.message || '장바구니 추가에 실패했습니다.');
      }
    } catch (error) {
      console.error('Failed to add to cart:', error);
      alert('장바구니 추가에 실패했습니다.');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = () => {
    if (!product || product.status === '품절') return;
    
    // 바로 구매 로직 (체크아웃 페이지로 이동하며 상품 정보 전달)
    const orderData = {
      items: [{
        productId: product.no || product.id,
        productName: product.name,
        price: product.price,
        quantity: quantity,
        imageUrl: product.imageUrl
      }],
      totalAmount: product.price * quantity
    };
    
    // 로컬 스토리지에 주문 정보 저장 후 체크아웃 페이지로 이동
    localStorage.setItem('tempOrder', JSON.stringify(orderData));
    window.location.href = '/checkout';
  };

  const images = product.images || [product.imageUrl];
  const rating = product.rating || 4.5;
  const reviewCount = product.reviewCount || 128;

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-6xl mx-auto px-4">
        {/* 브레드크럼 */}
        <nav className="mb-8">
          <div className="flex items-center space-x-2 text-sm">
            <a href="/" className="text-red-400 hover:text-red-500">홈</a>
            <span className="text-gray-400">&gt;</span>
            <a href="/products/listp" className="text-red-400 hover:text-red-500">스토어</a>
            <span className="text-gray-400">&gt;</span>
            <span className="text-gray-600">{product.name}</span>
          </div>
        </nav>

        {/* 상품 상세 정보 */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 이미지 섹션 */}
            <div className="space-y-4">
              <div className="relative">
                {product.status === '품절' && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10 rounded-lg">
                    <span className="text-white text-2xl font-bold">품절</span>
                  </div>
                )}
                <img
                  src={images[selectedImage]}
                  alt={product.name}
                  className="w-full h-96 object-cover rounded-lg shadow-lg"
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/500x400'; }}
                />
              </div>
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      onClick={() => setSelectedImage(index)}
                      className={`w-20 h-20 object-cover rounded cursor-pointer border-2 transition-colors ${
                        selectedImage === index ? 'border-red-400' : 'border-gray-200 hover:border-red-300'
                      }`}
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/80'; }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* 상품 정보 섹션 */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.name}</h1>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <i
                        key={i}
                        className={`fas fa-star ${
                          i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                      ></i>
                    ))}
                    <span className="ml-2 text-gray-600">({reviewCount})</span>
                  </div>
                  <span className="text-sm bg-red-100 text-red-600 px-2 py-1 rounded">
                    {product.category}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-bold text-red-400">
                    {product.price?.toLocaleString()}원
                  </span>
                </div>
                <p className="text-gray-600">{product.description}</p>
              </div>

              {/* 재고 정보 */}
              <div className="text-sm text-gray-500">
                재고: {product.stock || 50}개 남음
              </div>

              {/* 수량 선택 */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">수량</label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      className="w-10 h-10 rounded-full border-2 border-red-400 text-red-400 hover:bg-red-400 hover:text-white transition-colors flex items-center justify-center"
                    >
                      <i className="fas fa-minus"></i>
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock || 50, parseInt(e.target.value) || 1)))}
                      className="w-20 text-center border border-gray-300 rounded py-2"
                    />
                    <button
                      onClick={() => handleQuantityChange(1)}
                      className="w-10 h-10 rounded-full border-2 border-red-400 text-red-400 hover:bg-red-400 hover:text-white transition-colors flex items-center justify-center"
                    >
                      <i className="fas fa-plus"></i>
                    </button>
                    <span className="text-sm text-gray-500">재고: {product.stock || 50}개</span>
                  </div>
                </div>

                {/* 총 가격 */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>총 가격:</span>
                    <span className="text-red-400">{(product.price * quantity).toLocaleString()}원</span>
                  </div>
                </div>
              </div>

              {/* 버튼 */}
              <div className="flex gap-3">
                <button 
                  onClick={handleAddToCart}
                  disabled={product.status === '품절' || addingToCart}
                  className="flex-1 bg-gradient-to-r from-red-400 to-red-500 hover:from-red-500 hover:to-red-600 text-white py-3 px-6 rounded-lg font-bold transition-all transform hover:-translate-y-1 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {addingToCart ? (
                    <>
                      <i className="fas fa-spinner fa-spin mr-2"></i>추가 중...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-shopping-cart mr-2"></i>장바구니 담기
                    </>
                  )}
                </button>
                <button 
                  onClick={handleBuyNow}
                  disabled={product.status === '품절' || addingToCart}
                  className="flex-1 bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-white py-3 px-6 rounded-lg font-bold transition-all transform hover:-translate-y-1 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  <i className="fas fa-credit-card mr-2"></i>바로 구매
                </button>
              </div>
            </div>
          </div>

          {/* 상품 상세 설명 */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">상품 상세 정보</h2>
            <p className="text-gray-700 leading-relaxed">{product.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
