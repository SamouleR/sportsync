import { useState } from 'react';
import { useAuth, useToast } from '../App.jsx';
import { getPlayers, getUserById } from '../data/store.js';

export default function ParentDashboard() {
  const { user } = useAuth();
  const { showToast } = useToast();
  
  // A parent has multiple children (user.children = ['player-1', 'player-2'])
  const childrenIds = user.children || [];
  const [activeChild, setActiveChild] = useState(childrenIds[0] || null);
  const [tab, setTab] = useState('covoiturage');

  const childrenData = childrenIds.map(id => getUserById(id)).filter(Boolean);
  const selectedChild = childrenData.find(c => c.id === activeChild);

  const [carpoolForm, setCarpoolForm] = useState({ seats: 0, needRide: false, remark: '' });
  const [medicalForm, setMedicalForm] = useState({ allergies: '', docSigned: false });

  const handleCarpoolSave = () => {
    showToast('Disponibilité de covoiturage enregistrée !');
  };

  const handleMedicalSave = () => {
    showToast('Fiche médicale mise à jour !');
  };

  const handleVolunteerClick = (role) => {
    showToast(`Merci ! Vous êtes inscrit comme : ${role}`);
  };

  if (childrenData.length === 0) {
    return <div className="page-enter" style={{ padding:40, textAlign:'center' }}>Aucun enfant lié à ce compte.</div>;
  }

  return (
    <div className="page-enter">
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: '1.8rem', marginBottom: 8, textTransform:'uppercase' }}>
          ESPACE PARENTS
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Gérez la logistique, le transport et les informations médicales de vos enfants.
        </p>
      </div>

      {/* Child Switcher */}
      <div style={{ display:'flex', gap:12, marginBottom:24, flexWrap:'wrap' }}>
        {childrenData.map(child => (
          <button 
            key={child.id} 
            onClick={() => setActiveChild(child.id)}
            className={`btn ${activeChild === child.id ? 'btn-primary' : 'btn-ghost'}`}
            style={{ borderRadius:'var(--radius-full)' }}
          >
            <div className="avatar avatar-sm" style={{ marginRight:8, width:24, height:24, fontSize:'0.6rem' }}>{child.avatar}</div>
            {child.name}
          </button>
        ))}
      </div>

      <div className="glass-card" style={{ padding:24, marginBottom:24 }}>
        <h2 style={{ fontSize:'1.2rem', marginBottom:16, display:'flex', alignItems:'center', gap:8, textTransform:'uppercase' }}>
          <span className="material-icons-round">person</span>
          PROFIL : {selectedChild?.name}
        </h2>

        {/* Tabs */}
        <div className="role-switcher" style={{ marginBottom:24, maxWidth:600 }}>
          <button className={`role-option ${tab==='covoiturage'?'active':''}`} onClick={() => setTab('covoiturage')}>COVOITURAGE</button>
          <button className={`role-option ${tab==='medical'?'active':''}`} onClick={() => setTab('medical')}>MÉDICAL</button>
          <button className={`role-option ${tab==='benevolat'?'active':''}`} onClick={() => setTab('benevolat')}>BÉNÉVOLAT</button>
          <button className={`role-option ${tab==='finances'?'active':''}`} onClick={() => setTab('finances')}>FINANCES</button>
        </div>

        {/* Tab Content */}
        {tab === 'covoiturage' && (
          <div className="card-enter">
            <h3 style={{ fontSize:'0.9rem', marginBottom:12, color:'var(--text-secondary)' }}>Logistique des matchs à l'extérieur</h3>
            
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:16 }}>
              <div className="glass-card" style={{ padding:16, cursor:'pointer', border: carpoolForm.needRide ? '2px solid var(--text-primary)' : '1px solid var(--border-color)' }} onClick={() => setCarpoolForm({...carpoolForm, needRide:true, seats:0})}>
                <span className="material-icons-round" style={{ fontSize:24, marginBottom:8 }}>directions_car</span>
                <div style={{ fontWeight:600 }}>Besoin d'un trajet</div>
                <div style={{ fontSize:'0.75rem', color:'var(--text-muted)' }}>Mon enfant a besoin d'être emmené.</div>
              </div>
              
              <div className="glass-card" style={{ padding:16, cursor:'pointer', border: !carpoolForm.needRide && carpoolForm.seats > 0 ? '2px solid var(--text-primary)' : '1px solid var(--border-color)' }} onClick={() => setCarpoolForm({...carpoolForm, needRide:false, seats:3})}>
                <span className="material-icons-round" style={{ fontSize:24, marginBottom:8 }}>airport_shuttle</span>
                <div style={{ fontWeight:600 }}>Je prends ma voiture</div>
                <div style={{ fontSize:'0.75rem', color:'var(--text-muted)' }}>J'ai des places disponibles.</div>
              </div>
            </div>

            {!carpoolForm.needRide && (
              <div style={{ marginBottom:16 }}>
                <label className="input-label">Nombre de places disponibles (hors votre enfant)</label>
                <input type="number" min="0" max="6" className="input-field" value={carpoolForm.seats} onChange={e => setCarpoolForm({...carpoolForm, seats: parseInt(e.target.value)||0})} style={{ maxWidth:200 }} />
              </div>
            )}

            <button className="btn btn-primary" onClick={handleCarpoolSave}>VALIDER LE CHOIX</button>
          </div>
        )}

        {tab === 'medical' && (
          <div className="card-enter">
             <h3 style={{ fontSize:'0.9rem', marginBottom:12, color:'var(--text-secondary)' }}>Fiche médicale et autorisations</h3>
             
             <div style={{ marginBottom:16 }}>
                <label className="input-label">Allergies ou problèmes médicaux récents</label>
                <textarea className="textarea-field" placeholder="Ex: Asthme, entorse récente..." value={medicalForm.allergies} onChange={e => setMedicalForm({...medicalForm, allergies: e.target.value})} />
             </div>

             <div style={{ marginBottom:16, display:'flex', alignItems:'center', gap:12 }}>
                <input type="checkbox" id="doc" checked={medicalForm.docSigned} onChange={e => setMedicalForm({...medicalForm, docSigned: e.target.checked})} style={{ width:18, height:18 }} />
                <label htmlFor="doc" style={{ fontSize:'0.85rem' }}>J'autorise les déplacements et les interventions médicales d'urgence.</label>
             </div>

             <button className="btn btn-primary" onClick={handleMedicalSave}>ENREGISTRER LA FICHE</button>
          </div>
        )}

        {tab === 'benevolat' && (
          <div className="card-enter">
            <h3 style={{ fontSize:'0.9rem', marginBottom:12, color:'var(--text-secondary)' }}>Participez à la vie du club</h3>
            <p style={{ fontSize:'0.85rem', color:'var(--text-muted)', marginBottom:20 }}>Le club fonctionne grâce aux bénévoles. Inscrivez-vous pour aider lors du prochain match.</p>

            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:16, background:'var(--bg-elevated)', borderRadius:'var(--radius-sm)', border:'1px solid var(--border-color)' }}>
                <div>
                  <div style={{ fontWeight:600 }}>Laver les maillots</div>
                  <div style={{ fontSize:'0.75rem', color:'var(--text-muted)' }}>Prendre le sac après le match et le ramener propre.</div>
                </div>
                <button className="btn btn-ghost btn-sm" onClick={() => handleVolunteerClick('Lavage Maillots')}>JE M'INSCRIS</button>
              </div>

              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:16, background:'var(--bg-elevated)', borderRadius:'var(--radius-sm)', border:'1px solid var(--border-color)' }}>
                <div>
                  <div style={{ fontWeight:600 }}>Collation (Boissons/Oranges)</div>
                  <div style={{ fontSize:'0.75rem', color:'var(--text-muted)' }}>Apporter la collation pour la mi-temps.</div>
                </div>
                <button className="btn btn-ghost btn-sm" onClick={() => handleVolunteerClick('Collation')}>JE M'INSCRIS</button>
              </div>

              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:16, background:'var(--bg-elevated)', borderRadius:'var(--radius-sm)', border:'1px solid var(--border-color)' }}>
                <div>
                  <div style={{ fontWeight:600 }}>Table de marque / Arbitrage de touche</div>
                  <div style={{ fontSize:'0.75rem', color:'var(--text-muted)' }}>Assister les officiels pendant le match.</div>
                </div>
                <button className="btn btn-ghost btn-sm" onClick={() => handleVolunteerClick('Délégué')}>JE M'INSCRIS</button>
              </div>
            </div>
          </div>
        )}

        {tab === 'finances' && (
          <div className="card-enter">
            <h3 style={{ fontSize:'0.9rem', marginBottom:12, color:'var(--text-secondary)' }}>Espace Financier et Cotisations</h3>
            
            <div className="glass-card" style={{ padding:24, marginBottom:24, background:'var(--bg-elevated)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <div>
                <div style={{ fontSize:'0.85rem', color:'var(--text-secondary)', textTransform:'uppercase' }}>Solde du compte</div>
                <div style={{ fontSize:'2rem', fontWeight:800, fontFamily:"'Montserrat'", color: user.finances?.balance < 0 ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                  {user.finances?.balance || 0} €
                </div>
              </div>
              <button className="btn btn-primary" onClick={() => showToast('Redirection vers la plateforme de paiement...')} disabled={user.finances?.balance >= 0}>
                RÉGLER LE SOLDE
              </button>
            </div>

            <h4 style={{ fontSize:'0.8rem', textTransform:'uppercase', color:'var(--text-muted)', marginBottom:12 }}>Dernières Transactions</h4>
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {user.finances?.transactions?.map(tx => (
                <div key={tx.id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 16px', borderBottom:'1px solid var(--border-color)' }}>
                  <div>
                    <div style={{ fontWeight:600 }}>{tx.desc}</div>
                    <div style={{ fontSize:'0.75rem', color:'var(--text-muted)' }}>{tx.date}</div>
                  </div>
                  <div style={{ fontWeight:700, color: tx.amount < 0 ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                    {tx.amount} €
                  </div>
                </div>
              ))}
              {(!user.finances || !user.finances.transactions || user.finances.transactions.length === 0) && (
                <div style={{ fontSize:'0.85rem', color:'var(--text-muted)' }}>Aucune transaction récente.</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
