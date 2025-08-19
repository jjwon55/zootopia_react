import React, { useEffect, useState } from 'react';
import api from '../../apis/api';

export default function OrderDetail({ orderCodeProp }) {
  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const orderCode = orderCodeProp || window.location.pathname.split('/').pop();

  useEffect(() => {
    (async () => {
      try {
        const { data: orders } = await api.get(`/orders/my?userId=1`); // TODO: replace with auth user
        const target = orders.find(o => o.orderCode === orderCode);
        setOrder(target || null);
        // (Optional) backend endpoint for items could be added; for now placeholder
      } catch (e) {
        console.error(e);
      }
    })();
  }, [orderCode]);

  if (!order) return <div className="tw:p-6">주문 정보를 불러오는 중...</div>;

  return (
    <div className="tw:max-w-3xl tw:mx-auto tw:p-6">
      <h1 className="tw:text-2xl tw:font-bold tw:mb-4">주문 상세</h1>
      <div className="tw:bg-white tw:rounded tw:shadow tw:p-4 tw:mb-6">
        <div className="tw:flex tw:justify-between tw:mb-2"><span className="tw:text-gray-500">주문번호</span><span>{order.orderCode}</span></div>
        <div className="tw:flex tw:justify-between tw:mb-2"><span className="tw:text-gray-500">상품명</span><span>{order.productName}</span></div>
        <div className="tw:flex tw:justify-between tw:mb-2"><span className="tw:text-gray-500">금액</span><span>{order.price.toLocaleString()}원</span></div>
        <div className="tw:flex tw:justify-between tw:mb-2"><span className="tw:text-gray-500">상태</span><span>{order.status}</span></div>
        {order.payTid && <div className="tw:flex tw:justify-between tw:mb-2"><span className="tw:text-gray-500">TID</span><span>{order.payTid}</span></div>}
      </div>
      <a href="/products/listp" className="tw:inline-block tw:px-4 tw:py-2 tw:bg-pink-500 hover:tw:bg-pink-600 tw:text-white tw:rounded">쇼핑 계속하기</a>
    </div>
  );
}
