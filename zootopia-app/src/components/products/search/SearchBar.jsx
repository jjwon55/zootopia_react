import React, { useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import './search.css';

const SearchBar = ({ onSearch, placeholder = "상품명을 검색하세요...", isLoading = false }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch && !isLoading) {
      onSearch(searchTerm);
    }
  };

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // 인라인 스타일을 백업으로 추가
  const containerStyle = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    background: 'white',
    borderRadius: '9999px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    border: '1px solid #e5e7eb',
    overflow: 'hidden',
    transition: 'all 0.3s ease',
  };

  const inputStyle = {
    width: '100%',
    padding: '1rem 6rem 1rem 3.5rem',
    fontSize: '1.125rem',
    background: 'transparent',
    border: 'none',
    outline: 'none',
  };

  const buttonStyle = {
    position: 'absolute',
    right: '0.5rem',
    background: 'linear-gradient(135deg, #f472b6, #ec4899)',
    color: 'white',
    padding: '0.625rem 2rem',
    borderRadius: '9999px',
    fontWeight: '500',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  };

  return (
    <div className="search-bar-wrapper fade-in-up" style={{position: 'relative', width: '100%', maxWidth: '48rem', margin: '0 auto 1.5rem auto'}}>
      <form onSubmit={handleSubmit}>
        <div className={`search-input-container ${isLoading ? 'loading' : ''}`} style={containerStyle}>
          <FiSearch className="search-icon" style={{position: 'absolute', left: '1.25rem', color: '#9ca3af', fontSize: '1.25rem', zIndex: 10}} />
          <input
            type="text"
            value={searchTerm}
            onChange={handleInputChange}
            placeholder={placeholder}
            className="search-input"
            style={inputStyle}
            disabled={isLoading}
          />
          <button
            type="submit"
            className="search-button"
            style={buttonStyle}
            disabled={isLoading}
          >
            {isLoading ? '검색중...' : '검색'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;
