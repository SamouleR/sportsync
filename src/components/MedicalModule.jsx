import { useState, useEffect } from 'react';
import { useAuth, useToast } from '../App.jsx';
import { useMedical } from '../hooks/useMedical.js';
import { useUsers } from '../hooks/useUsers.js';

const ZONES = ['Tête','Épaule','Bras','Coude','Poignet','Main','Dos','Hanche','Cuisse','Genou','Tibia','Cheville','Pied','Autre'];
const TYPES = ['blessure','gêne','maladie','indisponibilité'];
const SEVERITIES = ['légère','modérée','grave'];

export default function MedicalModule() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const isCoach = user.role === 'coach' || user.role === 'admin';
  
  const medicalParams = isCoach ? { team: user.team } : { playerId: user.id };
  const { reports, create: createReport, markHealed, refresh } = useMedical(medicalParams);
  const { getPlayers } = useUsers();
  
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState('actif');
  const [form, setForm] = useState({ playerId: user.id, type:'gêne', zone:'', severity:'légère', description:'', startDate:'', estimatedReturn:'', status:'actif' });

  const players = isCoach ? getPlayers(user.team) : [];
  const filtered = reports.filter(r => filter === 'tous' || r.status === filter);
  const up = (k,v) => setForm(p => ({...p,[k]:v}));

  const submit = async (e) => {
    e.preventDefault();
    await createReport({ ...form, playerId: isCoach ? form.playerId : user.id });
    showToast('Signalement médical enregistré', 'medical_services');
    setShowForm(false);
    setForm({ playerId: user.id, type:'gêne', zone:'', severity:'légère', description:'', startDate:'', estimatedReturn:'', status:'actif' });
  };

  const resolve = async (id) => {
    await markHealed(id);
    showToast('Marqué comme guéri', 'check_circle');
  };

  const sevColor = { 'légère':'var(--accent-orange)', 'modérée':'#FF6D00', 'grave':'var(--accent-red)' };
  const typeIcon = { blessure:'personal_injury', gêne:'warning', maladie:'sick', indisponibilité:'event_busy' };

  return (
    <div className="page-enter" style={{ maxWidth: 700 }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:24, flexWrap:'wrap', gap:12 }}>
        <div>
          <h1 style={{ fontSize:'1.6rem', marginBottom:4 }}>
            <span className="material-icons-round" style={{ fontSize:28, verticalAlign:'middle', marginRight:8, color:'var(--accent-red)' }}>local_hospital</span>
            {isCoach ? 'Suivi médical' : 'Mon état physique'}
          </h1>
          <p style={{ color:'var(--text-secondary)', fontSize:'0.9rem' }}>
            {isCoach ? `${reports.filter(r=>r.status==='actif').length} signalement(s) actif(s)` : 'Signalez une blessure ou une gêne'}
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          <span className="material-icons-round" style={{ fontSize:18 }}>{showForm ? 'close' : 'add'}</span>
          {showForm ? 'Fermer' : 'Signaler'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={submit} className="glass-card" style={{ padding:24, marginBottom:24 }}>
          <h3 style={{ fontSize:'1rem', marginBottom:16 }}>Nouveau signalement</h3>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:16 }}>
            {isCoach && <div>
              <label className="input-label">Joueur</label>
              <select className="select-field" value={form.playerId} onChange={e => up('playerId',e.target.value)}>
                {players.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>}
            <div>
              <label className="input-label">Type</label>
              <select className="select-field" value={form.type} onChange={e => up('type',e.target.value)}>
                {TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase()+t.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <label className="input-label">Zone du corps</label>
              <select className="select-field" value={form.zone} onChange={e => up('zone',e.target.value)} required>
                <option value="">Sélectionner...</option>
                {ZONES.map(z => <option key={z} value={z}>{z}</option>)}
              </select>
            </div>
            <div>
              <label className="input-label">Sévérité</label>
              <select className="select-field" value={form.severity} onChange={e => up('severity',e.target.value)}>
                {SEVERITIES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <label className="input-label">Depuis le</label>
              <input type="date" className="input-field" value={form.startDate} onChange={e => up('startDate',e.target.value)} required />
            </div>
            <div>
              <label className="input-label">Retour estimé</label>
              <input type="date" className="input-field" value={form.estimatedReturn} onChange={e => up('estimatedReturn',e.target.value)} />
            </div>
          </div>
          <div style={{ marginBottom:16 }}>
            <label className="input-label">Description</label>
            <textarea className="textarea-field" placeholder="Décrivez la blessure ou la gêne..." value={form.description} onChange={e => up('description',e.target.value)} required />
          </div>
          <button type="submit" className="btn btn-primary">
            <span className="material-icons-round" style={{ fontSize:18 }}>check</span> Enregistrer
          </button>
        </form>
      )}

      {/* Filter */}
      <div className="role-switcher" style={{ marginBottom:20, maxWidth:300 }}>
        {['actif','guéri','tous'].map(f => (
          <button key={f} className={`role-option ${filter===f?'active':''}`} onClick={() => setFilter(f)} style={{ fontSize:'0.8rem', padding:'8px 12px' }}>
            {f.charAt(0).toUpperCase()+f.slice(1)}
          </button>
        ))}
      </div>

      {/* Reports list */}
      <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
        {filtered.length === 0 && (
          <div className="glass-card" style={{ padding:40, textAlign:'center' }}>
            <span className="material-icons-round" style={{ fontSize:48, color:'var(--text-muted)' }}>health_and_safety</span>
            <p style={{ color:'var(--text-secondary)', marginTop:12 }}>Aucun signalement {filter !== 'tous' ? filter : ''}.</p>
          </div>
        )}
        {filtered.map((r, i) => {
          const p = r.player || null;
          return (
            <div key={r.id} className="glass-card card-enter" style={{ padding:'18px 22px', animationDelay:`${i*50}ms` }}>
              <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:12 }}>
                <div style={{ width:42, height:42, borderRadius:'var(--radius-md)', background:`linear-gradient(135deg, ${sevColor[r.severity]||'#666'}33, ${sevColor[r.severity]||'#666'}11)`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <span className="material-icons-round" style={{ fontSize:22, color:sevColor[r.severity]||'#666' }}>{typeIcon[r.type]||'warning'}</span>
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' }}>
                    <span style={{ fontWeight:700, fontSize:'0.95rem' }}>{r.zone}</span>
                    <span className={`badge ${r.status==='actif'?'badge-danger':'badge-success'}`}>{r.status==='actif'?'🔴 Actif':'✅ Guéri'}</span>
                    <span className="badge badge-warning" style={{ background:`${sevColor[r.severity]}22`, color:sevColor[r.severity] }}>{r.severity}</span>
                  </div>
                  {isCoach && p && <div style={{ fontSize:'0.8rem', color:'var(--text-muted)', marginTop:2 }}>👤 {p.name}</div>}
                </div>
              </div>
              <p style={{ fontSize:'0.88rem', color:'var(--text-secondary)', lineHeight:1.5, marginBottom:8 }}>{r.description}</p>
              <div style={{ display:'flex', gap:16, fontSize:'0.78rem', color:'var(--text-muted)', flexWrap:'wrap' }}>
                <span> Depuis : {new Date(r.startDate).toLocaleDateString('fr-FR')}</span>
                {r.estimatedReturn && <span>🔄 Retour estimé : {new Date(r.estimatedReturn).toLocaleDateString('fr-FR')}</span>}
              </div>
              {isCoach && r.status === 'actif' && (
                <button className="btn btn-success btn-sm" style={{ marginTop:12 }} onClick={() => resolve(r.id)}>
                  <span className="material-icons-round" style={{ fontSize:16 }}>check</span> Marquer guéri
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
