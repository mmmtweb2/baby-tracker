import React from 'react';
import { Baby } from 'lucide-react';

export default function Header({ title, subtitle }) {
  return (
    <header className="bg-gradient-to-b from-baby-100 to-baby-50 pt-8 pb-6 px-4">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-sage-500 rounded-full flex items-center justify-center shadow-md">
            <Baby className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-sage-800">{title}</h1>
        </div>
        {subtitle && (
          <p className="text-sage-600 text-sm mr-13">{subtitle}</p>
        )}
      </div>
    </header>
  );
}
