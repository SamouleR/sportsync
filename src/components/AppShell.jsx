import { useState, useEffect } from 'react';
import { useAuth } from '../App.jsx';
import { getClubName, getUnreadCount } from '../data/store.js';
import CoachDashboard from './CoachDashboard.jsx';
import PlayerDashboard from './PlayerDashboard.jsx';
import CreateTraining from './CreateTraining.jsx';
import TrainingDetail from './TrainingDetail.jsx';
import PlayersManagement from './PlayersManagement.jsx';
import MedicalModule from './MedicalModule.jsx';
import MatchConvocation from './MatchConvocation.jsx';
import NotificationsPanel from './NotificationsPanel.jsx';
import SportConfig from './SportConfig.jsx';
import ParentDashboard from './ParentDashboard.jsx';
import PerformanceAnalytics from './PerformanceAnalytics.jsx';
import MatchLiveTracker from './MatchLiveTracker.jsx';
import AdminTeamPanel from './AdminTeamPanel.jsx';
import AdminMessagesPanel from './AdminMessagesPanel.jsx';
import AdminUsersPanel from './AdminUsersPanel.jsx';

export default function AppShell() {
  const { user, logoutUser } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [selectedId, setSelectedId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const clubName = getClubName();
  const unread = getUnreadCount(user.id);

  useEffect(() => { setSidebarOpen(false); }, [currentPage]);

  const navigateTo = (page, id = null) => { setCurrentPage(page); setSelectedId(id); };
  const isCoach = user.role === 'coach';
  const isAdmin = user.role === 'admin';
  const isStaff = isCoach || isAdmin;
  const isParent = user.role === 'parent';

  const roleLabel = isAdmin ? 'Administrateur' : isCoach ? 'Entraîneur' : isParent ? 'Parent' : 'Joueur';

  const staffItems = [
    { id:'dashboard', label:'Tableau de bord', icon:'dashboard' },
    { id:'create', label:'Créer séance', icon:'add_circle' },
    { id:'matches', label:'Matchs & Tactique', icon:'emoji_events' },
    { id:'live', label:'Match en Direct', icon:'sensors' },
    { id:'players', label:'Effectif', icon:'groups' },
    { id:'analytics', label:'Performances', icon:'query_stats' },
    { id:'medical', label:'Infirmerie', icon:'local_hospital' },
    { id:'config', label:'Configuration', icon:'settings' },
  ];

  if (isAdmin) {
    staffItems.push({ id:'public-team', label:'Site Public (Équipe)', icon:'public' });
    staffItems.push({ id:'admin-users', label:'Gestion des Membres', icon:'manage_accounts' });
    staffItems.push({ id:'admin-messages', label:'Messagerie Publique', icon:'mark_email_unread' });
  }

  const navItems = isStaff
    ? staffItems
    : isParent
      ? [
          { id:'dashboard', label:'Espace Parents', icon:'family_restroom' },
          { id:'matches', label:'Matchs des enfants', icon:'emoji_events' },
        ]
      : [
          { id:'dashboard', label:'Mes séances', icon:'event' },
          { id:'matches', label:'Matchs', icon:'emoji_events' },
          { id:'medical', label:'Mon état', icon:'health_and_safety' },
        ];

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return isStaff
          ? <CoachDashboard onViewTraining={id => navigateTo('detail', id)} onCreateTraining={() => navigateTo('create')} />
          : isParent
            ? <ParentDashboard />
            : <PlayerDashboard onViewTraining={id => navigateTo('detail', id)} />;
      case 'create': return <CreateTraining onBack={() => navigateTo('dashboard')} />;
      case 'detail': return <TrainingDetail trainingId={selectedId} onBack={() => navigateTo('dashboard')} />;
      case 'players': return <PlayersManagement />;
      case 'medical': return <MedicalModule />;
      case 'matches': return <MatchConvocation />;
      case 'config': return <SportConfig />;
      case 'live': return <MatchLiveTracker />;
      case 'analytics': return <PerformanceAnalytics team={user.team} />;
      case 'public-team': return isAdmin ? <AdminTeamPanel /> : null;
      case 'admin-users': return isAdmin ? <AdminUsersPanel /> : null;
      case 'admin-messages': return isAdmin ? <AdminMessagesPanel /> : null;
      default: return null;
    }
  };

  return (
    <div className="flex h-screen bg-[#F5F2EB] text-[#000000] overflow-hidden">
      {sidebarOpen && <div onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-black/50 z-[99] md:hidden" />}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-[100] w-64 bg-white border-r border-[#E5E5E5] flex flex-col p-4 transition-transform duration-300 md:relative md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:8, padding:'0 8px' }}>
          <div style={{ width:40, height:40, borderRadius:'var(--radius-md)', background:'linear-gradient(135deg, var(--primary), var(--accent))', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <span className="material-icons-round" style={{ fontSize:22, color:'white' }}>sports_soccer</span>
          </div>
          <div>
            <div style={{ fontFamily:"'Montserrat', sans-serif", fontWeight:700, fontSize:'1.05rem' }}>SportSync</div>
            <div style={{ fontSize:'0.7rem', color:'var(--text-muted)' }}>{clubName}</div>
          </div>
        </div>

        <div style={{ margin:'16px 8px', padding:'10px 14px', background:'rgba(108,92,231,0.1)', borderRadius:'var(--radius-md)', border:'1px solid rgba(108,92,231,0.2)', fontSize:'0.8rem', color:'var(--primary-light)', fontWeight:600, display:'flex', alignItems:'center', gap:8 }}>
          <span className="material-icons-round" style={{ fontSize:16 }}>shield</span>
          {user.team}
        </div>

        <nav style={{ flex:1, marginTop:8 }}>
          {navItems.map(item => (
            <button key={item.id} onClick={() => navigateTo(item.id)} style={{
              display:'flex', alignItems:'center', gap:12, width:'100%', padding:'12px 16px', border:'none',
              borderRadius:'var(--radius-md)', background: currentPage === item.id ? 'rgba(108,92,231,0.15)' : 'transparent',
              color: currentPage === item.id ? 'var(--primary-light)' : 'var(--text-secondary)',
              fontFamily:"'Montserrat', sans-serif", fontWeight:500, fontSize:'0.9rem', cursor:'pointer',
              transition:'all var(--transition-fast)', marginBottom:4, textAlign:'left',
            }}>
              <span className="material-icons-round" style={{ fontSize:20 }}>{item.icon}</span>
              {item.label}
            </button>
          ))}

          {/* Notifications button */}
          <button onClick={() => setShowNotifs(true)} style={{
            display:'flex', alignItems:'center', gap:12, width:'100%', padding:'12px 16px', border:'none',
            borderRadius:'var(--radius-md)', background:'transparent', color:'var(--text-secondary)',
            fontFamily:"'Montserrat', sans-serif", fontWeight:500, fontSize:'0.9rem', cursor:'pointer',
            transition:'all var(--transition-fast)', marginBottom:4, textAlign:'left', position:'relative',
          }}>
            <span className="material-icons-round" style={{ fontSize:20, position:'relative' }}>
              notifications
              {unread > 0 && <span style={{ position:'absolute', top:-4, right:-4, width:14, height:14, borderRadius:'50%', background:'var(--accent-red)', fontSize:'0.6rem', color:'white', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontFamily:"'Montserrat'" }}>{unread}</span>}
            </span>
            Notifications
          </button>
        </nav>

        {/* User section */}
        <div style={{ borderTop:'1px solid var(--border-color)', paddingTop:16, marginTop:16 }}>
          <div style={{ display:'flex', alignItems:'center', gap:12, padding:'0 8px', marginBottom:12 }}>
            <div className="avatar" style={{ background:user.avatarColor, color:'white' }}>{user.avatar}</div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:'0.85rem', fontWeight:600, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{user.name}</div>
              <div style={{ fontSize:'0.75rem', color:'var(--text-muted)' }}>
                <span className="badge" style={{
                  padding:'2px 8px', fontSize:'0.65rem',
                  background: isAdmin ? 'rgba(255,109,0,0.15)' : isCoach ? 'rgba(108,92,231,0.15)' : 'rgba(0,210,255,0.15)',
                  color: isAdmin ? '#FF6D00' : isCoach ? 'var(--primary-light)' : 'var(--accent)',
                }}>{roleLabel}</span>
              </div>
            </div>
          </div>
          <button onClick={logoutUser} className="btn btn-ghost" style={{ width:'100%', fontSize:'0.8rem', justifyContent:'flex-start', padding:'10px 16px' }}>
            <span className="material-icons-round" style={{ fontSize:18 }}>logout</span> Déconnexion
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto pb-16 md:pb-0 p-4 md:p-8">
        <div className="flex items-center justify-between mb-6 md:hidden">
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg text-[#404040] hover:bg-[#E5E5E5]">
            <span className="material-icons-round">menu</span>
          </button>
          <div className="font-['Montserrat'] font-bold text-lg">SportSync</div>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowNotifs(true)} className="relative p-2 rounded-lg text-[#404040] hover:bg-[#E5E5E5]">
              <span className="material-icons-round">notifications</span>
              {unread > 0 && <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#F5F2EB]" />}
            </button>
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shadow-sm" style={{ background:user.avatarColor, color:'white' }}>{user.avatar}</div>
          </div>
        </div>
        {renderPage()}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E5E5E5] flex items-center justify-around p-2 pb-safe md:hidden z-50">
        {navItems.slice(0, 4).map(item => (
          <button key={item.id} className={`flex flex-col items-center gap-1 p-2 rounded-lg min-w-[64px] ${currentPage === item.id ? 'text-[#000000]' : 'text-[#737373]'}`} onClick={() => navigateTo(item.id)}>
            <span className="material-icons-round text-xl">{item.icon}</span>
            <span className="text-[0.65rem] font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      {showNotifs && <NotificationsPanel onClose={() => setShowNotifs(false)} />}
    </div>
  );
}
