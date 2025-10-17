import React from 'react';
import { Card } from './Card';
import { Badge } from './Badge';

/**
 * Leaderboard Component
 * Tabla de clasificación para apps deportivas
 */
export const Leaderboard = ({ 
  players = [],
  title = "Clasificación",
  className = ''
}) => {
  return (
    <Card className={className}>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">{title}</h2>
      
      <div className="space-y-3">
        {players.map((player, index) => (
          <div 
            key={player.id || index}
            className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-4">
              {/* Posición */}
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg
                ${index === 0 ? 'bg-yellow-400 text-yellow-900' : ''}
                ${index === 1 ? 'bg-gray-300 text-gray-800' : ''}
                ${index === 2 ? 'bg-orange-400 text-orange-900' : ''}
                ${index > 2 ? 'bg-blue-100 text-blue-800' : ''}
              `}>
                {index + 1}
              </div>
              
              {/* Nombre y stats */}
              <div>
                <p className="font-semibold text-gray-900">{player.name}</p>
                <p className="text-sm text-gray-600">
                  {player.wins || 0}V - {player.losses || 0}D
                </p>
              </div>
            </div>
            
            {/* Puntos */}
            <div className="text-right">
              <p className="text-2xl font-bold text-green-600">{player.points || 0}</p>
              <p className="text-sm text-gray-500">puntos</p>
            </div>
          </div>
        ))}
      </div>
      
      {players.length === 0 && (
        <p className="text-center text-gray-500 py-8">
          No hay jugadores en la clasificación
        </p>
      )}
    </Card>
  );
};

export default Leaderboard;
