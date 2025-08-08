import React from 'react';
import PurchasedProductList from '../../components/mypage/PurchasedProductList';

export default function MyPageHome() {
  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-3xl mx-auto bg-white rounded shadow p-8">
        <h1 className="text-3xl font-bold mb-6">마이페이지</h1>
        {/* 구매한 상품 리스트 */}
        <PurchasedProductList />
      </div>
    </div>
  );
}
