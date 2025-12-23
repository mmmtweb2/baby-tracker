import React from 'react';
import { SEVERITIES } from '../utils/helpers';

export default function SeverityPicker({ selected, onChange }) {
  return (
    <div className="flex gap-3">
      {SEVERITIES.map((severity) => {
        const isSelected = selected === severity.id;
        return (
          <button
            key={severity.id}
            type="button"
            onClick={() => onChange(severity.id)}
            className={`
              flex-1 flex flex-col items-center justify-center p-4 rounded-xl border-2
              transition-all duration-200
              ${isSelected 
                ? `${severity.color} border-current shadow-sm` 
                : 'bg-white border-gray-100 text-gray-400 hover:border-gray-200'
              }
            `}
          >
            <span className="text-2xl mb-1">{severity.emoji}</span>
            <span className="text-sm font-medium">{severity.label}</span>
          </button>
        );
      })}
    </div>
  );
}
