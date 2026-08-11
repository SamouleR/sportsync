import { useState, useEffect } from 'react';
import { useAuth, useToast } from '../App.jsx';
import { useUsers } from '../hooks/useUsers.js';
import { userService, statsService } from '../services/api.js';

export default function PlayersManagement() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const { users, getPlayers, refresh, loading } = useUsers();
  const [players, setPlayers] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [search, setSearch] = useState('');
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [editStats, setEditStats] = useState({ rating: 70, form: 7.0 });
  const [coachComment, setCoachComment] = useState('');

  useEffect(() => {
    if (!loading) setPlayers(getPlayers(user.team));
  }, [user.team, loading, users]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) return;
    try {
      await userService.create({ name: newName.trim(), email: newEmail.trim(), team: user.team, role: 'player' });
      setNewName(''); setNewEmail(''); setShowAdd(false);
      await refresh();
      showToast('Joueur ajouté !');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleRemove = async (id, name) => {
    if (confirm(`Retirer ${name} de l'effectif ?`)) {
      await userService.delete(id);
      await refresh();
      showToast('Joueur retiré', 'person_remove');
    }
  };

  const filtered = players.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.email && p.email.toLowerCase().includes(search.toLowerCase()))
  );

  const handleOpenPlayer = (p) => {
    setSelectedPlayer(p);
    setEditStats({ rating: p.stats?.rating || 70, form: p.stats?.form || 7.0 });
    setCoachComment(p.coachComment || '');
  };

  const handleSavePlayer = async () => {
    if (!selectedPlayer) return;
    try {
      await userService.update(selectedPlayer.id, {
        coachComment,
        stats: { rating: Number(editStats.rating), form: Number(editStats.form) }
      });
      await refresh();
      setSelectedPlayer(null);
      showToast('Fiche joueur mise à jour');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  return (
    <div className="page-enter" style={{ maxWidth: 700 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', marginBottom: 4 }}>
            <span className="material-icons-round" style={{ fontSize: 28, verticalAlign: 'middle', marginRight: 8, color: 'var(--primary-light)' }}>groups</span>
            Effectif
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            {players.length} joueur{players.length > 1 ? 's' : ''} — {user.team}
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAdd(!showAdd)}>
          <span className="material-icons-round" style={{ fontSize: 18 }}>{showAdd ? 'close' : 'person_add'}</span>
          {showAdd ? 'Fermer' : 'Ajouter'}
        </button>
      </div>

      {/* Add Player Form */}
      {showAdd && (
        <form onSubmit={handleAdd} className="glass-card" style={{ padding: 24, marginBottom: 24 }}>
          <h3 style={{ fontSize: '1rem', marginBottom: 16 }}>Nouveau joueur</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
            <div>
              <label className="input-label">Nom complet</label>
              <input className="input-field" placeholder="Prénom Nom" value={newName} onChange={e => setNewName(e.target.value)} required />
            </div>
            <div>
              <label className="input-label">Email</label>
              <input className="input-field" type="email" placeholder="email@exemple.fr" value={newEmail} onChange={e => setNewEmail(e.target.value)} required />
            </div>
          </div>
          <button type="submit" className="btn btn-success">
            <span className="material-icons-round" style={{ fontSize: 18 }}>check</span> Ajouter le joueur
          </button>
        </form>
      )}

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: 20 }}>
        <span className="material-icons-round" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: 20 }}>search</span>
        <input className="input-field" placeholder="Rechercher un joueur..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 44 }} />
      </div>

      {/* Player List */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
        {filtered.map((p, i) => (
          <div key={p.id} className="glass-card card-enter hover-scale" onClick={() => handleOpenPlayer(p)} style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14, animationDelay: `${i * 40}ms`, cursor: 'pointer', border: '1px solid var(--border-color)' }}>
            <div className="avatar" style={{ background: p.photoUrl ? `url(${p.photoUrl}) center/cover` : p.avatarColor, color: 'white' }}>
              {!p.photoUrl && p.avatar}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{p.name}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 4 }}>{p.category || 'Senior'} • {p.level || 'Régional'}</div>
              {p.medicalStatus === 'Manquant' && <span className="badge badge-danger" style={{ fontSize: '0.65rem', display: 'inline-block' }}>CERTIFICAT MANQUANT</span>}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>{p.stats?.rating || '-'}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>NOTE</div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
            <span className="material-icons-round" style={{ fontSize: 40, marginBottom: 8 }}>search_off</span>
            <p>Aucun joueur trouvé.</p>
          </div>
        )}
      </div>

      {/* Player Profile Modal */}
      {selectedPlayer && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 24 }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: 500, padding: 32, display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div className="avatar avatar-lg" style={{ background: selectedPlayer.photoUrl ? `url(${selectedPlayer.photoUrl}) center/cover` : selectedPlayer.avatarColor, color: 'white' }}>
                  {!selectedPlayer.photoUrl && selectedPlayer.avatar}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>{selectedPlayer.name}</h3>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{selectedPlayer.category || 'Senior'} • {selectedPlayer.level || 'Régional'}</div>
                </div>
              </div>
              <button className="btn btn-icon btn-ghost" onClick={() => setSelectedPlayer(null)}>
                <span className="material-icons-round">close</span>
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, background: 'var(--bg-elevated)', padding: 16, borderRadius: 'var(--radius-md)' }}>
              <div>
                <label className="input-label">Note Globale (Rating)</label>
                <input type="number" min="1" max="99" value={editStats.rating} onChange={e => setEditStats({...editStats, rating: e.target.value})} className="input-field" style={{ fontSize: '1.2rem', fontWeight: 800 }} />
              </div>
              <div>
                <label className="input-label">Forme du moment</label>
                <input type="number" min="1" max="10" step="0.1" value={editStats.form} onChange={e => setEditStats({...editStats, form: e.target.value})} className="input-field" style={{ fontSize: '1.2rem', fontWeight: 800 }} />
              </div>
            </div>

            <div>
              <label className="input-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Certificat Médical</span>
                <span className={`badge ${selectedPlayer.medicalStatus === 'Validé' ? 'badge-success' : 'badge-danger'}`}>
                  {selectedPlayer.medicalStatus || 'Manquant'}
                </span>
              </label>
              {selectedPlayer.medicalStatus === 'Manquant' && (
                <p style={{ fontSize: '0.8rem', color: 'var(--accent-red)', margin: '4px 0 0 0' }}>Rappel : Le joueur ne peut pas participer aux matchs officiels.</p>
              )}
            </div>

            <div>
              <label className="input-label">Commentaire du Coach (Privé)</label>
              <textarea 
                rows="4" 
                value={coachComment} 
                onChange={e => setCoachComment(e.target.value)} 
                className="input-field" 
                placeholder="Ex: Doit travailler son pied faible..."
                style={{ resize: 'none' }}
              />
            </div>

            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 8 }}>
              <button className="btn btn-ghost" onClick={() => handleRemove(selectedPlayer.id, selectedPlayer.name)} style={{ color: 'var(--accent-red)', marginRight: 'auto' }}>
                <span className="material-icons-round" style={{ fontSize: 18 }}>person_remove</span> Retirer
              </button>
              <button className="btn btn-ghost" onClick={() => setSelectedPlayer(null)}>Annuler</button>
              <button className="btn btn-primary" onClick={handleSavePlayer}>Enregistrer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
