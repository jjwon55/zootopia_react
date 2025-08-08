import api from './api';

// Mock 데이터
const mockProducts = [
  {
    no: 1,
    id: 1,
    name: '프리미엄 강아지 사료',
    price: 35000,
    imageUrl: '/src/assets/img/products/fooddogmeat.png',
    image: '/src/assets/img/products/fooddogmeat.png',
    category: 'food',
    description: '건강한 성장을 위한 프리미엄 강아지 사료입니다.',
    stock: 50
  },
  {
    no: 2,
    id: 2,
    name: '고양이 장난감 세트',
    price: 15000,
    imageUrl: '/src/assets/img/products/toycatrod.png',
    image: '/src/assets/img/products/toycatrod.png',
    category: 'toy',
    description: '고양이가 좋아하는 다양한 장난감 세트입니다.',
    stock: 30
  },
  {
    no: 3,
    id: 3,
    name: '펫 샴푸',
    price: 12000,
    imageUrl: '/src/assets/img/products/productpetshampoo.png',
    image: '/src/assets/img/products/productpetshampoo.png',
    category: 'care',
    description: '순한 성분의 펫 전용 샴푸입니다.',
    stock: 20
  },
  {
    no: 4,
    id: 4,
    name: '강아지 하네스',
    price: 18000,
    imageUrl: '/src/assets/img/products/productdogharness.png',
    image: '/src/assets/img/products/productdogharness.png',
    category: 'accessory',
    description: '편안하고 안전한 강아지 하네스입니다.',
    stock: 25
  },
  {
    no: 5,
    id: 5,
    name: '고양이 모래',
    price: 8000,
    imageUrl: '/src/assets/img/products/productcathygienepad.png',
    image: '/src/assets/img/products/productcathygienepad.png',
    category: 'care',
    description: '냄새 제거 효과가 뛰어난 고양이 모래입니다.',
    stock: 40
  },
  {
    no: 6,
    id: 6,
    name: '펫 침대',
    price: 45000,
    imageUrl: '/src/assets/img/products/productpetbed.png',
    image: '/src/assets/img/products/productpetbed.png',
    category: 'accessory',
    description: '푹신하고 따뜻한 펫 전용 침대입니다.',
    stock: 15
  }
];

const mockCategories = [
  { id: 'food', name: '사료' },
  { id: 'toy', name: '장난감' },
  { id: 'care', name: '케어용품' },
  { id: 'accessory', name: '악세서리' }
];

// 상품 목록 조회
export const fetchProducts = async (params = {}) => {
  try {
    // 실제 API 호출 시도
    const response = await api.get('/products', { params });
    return {
      success: true,
      products: response.data.products || response.data,
      pagination: response.data.pagination
    };
  } catch (error) {
    console.warn('API 호출 실패, Mock 데이터 사용:', error.message);
    // API 실패 시 Mock 데이터 반환
    return {
      success: true,
      products: mockProducts,
      pagination: {
        page: 1,
        size: 10,
        total: mockProducts.length
      }
    };
  }
};

// 상품 상세 조회
export const fetchProductDetail = async (productId) => {
  try {
    const response = await api.get(`/products/${productId}`);
    return {
      success: true,
      product: response.data
    };
  } catch (error) {
    console.warn('API 호출 실패, Mock 데이터 사용:', error.message);
    // Mock 데이터에서 해당 상품 찾기
    const product = mockProducts.find(p => p.id == productId);
    if (product) {
      return {
        success: true,
        product: product
      };
    }
    return {
      success: false,
      error: '상품을 찾을 수 없습니다.'
    };
  }
};

// 상품 검색
export const searchProducts = async (keyword, params = {}) => {
  try {
    const response = await api.get('/products/search', {
      params: { keyword, ...params }
    });
    return {
      success: true,
      products: response.data.products || response.data,
      pagination: response.data.pagination
    };
  } catch (error) {
    console.error('Product search error:', error);
    return {
      success: false,
      error: error.message,
      products: []
    };
  }
};

// 카테고리별 상품 조회
export const fetchProductsByCategory = async (categoryId, params = {}) => {
  try {
    const response = await api.get(`/products/category/${categoryId}`, { params });
    return {
      success: true,
      products: response.data.products || response.data,
      pagination: response.data.pagination
    };
  } catch (error) {
    console.error('Products by category fetch error:', error);
    return {
      success: false,
      error: error.message,
      products: []
    };
  }
};

// 카테고리 목록 조회
export const fetchCategories = async () => {
  try {
    const response = await api.get('/categories');
    return {
      success: true,
      categories: response.data.categories || response.data
    };
  } catch (error) {
    console.warn('API 호출 실패, Mock 데이터 사용:', error.message);
    // API 실패 시 Mock 데이터 반환
    return {
      success: true,
      categories: mockCategories
    };
  }
};
