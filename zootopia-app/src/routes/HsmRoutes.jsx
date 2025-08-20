// src/routes/HsmRoutes.jsx - Updated
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/Home.jsx';
import ProductList from '../pages/products/listp.jsx';
import ProductDetail from '../pages/products/detail.jsx';
import Cart from '../pages/cart/cart.jsx';
import Checkout from '../pages/cart/checkout.jsx';
import NotFound from '../pages/products/NotFound.jsx';
// KakaoPay 관련 페이지 제거
import OrderDetail from '../pages/orders/OrderDetail.jsx';
import TossSuccess from '../pages/payments/TossSuccess.jsx';
import TossFail from '../pages/payments/TossFail.jsx';

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

  {/* Toss 결제 결과 (추후 실제 Success 컴포넌트로 교체 가능) */}
  <Route path="/pay/toss/success" element={<TossSuccess />} />
  <Route path="/pay/toss/fail" element={<TossFail />} />

  {/* 주문 상세 */}
  <Route path="/orders/:orderCode" element={<OrderDetail />} />

      {/* 라우팅되지 않는 경로 */}
      {/* <Route path="*" element={<NotFound />} /> */}
    </Routes>
  );
}
