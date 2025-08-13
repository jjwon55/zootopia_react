// 상품 관련 API 호출 함수들 (통합)
import { mockProductsDatabase, simulateApiCall } from '../../utils/products/mockDatabase.js';
const API_BASE_URL = 'http://localhost:8080';

// 상품 목록 조회
export async function fetchProducts({ category = '', search = '', page = 1, size = 12 } = {}) {
  try {
    const qs = new URLSearchParams({
      category: category === '전체' ? '' : category,
      search,
      page,
      size
    });
    const response = await fetch(`${API_BASE_URL}/products/api/list?${qs}`);
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API 호출 실패, Mock 데이터 사용:', error);
    // Mock DB로 시뮬레이션 + success 플래그 포함
    const result = await simulateApiCall((params) => {
      let filtered = [...mockProductsDatabase];
      if (params.category && params.category !== '전체') {
        filtered = filtered.filter(p => p.category === params.category);
      }
      if (params.search) {
        const q = String(params.search).toLowerCase();
        filtered = filtered.filter(p =>
          p.name.toLowerCase().includes(q) ||
          (p.description || '').toLowerCase().includes(q)
        );
      }
      const pageNum = parseInt(params.page);
      const sizeNum = parseInt(params.size);
      const start = (pageNum - 1) * sizeNum;
      const end = start + sizeNum;
      const items = filtered.slice(start, end);
      return {
        success: true,
        products: items,
        totalProducts: filtered.length,
        currentPage: pageNum,
        totalPages: Math.max(1, Math.ceil(filtered.length / sizeNum))
      };
    }, { category, search, page, size });
    return result;
  }
}

// 상품 상세 조회
export async function fetchProductDetail(productId) {
  try {
    const response = await fetch(`${API_BASE_URL}/products/api/detail/${productId}`);
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API 호출 실패, Mock 데이터 사용:', error);
    const result = await simulateApiCall((id) => {
      const p = mockProductsDatabase.find(it => String(it.no) === String(id));
      if (!p) throw new Error('상품을 찾을 수 없습니다.');
      return { success: true, product: p };
    }, productId);
    return result;
  }
}

// 카테고리 목록 조회
export async function fetchCategories() {
  try {
    const response = await fetch(`${API_BASE_URL}/products/api/categories`);
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API 호출 실패, Mock 데이터 사용:', error);
    const result = await simulateApiCall(() => {
      const categories = [...new Set(mockProductsDatabase.map(p => p.category))];
      return { success: true, categories: ['전체', ...categories] };
    });
    return result;
  }
}
