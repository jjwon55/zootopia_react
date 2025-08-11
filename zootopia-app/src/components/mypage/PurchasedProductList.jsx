import React, { useEffect, useState } from 'react';
import { fetchPurchasedProducts } from '../../apis/order';

export default function PurchasedProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPurchasedProducts().then((data) => {
      setProducts(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="text-center py-8">로딩중...</div>;

  if (products.length === 0) {
    return <div className="text-center py-8 text-gray-500">구매한 상품이 없습니다.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">구매한 상품 리스트</h2>
      <ul className="space-y-4">
        {products.map((product) => (
          <li key={product.id} className="flex items-center bg-white rounded shadow p-4">
            <img
              src={product.image}
              alt={product.name}
              className="w-20 h-20 object-cover rounded mr-4 border"
              onError={e => { e.target.src = 'https://via.placeholder.com/80'; }}
            />
            <div className="flex-1">
              <div className="font-semibold text-lg">{product.name}</div>
              <div className="text-gray-500">{product.price.toLocaleString()}원</div>
            </div>
            <span
              className={
                'px-3 py-1 rounded-full text-sm font-medium ' +
                (product.status === '배달 완료'
                  ? 'bg-green-100 text-green-700 border border-green-300'
                  : 'bg-yellow-100 text-yellow-700 border border-yellow-300')
              }
            >
              {product.status}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
