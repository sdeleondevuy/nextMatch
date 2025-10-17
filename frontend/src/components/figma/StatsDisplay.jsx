import React from 'react';
import { Card } from './Card';

/**
 * StatsDisplay Component
 * Muestra estadísticas en formato de tarjetas
 */
export const StatsDisplay = ({ 
  stats = [],
  className = ''
}) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
      {stats.map((stat, index) => (
        <Card key={index} className="text-center">
          {/* Icon */}
          {stat.icon && (
            <div className="text-4xl mb-3">{stat.icon}</div>
          )}
          
          {/* Value */}
          <p className="text-4xl font-bold text-gray-900 mb-2">
            {stat.value}
          </p>
          
          {/* Label */}
          <p className="text-sm text-gray-600 font-medium">
            {stat.label}
          </p>
          
          {/* Change indicator */}
          {stat.change && (
            <p className={`text-xs mt-2 ${stat.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {stat.change > 0 ? '↑' : '↓'} {Math.abs(stat.change)}%
            </p>
          )}
        </Card>
      ))}
    </div>
  );
};

export default StatsDisplay;
