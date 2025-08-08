import api from './api';

// 장바구니 아이템 조회
export const fetchCartItems = async (userId) => {
  try {
    const response = await api.get(`/cart/${userId}`);
    return {
      success: true,
      cartItems: response.data
    };
  } catch (error) {
    console.error('Cart items fetch error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// 장바구니 아이템 업데이트
export const updateCartItem = async (cartItemId, quantity) => {
  try {
    const response = await api.put(`/cart/${cartItemId}`, { quantity });
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Cart item update error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// 장바구니 아이템 삭제
export const removeCartItem = async (cartItemId) => {
  try {
    const response = await api.delete(`/cart/${cartItemId}`);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Cart item remove error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// 장바구니 비우기
export const clearCart = async (userId) => {
  try {
    const response = await api.delete(`/cart/clear/${userId}`);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Cart clear error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// 장바구니에 아이템 추가
export const addToCart = async (userId, productId, quantity = 1) => {
  try {
    const response = await api.post('/cart', {
      userId,
      productId,
      quantity
    });
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Add to cart error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};
