import React, { useState } from 'react';

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
    { name: '장난감', icon: '�' },
    { name: '산책', icon: '🚶‍♂️' }
  ];

  const categoryList = categories || defaultCategories;

  return (
    <div className="flex flex-wrap justify-center gap-4 mb-8">
      {categoryList.map((category) => {
        const categoryName = typeof category === 'string' ? category : category.name;
        const categoryIcon = typeof category === 'object' ? category.icon : '';
        const isActive = selectedCategory === categoryName;
        
        return (
          <button
            key={categoryName}
            onClick={() => handleCategoryClick(categoryName)}
            className={`
              category-button px-6 py-3 rounded-full font-medium 
              flex items-center gap-2 min-w-fit text-sm sm:text-base
              border-2 shadow-sm
              ${isActive
                ? 'bg-gradient-to-r from-pink-400 to-pink-500 text-white border-pink-500 active shadow-lg'
                : 'bg-white text-gray-700 border-gray-200 hover:bg-pink-50 hover:border-pink-300 hover:text-pink-600'
              }
            `}
          >
            {categoryIcon && <span className="text-lg">{categoryIcon}</span>}
            <span className="font-semibold">{categoryName}</span>
          </button>
        );
      })}
    </div>
  );
};

export default CategoryButtons;
