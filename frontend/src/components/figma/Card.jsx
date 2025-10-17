import React from 'react';

/**
 * Card Component
 * Tarjeta reutilizable con estilos de Figma
 */
export const Card = ({ 
  children, 
  className = '',
  hover = true,
  ...props 
}) => {
  const baseStyles = 'bg-white rounded-xl shadow-lg p-6 border border-gray-100';
  const hoverStyles = hover ? 'hover:shadow-xl transition-shadow duration-300' : '';
  
  return (
    <div 
      className={`${baseStyles} ${hoverStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
