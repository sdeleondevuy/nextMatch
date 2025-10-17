import React from 'react';

/**
 * Input Component
 * Campo de input con estilos consistentes
 */
export const Input = ({ 
  label,
  error,
  className = '',
  ...props 
}) => {
  const inputStyles = `
    w-full px-4 py-3 rounded-lg border-2 
    focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
    transition-all duration-200
    ${error ? 'border-red-500' : 'border-gray-300'}
  `;
  
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <input 
        className={`${inputStyles} ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default Input;
