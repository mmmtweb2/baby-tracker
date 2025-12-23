import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, PlusCircle, BarChart3, Clock } from 'lucide-react';

const navItems = [
  { to: '/', icon: Home, label: 'בית' },
  { to: '/add-feeding', icon: PlusCircle, label: 'האכלה' },
  { to: '/add-vomit', icon: Clock, label: 'הקאה' },
  { to: '/analytics', icon: BarChart3, label: 'ניתוח' },
];

export default function Navigation() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-baby-200 safe-bottom z-50">
      <div className="max-w-lg mx-auto px-2">
        <div className="flex justify-around items-center h-16">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center px-4 py-2 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'text-sage-600 bg-sage-100'
                    : 'text-gray-400 hover:text-sage-500 hover:bg-sage-50'
                }`
              }
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium">{label}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}
