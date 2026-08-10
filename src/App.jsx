import { useState, useEffect, createContext, useContext } from 'react';
import LoginScreen from './components/LoginScreen.jsx';
import AppShell from './components/AppShell.jsx';
import PublicParentView from './components/PublicParentView.jsx';
import LandingPage from './components/LandingPage.jsx';
import PublicClubPage from './components/PublicClubPage.jsx';
import PublicFeaturesPage from './components/PublicFeaturesPage.jsx';
import PublicContactPage from './components/PublicContactPage.jsx';

// Auth context
export const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

// Toast context
export const ToastContext = createContext(null);
export const useToast = () => useContext(ToastContext);

function App() {
  const [user, setUser] = useState(null);
  const [toastMsg, setToastMsg] = useState(null);
  const [toastVisible, setToastVisible] = useState(false);
  const [unauthView, setUnauthView] = useState('landing'); // 'landing', 'login', 'live'

  // Persist session
  useEffect(() => {
    const saved = sessionStorage.getItem('sportsync_session');
    if (saved) {
      setUser(JSON.parse(saved));
    }
  }, []);

  const loginUser = (userData) => {
    setUser(userData);
    sessionStorage.setItem('sportsync_session', JSON.stringify(userData));
  };

  const logoutUser = () => {
    setUser(null);
    setUnauthView('landing');
    sessionStorage.removeItem('sportsync_session');
  };

  const showToast = (message, icon = 'check_circle') => {
    setToastMsg({ message, icon });
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3000);
  };

  const renderUnauthView = () => {
    switch (unauthView) {
      case 'login':
        return <LoginScreen onBack={() => setUnauthView('landing')} />;
      case 'parents':
        return <PublicParentView onNavigate={setUnauthView} currentView={unauthView} onLoginClick={() => setUnauthView('login')} />;
      case 'club':
        return <PublicClubPage onNavigate={setUnauthView} currentView={unauthView} onLoginClick={() => setUnauthView('login')} />;
      case 'features':
        return <PublicFeaturesPage onNavigate={setUnauthView} currentView={unauthView} onLoginClick={() => setUnauthView('login')} />;
      case 'contact':
        return <PublicContactPage onNavigate={setUnauthView} currentView={unauthView} onLoginClick={() => setUnauthView('login')} />;
      case 'landing':
      default:
        return <LandingPage onNavigate={setUnauthView} currentView={unauthView} onLoginClick={() => setUnauthView('login')} />;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loginUser, logoutUser }}>
      <ToastContext.Provider value={{ showToast }}>
        <div className="bg-mesh" aria-hidden="true" />
        
        {user ? <AppShell /> : renderUnauthView()}

        {/* Global Toast */}
        {toastMsg && (
          <div className={`toast ${toastVisible ? 'show' : ''}`}>
            <span className="material-icons-round" style={{ fontSize: 20, color: 'var(--accent-green)' }}>
              {toastMsg.icon}
            </span>
            {toastMsg.message}
          </div>
        )}
      </ToastContext.Provider>
    </AuthContext.Provider>
  );
}

export default App;
