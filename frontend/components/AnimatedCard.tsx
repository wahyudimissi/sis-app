'use client';

import { ReactNode } from 'react';

interface AnimatedCardProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  enableAnimation?: boolean;
}

export default function AnimatedCard({ 
  children, 
  delay = 0, 
  className = '',
  enableAnimation = false // Default false untuk performa
}: AnimatedCardProps) {
  // Jika animation disabled, gunakan CSS classes saja
  if (!enableAnimation) {
    return (
      <div className={`bg-white/80 backdrop-blur-sm rounded-xl shadow-sm hover:shadow-md border border-gray-100/50 transition-shadow duration-200 ${className}`}>
        {children}
      </div>
    );
  }

  // Dengan animation (optional)
  return (
    <div 
      className={`bg-white/80 backdrop-blur-sm rounded-xl shadow-sm hover:shadow-lg border border-gray-100/50 transition-all duration-300 animate-slide-up ${className}`}
      style={{ animationDelay: `${delay}s` }}
    >
      {children}
    </div>
  );
}
