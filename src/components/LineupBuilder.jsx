import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useAuth, useToast } from '../App.jsx';
import { updateMatchLineup, getUserById } from '../data/store.js';

const FIELD_CONFIGS = {
  football: {
    bg: 'var(--bg-elevated)',
    lines: (
      <>
        {/* Center circle */}
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '30%', height: '15%', border: '2px solid var(--border-color)', borderRadius: '50%' }} />
        {/* Center line */}
        <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 2, background: 'var(--border-color)' }} />
        {/* Penalty areas */}
        <div style={{ position: 'absolute', top: 0, left: '20%', right: '20%', height: '15%', border: '2px solid var(--border-color)', borderTop: 'none' }} />
        <div style={{ position: 'absolute', bottom: 0, left: '20%', right: '20%', height: '15%', border: '2px solid var(--border-color)', borderBottom: 'none' }} />
      </>
    )
  },
  basketball: {
    bg: 'var(--bg-elevated)',
    lines: (
      <>
        {/* Center circle */}
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '30%', height: '15%', border: '2px solid var(--border-color)', borderRadius: '50%' }} />
        {/* Center line */}
        <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 2, background: 'var(--border-color)' }} />
        {/* Key areas */}
        <div style={{ position: 'absolute', top: 0, left: '35%', right: '35%', height: '25%', border: '2px solid var(--border-color)', borderTop: 'none', background: 'var(--bg-card)' }} />
        <div style={{ position: 'absolute', bottom: 0, left: '35%', right: '35%', height: '25%', border: '2px solid var(--border-color)', borderBottom: 'none', background: 'var(--bg-card)' }} />
        {/* 3pt lines (simplified) */}
        <div style={{ position: 'absolute', top: 0, left: '10%', right: '10%', height: '40%', border: '2px solid var(--border-color)', borderTop: 'none', borderRadius: '0 0 50% 50%' }} />
        <div style={{ position: 'absolute', bottom: 0, left: '10%', right: '10%', height: '40%', border: '2px solid var(--border-color)', borderBottom: 'none', borderRadius: '50% 50% 0 0' }} />
      </>
    )
  }
};

const FORMATIONS = {
  foot11_442: [
    { id: 0, x: 50, y: 88, role: 'G' },
    { id: 1, x: 15, y: 70, role: 'DG' },
    { id: 2, x: 35, y: 75, role: 'DC' },
    { id: 3, x: 65, y: 75, role: 'DC' },
    { id: 4, x: 85, y: 70, role: 'DD' },
    { id: 5, x: 20, y: 45, role: 'MG' },
    { id: 6, x: 40, y: 50, role: 'MC' },
    { id: 7, x: 60, y: 50, role: 'MC' },
    { id: 8, x: 80, y: 45, role: 'MD' },
    { id: 9, x: 35, y: 20, role: 'BU' },
    { id: 10, x: 65, y: 20, role: 'BU' },
  ],
  foot11_4231: [
    { id: 0, x: 50, y: 88, role: 'G' },
    { id: 1, x: 15, y: 70, role: 'DG' },
    { id: 2, x: 35, y: 75, role: 'DC' },
    { id: 3, x: 65, y: 75, role: 'DC' },
    { id: 4, x: 85, y: 70, role: 'DD' },
    { id: 5, x: 35, y: 55, role: 'MDC' },
    { id: 6, x: 65, y: 55, role: 'MDC' },
    { id: 7, x: 20, y: 35, role: 'MOG' },
    { id: 8, x: 50, y: 35, role: 'MOC' },
    { id: 9, x: 80, y: 35, role: 'MOD' },
    { id: 10, x: 50, y: 15, role: 'BU' },
  ],
  foot11_433: [
    { id: 0, x: 50, y: 88, role: 'G' },
    { id: 1, x: 15, y: 70, role: 'DG' },
    { id: 2, x: 35, y: 75, role: 'DC' },
    { id: 3, x: 65, y: 75, role: 'DC' },
    { id: 4, x: 85, y: 70, role: 'DD' },
    { id: 5, x: 50, y: 55, role: 'MDC' },
    { id: 6, x: 30, y: 40, role: 'MC' },
    { id: 7, x: 70, y: 40, role: 'MC' },
    { id: 8, x: 20, y: 20, role: 'AG' },
    { id: 9, x: 50, y: 15, role: 'BU' },
    { id: 10, x: 80, y: 20, role: 'AD' },
  ],
  foot5: [
    { id: 0, x: 50, y: 88, role: 'G' },
    { id: 1, x: 50, y: 65, role: 'DEF' },
    { id: 2, x: 20, y: 40, role: 'AG' },
    { id: 3, x: 80, y: 40, role: 'AD' },
    { id: 4, x: 50, y: 15, role: 'BU' },
  ],
  basket5x5: [
    { id: 0, x: 50, y: 75, role: 'PG' },
    { id: 1, x: 20, y: 55, role: 'SG' },
    { id: 2, x: 80, y: 55, role: 'SF' },
    { id: 3, x: 35, y: 25, role: 'PF' },
    { id: 4, x: 65, y: 25, role: 'C' },
  ],
  basket3x3: [
    { id: 0, x: 50, y: 70, role: 'Meneur' },
    { id: 1, x: 25, y: 40, role: 'Ailier' },
    { id: 2, x: 75, y: 40, role: 'Pivot' },
  ],
};

export default function LineupBuilder({ match, sport, format, onClose, onUpdate }) {
  const { showToast } = useToast();
  
  // match.lineup is an object mapping slot.id to playerId
  const [lineup, setLineup] = useState(match.lineup || {});
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedFormation, setSelectedFormation] = useState('foot11_442');

  const getActiveFormation = () => {
    if (format === 'foot11') return FORMATIONS[selectedFormation];
    return FORMATIONS[format] || FORMATIONS.foot5;
  };

  const formation = getActiveFormation();
  const field = FIELD_CONFIGS[sport] || FIELD_CONFIGS.football;

  // List of convocated players
  const convocatedIds = match.convocations || [];
  const allAvailablePlayers = convocatedIds.map(id => getUserById(id)).filter(Boolean);

  const handleSlotClick = (slotId) => {
    setSelectedSlot(selectedSlot === slotId ? null : slotId);
  };

  const handleAssign = (playerId) => {
    if (selectedSlot === null) return;
    
    // If player is already somewhere else, swap them or just move them
    const newLineup = { ...lineup };
    
    // Remove player from current slot if they are already on the field
    Object.keys(newLineup).forEach(key => {
      if (newLineup[key] === playerId) {
        delete newLineup[key];
      }
    });

    newLineup[selectedSlot] = playerId;
    setLineup(newLineup);
    setSelectedSlot(null);
  };

  const handleRemove = (slotId, e) => {
    e.stopPropagation();
    const newLineup = { ...lineup };
    delete newLineup[slotId];
    setLineup(newLineup);
    setSelectedSlot(null);
  };

  const handleSave = () => {
    updateMatchLineup(match.id, lineup);
    showToast('Composition enregistrée !');
    if (onUpdate) onUpdate();
    onClose();
  };

  // Players not currently in the lineup
  const placedIds = Object.values(lineup);
  const benchPlayers = allAvailablePlayers.filter(p => !placedIds.includes(p.id));

  return createPortal(
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: 1000, height: '90vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-card)', overflow: 'hidden' }}>
        
        {/* Header */}
        <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <h2 style={{ fontSize: '1.2rem', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="material-icons-round" style={{ color: 'var(--accent)' }}>sports_soccer</span>
              Composition 
            </h2>
            {format === 'foot11' && (
              <select 
                value={selectedFormation} 
                onChange={e => setSelectedFormation(e.target.value)}
                style={{ padding: '6px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', fontWeight: 600, fontSize: '0.9rem' }}
              >
                <option value="foot11_442">4-4-2</option>
                <option value="foot11_4231">4-2-3-1</option>
                <option value="foot11_433">4-3-3</option>
              </select>
            )}
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button className="btn btn-ghost btn-sm" onClick={onClose}>Annuler</button>
            <button className="btn btn-primary btn-sm" onClick={handleSave}>
              <span className="material-icons-round" style={{ fontSize: 16 }}>save</span> Enregistrer
            </button>
          </div>
        </div>

        {/* Content */}
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          
          {/* Field Area */}
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, background: 'var(--bg-primary)' }}>
            <div style={{ 
              position: 'relative', 
              width: '100%', 
              maxWidth: 400, 
              aspectRatio: '2/3', 
              background: field.bg,
              border: '4px solid rgba(255,255,255,0.8)',
              borderRadius: 8,
              boxShadow: 'var(--shadow-lg)',
              overflow: 'hidden'
            }}>
              {field.lines}

              {/* Slots */}
              {formation.map(slot => {
                const playerId = lineup[slot.id];
                const player = playerId ? getUserById(playerId) : null;
                const isSelected = selectedSlot === slot.id;

                return (
                  <div 
                    key={slot.id}
                    onClick={() => handleSlotClick(slot.id)}
                    style={{
                      position: 'absolute',
                      left: `${slot.x}%`,
                      top: `${slot.y}%`,
                      transform: 'translate(-50%, -50%)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 4,
                      cursor: 'pointer',
                      zIndex: isSelected ? 10 : 5
                    }}
                  >
                    <div style={{
                      width: 44,
                      height: 44,
                      borderRadius: 'var(--radius-sm)',
                      background: player ? (player.photoUrl ? `url(${player.photoUrl}) center/cover` : 'var(--text-primary)') : 'transparent',
                      border: `1px solid ${isSelected ? 'var(--text-primary)' : 'var(--border-color)'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: player ? 'var(--bg-primary)' : 'var(--text-muted)',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      transition: 'all 0.2s ease',
                      position: 'relative',
                      boxShadow: isSelected ? '0 0 0 2px var(--bg-primary), 0 0 0 4px var(--text-primary)' : 'none'
                    }}>
                      {player ? (!player.photoUrl && player.avatar) : <span className="material-icons-round" style={{ fontSize: 20 }}>person_add</span>}
                      
                      {player && isSelected && (
                        <button 
                          onClick={(e) => handleRemove(slot.id, e)}
                          style={{
                            position: 'absolute', top: -8, right: -8,
                            width: 20, height: 20, borderRadius: '50%',
                            background: 'var(--accent-red)', border: 'none', color: 'white',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer'
                          }}
                        >
                          <span className="material-icons-round" style={{ fontSize: 14 }}>close</span>
                        </button>
                      )}
                    </div>
                    <div style={{
                      background: 'rgba(0,0,0,0.6)',
                      padding: '2px 6px',
                      borderRadius: 4,
                      fontSize: '0.65rem',
                      color: 'white',
                      fontWeight: 600,
                      whiteSpace: 'nowrap'
                    }}>
                      {player ? player.name.split(' ')[0] : slot.role}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Player Selection Sidebar */}
          <div style={{ width: 300, background: 'var(--bg-secondary)', borderLeft: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column' }}>
            {selectedSlot !== null ? (
              <div style={{ padding: 20, display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--accent)', marginBottom: 16 }}>
                  Sélectionnez un joueur pour : {formation.find(s => s.id === selectedSlot)?.role}
                </div>
                
                <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {allAvailablePlayers.length === 0 && (
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Aucun joueur convoqué pour ce match.</div>
                  )}
                  {allAvailablePlayers.map(p => {
                    const isPlaced = placedIds.includes(p.id);
                    return (
                      <div 
                        key={p.id}
                        onClick={() => handleAssign(p.id)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px',
                          background: 'var(--bg-card)', borderRadius: 'var(--radius-md)',
                          border: '1px solid var(--border-color)', cursor: 'pointer',
                          transition: 'background 0.2s ease',
                          opacity: isPlaced ? 0.6 : 1
                        }}
                      >
                        <div className="avatar" style={{ background: p.photoUrl ? `url(${p.photoUrl}) center/cover` : p.avatarColor, color: 'white' }}>
                          {!p.photoUrl && p.avatar}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '0.85rem', fontWeight: 600, textTransform:'uppercase' }}>{p.name}</div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{p.position || 'N/A'}</div>
                        </div>
                        {p.stats && (
                          <div style={{ display:'flex', gap:4 }}>
                            <div style={{ fontSize:'0.7rem', padding:'2px 6px', border:'1px solid var(--border-color)', borderRadius:'var(--radius-sm)' }}>
                              NOTE: {p.stats.rating}
                            </div>
                            <div style={{ fontSize:'0.7rem', padding:'2px 6px', border:'1px solid var(--border-color)', borderRadius:'var(--radius-sm)' }}>
                              END: {p.stats.stamina}
                            </div>
                          </div>
                        )}
                        {isPlaced && <span className="material-icons-round" style={{ fontSize: 16, color: 'var(--text-primary)' }}>check</span>}
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div style={{ padding: 20, display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 16 }}>
                  Remplaçants ({benchPlayers.length})
                </div>
                <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 12 }}>
                    Cliquez sur une position vide sur le terrain pour y assigner un joueur.
                  </p>
                  {benchPlayers.map(p => (
                    <div key={p.id} style={{
                      display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px',
                      background: 'var(--bg-card)', borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-color)',
                      opacity: 0.8
                    }}>
                      <div className="avatar avatar-sm">{p.avatar}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.85rem', fontWeight: 600, textTransform:'uppercase' }}>{p.name}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{p.position || 'N/A'}</div>
                      </div>
                      {p.stats && (
                        <div style={{ display:'flex', gap:4 }}>
                          <div style={{ fontSize:'0.7rem', padding:'2px 6px', border:'1px solid var(--border-color)', borderRadius:'var(--radius-sm)' }}>
                            NOTE: {p.stats.rating}
                          </div>
                          <div style={{ fontSize:'0.7rem', padding:'2px 6px', border:'1px solid var(--border-color)', borderRadius:'var(--radius-sm)' }}>
                            END: {p.stats.stamina}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>,
    document.body
  );
}
