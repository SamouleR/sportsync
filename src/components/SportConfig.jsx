import { useState, useEffect } from 'react';
import { useAuth, useToast } from '../App.jsx';
import { SPORTS_CONFIG, getClubConfig, setClubConfig, getClubName, getCurrentFormatConfig, getPlayers } from '../data/store.js';

export default function SportConfig() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [config, setConfig] = useState(getClubConfig());
  const [saved, setSaved] = useState(true);
  const clubName = getClubName();
  const players = getPlayers(user.team);

  const sportData = SPORTS_CONFIG[config.sport];
  const formatData = sportData?.formats[config.format];

  const handleSportChange = (sport) => {
    const firstFormat = Object.keys(SPORTS_CONFIG[sport].formats)[0];
    setConfig({ sport, format: firstFormat });
    setSaved(false);
  };

  const handleFormatChange = (format) => {
    setConfig(prev => ({ ...prev, format }));
    setSaved(false);
  };

  const handleSave = () => {
    setClubConfig(config.sport, config.format);
    showToast('Configuration sportive enregistrée !');
    setSaved(true);
  };

  return (
    <div className="page-enter" style={{ maxWidth: 700 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: '1.6rem', marginBottom: 4 }}>
          <span className="material-icons-round" style={{ fontSize: 28, verticalAlign: 'middle', marginRight: 8, color: 'var(--accent)' }}>settings</span>
          Configuration sportive
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Définissez le sport et le format de jeu de {clubName}.
        </p>
      </div>

      {/* Sport Selection */}
      <div className="glass-card" style={{ padding: 24, marginBottom: 20 }}>
        <h3 style={{ fontSize: '1rem', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="material-icons-round" style={{ fontSize: 20, color: 'var(--primary-light)' }}>sports</span>
          Sport principal
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
          {Object.entries(SPORTS_CONFIG).map(([key, sport]) => (
            <button
              key={key}
              onClick={() => handleSportChange(key)}
              style={{
                padding: '20px 16px',
                border: `2px solid ${config.sport === key ? 'var(--primary)' : 'var(--border-color)'}`,
                borderRadius: 'var(--radius-lg)',
                background: config.sport === key ? 'rgba(108,92,231,0.12)' : 'var(--bg-card)',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 10,
                fontFamily: "'Montserrat'",
              }}
            >
              <span className="material-icons-round" style={{
                fontSize: 40,
                color: config.sport === key ? 'var(--primary-light)' : 'var(--text-muted)',
              }}>
                {sport.icon}
              </span>
              <span style={{
                fontWeight: 700,
                fontSize: '0.95rem',
                color: config.sport === key ? 'var(--text-primary)' : 'var(--text-secondary)',
              }}>
                {sport.label}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {Object.keys(sport.formats).length} format(s)
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Format Selection */}
      <div className="glass-card" style={{ padding: 24, marginBottom: 20 }}>
        <h3 style={{ fontSize: '1rem', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="material-icons-round" style={{ fontSize: 20, color: 'var(--accent)' }}>tune</span>
          Format de jeu — {sportData?.label}
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
          {sportData && Object.entries(sportData.formats).map(([key, fmt]) => (
            <button
              key={key}
              onClick={() => handleFormatChange(key)}
              style={{
                padding: '18px 16px',
                border: `2px solid ${config.format === key ? 'var(--accent)' : 'var(--border-color)'}`,
                borderRadius: 'var(--radius-lg)',
                background: config.format === key ? 'rgba(0,210,255,0.08)' : 'var(--bg-card)',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
                textAlign: 'left',
                fontFamily: "'Montserrat'",
              }}
            >
              <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: 8, color: config.format === key ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                {fmt.label}
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
                <span className="badge badge-success">{fmt.titulaires} titulaires</span>
                <span className="badge badge-info">{fmt.remplacants} remplaçants</span>
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Max convocation : {fmt.maxConvocation} joueurs
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Format Details Preview */}
      {formatData && (
        <div className="glass-card" style={{ padding: 24, marginBottom: 20 }}>
          <h3 style={{ fontSize: '1rem', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="material-icons-round" style={{ fontSize: 20, color: 'var(--accent-green)' }}>visibility</span>
            Aperçu : {formatData.label}
          </h3>

          {/* Stats row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 20 }}>
            <div className="stat-card" style={{ textAlign: 'center', padding: 14 }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: "'Montserrat'", color: 'var(--accent-green)' }}>
                {formatData.titulaires}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Titulaires</div>
            </div>
            <div className="stat-card" style={{ textAlign: 'center', padding: 14 }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: "'Montserrat'", color: 'var(--accent)' }}>
                {formatData.remplacants}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Remplaçants</div>
            </div>
            <div className="stat-card" style={{ textAlign: 'center', padding: 14 }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: "'Montserrat'", color: 'var(--accent-orange)' }}>
                {formatData.maxConvocation}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Max convoqués</div>
            </div>
          </div>

          {/* Positions by category */}
          <h4 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 12, fontWeight: 600 }}>
            Postes disponibles
          </h4>
          {Object.entries(formatData.positionCategories).map(([cat, positions]) => (
            <div key={cat} style={{ marginBottom: 12 }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, marginBottom: 6 }}>
                {cat}
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {positions.map(pos => (
                  <span key={pos} className="badge badge-primary" style={{ fontSize: '0.78rem' }}>{pos}</span>
                ))}
              </div>
            </div>
          ))}

          {/* Player count warning */}
          {players.length > formatData.maxConvocation && (
            <div style={{
              marginTop: 16, padding: '12px 16px',
              background: 'rgba(255,82,82,0.1)', border: '1px solid rgba(255,82,82,0.3)',
              borderRadius: 'var(--radius-md)', fontSize: '0.85rem', color: 'var(--accent-red)',
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <span className="material-icons-round" style={{ fontSize: 18 }}>warning</span>
              Vous avez {players.length} joueurs mais ce format limite les convocations à {formatData.maxConvocation}.
            </div>
          )}
        </div>
      )}

      {/* Save button */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <button className="btn btn-primary btn-lg" onClick={handleSave} disabled={saved}>
          <span className="material-icons-round" style={{ fontSize: 20 }}>save</span>
          {saved ? 'CONFIGURATION ENREGISTRÉE' : 'ENREGISTRER LA CONFIGURATION'}
        </button>
        {!saved && <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}><span className="material-icons-round" style={{ fontSize:14, verticalAlign:'middle' }}>warning</span> MODIFICATIONS NON ENREGISTRÉES</span>}
      </div>
    </div>
  );
}
