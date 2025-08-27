// cart.js - 장바구니 관련 API 호출
// 서버 호출은 공용 axios 인스턴스를 사용해 JWT를 자동으로 포함시키고, Vite 프록시를 통해 CORS를 피합니다.
import api from '../api';
import apiNoAuth from './httpNoAuth';
import { imagesByFilename } from '../../utils/products/images.js';
// 제품 목 데이터베이스를 사용해 이미지/가격/카테고리를 동기화 (서버 실패 시 폴백)
import { mockProductsDatabase } from '../../utils/products/mockDatabase.js';

// 로컬 스토리지 유틸리티 (userId에 따라 동적 키)
const GUEST_USER_ID = 'guest';
const DEFAULT_USER_ID = 1;
const cartKey = (userId) => `cart:user:${userId}`;
const readLocalCart = (userId) => {
  try {
    const raw = localStorage.getItem(cartKey(userId));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};
const writeLocalCart = (userId, items) => {
  try {
    localStorage.setItem(cartKey(userId), JSON.stringify(items));
  } catch {}
};
// 신규 등록 제품(오버레이) 조회
const readOverlay = () => {
  try { return JSON.parse(localStorage.getItem('customProductsOverlay') || '[]'); } catch { return []; }
};
const findProductById = (id) => {
  const mock = mockProductsDatabase.find(p => String(p.no) === String(id));
  if (mock) return mock;
  const overlay = readOverlay();
  return overlay.find(p => String(p.no) === String(id));
};
const sanitizeImage = (url) => {
  if (!url) return url;
  // base64 데이터는 로컬스토리지 용량 초과를 유발할 수 있으므로 생략
  if (String(url).startsWith('data:')) return '';
  return url;
};
const calcTotals = (items) => ({
  totalAmount: items.reduce((s, it) => s + (it.price || 0) * (it.quantity || 0), 0),
  totalItems: items.reduce((s, it) => s + (it.quantity || 0), 0)
});

// 개발 모드 여부
const isDev = () => !!(import.meta && import.meta.env && import.meta.env.DEV);

// 개발 환경에서는 장바구니 API에 Authorization 헤더를 붙이지 않아 403(만료 토큰) 방지
const pickClient = () => (import.meta?.env?.DEV ? apiNoAuth : api);

// 장바구니 아이템 조회
export async function fetchCartItems(userId = 1) {
  try {
  // 개발 모드: 서버 대신 로컬 스토리지 사용
  if (isDev()) {
    const local = readLocalCart(userId);
    const { totalAmount, totalItems } = calcTotals(local);
    return { success: true, cartItems: local, totalAmount, totalItems };
  }
  // 프록시 + JWT 인증
  // baseURL('/api') + path('/api/cart/...') → 브라우저는 '/api/api/cart/...'
  // Vite 프록시는 선두 '/api'만 제거하므로 실제 백엔드로는 '/api/cart/...'로 전달됩니다.
  const client = pickClient();
  const { data } = await client.get(`/api/cart/${userId}`);
  if (data?.cartItems) {
    data.cartItems = data.cartItems.map(it => {
      const m = (it.imageUrl || '').match(/\/assets\/dist\/img\/products\/(.+)$/);
      return {
        ...it,
        imageUrl: m && m[1] && imagesByFilename[m[1]] ? imagesByFilename[m[1]] : it.imageUrl
      };
    });
  }
  return data;
  } catch (error) {
    console.error('Failed to fetch cart items:', error);
  // API 실패 시: 로컬 스토리지 장바구니 사용 (현 사용자 → guest → 기본 1번 사용자 순)
  let cartItems = readLocalCart(userId);
  if (!cartItems || cartItems.length === 0) {
    const guestItems = readLocalCart(GUEST_USER_ID);
    if (guestItems && guestItems.length > 0) {
      cartItems = guestItems;
    }
  }
  if (!cartItems || cartItems.length === 0) {
    const defaultItems = readLocalCart(DEFAULT_USER_ID);
    if (defaultItems && defaultItems.length > 0) {
      cartItems = defaultItems;
    }
  }
  const { totalAmount, totalItems } = calcTotals(cartItems || []);
  return { success: true, cartItems: cartItems || [], totalAmount, totalItems };
  }
}

// 장바구니에 상품 추가
export async function addToCart(userId = 1, productId, quantity = 1) {
  try {
    // 개발 모드: 로컬 스토리지만 갱신
    if (isDev()) {
      const product = findProductById(productId);
      const prev = readLocalCart(userId);
      const idx = prev.findIndex(it => String(it.productId) === String(productId));
      if (idx >= 0) {
        prev[idx] = { ...prev[idx], quantity: (prev[idx].quantity || 0) + quantity };
      } else if (product) {
        prev.push({
          id: product.no,
          productId: product.no,
          productName: product.name,
          price: product.price,
          quantity,
        imageUrl: sanitizeImage(product.imageUrl),
          category: product.category
        });
      }
      writeLocalCart(userId, prev);
      const { totalAmount, totalItems } = calcTotals(prev);
      return { success: true, cartItems: prev, totalAmount, totalItems };
    }
    // 서버는 JWT의 사용자 정보를 사용할 수 있으나, 현재 API는 userId도 함께 보냄
  const client = pickClient();
  const { data } = await client.post('/api/cart/add',
    {
      userId,
      productId,
      quantity,
    }
  );
    return data;
  } catch (error) {
    console.error('Failed to add item to cart:', error);
    // 로컬 스토리지 폴백: 제품 정보를 DB에서 찾아 장바구니 갱신
  const product = findProductById(productId);
    const prev = readLocalCart(userId);
    const idx = prev.findIndex(it => String(it.productId) === String(productId));
    if (idx >= 0) {
      prev[idx] = { ...prev[idx], quantity: (prev[idx].quantity || 0) + quantity };
  } else if (product) {
      prev.push({
        id: product.no, // 폴백에선 cartItemId = productId로 사용
        productId: product.no,
        productName: product.name,
        price: product.price,
        quantity,
    imageUrl: sanitizeImage(product.imageUrl),
        category: product.category
      });
    }
    writeLocalCart(userId, prev);
    // 로그인 지연/게스트 담기 대비, 게스트 키에도 동기화 (기본 사용자 1번일 때만)
    if (String(userId) === String(DEFAULT_USER_ID)) {
      writeLocalCart(GUEST_USER_ID, prev);
    }
    const { totalAmount, totalItems } = calcTotals(prev);
    return { success: true, cartItems: prev, totalAmount, totalItems };
  }
}

// 장바구니 아이템 수량 업데이트
export async function updateCartItem(userId = 1, cartItemId, quantity) {
  try {
  if (isDev()) {
    const prev = readLocalCart(userId);
    const next = prev.map(it => String(it.id) === String(cartItemId) ? { ...it, quantity } : it);
    writeLocalCart(userId, next);
    const { totalAmount, totalItems } = calcTotals(next);
    return { success: true, cartItems: next, totalAmount, totalItems };
  }
  const client = pickClient();
  const { data } = await client.put(`/api/cart/update/${cartItemId}`, { quantity });
  return data;
  } catch (error) {
    console.error('Failed to update cart item:', error);
  // 로컬 스토리지 폴백: cartItemId(=productId)로 항목 찾기
  const prev = readLocalCart(userId);
  const next = prev.map(it => String(it.id) === String(cartItemId) ? { ...it, quantity } : it);
  writeLocalCart(userId, next);
  const { totalAmount, totalItems } = calcTotals(next);
  return { success: true, cartItems: next, totalAmount, totalItems };
  }
}

// 장바구니 아이템 삭제
export async function removeCartItem(userId = 1, cartItemId) {
  try {
  if (isDev()) {
    const prev = readLocalCart(userId);
    const next = prev.filter(it => String(it.id) !== String(cartItemId));
    writeLocalCart(userId, next);
    const { totalAmount, totalItems } = calcTotals(next);
    return { success: true, cartItems: next, totalAmount, totalItems };
  }
  const client = pickClient();
  const { data } = await client.delete(`/api/cart/remove/${cartItemId}`);
  return data;
  } catch (error) {
    console.error('Failed to remove cart item:', error);
  // 로컬 스토리지 폴백
  const prev = readLocalCart(userId);
  const next = prev.filter(it => String(it.id) !== String(cartItemId));
  writeLocalCart(userId, next);
  const { totalAmount, totalItems } = calcTotals(next);
  return { success: true, cartItems: next, totalAmount, totalItems };
  }
}

// 장바구니 비우기
export async function clearCart(userId = 1) {
  try {
  if (isDev()) {
    writeLocalCart(userId, []);
    return { success: true, cartItems: [], totalAmount: 0, totalItems: 0 };
  }
  const client = pickClient();
  const { data } = await client.delete(`/api/cart/clear/${userId}`);
  return data;
  } catch (error) {
    console.error('Failed to clear cart:', error);
  // 로컬 스토리지 폴백
  writeLocalCart(userId, []);
  return { success: true, cartItems: [], totalAmount: 0, totalItems: 0 };
  }
}