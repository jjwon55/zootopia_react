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
    
    // API 호출 실패 시 임시 Mock 데이터 (55개) + 페이징 적용
    const categories = ['사료', '장난감', '용품', '산책', '의류', '건강용품'];
    const allProducts = Array.from({ length: 55 }, (_, i) => {
      const idx = i + 1;
      const cat = categories[i % categories.length];
      return {
        no: idx,
        name: `${cat} 상품 ${idx}`,
        price: 8000 + (idx % 12) * 3000,
        category: cat,
        imageUrl: `https://picsum.photos/seed/p${idx}/320/200`,
        description: `${cat} 카테고리의 더미 상품 설명 ${idx}`,
        views: 10 + idx,
        likes: idx % 20,
        stock: 5 + (idx % 30),
        status: '판매중'
      };
    })
      // 카테고리 필터
      .filter(p => !category || category === '' || category === '전체' || p.category === category)
      // 검색어 필터
      .filter(p => !search || p.name.includes(search) || p.description.includes(search));

    const totalProducts = allProducts.length;
    const start = (page - 1) * size;
    const end = Math.min(start + size, totalProducts);
    const pageItems = allProducts.slice(start, Math.max(start, end));

    return {
      success: true,
      products: pageItems,
      totalProducts,
      currentPage: page,
      totalPages: Math.max(1, Math.ceil(totalProducts / size))
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
  categories: ['전체', '사료', '장난감', '용품', '산책', '의류', '건강용품']
    };
  }
}
