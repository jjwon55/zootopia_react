import React, { useState, useEffect } from 'react';
// products.js와 디렉터리 모두 존재하므로, 55개 Mock을 포함한 index.js를 명시적으로 사용
import { fetchProducts, fetchCategories } from '../../apis/products/products.js';

import { mockProductsDatabase } from '../../utils/products/mockDatabase';

import SearchSection from '../../components/products/search/SearchSection';
import ProductCard from '../../components/products/ProductCard';

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState('전체');
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

      if (response && response.success && Array.isArray(response.categories)) {
        const categoryList = [
          { name: '전체', icon: '📋' },
          ...response.categories.filter(cat => cat !== '전체').map(cat => ({
            name: cat,
            icon: getCategoryIcon(cat)
          }))
        ];
        setCategories(categoryList);
      } else {
        // 기본 카테고리 설정
        setCategories([
          { name: '전체', icon: '📋' },
          { name: '사료', icon: '🍽️' },
          { name: '용품', icon: '🛍️' },
          { name: '장난감', icon: '🏀' },
          { name: '산책', icon: '🚶‍♂️' },
          { name: '액세서리', icon: '🎀' },
          { name: '위생용품', icon: '🧼' },
          { name: '미용용품', icon: '✂️' }
        ]);
      }
    } catch (error) {
      console.error('Failed to load categories:', error);
      // 실패 시 기본 카테고리 사용
      setCategories([
        { name: '전체', icon: '📋' },
        { name: '사료', icon: '🍽️' },
        { name: '용품', icon: '🛍️' },
        { name: '장난감', icon: '🏀' },
        { name: '산책', icon: '🚶‍♂️' },
        { name: '액세서리', icon: '🎀' },
        { name: '위생용품', icon: '🧼' },
        { name: '미용용품', icon: '✂️' }
      ]);
    }
  };

  const getCategoryIcon = (category) => {
    const icons = {
      '사료': '🍽️',
      '용품': '🛍️',
      '장난감': '🏀',
      '산책': '🚶‍♂️',
      '의류': '👕',
      '액세서리': '🎀',
      '건강': '💊',
      '위생용품': '🧼',
      '미용용품': '✂️'
    };
    return icons[category] || '📦';
  };


  const loadProducts = async () => {
    setLoading(true);
    try {
      const response = await fetchProducts({

        category: selectedCategory === '전체' ? '' : selectedCategory,

        search: searchTerm,
        page: currentPage,
        size: 12
      });
      

  // 요청에 따라 API 결과와 무관하게 mockProductsDatabase 앞 54개만 사용
  const fixedProducts = mockProductsDatabase.slice(0, 55);
  setProducts(fixedProducts);
  setTotalProducts(fixedProducts.length);
  setTotalPages(1);
    } catch (error) {
      console.error('Failed to load products:', error);
  const fixedProducts = mockProductsDatabase.slice(0, 55);
  setProducts(fixedProducts);
  setTotalProducts(fixedProducts.length);
  setTotalPages(1);

    } finally {
      setLoading(false);
    }
  };


  // (요청) 항상 mockProductsDatabase 앞 8개 고정 사용 -> 별도 함수 불필요

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);

  };

  const handleProductClick = (productId) => {
    window.location.href = `/products/detail/${productId}`;
  };

  return (

    <div className="min-h-screen" style={{ backgroundColor: '#FFF6F6' }}>
      {/* 검색 섹션 */}
      <SearchSection
        onSearch={handleSearch}
        onCategorySelect={handleCategoryChange}
        categories={categories}
        activeCategory={selectedCategory}
        searchPlaceholder="상품명을 검색하세요..."
        isLoading={loading}
      />

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* 로딩 상태 */}
        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF9999] mx-auto mb-4"></div>
            <p className="text-gray-600">상품을 불러오는 중...</p>
          </div>
        ) : (
          <React.Fragment>
            {/* 상품 그리드 */}
            {products.length === 0 ? (
              <div className="text-center py-16 text-gray-500">
                <div className="text-6xl mb-4">📦</div>
                <p className="text-xl">조건에 맞는 상품이 없습니다.</p>
              </div>
            ) : (
              <div className="products-grid">
                {products.map(product => (
                  <ProductCard
                    key={product.no}
                    product={product}
                    onClick={handleProductClick}
                  />

                ))}
              </div>
            )}

            {/* 페이지네이션 */}
            {totalPages > 1 && (

      <div className="flex justify-center mt-8">

                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}

        className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors border-[#FFC2C2] hover:bg-[#FFE5E5] text-[#A04545]"
                  >
                    이전

                  </button>
                  
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}

                        className={`px-4 py-2 rounded-lg transition-colors ${
                          currentPage === pageNum
                            ? 'bg-[#FF9999] text-white hover:bg-[#FF8C8C]'
                            : 'border border-[#FFC2C2] text-[#A04545] hover:bg-[#FFE5E5]'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}

                    className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors border-[#FFC2C2] hover:bg-[#FFE5E5] text-[#A04545]"
                  >
                    다음

                  </button>
                </div>
              </div>
            )}

          </React.Fragment>

        )}
      </div>
    </div>
  );
}
