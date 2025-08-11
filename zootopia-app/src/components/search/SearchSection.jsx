import React from 'react';
import SearchBar from './SearchBar';
import CategoryButtons from './CategoryButtons';

const SearchSection = ({ 
  onSearch, 
  onCategorySelect, 
  categories,
  activeCategory = '전체',
  searchPlaceholder = "상품명을 검색하세요..."
}) => {
  return (
    <div className="w-full bg-gradient-to-b from-pink-50 to-white py-12 shadow-sm search-container">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* 검색 바 */}
        <SearchBar 
          onSearch={onSearch}
          placeholder={searchPlaceholder}
        />
        
        {/* 카테고리 버튼들 */}
        <CategoryButtons 
          categories={categories}
          onCategorySelect={onCategorySelect}
          activeCategory={activeCategory}
        />
      </div>
    </div>
  );
};

export default SearchSection;
