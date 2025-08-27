import React, { useState, useEffect } from 'react';
// products.js와 디렉터리 모두 존재하므로, 55개 Mock을 포함한 index.js를 명시적으로 사용
import { fetchProducts, fetchCategories } from '../../apis/products/products.js';

import { mockProductsDatabase } from '../../utils/products/mockDatabase';

import SearchSection from '../../components/products/search/SearchSection';
import ProductCard from '../../components/products/ProductCard';
import { useLoginContext } from '../../context/LoginContextProvider';

export default function ProductList() {
  const { roles } = useLoginContext();
  const isAdmin = !!roles?.isAdmin;
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  // 로컬 오버레이(신규/실서버 동기 제품)를 저장/병합해 Mock 보완
  const OVERLAY_KEY = 'customProductsOverlay';
  const loadOverlay = () => {
    try {
      return JSON.parse(localStorage.getItem(OVERLAY_KEY) || '[]');
    } catch {
      return [];
    }
  };
  const saveOverlay = (items = []) => {
    try {
      // 기존과 병합 (no 또는 name 기준 중복 제거)
      const prev = loadOverlay();
      const map = new Map();
      [...prev, ...items].forEach(p => {
        const key = p?.no ?? p?.name;
        if (key != null) map.set(String(key), p);
      });
      localStorage.setItem(OVERLAY_KEY, JSON.stringify(Array.from(map.values())));
    } catch {}
  };

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
      // 1) API 우선 조회
      const api = await fetchProducts({
        category: selectedCategory,
        search: searchTerm,
        page: currentPage,
        size: 12,
      });

      let data;
      if (api && api.success && Array.isArray(api.products)) {
        data = api.products;
        // API 성공 시에도 로컬 오버레이(신규 등록 제품) 병합하여 목록에 노출
        const overlay = loadOverlay();
        if (Array.isArray(overlay) && overlay.length) {
          const exists = new Set(data.map(p => String(p.no ?? p.name)));
          overlay.forEach(p => {
            const key = String(p.no ?? p.name);
            if (!exists.has(key)) {
              data.push(p);
              exists.add(key);
            }
          });
        }
        // 페이지네이션 메타 동기화 (서버 기준 유지)
        setTotalProducts(api.totalProducts ?? data.length ?? 0);
        setTotalPages(api.totalPages ?? 1);
        // 오프라인 대비로 서버 결과를 오버레이에도 저장(중복은 내부에서 정리)
        saveOverlay(api.products);
      } else {
        // 2) 실패 시 Mock로 대체 (기존 로직)
        data = mockProductsDatabase.slice(0, 55);
        // 오버레이 병합 -> 카테고리/검색과 동일 기준으로 필터
        const overlay = loadOverlay();
        if (Array.isArray(overlay) && overlay.length) {
          const merged = [...data];
          const exists = new Set(merged.map(p => String(p.no ?? p.name)));
          overlay.forEach(p => {
            const key = String(p.no ?? p.name);
            if (!exists.has(key)) {
              merged.push(p);
              exists.add(key);
            }
          });
          data = merged;
        }
      }

      // 카테고리 필터 ("전체" 는 통과)
      if (selectedCategory && selectedCategory !== '전체') {
        data = data.filter(p => p.category === selectedCategory);
      }

      // 검색어 필터 (이름 + 설명 간단 매칭)
      if (searchTerm.trim()) {
        const term = searchTerm.trim().toLowerCase();
        data = data.filter(p =>
          p.name.toLowerCase().includes(term) ||
          (p.description && p.description.toLowerCase().includes(term))
        );
      }

      // API가 페이지네이션을 처리해 내려오면 그대로 사용, 아니면 클라이언트 처리
  if (!(api && api.success && Array.isArray(api.products))) {
        const pageSize = 12;
        const total = data.length;
        const pages = Math.max(1, Math.ceil(total / pageSize));
        const clampedPage = Math.min(currentPage, pages);
        if (clampedPage !== currentPage) {
          setCurrentPage(clampedPage);
        }
        const start = (clampedPage - 1) * pageSize;
        data = data.slice(start, start + pageSize);
        setTotalProducts(total);
        setTotalPages(pages);
      }

      setProducts(data);
    } catch (error) {
      console.error('Failed to load products:', error);
      setProducts([]);
      setTotalProducts(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };


  // 카테고리/검색 기반 필터링으로 동작 (Mock 데이터 로컬 처리)

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

  const handleCreateProduct = () => {
  // SPA 내 등록 페이지로 이동
  window.location.href = '/products/create';
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
        adminAction={isAdmin ? (
          <div className="tw:flex tw:gap-2">
            <button
              onClick={handleCreateProduct}
              className="tw:inline-flex tw:items-center tw:gap-2 tw:px-4 tw:py-2 tw:rounded-lg tw:text-white tw:bg-[#FF9999] hover:tw:bg-[#FF7A7A] tw:shadow"
            >
              상품등록
            </button>
          </div>
        ) : null}
      />

      <div className="max-w-6xl mx-auto px-4 py-6">
  {/* 관리자 전용 버튼은 SearchSection에서 렌더링됨 */}
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
