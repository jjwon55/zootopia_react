// src/routes/HsmRoutes.jsx - Updated
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/Home.jsx';
import ProductList from '../pages/products/listp.jsx';
import ProductDetail from '../pages/products/detail.jsx';
import Cart from '../pages/cart/cart.jsx';
import Checkout from '../pages/cart/checkout.jsx';
import NotFound from '../pages/products/NotFound.jsx';
import KakaoPayMock from '../pages/cart/KakaoPayMock.jsx';

export default function HsmRoutes() {
  return (
    <Routes>
      {/* / → /products/listp 로 리다이렉트 */}
      {/* <Route path="/" element={<Navigate to="/products/listp" replace />} /> */}
  {/* 기본 페이지: / 에서 홈 표시 */}
  <Route path="/" element={<Home />} />

      {/* 목록 */}
      <Route path="/products/listp" element={<ProductList />} />

      {/* 상세 (ProductList에서 /products/detail/${productId} 로 이동하므로 파라미터명을 productId로) */}
      <Route path="/products/detail/:productId" element={<ProductDetail />} />

      {/* 장바구니 */}
      <Route path="/cart" element={<Cart />} />

      {/* 장바구니/결제 */}
      <Route path="/checkout" element={<Checkout />} />

      {/* 카카오페이 데모 결제 페이지 */}
      <Route path="/kakao-pay-mock" element={<KakaoPayMock />} />

      {/* 라우팅되지 않는 경로 */}
      {/* <Route path="*" element={<NotFound />} /> */}
    </Routes>
  );
}
