'use client';

import { ReactNode } from 'react';

interface AnimatedButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'success' | 'danger' | 'warning' | 'info' | 'secondary';
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  enableAnimation?: boolean;
}

export default function AnimatedButton({ 
  children, 
  variant = 'primary', 
  className = '',
  onClick,
  disabled = false,
  type = 'button',
  enableAnimation = false, // Default false untuk performa
}: AnimatedButtonProps) {
  const variants = {
    primary: 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white',
    success: 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white',
    danger: 'bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white',
    warning: 'bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white',
    info: 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white',
    secondary: 'bg-gradient-to-r from-gray-500 to-slate-600 hover:from-gray-600 hover:to-slate-700 text-white',
  };

  const animationClass = enableAnimation ? 'hover:scale-[1.02] active:scale-[0.98]' : '';

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`px-4 py-2 rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2 ${variants[variant]} ${animationClass} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {children}
    </button>
  );
}
