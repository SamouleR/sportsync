import { useState } from 'react';
import { useAuth, useToast } from '../App.jsx';
import { useMatches } from '../hooks/useMatches.js';
import { useUsers } from '../hooks/useUsers.js';
import { useMedical } from '../hooks/useMedical.js';
import { DEFAULT_CLUB_CONFIG, LOCATIONS } from '../data/constants.js';
import LineupBuilder from './LineupBuilder.jsx';

export default function MatchConvocation({ onViewMatch }) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const isCoach = user.role === 'coach' || user.role === 'admin';
  const isParent = user.role === 'parent';
  
  const { getUpcoming, create, loading: matchesLoading } = useMatches(user.team);
  
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ title:'', date:'', startTime:'', endTime:'', location:'', opponent:'', type:'domicile' });

  const matches = matchesLoading ? [] : getUpcoming();

  const up = (k,v) => setForm(p => ({...p,[k]:v}));
  const submit = async (e) => {
    e.preventDefault();
    await create({ ...form, team:user.team, createdBy:user.id });
    showToast('Match créé !');
    setShowCreate(false);
    setForm({ title:'', date:'', startTime:'', endTime:'', location:'', opponent:'', type:'domicile' });
  };

  const fmt = d => new Date(d).toLocaleDateString('fr-FR', { weekday:'short', day:'numeric', month:'short' });

  return (
    <div className="page-enter" style={{ maxWidth:750 }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:24, flexWrap:'wrap', gap:12 }}>
        <div>
          <h1 style={{ fontSize:'1.6rem', marginBottom:4 }}>
            <span className="material-icons-round" style={{ fontSize:28, verticalAlign:'middle', marginRight:8, color:'var(--accent)' }}>emoji_events</span>
            Matchs & Convocations
          </h1>
          <p style={{ color:'var(--text-secondary)', fontSize:'0.9rem' }}>{matches.length} match(s) à venir</p>
        </div>
        {isCoach && <button className="btn btn-primary" onClick={() => setShowCreate(!showCreate)}>
          <span className="material-icons-round" style={{ fontSize:18 }}>{showCreate?'close':'add'}</span>
          {showCreate ? 'Fermer' : 'Nouveau match'}
        </button>}
      </div>

      {showCreate && (
        <form onSubmit={submit} className="glass-card" style={{ padding:24, marginBottom:24 }}>
          <h3 style={{ fontSize:'1rem', marginBottom:16 }}>Planifier un match</h3>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:16 }}>
            <div style={{ gridColumn:'1/-1' }}>
              <label className="input-label">Titre</label>
              <input className="input-field" placeholder="Ex: Championnat J15 vs ..." value={form.title} onChange={e=>up('title',e.target.value)} required />
            </div>
            <div><label className="input-label">Adversaire</label><input className="input-field" placeholder="Nom de l'équipe" value={form.opponent} onChange={e=>up('opponent',e.target.value)} required /></div>
            <div><label className="input-label">Type</label>
              <select className="select-field" value={form.type} onChange={e=>up('type',e.target.value)}>
                <option value="domicile">DOMICILE</option><option value="extérieur">EXTÉRIEUR</option>
              </select>
            </div>
            <div><label className="input-label">Date</label><input type="date" className="input-field" value={form.date} onChange={e=>up('date',e.target.value)} required /></div>
            <div><label className="input-label">Heure début</label><input type="time" className="input-field" value={form.startTime} onChange={e=>up('startTime',e.target.value)} required /></div>
            <div><label className="input-label">Heure fin</label><input type="time" className="input-field" value={form.endTime} onChange={e=>up('endTime',e.target.value)} required /></div>
            <div><label className="input-label">Lieu</label>
              <select className="select-field" value={form.location} onChange={e=>up('location',e.target.value)}>
                <option value="">Sélectionner...</option>
                {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
          </div>
          <button type="submit" className="btn btn-primary"><span className="material-icons-round" style={{ fontSize:18 }}>check</span> Créer le match</button>
        </form>
      )}

      <div className="stagger" style={{ display:'flex', flexDirection:'column', gap:14 }}>
        {matches.length === 0 && (
          <div className="glass-card" style={{ padding:48, textAlign:'center' }}>
            <span className="material-icons-round" style={{ fontSize:48, color:'var(--text-muted)' }}>sports_score</span>
            <p style={{ color:'var(--text-secondary)', marginTop:12 }}>Aucun match planifié.</p>
          </div>
        )}
        {matches.map(m => (
          <MatchCard key={m.id} match={m} isCoach={isCoach} isParent={isParent} user={user} fmt={fmt} showToast={showToast} onView={() => onViewMatch && onViewMatch(m.id)} />
        ))}
      </div>
    </div>
  );
}

function MatchCard({ match, isCoach, isParent, user, fmt, showToast, onView }) {
  const [expanded, setExpanded] = useState(false);
  const [showTactics, setShowTactics] = useState(false);
  
  const clubConfig = DEFAULT_CLUB_CONFIG;
  const { users, getPlayers } = useUsers();
  const { reports } = useMedical({ team: match.team });
  const { remove, updateConvocations } = useMatches(user.team);

  const players = getPlayers(match.team);
  const injuredIds = reports.filter(r => r.status === 'actif').map(i => i.playerId);
  
  let convocatedIds = match.convocations || [];
  if (typeof convocatedIds === 'string') {
    try { convocatedIds = JSON.parse(convocatedIds); } catch(e) { convocatedIds = []; }
  }
  let convStatus = match.convocationStatus || {};
  if (typeof convStatus === 'string') {
    try { convStatus = JSON.parse(convStatus); } catch(e) { convStatus = {}; }
  }

  const isConvoked = convocatedIds.includes(user.id);
  const myStatus = convStatus[user.id];

  const childId = isParent ? user.children?.find(id => convocatedIds.includes(id)) : null;
  const child = childId ? users.find(u => u.id === childId) : null;
  const childStatus = childId ? convStatus[childId] : null;

  const togglePlayer = async (pid) => {
    const updated = convocatedIds.includes(pid) ? convocatedIds.filter(id => id !== pid) : [...convocatedIds, pid];
    await updateConvocations(match.id, updated, convStatus);
  };

  const respond = async (status, pid = user.id) => {
    const newStatus = { ...convStatus, [pid]: status };
    await updateConvocations(match.id, convocatedIds, newStatus);
    showToast(`Réponse : ${status === 'accepté' ? 'Accepté' : 'Décliné'}`);
  };

  const handleDelete = async () => {
    if (confirm('Supprimer ce match ?')) { 
      await remove(match.id); 
      showToast('Match supprimé','delete'); 
    }
  };

  const getUserById = (id) => users.find(u => u.id === id);
  // Fake attendance since backend doesn't support it yet
  const getPlayerAttendanceRate = (pid) => 85;

  return (
    <div className="glass-card card-enter" style={{ padding:22 }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:8, marginBottom:14 }}>
        <div>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
            <span className="badge badge-info">{match.type === 'domicile' ? 'DOMICILE' : 'EXTÉRIEUR'}</span>
            <h3 style={{ fontSize:'1.05rem', textTransform:'uppercase' }}>{match.title}</h3>
          </div>
          <div style={{ display:'flex', gap:14, fontSize:'0.85rem', color:'var(--text-secondary)', flexWrap:'wrap' }}>
            <span style={{ display:'flex', alignItems:'center', gap:4 }}><span className="material-icons-round" style={{ fontSize:16 }}>calendar_today</span>{fmt(match.date)}</span>
            <span style={{ display:'flex', alignItems:'center', gap:4 }}><span className="material-icons-round" style={{ fontSize:16 }}>schedule</span>{match.startTime} - {match.endTime}</span>
            <span style={{ display:'flex', alignItems:'center', gap:4 }}><span className="material-icons-round" style={{ fontSize:16 }}>location_on</span>{match.location}</span>
          </div>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:6 }}>
            <span className="badge badge-primary">VS {match.opponent}</span>
            {isCoach && <button className="btn btn-icon btn-ghost" onClick={handleDelete} style={{ color:'var(--accent-red)' }}><span className="material-icons-round" style={{ fontSize:18 }}>delete</span></button>}
          </div>
      </div>

      <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:12, fontSize:'0.85rem' }}>
        <span style={{ color:'var(--text-secondary)' }}>Convoqués : <strong style={{ color:'var(--text-primary)' }}>{convocatedIds.length}</strong> / {players.length}</span>
        {convocatedIds.length > 0 && (
          <div style={{ display:'flex' }}>
            {convocatedIds.slice(0,6).map(pid => {
              const p = getUserById(pid);
              return p ? <div key={pid} className="avatar avatar-sm" style={{ background: p.photoUrl ? `url(${p.photoUrl}) center/cover` : p.avatarColor, color:'white', marginLeft:-6, border:'2px solid var(--bg-card)', fontSize:'0.6rem' }}>{!p.photoUrl && p.avatar}</div> : null;
            })}
            {convocatedIds.length > 6 && <div className="avatar avatar-sm" style={{ background:'var(--bg-elevated)', color:'var(--text-muted)', marginLeft:-6, border:'2px solid var(--bg-card)', fontSize:'0.6rem' }}>+{convocatedIds.length-6}</div>}
          </div>
        )}
      </div>

      {!isCoach && !isParent && isConvoked && (
        <div style={{ padding:14, background:'var(--bg-elevated)', borderRadius:'var(--radius-md)', marginBottom:12, border:'1px solid var(--border-color)' }}>
          <p style={{ fontSize:'0.85rem', fontWeight:600, marginBottom:8, display:'flex', alignItems:'center', gap:6 }}>
            <span className="material-icons-round" style={{ fontSize:16 }}>assignment_ind</span> VOUS ÊTES CONVOQUÉ
          </p>
          <div style={{ display:'flex', gap:8 }}>
            <button className={`btn btn-sm ${myStatus==='accepté'?'btn-success':'btn-ghost'}`} onClick={() => respond('accepté')}>ACCEPTER</button>
            <button className={`btn btn-sm ${myStatus==='décliné'?'btn-danger':'btn-ghost'}`} onClick={() => respond('décliné')}>DÉCLINER</button>
          </div>
          {myStatus && <span className={`badge ${myStatus==='accepté'?'badge-success':'badge-danger'}`} style={{ marginTop:8, display:'inline-flex' }}>{myStatus==='accepté'?'STATUT : ACCEPTÉ':'STATUT : DÉCLINÉ'}</span>}
        </div>
      )}

      {isParent && childId && (
        <div style={{ padding:14, background:'var(--bg-elevated)', borderRadius:'var(--radius-md)', marginBottom:12, border:'1px solid var(--border-color)' }}>
          <p style={{ fontSize:'0.85rem', fontWeight:600, marginBottom:8, display:'flex', alignItems:'center', gap:6 }}>
            <span className="material-icons-round" style={{ fontSize:16 }}>family_restroom</span> {child?.name} EST CONVOQUÉ(E)
          </p>
          <div style={{ display:'flex', gap:8 }}>
            <button className={`btn btn-sm ${childStatus==='accepté'?'btn-success':'btn-ghost'}`} onClick={() => respond('accepté', childId)}>ACCEPTER</button>
            <button className={`btn btn-sm ${childStatus==='décliné'?'btn-danger':'btn-ghost'}`} onClick={() => respond('décliné', childId)}>DÉCLINER</button>
          </div>
          {childStatus && <span className={`badge ${childStatus==='accepté'?'badge-success':'badge-danger'}`} style={{ marginTop:8, display:'inline-flex' }}>{childStatus==='accepté'?'STATUT : ACCEPTÉ':'STATUT : DÉCLINÉ'}</span>}
        </div>
      )}

      {isCoach && (
        <div style={{ display:'flex', gap:8, marginBottom: expanded?12:0 }}>
          <button className="btn btn-ghost btn-sm" onClick={() => setExpanded(!expanded)}>
            <span className="material-icons-round" style={{ fontSize:16 }}>{expanded?'expand_less':'expand_more'}</span>
            {expanded ? 'Masquer' : 'Gérer les convocations'}
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => setShowTactics(true)}>
            <span className="material-icons-round" style={{ fontSize:16 }}>sports_score</span>
            Composition tactique
          </button>
        </div>
      )}

      {showTactics && (
        <LineupBuilder 
          match={match} 
          sport={clubConfig.sport} 
          format={clubConfig.format} 
          onClose={() => setShowTactics(false)} 
        />
      )}

      {isCoach && expanded && (
        <div style={{ borderTop:'1px solid var(--border-color)', paddingTop:16 }}>
          <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
            {players.map(p => {
              const isSelected = convocatedIds.includes(p.id);
              const isInjured = injuredIds.includes(p.id);
              const attendance = getPlayerAttendanceRate(p.id);
              const cStatus = convStatus[p.id];
              return (
                <div key={p.id} onClick={() => !isInjured && togglePlayer(p.id)} style={{
                  display:'flex', alignItems:'center', gap:12, padding:'10px 14px',
                  background: isSelected ? 'rgba(108,92,231,0.1)' : 'var(--bg-card)',
                  border: `1px solid ${isSelected ? 'rgba(108,92,231,0.3)' : 'var(--border-color)'}`,
                  borderRadius:'var(--radius-md)', cursor: isInjured ? 'not-allowed' : 'pointer',
                  opacity: isInjured ? 0.5 : 1, transition:'all var(--transition-fast)',
                }}>
                  <div className="avatar" style={{ background: p.photoUrl ? `url(${p.photoUrl}) center/cover` : p.avatarColor, color: 'white' }}>
                    {!p.photoUrl && p.avatar}
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:600, fontSize:'0.88rem', display:'flex', alignItems:'center', gap:6, textTransform:'uppercase' }}>
                      {p.name} {isInjured && <span className="badge badge-danger" style={{ fontSize:'0.65rem' }}>BLESSÉ</span>}
                    </div>
                    <div style={{ fontSize:'0.75rem', color:'var(--text-muted)', display:'flex', gap:8 }}>
                      <span>{p.position || 'N/A'}</span>
                      <span>PRÉSENCE : {attendance}%</span>
                    </div>
                  </div>
                  {cStatus && <span className={`badge ${cStatus==='accepté'?'badge-success':'badge-danger'}`} style={{ fontSize:'0.7rem' }}>{cStatus==='accepté'?'ACC':'DEC'}</span>}
                  <div style={{ width:24, height:24, borderRadius:6, border:`1px solid ${isSelected?'var(--text-primary)':'var(--border-color)'}`, background:isSelected?'var(--text-primary)':'transparent', display:'flex', alignItems:'center', justifyContent:'center', transition:'all var(--transition-fast)' }}>
                    {isSelected && <span className="material-icons-round" style={{ fontSize:16, color:'var(--bg-primary)' }}>check</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
