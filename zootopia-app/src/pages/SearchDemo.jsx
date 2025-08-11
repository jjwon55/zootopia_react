import React, { useState } from 'react';
import SearchSection from '../components/products/search/SearchSection';

const SearchDemo = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('전체');

  const handleSearch = (term) => {
    setSearchTerm(term);
    console.log('검색어:', term);
    // 여기에 실제 검색 로직을 추가하세요
  };

  const handleCategorySelect = (category) => {
    setActiveCategory(category);
    console.log('선택된 카테고리:', category);
    // 여기에 카테고리 필터링 로직을 추가하세요
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 검색 섹션 */}
      <SearchSection
        onSearch={handleSearch}
        onCategorySelect={handleCategorySelect}
        activeCategory={activeCategory}
        searchPlaceholder="상품명을 검색하세요..."
      />
      
      {/* 결과 표시 영역 */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4">검색 결과</h3>
          <div className="space-y-2 text-gray-600">
            <p>검색어: <span className="font-medium text-gray-800">{searchTerm || '없음'}</span></p>
            <p>선택된 카테고리: <span className="font-medium text-pink-600">{activeCategory}</span></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchDemo;
