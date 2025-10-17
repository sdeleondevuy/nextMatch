import React from 'react';
import { Card } from './Card';
import { Badge } from './Badge';

/**
 * PlayerCard Component
 * Tarjeta de perfil de jugador
 */
export const PlayerCard = ({ 
  player,
  className = ''
}) => {
  const { name, avatar, level, wins, losses, points, sport } = player;
  const winRate = wins && losses ? Math.round((wins / (wins + losses)) * 100) : 0;
  
  return (
    <Card className={`text-center ${className}`}>
      {/* Avatar */}
      <div className="mx-auto w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center mb-4">
        {avatar ? (
          <img src={avatar} alt={name} className="w-full h-full rounded-full object-cover" />
        ) : (
          <span className="text-4xl font-bold text-white">
            {name?.charAt(0) || '?'}
          </span>
        )}
      </div>
      
      {/* Name */}
      <h3 className="text-xl font-bold text-gray-900 mb-2">{name || 'Jugador'}</h3>
      
      {/* Level & Sport */}
      <div className="flex gap-2 justify-center mb-4">
        <Badge variant="info">Nivel {level || 'N/A'}</Badge>
        {sport && <Badge variant="default">{sport}</Badge>}
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
        <div>
          <p className="text-2xl font-bold text-green-600">{wins || 0}</p>
          <p className="text-xs text-gray-600">Victorias</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-red-600">{losses || 0}</p>
          <p className="text-xs text-gray-600">Derrotas</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-blue-600">{winRate}%</p>
          <p className="text-xs text-gray-600">Win Rate</p>
        </div>
      </div>
      
      {/* Points */}
      {points !== undefined && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-3xl font-bold text-yellow-600">{points}</p>
          <p className="text-sm text-gray-600">Puntos totales</p>
        </div>
      )}
    </Card>
  );
};

export default PlayerCard;
