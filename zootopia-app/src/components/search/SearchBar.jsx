import React, { useState } from 'react';
import { FiSearch } from 'react-icons/fi';

const SearchBar = ({ onSearch, placeholder = "상품명을 검색하세요..." }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm);
    }
  };

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="w-full max-w-3xl mx-auto mb-6">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center bg-white rounded-full shadow-md border border-gray-200 overflow-hidden">
          <FiSearch className="absolute left-5 text-gray-400 text-xl z-10" />
          <input
            type="text"
            value={searchTerm}
            onChange={handleInputChange}
            placeholder={placeholder}
            className="w-full pl-14 pr-24 py-4 text-lg bg-transparent
                     focus:outline-none transition-all duration-200
                     placeholder-gray-400"
          />
          <button
            type="submit"
            className="absolute right-2 bg-gradient-to-r from-pink-400 to-pink-500 
                     hover:from-pink-500 hover:to-pink-600 text-white px-8 py-2.5 
                     rounded-full transition-all duration-200 font-medium
                     search-button-hover shadow-sm"
          >
            검색
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;
