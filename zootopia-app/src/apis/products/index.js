// 상품 관련 API 호출 함수들 (메인 API 파일)
import { mockProductsDatabase, simulateApiCall } from '../../utils/products/mockDatabase.js';

const API_BASE_URL = 'http://localhost:8080';

/**
 * 상품 목록 조회
 * @param {Object} params - 검색 매개변수
 * @param {string} params.category - 카테고리
 * @param {string} params.search - 검색어
 * @param {number} params.page - 페이지 번호
 * @param {number} params.size - 페이지 크기
 * @returns {Promise<Object>} 상품 목록 데이터
 */
export async function fetchProducts({ 
  category = '', 
  search = '', 
  page = 1, 
  size = 12 
} = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}/products/api/list?${new URLSearchParams({
      category: category === '전체' ? '' : category,
      search,
      page,
      size
    })}`);
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API 호출 실패, Mock 데이터 사용:', error);
    
    // Mock 데이터베이스를 사용한 API 시뮬레이션
    return await simulateApiCall((params) => {
      let filteredProducts = [...mockProductsDatabase];
      
      // 카테고리 필터링
      if (params.category && params.category !== '전체') {
        filteredProducts = filteredProducts.filter(product => 
          product.category === params.category
        );
      }
      
      // 검색 필터링
      if (params.search) {
        filteredProducts = filteredProducts.filter(product =>
          product.name.toLowerCase().includes(params.search.toLowerCase()) ||
          product.description.toLowerCase().includes(params.search.toLowerCase())
        );
      }
      
      // 페이지네이션
      const startIndex = (parseInt(params.page) - 1) * parseInt(params.size);
      const endIndex = startIndex + parseInt(params.size);
      const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
      
      return {
        products: paginatedProducts,
        totalProducts: filteredProducts.length,
        currentPage: parseInt(params.page),
        totalPages: Math.ceil(filteredProducts.length / parseInt(params.size))
      };
    }, { category, search, page, size });
  }
}

/**
 * 상품 상세 조회
 * @param {string|number} productId - 상품 ID
 * @returns {Promise<Object>} 상품 상세 데이터
 */
export async function fetchProductDetail(productId) {
  try {
    const response = await fetch(`${API_BASE_URL}/products/api/detail/${productId}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API 호출 실패, Mock 데이터 사용:', error);
    
    // Mock 데이터베이스를 사용한 API 시뮬레이션
    return await simulateApiCall((id) => {
      const product = mockProductsDatabase.find(p => p.no === parseInt(id));
      
      if (!product) {
        throw new Error('상품을 찾을 수 없습니다.');
      }
      
      return { product };
    }, productId);
  }
}

/**
 * 카테고리 목록 조회
 * @returns {Promise<Object>} 카테고리 목록 데이터
 */
export async function fetchCategories() {
  try {
    const response = await fetch(`${API_BASE_URL}/products/api/categories`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API 호출 실패, Mock 데이터 사용:', error);
    
    // Mock 데이터베이스를 사용한 API 시뮬레이션
    return await simulateApiCall(() => {
      const categories = [...new Set(mockProductsDatabase.map(p => p.category))];
      return {
        categories: ['전체', ...categories]
      };
    });
  }
}
