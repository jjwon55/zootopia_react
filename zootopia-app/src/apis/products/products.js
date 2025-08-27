// 상품 관련 API 호출 함수들 (통합)
import api from '../api';
import { mockProductsDatabase, simulateApiCall } from '../../utils/products/mockDatabase.js';
import { imagesByFilename } from '../../utils/products/images.js';

// 서버에서 내려온 imageUrl이 '/assets/dist/img/products/파일명' 형태면
// 파일명만 뽑아 번들된 로컬 에셋 URL로 치환
function mapImageUrl(url) {
  if (!url) return url;
  try {
    const m = url.match(/\/assets\/dist\/img\/products\/(.+)$/);
    if (m && m[1]) {
      const filename = m[1];
      return imagesByFilename[filename] || url;
    }
    return url;
  } catch {
    return url;
  }
}

// 상품 목록 조회
export async function fetchProducts({ category = '', search = '', page = 1, size = 12 } = {}) {
  try {
    const { data } = await api.get('/products/api/list', {
      params: {
        category: category === '전체' ? '' : category,
        search,
        page,
        size,
      },
    });
    if (data?.products) {
      const now = Date.now();
      const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;
      data.products = data.products.map(p => {
        let isNew = false;
        try {
          const d = p.regDate ? new Date(p.regDate).getTime() : null;
          if (d && now - d <= THIRTY_DAYS) isNew = true;
        } catch {}
        return {
          ...p,
          imageUrl: mapImageUrl(p.imageUrl),
          isNew,
        };
      });
    }
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
  const { data } = await api.get(`/products/api/detail/${productId}`);
  if (data?.product) {
    data.product = {
      ...data.product,
      imageUrl: mapImageUrl(data.product.imageUrl)
    };
  }
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
  const { data } = await api.get('/products/api/categories');
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
