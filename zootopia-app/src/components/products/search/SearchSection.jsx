import React from 'react';
import SearchBar from './SearchBar';
import CategoryButtons from './CategoryButtons';
import './search.css';

const SearchSection = ({ 
  onSearch, 
  onCategorySelect, 
  categories,
  activeCategory = '전체',
  searchPlaceholder = "상품명을 검색하세요...",
  isLoading = false
}) => {
  const containerStyle = {
    width: '100%',
    background: 'linear-gradient(135deg, #fef7f0 0%, #fdf4f5 50%, #fef1f5 100%)',
    padding: '3rem 0',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  };

  const wrapperStyle = {
    maxWidth: '72rem',
    margin: '0 auto',
    padding: '0 1rem',
  };

  return (
    <div className="search-container" style={containerStyle}>
      <div className="search-content-wrapper" style={wrapperStyle}>
        {/* 검색 바 */}
        <SearchBar 
          onSearch={onSearch}
          placeholder={searchPlaceholder}
          isLoading={isLoading}
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
