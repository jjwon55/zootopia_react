// 상품 관련 API 호출 함수들
const API_BASE_URL = 'http://localhost:8080';

// 상품 목록 조회
export async function fetchProducts({ 
  category = '', 
  search = '', 
  page = 1, 
  size = 12 
} = {}) {
  try {
    const params = new URLSearchParams();
    if (category && category !== '전체') params.append('category', category);
    if (search) params.append('search', search);
    params.append('page', page);
    params.append('size', size);

    const response = await fetch(`${API_BASE_URL}/products/api/list?${params}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch products:', error);
    
    // API 호출 실패 시 임시 Mock 데이터 반환
    return {
      success: true,
      products: [
        {
          no: 1,
          name: '강아지 사료',
          price: 25000,
          category: '사료',
          imageUrl: '/assets/dist/img/products/dogfood.jpg',
          description: '영양 만점 강아지 사료'
        },
        {
          no: 2,
          name: '고양이 장난감',
          price: 12000,
          category: '장난감',
          imageUrl: '/assets/dist/img/products/cattoy.jpg',
          description: '재미있는 고양이 장난감'
        },
        {
          no: 3,
          name: '애완용품 세트',
          price: 35000,
          category: '용품',
          imageUrl: '/assets/dist/img/products/petset.jpg',
          description: '반려동물 필수 용품 세트'
        }
      ],
      totalProducts: 3,
      currentPage: 1,
      totalPages: 1
    };
  }
}

// 상품 상세 조회
export async function fetchProductDetail(productId) {
  try {
    const response = await fetch(`${API_BASE_URL}/products/api/detail/${productId}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch product detail:', error);
    
    // API 호출 실패 시 임시 Mock 데이터 반환
    return {
      success: true,
      product: {
        no: productId,
        name: `상품 ${productId}`,
        price: 25000,
        category: '사료',
        imageUrl: '/assets/dist/img/products/dogfood.jpg',
        description: '상품 설명입니다.',
        stock: 50,
        status: '판매중'
      }
    };
  }
}

// 카테고리 목록 조회
export async function fetchCategories() {
  try {
    const response = await fetch(`${API_BASE_URL}/products/api/categories`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    
    // API 호출 실패 시 기본 카테고리 반환
    return {
      success: true,
      categories: ['전체', '사료', '장난감', '용품', '의류', '건강용품']
    };
  }
}
