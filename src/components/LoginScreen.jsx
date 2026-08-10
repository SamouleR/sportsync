import { useState } from 'react';
import { useAuth, useToast } from '../App.jsx';
import { login } from '../data/store.js';

const SLIDES = [
  { id: 'player', label: 'Joueur', defaultEmail: 'lucas@sportsync.fr', defaultPass: 'joueur123' },
  { id: 'coach', label: 'Entraîneur', defaultEmail: 'coach@sportsync.fr', defaultPass: 'coach123' },
  { id: 'admin', label: 'Administrateur', defaultEmail: 'admin@sportsync.fr', defaultPass: 'admin123' }
];

export default function LoginScreen({ onBack }) {
  const { loginUser } = useAuth();
  const { showToast } = useToast();
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [email, setEmail] = useState(SLIDES[0].defaultEmail);
  const [password, setPassword] = useState(SLIDES[0].defaultPass);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [show2FA, setShow2FA] = useState(false);
  const [code2FA, setCode2FA] = useState('');
  const [pendingUser, setPendingUser] = useState(null);

  const currentSlide = SLIDES[currentIndex];

  const handleNext = () => {
    const nextIdx = (currentIndex + 1) % SLIDES.length;
    setCurrentIndex(nextIdx);
    setEmail(SLIDES[nextIdx].defaultEmail);
    setPassword(SLIDES[nextIdx].defaultPass);
    setError('');
  };

  const handlePrev = () => {
    const prevIdx = (currentIndex - 1 + SLIDES.length) % SLIDES.length;
    setCurrentIndex(prevIdx);
    setEmail(SLIDES[prevIdx].defaultEmail);
    setPassword(SLIDES[prevIdx].defaultPass);
    setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    const user = login(email, password);
    if (user) { 
      setPendingUser(user);
      setShow2FA(true);
      showToast(`Un email contenant votre code 2FA a été envoyé à ${user.email}`);
    } else {
      setError('Identifiants incorrects');
    }
    setLoading(false);
  };

  const handleVerify2FA = (e) => {
    e.preventDefault();
    if (code2FA.length === 6) {
      loginUser(pendingUser); 
      showToast(`Authentification réussie ! Bienvenue, ${pendingUser.name}`);
    } else {
      setError('Le code 2FA doit contenir 6 chiffres (ex: 123456).');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)' }}>
      {onBack && (
        <button onClick={onBack} style={{ position: 'absolute', top: 24, left: 24, background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-secondary)', fontFamily: "'Montserrat'" }}>
          <span className="material-icons-round">arrow_back</span> Retour au Live
        </button>
      )}

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', width: '100%', maxWidth: 1000, margin: '0 auto', padding: 24 }}>
        
        {/* Navigation Buttons */}
        <button onClick={handlePrev} style={{ position: 'absolute', left: 24, background: 'transparent', border: 'none', color: 'var(--primary)', fontFamily: "'Montserrat'", fontSize: '1rem', cursor: 'pointer' }}>
          [ précédent ]
        </button>
        
        <button onClick={handleNext} style={{ position: 'absolute', right: 24, background: 'transparent', border: 'none', color: 'var(--primary)', fontFamily: "'Montserrat'", fontSize: '1rem', cursor: 'pointer' }}>
          [ suivant ]
        </button>

        {/* Login Form Container */}
        <div style={{ width: '100%', maxWidth: 400, textAlign: 'center', animation: 'fadeIn 0.3s ease' }} key={currentSlide.id}>
          <h1 style={{ fontFamily: "'Montserrat'", color: 'var(--primary)', fontSize: '2.5rem', marginBottom: 48, fontWeight: 400 }}>
            {currentSlide.label}
          </h1>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
            
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16, width: '100%' }}>
              <span className="material-icons-round" style={{ color: 'var(--primary)', fontSize: 18, marginRight: 8, width: 24, textAlign: 'center' }}>person</span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)', width: 120, textAlign: 'left', fontFamily: "'Montserrat'" }}>Nom d'utilisateur :</span>
              <input 
                type="text" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{ flex: 1, padding: '8px 12px', border: '1px solid var(--border-color)', borderRadius: 20, outline: 'none', fontFamily: "'Montserrat'", background: 'var(--bg-input)', color: 'var(--text-primary)' }} 
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24, width: '100%' }}>
              <span className="material-icons-round" style={{ color: 'var(--accent)', fontSize: 18, marginRight: 8, width: 24, textAlign: 'center' }}>vpn_key</span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)', width: 120, textAlign: 'left', fontFamily: "'Montserrat'" }}>Mot de passe :</span>
              <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={{ flex: 1, padding: '8px 12px', border: '1px solid var(--border-color)', borderRadius: 20, outline: 'none', fontFamily: "'Montserrat'", background: 'var(--bg-input)', color: 'var(--text-primary)' }} 
              />
            </div>

            {error && <div style={{ color: 'var(--accent-red)', fontSize: '0.8rem', marginBottom: 16 }}>{error}</div>}

            <button type="submit" disabled={loading} style={{ background: 'var(--text-primary)', color: 'var(--bg-primary)', padding: '10px 32px', borderRadius: 24, border: 'none', fontFamily: "'Montserrat'", fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', marginBottom: 32 }}>
              {loading ? '...' : 'Connexion'}
            </button>
          </form>
        </div>
      </div>

      {show2FA && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 24 }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: 400, padding: 32, display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ textAlign: 'center' }}>
              <span className="material-icons-round" style={{ fontSize: 48, color: 'var(--primary)', marginBottom: 16 }}>lock_clock</span>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, fontFamily: "'Montserrat'", marginBottom: 8 }}>Vérification 2FA requise</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Pour des raisons de sécurité, veuillez entrer le code à 6 chiffres envoyé à votre adresse email.
              </p>
            </div>
            
            <form onSubmit={handleVerify2FA} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label className="input-label" style={{ textAlign: 'center' }}>Code de sécurité (ex: 123456)</label>
                <input 
                  type="text" 
                  maxLength={6} 
                  required 
                  value={code2FA}
                  onChange={e => setCode2FA(e.target.value.replace(/\D/g, ''))}
                  style={{ width: '100%', padding: '16px', borderRadius: 'var(--radius-md)', border: '2px solid var(--border-color)', background: 'var(--bg-elevated)', color: 'var(--text-primary)', fontSize: '1.5rem', fontWeight: 800, textAlign: 'center', letterSpacing: 8 }}
                />
              </div>
              <button type="submit" className="btn btn-primary" style={{ height: 50, fontSize: '1rem' }} disabled={code2FA.length !== 6}>
                Vérifier et se connecter
              </button>
              <button type="button" className="btn btn-ghost" onClick={() => { setShow2FA(false); setPendingUser(null); }}>
                Annuler
              </button>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
