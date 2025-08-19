// src/routes/HsmRoutes.jsx - Updated
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/Home.jsx';
import ProductList from '../pages/products/listp.jsx';
import ProductDetail from '../pages/products/detail.jsx';
import Cart from '../pages/cart/cart.jsx';
import Checkout from '../pages/cart/checkout.jsx';
import NotFound from '../pages/products/NotFound.jsx';
import KakaoPayMock from '../pages/cart/KakaoPayMock.jsx';
import KakaoPayResult from '../pages/cart/KakaoPayResult.jsx';
import OrderDetail from '../pages/orders/OrderDetail.jsx';

// 간단한 취소/실패 placeholder 컴포넌트
function KakaoPayFail() { return <div style={{padding:40}}>카카오페이 결제가 실패/취소되었습니다. <a href="/checkout">다시 시도</a></div>; }
function KakaoPayCancel() { return <div style={{padding:40}}>카카오페이 결제가 취소되었습니다. <a href="/checkout">다시 시도</a></div>; }

export default function HsmRoutes() {
  return (
    <Routes>

      {/* 목록 */}
      <Route path="/products/listp" element={<ProductList />} />

      {/* 상세 (ProductList에서 /products/detail/${productId} 로 이동하므로 파라미터명을 productId로) */}
      <Route path="/products/detail/:productId" element={<ProductDetail />} />

      {/* 장바구니 */}
      <Route path="/cart" element={<Cart />} />

      {/* 장바구니/결제 */}
      <Route path="/checkout" element={<Checkout />} />

  {/* 카카오페이 데모 결제 페이지 / 실제 성공 콜백 / 실패 / 취소 */}
  <Route path="/kakao-pay-mock" element={<KakaoPayMock />} />
  <Route path="/pay/success" element={<KakaoPayResult />} />
  <Route path="/pay/fail" element={<KakaoPayFail />} />
  <Route path="/pay/cancel" element={<KakaoPayCancel />} />

  {/* 주문 상세 */}
  <Route path="/orders/:orderCode" element={<OrderDetail />} />

      {/* 라우팅되지 않는 경로 */}
      {/* <Route path="*" element={<NotFound />} /> */}
    </Routes>
  );
}
