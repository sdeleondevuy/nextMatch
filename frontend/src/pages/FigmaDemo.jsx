import React from 'react';
import { 
  Button, 
  Card, 
  Badge, 
  Leaderboard, 
  MatchCard, 
  PlayerCard,
  StatsDisplay,
  ScoreCard
} from '../components/figma';

/**
 * FigmaDemo - Página de demostración de componentes de Figma
 * Usa esta página para ver los componentes en acción en tu proyecto
 */
function FigmaDemo() {
  // Datos de ejemplo
  const players = [
    { id: 1, name: "Juan Pérez", wins: 15, losses: 3, points: 1250 },
    { id: 2, name: "María García", wins: 12, losses: 5, points: 1100 },
    { id: 3, name: "Carlos López", wins: 10, losses: 7, points: 980 },
    { id: 4, name: "Ana Martínez", wins: 8, losses: 6, points: 850 },
  ];

  const match = {
    player1: { name: "Juan Pérez", level: "A" },
    player2: { name: "María García", level: "B" },
    score: { player1: 6, player2: 4 },
    status: "finished",
    date: new Date(),
    sport: "Tenis Singles"
  };

  const stats = [
    { icon: "🎾", value: 156, label: "Partidos", change: 12 },
    { icon: "🏆", value: 89, label: "Victorias", change: 5 },
    { icon: "👥", value: 45, label: "Jugadores", change: 8 },
    { icon: "📈", value: "87%", label: "Win Rate" },
  ];

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Demo de Componentes de Figma</h1>
        <p className="text-gray-600">Componentes generados automáticamente</p>
      </div>

      {/* Botones */}
      <Card>
        <h2 className="text-2xl font-bold mb-4">Botones</h2>
        <div className="flex flex-wrap gap-4">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
        </div>
      </Card>

      {/* Stats */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Estadísticas</h2>
        <StatsDisplay stats={stats} />
      </div>

      {/* Leaderboard */}
      <Leaderboard players={players} title="Top Jugadores" />

      {/* Match Card */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Partido</h2>
        <MatchCard match={match} />
      </div>

      {/* Player Cards */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Jugadores</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {players.slice(0, 3).map(player => (
            <PlayerCard key={player.id} player={player} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default FigmaDemo;
