// cart.js - 장바구니 관련 API 호출
const API_BASE_URL = 'http://localhost:8080';

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
    
    // API 호출 실패 시 임시 Mock 데이터 반환
    return {
      success: true,
      cartItems: [
        {
          id: 1,
          productId: 1,
          productName: '강아지 사료',
          price: 25000,
          quantity: 2,
          imageUrl: '/assets/dist/img/products/dogfood.jpg',
          category: '사료'
        },
        {
          id: 2,
          productId: 2,
          productName: '고양이 장난감',
          price: 12000,
          quantity: 1,
          imageUrl: '/assets/dist/img/products/cattoy.jpg',
          category: '장난감'
        },
        {
          id: 3,
          productId: 3,
          productName: '애완용품 세트',
          price: 35000,
          quantity: 1,
          imageUrl: '/assets/dist/img/products/petset.jpg',
          category: '용품'
        }
      ],
      totalAmount: 87000,
      totalItems: 4
    };
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
    return {
      success: false,
      message: '장바구니 추가에 실패했습니다.'
    };
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
    return {
      success: false,
      message: '수량 변경에 실패했습니다.'
    };
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
    return {
      success: false,
      message: '삭제에 실패했습니다.'
    };
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
    return {
      success: false,
      message: '장바구니 비우기에 실패했습니다.'
    };
  }
}