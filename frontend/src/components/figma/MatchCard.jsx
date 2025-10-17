import React from 'react';
import { Card } from './Card';
import { Badge } from './Badge';

/**
 * MatchCard Component
 * Tarjeta para mostrar información de un partido
 */
export const MatchCard = ({ 
  match,
  className = ''
}) => {
  const { player1, player2, score, status, date, sport } = match;
  
  const statusVariants = {
    'live': 'error',
    'finished': 'success',
    'scheduled': 'info',
  };
  
  return (
    <Card className={className}>
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <Badge variant="default">{sport || 'Tenis'}</Badge>
        <Badge variant={statusVariants[status] || 'default'}>
          {status === 'live' ? '🔴 En vivo' : status}
        </Badge>
      </div>
      
      {/* Players */}
      <div className="space-y-4">
        {/* Player 1 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
              {player1?.name?.charAt(0) || 'A'}
            </div>
            <div>
              <p className="font-semibold text-gray-900">{player1?.name || 'Jugador 1'}</p>
              <p className="text-sm text-gray-500">Nivel: {player1?.level || 'N/A'}</p>
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {score?.player1 !== undefined ? score.player1 : '-'}
          </div>
        </div>
        
        {/* VS Divider */}
        <div className="text-center text-gray-400 font-bold">VS</div>
        
        {/* Player 2 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-green-500 text-white flex items-center justify-center font-bold">
              {player2?.name?.charAt(0) || 'B'}
            </div>
            <div>
              <p className="font-semibold text-gray-900">{player2?.name || 'Jugador 2'}</p>
              <p className="text-sm text-gray-500">Nivel: {player2?.level || 'N/A'}</p>
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {score?.player2 !== undefined ? score.player2 : '-'}
          </div>
        </div>
      </div>
      
      {/* Footer */}
      {date && (
        <div className="mt-4 pt-4 border-t border-gray-200 text-sm text-gray-600 text-center">
          📅 {new Date(date).toLocaleDateString('es-ES', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      )}
    </Card>
  );
};

export default MatchCard;
