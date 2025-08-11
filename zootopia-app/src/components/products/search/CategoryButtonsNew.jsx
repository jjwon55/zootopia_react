import React, { useState } from 'react';
import './search.css';

const CategoryButtons = ({ categories, onCategorySelect, activeCategory = '전체' }) => {
  const [selectedCategory, setSelectedCategory] = useState(activeCategory);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    if (onCategorySelect) {
      onCategorySelect(category);
    }
  };

  const defaultCategories = [
    { name: '전체', icon: '📋' },
    { name: '사료', icon: '🍽️' },
    { name: '용품', icon: '🛍️' },
    { name: '장난감', icon: '🏀' },
    { name: '산책', icon: '🚶‍♂️' }
  ];

  const categoryList = categories || defaultCategories;

  const containerStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '1rem',
    marginBottom: '2rem',
  };

  const getButtonStyle = (isActive) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1.5rem',
    borderRadius: '9999px',
    fontWeight: '600',
    fontSize: '0.875rem',
    border: '2px solid',
    cursor: 'pointer',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    minWidth: 'fit-content',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    background: isActive ? 'linear-gradient(135deg, #f472b6, #ec4899)' : 'white',
    color: isActive ? 'white' : '#374151',
    borderColor: isActive ? '#ec4899' : '#d1d5db',
  });

  return (
    <div className="category-buttons-container fade-in-up" style={containerStyle}>
      {categoryList.map((category) => {
        const categoryName = typeof category === 'string' ? category : category.name;
        const categoryIcon = typeof category === 'object' ? category.icon : '';
        const isActive = selectedCategory === categoryName;
        
        return (
          <button
            key={categoryName}
            onClick={() => handleCategoryClick(categoryName)}
            className={`category-button ${isActive ? 'active' : ''}`}
            style={getButtonStyle(isActive)}
          >
            {categoryIcon && <span className="category-icon" style={{fontSize: '1.125rem'}}>{categoryIcon}</span>}
            <span>{categoryName}</span>
          </button>
        );
      })}
    </div>
  );
};

export default CategoryButtons;
