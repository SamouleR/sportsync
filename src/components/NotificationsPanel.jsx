import { useState, useEffect } from 'react';
import { useAuth } from '../App.jsx';
import { useNotifications } from '../hooks/useNotifications.js';

export default function NotificationsPanel({ onClose }) {
  const { user } = useAuth();
  const { notifications: notifs, markRead: handleRead, markAllRead: handleReadAll } = useNotifications(user.id);

  const typeIcon = { training:'event', match:'emoji_events', medical:'local_hospital', message:'chat', system:'info' };
  const typeColor = { training:'var(--primary-light)', match:'var(--accent)', medical:'var(--accent-red)', message:'var(--accent-green)', system:'var(--text-secondary)' };

  const timeAgo = (ts) => {
    const diff = Date.now() - new Date(ts).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "À l'instant";
    if (mins < 60) return `Il y a ${mins}min`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `Il y a ${hrs}h`;
    return `Il y a ${Math.floor(hrs/24)}j`;
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth:440, padding:0 }}>
        <div style={{ padding:'20px 24px', borderBottom:'1px solid var(--border-color)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <h2 style={{ fontSize:'1.1rem', display:'flex', alignItems:'center', gap:8 }}>
            <span className="material-icons-round" style={{ fontSize:22, color:'var(--primary-light)' }}>notifications</span>
            Notifications
          </h2>
          <div style={{ display:'flex', gap:8 }}>
            {notifs.some(n => !n.read) && (
              <button className="btn btn-ghost btn-sm" onClick={handleReadAll} style={{ fontSize:'0.75rem' }}>
                Tout marquer lu
              </button>
            )}
            <button className="btn btn-icon btn-ghost" onClick={onClose}>
              <span className="material-icons-round" style={{ fontSize:20 }}>close</span>
            </button>
          </div>
        </div>
        <div style={{ maxHeight:400, overflowY:'auto' }}>
          {notifs.length === 0 ? (
            <div style={{ padding:48, textAlign:'center', color:'var(--text-muted)' }}>
              <span className="material-icons-round" style={{ fontSize:40, marginBottom:8 }}>notifications_none</span>
              <p>Aucune notification.</p>
            </div>
          ) : notifs.map(n => (
            <div key={n.id} onClick={() => handleRead(n.id)} style={{
              padding:'14px 24px', display:'flex', gap:12, alignItems:'flex-start',
              background: n.read ? 'transparent' : 'rgba(108,92,231,0.05)',
              borderBottom:'1px solid var(--border-color)', cursor:'pointer',
              transition:'background var(--transition-fast)',
            }}>
              <div style={{ width:36, height:36, borderRadius:'var(--radius-md)', background:`${typeColor[n.type]||'#666'}15`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <span className="material-icons-round" style={{ fontSize:18, color:typeColor[n.type]||'#666' }}>{typeIcon[n.type]||'info'}</span>
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontWeight:n.read?500:700, fontSize:'0.88rem', marginBottom:2 }}>{n.title}</div>
                <div style={{ fontSize:'0.8rem', color:'var(--text-secondary)', marginBottom:4 }}>{n.message}</div>
                <div style={{ fontSize:'0.7rem', color:'var(--text-muted)' }}>{timeAgo(n.createdAt)}</div>
              </div>
              {!n.read && <div className="pulse-dot green" style={{ marginTop:8 }} />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
