import { useState } from 'react';
import { getPlayers } from '../data/store.js';

export default function PerformanceAnalytics({ team }) {
  const players = getPlayers(team);
  const [selectedPlayer, setSelectedPlayer] = useState(players[0] || null);

  // Simple SVG Radar Chart
  const drawRadar = (stats) => {
    if (!stats) return null;
    const center = 100;
    const radius = 80;
    const attributes = ['rating', 'stamina', 'form', 'pace', 'passing', 'shooting', 'defense'];
    const angles = attributes.map((_, i) => (Math.PI * 2 * i) / attributes.length - Math.PI / 2);

    const getPoint = (val, angle) => {
      // Normalize values (assuming max is 100, form is max 10 so * 10)
      const normalized = val <= 10 ? val * 10 : val;
      const r = (normalized / 100) * radius;
      return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
    };

    const points = attributes.map((attr, i) => getPoint(stats[attr] || 50, angles[i])).join(' ');

    return (
      <svg width="200" height="200" viewBox="0 0 200 200" style={{ overflow: 'visible' }}>
        {/* Web grid */}
        {[0.2, 0.4, 0.6, 0.8, 1].map((scale, idx) => (
          <polygon
            key={`grid-${idx}`}
            points={attributes.map((_, i) => `${center + radius * scale * Math.cos(angles[i])},${center + radius * scale * Math.sin(angles[i])}`).join(' ')}
            fill="none"
            stroke="var(--border-color)"
            strokeWidth="1"
          />
        ))}
        {/* Axes */}
        {angles.map((angle, i) => (
          <line key={`axis-${i}`} x1={center} y1={center} x2={center + radius * Math.cos(angle)} y2={center + radius * Math.sin(angle)} stroke="var(--border-color)" strokeWidth="1" />
        ))}
        {/* Data polygon */}
        <polygon points={points} fill="rgba(0,0,0,0.1)" stroke="var(--text-primary)" strokeWidth="2" />
        {/* Labels */}
        {attributes.map((attr, i) => (
          <text key={`label-${i}`} x={center + (radius + 20) * Math.cos(angles[i])} y={center + (radius + 20) * Math.sin(angles[i])} fontSize="10" fill="var(--text-secondary)" textAnchor="middle" dominantBaseline="middle" style={{ textTransform: 'uppercase', fontWeight: 600 }}>
            {attr}
          </text>
        ))}
      </svg>
    );
  };

  return (
    <div className="page-enter" style={{ maxWidth: 900 }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: '1.8rem', marginBottom: 8, textTransform: 'uppercase' }}>
          ANALYTIQUE & PERFORMANCES
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Analyse approfondie des profils athlétiques et techniques.
        </p>
      </div>

      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
        {/* Player Selection */}
        <div className="glass-card" style={{ padding: 16, width: 250, maxHeight: 600, overflowY: 'auto' }}>
          <h3 style={{ fontSize: '0.9rem', marginBottom: 16, color: 'var(--text-secondary)' }}>EFFECTIF</h3>
          {players.map(p => (
            <div key={p.id} onClick={() => setSelectedPlayer(p)} style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '10px',
              borderBottom: '1px solid var(--border-color)', cursor: 'pointer',
              background: selectedPlayer?.id === p.id ? 'var(--bg-secondary)' : 'transparent'
            }}>
              <div className="avatar avatar-sm">{p.avatar}</div>
              <div style={{ flex: 1, fontSize: '0.85rem', fontWeight: selectedPlayer?.id === p.id ? 700 : 500 }}>
                {p.name}
              </div>
            </div>
          ))}
        </div>

        {/* Analytics Display */}
        {selectedPlayer && selectedPlayer.stats && (
          <div className="glass-card" style={{ flex: 1, padding: 32, minWidth: 300, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1.4rem', textTransform: 'uppercase', marginBottom: 4 }}>{selectedPlayer.name}</h2>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: 32 }}>{selectedPlayer.position}</div>

            <div style={{ display: 'flex', gap: 48, flexWrap: 'wrap', justifyContent: 'center', width: '100%' }}>
              {/* Radar Chart */}
              <div style={{ padding: 24, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {drawRadar(selectedPlayer.stats)}
              </div>

              {/* Stats Bars */}
              <div style={{ flex: 1, minWidth: 250, display: 'flex', flexDirection: 'column', gap: 16 }}>
                {Object.entries(selectedPlayer.stats).map(([key, val]) => {
                  const normalized = val <= 10 ? val * 10 : val;
                  return (
                    <div key={key}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: 4 }}>
                        <span>{key}</span>
                        <span>{val}</span>
                      </div>
                      <div style={{ height: 6, background: 'var(--border-color)', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${normalized}%`, background: 'var(--text-primary)', transition: 'width 0.5s ease' }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
