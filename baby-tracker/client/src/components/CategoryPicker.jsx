import React from 'react';
import { CATEGORIES } from '../utils/helpers';

export default function CategoryPicker({ selected = [], onChange }) {
  const toggleCategory = (categoryId) => {
    if (selected.includes(categoryId)) {
      onChange(selected.filter(c => c !== categoryId));
    } else {
      onChange([...selected, categoryId]);
    }
  };

  return (
    <div className="grid grid-cols-4 gap-2">
      {CATEGORIES.map((category) => {
        const isSelected = selected.includes(category.id);
        return (
          <button
            key={category.id}
            type="button"
            onClick={() => toggleCategory(category.id)}
            className={`
              category-badge flex flex-col items-center justify-center p-3 rounded-xl border-2
              transition-all duration-200
              ${isSelected 
                ? `${category.color} border-current shadow-sm` 
                : 'bg-white border-gray-100 text-gray-400 hover:border-gray-200'
              }
            `}
          >
            <span className="text-xl mb-1">{category.emoji}</span>
            <span className="text-xs font-medium">{category.label}</span>
          </button>
        );
      })}
    </div>
  );
}
