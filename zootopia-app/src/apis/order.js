// 구매한 상품 리스트 및 배송 상태 조회용 API
const API_BASE_URL = 'http://localhost:8080';

export async function fetchPurchasedProducts(userId = 1) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/orders/my?userId=${userId}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    
    // 백엔드 Order 객체를 프론트엔드 형식으로 변환
    return data.map(order => ({
      id: order.id,
      name: order.productName,
      price: order.price,
      status: order.status,
      image: order.image
    }));
  } catch (error) {
    console.error('Failed to fetch purchased products:', error);
    
    // API 호출 실패 시 임시 Mock 데이터 반환
    return [
      {
        id: 1,
        name: '강아지 사료',
        price: 25000,
        status: '배송중',
        image: '/assets/dist/img/products/dogfood.jpg',
      },
      {
        id: 2,
        name: '고양이 장난감',
        price: 12000,
        status: '배달 완료',
        image: '/assets/dist/img/products/cattoy.jpg',
      },
    ];
  }
}
