import React from 'react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="mb-8">
          <i className="fas fa-exclamation-triangle text-6xl text-red-400 mb-4"></i>
        </div>
        <h1 className="text-4xl font-bold text-gray-800 mb-4">404 - 페이지를 찾을 수 없습니다</h1>
        <p className="text-lg text-gray-600 mb-8">
          요청하신 페이지가 존재하지 않습니다.
        </p>
        <button
          onClick={() => window.location.href = '/'}
          className="bg-red-400 hover:bg-red-500 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          <i className="fas fa-home mr-2"></i>
          홈으로 돌아가기
        </button>
      </div>
    </div>
  );
}
