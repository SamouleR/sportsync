import { useState } from 'react';
import { useUsers } from '../hooks/useUsers.js';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Tooltip as RechartsTooltip, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import { motion } from 'framer-motion';

export default function PerformanceAnalytics({ team }) {
  const { getPlayers, loading } = useUsers();
  const players = loading ? [] : getPlayers(team);
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  // Auto-select first player once loaded
  if (!selectedPlayer && players.length > 0) {
    setSelectedPlayer(players[0]);
  }

  // Format data for Recharts Radar
  const getRadarData = (stats) => {
    if (!stats) return [];
    return [
      { subject: 'Vitesse', A: stats.pace || 50, fullMark: 100 },
      { subject: 'Passe', A: stats.passing || 50, fullMark: 100 },
      { subject: 'Tir', A: stats.shooting || 50, fullMark: 100 },
      { subject: 'Défense', A: stats.defense || 50, fullMark: 100 },
      { subject: 'Général', A: stats.rating || 50, fullMark: 100 },
      { subject: 'Endurance', A: stats.stamina || 50, fullMark: 100 },
      { subject: 'Forme', A: (stats.form || 5) * 10, fullMark: 100 },
    ];
  };

  // Mock data for LineChart (Performance history)
  const getHistoryData = () => {
    return [
      { name: 'Août', note: 6.5 },
      { name: 'Sept', note: 7.2 },
      { name: 'Oct', note: 7.0 },
      { name: 'Nov', note: 7.8 },
      { name: 'Déc', note: 8.1 },
      { name: 'Janv', note: 7.5 },
    ];
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="page-enter" 
      style={{ maxWidth: 1000 }}
    >
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: '1.8rem', marginBottom: 8, textTransform: 'uppercase' }}>
          Analytique & Performances
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Suivi avancé des statistiques des joueurs avec Recharts.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
        
        {/* Left Column: Player Selection & Summary */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div className="glass-card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: '1rem', marginBottom: 16 }}>Sélectionner un joueur</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 300, overflowY: 'auto', paddingRight: 8 }} className="custom-scroll">
              {players.map(p => (
                <div 
                  key={p.id} 
                  onClick={() => setSelectedPlayer(p)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px',
                    borderRadius: 'var(--radius-md)', cursor: 'pointer',
                    background: selectedPlayer?.id === p.id ? 'rgba(108,92,231,0.1)' : 'transparent',
                    border: `1px solid ${selectedPlayer?.id === p.id ? 'rgba(108,92,231,0.3)' : 'transparent'}`,
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div className="avatar avatar-sm" style={{ background: p.photoUrl ? `url(${p.photoUrl}) center/cover` : p.avatarColor, color: 'white' }}>
                    {!p.photoUrl && p.avatar}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{p.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{p.position || 'N/A'}</div>
                  </div>
                  {p.stats?.rating && (
                    <div className="badge badge-primary" style={{ fontSize: '0.7rem' }}>{p.stats.rating}</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {selectedPlayer && (
            <motion.div 
              key={selectedPlayer.id}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="glass-card" 
              style={{ padding: 24, display: 'flex', alignItems: 'center', gap: 20 }}
            >
              <div className="avatar" style={{ width: 80, height: 80, fontSize: '2rem', background: selectedPlayer.photoUrl ? `url(${selectedPlayer.photoUrl}) center/cover` : selectedPlayer.avatarColor, color: 'white' }}>
                {!selectedPlayer.photoUrl && selectedPlayer.avatar}
              </div>
              <div>
                <h2 style={{ fontSize: '1.4rem', marginBottom: 4 }}>{selectedPlayer.name}</h2>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <span className="badge badge-info">{selectedPlayer.position || 'Non défini'}</span>
                  <span className="badge badge-success">Général : {selectedPlayer.stats?.rating || 'N/A'}</span>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Right Column: Recharts Graphs */}
        {selectedPlayer ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            
            {/* Radar Chart */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-card" 
              style={{ padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
            >
              <h3 style={{ fontSize: '1rem', width: '100%', marginBottom: 16 }}>Profil Technique (Radar)</h3>
              <div style={{ width: '100%', height: 320 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={getRadarData(selectedPlayer.stats)}>
                    <PolarGrid stroke="var(--border-color)" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text-secondary)', fontSize: 12, fontWeight: 600 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: 'var(--text-muted)', fontSize: 10 }} />
                    <Radar name={selectedPlayer.name} dataKey="A" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.4} />
                    <RechartsTooltip contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-color)', borderRadius: 8, color: 'var(--text-primary)' }} itemStyle={{ color: 'var(--primary)' }} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Line Chart */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card" 
              style={{ padding: 24 }}
            >
              <h3 style={{ fontSize: '1rem', width: '100%', marginBottom: 16 }}>Évolution de la Note (Saison)</h3>
              <div style={{ width: '100%', height: 250 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={getHistoryData()} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                    <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} tickMargin={10} axisLine={false} tickLine={false} />
                    <YAxis domain={[0, 10]} stroke="var(--text-muted)" fontSize={12} axisLine={false} tickLine={false} />
                    <RechartsTooltip contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-color)', borderRadius: 8 }} />
                    <Line type="monotone" dataKey="note" stroke="var(--accent)" strokeWidth={3} dot={{ r: 5, fill: 'var(--bg-card)', strokeWidth: 2 }} activeDot={{ r: 7 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>
        ) : (
          <div className="glass-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 400, color: 'var(--text-muted)' }}>
            Sélectionnez un joueur pour voir ses statistiques Recharts.
          </div>
        )}
      </div>
    </motion.div>
  );
}
