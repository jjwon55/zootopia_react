import React, { useState, useEffect } from 'react';
import { fetchProducts, fetchCategories } from '../../apis/products';

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([{ id: 'all', name: '전체' }]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  // 카테고리 목록 로드
  useEffect(() => {
    loadCategories();
  }, []);

  // 상품 목록 로드
  useEffect(() => {
    loadProducts();
  }, [selectedCategory, searchTerm, currentPage]);

  const loadCategories = async () => {
    try {
      const response = await fetchCategories();
      if (response.success) {
        const allCategories = [{ id: 'all', name: '전체' }, ...response.categories];
        setCategories(allCategories);
      }
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  const loadProducts = async () => {
    setLoading(true);
    try {
      const response = await fetchProducts({
        category: selectedCategory,
        search: searchTerm,
        page: currentPage,
        size: 12
      });
      
      if (response.success) {
        setProducts(response.products || []);
        setTotalProducts(response.totalProducts || 0);
        setTotalPages(response.totalPages || 1);
      }
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1); // 카테고리 변경 시 첫 페이지로
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // 검색 시 첫 페이지로
  };

  const handleProductClick = (productId) => {
    window.location.href = `/products/detail/${productId}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 페이지 헤더 */}
      <div className="bg-gradient-to-br from-red-400 to-red-500 text-white py-12 mb-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">
            <i className="fas fa-store mr-3"></i>ZOOTOPIA 스토어
          </h1>
          <p className="text-lg mb-6">귀여운 반려동물과 함께하는 특별한 순간</p>
          
          <div className="flex justify-center flex-wrap gap-4">
            <span className="bg-white bg-opacity-20 border border-white border-opacity-30 backdrop-blur px-4 py-2 rounded-full text-sm">
              <i className="fas fa-box mr-1"></i>총 {totalProducts}개 상품
            </span>
            <span className="bg-white bg-opacity-20 border border-white border-opacity-30 backdrop-blur px-4 py-2 rounded-full text-sm">
              <i className="fas fa-tags mr-1"></i>
              {categories.find(cat => cat.id === selectedCategory)?.name || '전체'} 카테고리
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4">
        {/* 검색 및 필터 */}
        <div className="mb-8">
          {/* 검색 */}
          <div className="mb-6">
            <div className="max-w-md mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="상품명을 검색하세요..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-red-400"
                />
                <i className="fas fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              </div>
            </div>
          </div>

          {/* 카테고리 버튼 */}
          <div className="flex justify-center flex-wrap gap-2 mb-6">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === category.id
                    ? 'bg-red-400 text-white transform scale-105'
                    : 'border border-red-400 text-red-400 hover:bg-red-400 hover:text-white'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* 로딩 상태 */}
        {loading ? (
          <div className="text-center py-16">
            <i className="fas fa-spinner fa-spin text-4xl text-red-400 mb-4"></i>
            <p className="text-gray-600">상품을 불러오는 중...</p>
          </div>
        ) : (
          <>
            {/* 상품 그리드 */}
            {products.length === 0 ? (
              <div className="text-center py-16 text-gray-500">
                <i className="fas fa-box-open text-6xl mb-4"></i>
                <p className="text-xl">조건에 맞는 상품이 없습니다.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
                {products.map(product => (
                  <div
                    key={product.no}
                    onClick={() => handleProductClick(product.no)}
                    className="bg-white rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 cursor-pointer"
                  >
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-24 sm:h-28 md:h-30 lg:h-32 xl:h-36 2xl:h-40 object-cover rounded-t-lg"
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/300x200'; }}
                    />
                    <div className="p-4">
                      <span className="inline-block bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full mb-2">
                        {product.category}
                      </span>
                      <h3 className="font-bold text-lg mb-2">{product.name}</h3>
                      <p className="text-gray-600 text-sm mb-3">{product.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-2xl font-bold text-red-400">
                          {product.price?.toLocaleString()}원
                        </span>
                        <div className="flex gap-2">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              // 장바구니 추가 로직
                            }}
                            className="bg-red-400 hover:bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                          >
                            <i className="fas fa-shopping-cart mr-1"></i>담기
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleProductClick(product.no);
                            }}
                            className="border border-red-400 text-red-400 hover:bg-red-400 hover:text-white px-3 py-2 rounded-lg text-sm transition-colors"
                          >
                            <i className="fas fa-eye"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 페이지네이션 */}
            {totalPages > 1 && (
              <div className="flex justify-center mb-12">
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                  >
                    <i className="fas fa-chevron-left"></i>
                  </button>
                  
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-4 py-2 rounded-lg ${
                          currentPage === pageNum
                            ? 'bg-red-400 text-white'
                            : 'border border-gray-300 hover:bg-gray-100'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                  >
                    <i className="fas fa-chevron-right"></i>
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
