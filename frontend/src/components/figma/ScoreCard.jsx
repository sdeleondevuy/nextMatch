import React from 'react';
import { Card } from './Card';

/**
 * ScoreCard Component
 * Tarjeta simple para mostrar un marcador
 */
export const ScoreCard = ({ 
  team1,
  team2,
  score1,
  score2,
  live = false,
  className = ''
}) => {
  return (
    <Card className={`relative ${className}`}>
      {/* Live indicator */}
      {live && (
        <div className="absolute top-4 right-4">
          <span className="flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
        </div>
      )}
      
      <div className="flex items-center justify-between py-4">
        {/* Team 1 */}
        <div className="flex-1 text-left">
          <p className="font-bold text-xl text-gray-900">{team1}</p>
        </div>
        
        {/* Score */}
        <div className="flex items-center gap-4 px-6">
          <span className="text-4xl font-bold text-blue-600">{score1}</span>
          <span className="text-2xl text-gray-400">-</span>
          <span className="text-4xl font-bold text-green-600">{score2}</span>
        </div>
        
        {/* Team 2 */}
        <div className="flex-1 text-right">
          <p className="font-bold text-xl text-gray-900">{team2}</p>
        </div>
      </div>
      
      {live && (
        <div className="text-center text-sm text-red-600 font-semibold">
          🔴 EN VIVO
        </div>
      )}
    </Card>
  );
};

export default ScoreCard;
