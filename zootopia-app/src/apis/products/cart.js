// cart.js - 장바구니 관련 API 호출
const API_BASE_URL = 'http://localhost:8080';
// 제품 목 데이터베이스를 사용해 이미지/가격/카테고리를 동기화
import { mockProductsDatabase } from '../../utils/products/mockDatabase.js';

// 로컬 스토리지 유틸리티
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
const calcTotals = (items) => ({
  totalAmount: items.reduce((s, it) => s + (it.price || 0) * (it.quantity || 0), 0),
  totalItems: items.reduce((s, it) => s + (it.quantity || 0), 0)
});

// 장바구니 아이템 조회
export async function fetchCartItems(userId = 1) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/cart/${userId}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch cart items:', error);
  // API 실패 시: 로컬 스토리지 장바구니 사용
  const cartItems = readLocalCart(userId);
  const { totalAmount, totalItems } = calcTotals(cartItems);
  return { success: true, cartItems, totalAmount, totalItems };
  }
}

// 장바구니에 상품 추가
export async function addToCart(userId = 1, productId, quantity = 1) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/cart/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: userId,
        productId: productId,
        quantity: quantity
      })
    });
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to add item to cart:', error);
    // 로컬 스토리지 폴백: 제품 정보를 DB에서 찾아 장바구니 갱신
    const product = mockProductsDatabase.find(p => String(p.no) === String(productId));
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
        imageUrl: product.imageUrl,
        category: product.category
      });
    }
    writeLocalCart(userId, prev);
    const { totalAmount, totalItems } = calcTotals(prev);
    return { success: true, cartItems: prev, totalAmount, totalItems };
  }
}

// 장바구니 아이템 수량 업데이트
export async function updateCartItem(cartItemId, quantity) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/cart/update/${cartItemId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        quantity: quantity
      })
    });
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to update cart item:', error);
  // 로컬 스토리지 폴백: cartItemId(=productId)로 항목 찾기
  const userId = 1; // 현재 프로젝트에선 하드코딩된 사용자 사용
  const prev = readLocalCart(userId);
  const next = prev.map(it => String(it.id) === String(cartItemId) ? { ...it, quantity } : it);
  writeLocalCart(userId, next);
  const { totalAmount, totalItems } = calcTotals(next);
  return { success: true, cartItems: next, totalAmount, totalItems };
  }
}

// 장바구니 아이템 삭제
export async function removeCartItem(cartItemId) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/cart/remove/${cartItemId}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to remove cart item:', error);
  // 로컬 스토리지 폴백
  const userId = 1;
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
    const response = await fetch(`${API_BASE_URL}/api/cart/clear/${userId}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to clear cart:', error);
  // 로컬 스토리지 폴백
  writeLocalCart(userId, []);
  return { success: true, cartItems: [], totalAmount: 0, totalItems: 0 };
  }
}