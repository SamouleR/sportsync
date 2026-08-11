import { useState, useEffect, useRef } from 'react';
import { useAuth, useToast } from '../App.jsx';
import { useTrainings } from '../hooks/useTrainings.js';
import { useUsers } from '../hooks/useUsers.js';
import { useSocket } from '../hooks/useSocket.js';

export default function TrainingDetail({ trainingId, onBack }) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const { trainings, getById, getStats, remove, sendMessage: sendMsg, loading: trainingsLoading, refresh } = useTrainings(user.team);
  const { users, getPlayers, loading: usersLoading } = useUsers();
  const { subscribe } = useSocket();
  
  const [training, setTraining] = useState(null);
  const [responses, setResponses] = useState([]);
  const [players, setPlayers] = useState([]);
  const [stats, setStats] = useState(null);
  const [tab, setTab] = useState('attendance');
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState('');
  const [showCalMenu, setShowCalMenu] = useState(false);
  const chatRef = useRef(null);
  const isStaff = user.role === 'coach' || user.role === 'admin';

  useEffect(() => {
    if (!trainingsLoading && !usersLoading) {
      const t = getById(trainingId);
      if (!t) return;
      setTraining(t);
      setResponses(t.responses || []);
      const teamPlayers = getPlayers(t.team);
      setPlayers(teamPlayers);
      setStats(getStats(trainingId, teamPlayers));
      setMessages(t.messages || []);
    }
  }, [trainingId, trainingsLoading, usersLoading, trainings]);
  
  useEffect(() => {
    const unsub1 = subscribe('trainingMessage', refresh);
    const unsub2 = subscribe('trainingResponseUpdated', refresh);
    return () => { unsub1?.(); unsub2?.(); };
  }, [subscribe, refresh]);
  
  useEffect(() => { if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight; }, [messages]);

  if (!training) return <div className="page-enter"><p>Chargement...</p></div>;

  const fmt = d => new Date(d).toLocaleDateString('fr-FR', { weekday:'long', day:'numeric', month:'long', year:'numeric' });
  const handleDelete = async () => { if (confirm('Supprimer ?')) { await remove(trainingId); showToast('Supprimé','delete'); onBack(); } };
  const handleSend = async (e) => { e.preventDefault(); if (!newMsg.trim()) return; await sendMsg(trainingId, user.id, newMsg.trim()); setNewMsg(''); };
  const getP = pid => {
    const found = users.find(u => u.id === pid);
    return found || { name:'Inconnu', avatar:'?', avatarColor:'#666' };
  };

  // Generate ICS content for calendar export
  const downloadICS = (t) => {
    const ics = `BEGIN:VCALENDAR\nBEGIN:VEVENT\nDTSTART:${t.date.replace(/-/g, '')}T${t.startTime.replace(':', '')}00\nDTEND:${t.date.replace(/-/g, '')}T${t.endTime.replace(':', '')}00\nSUMMARY:${t.title}\nLOCATION:${t.location}\nEND:VEVENT\nEND:VCALENDAR`;
    const blob = new Blob([ics], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `${t.title}.ics`; a.click();
  };

  const getGoogleCalendarUrl = (t) => {
    const start = `${t.date.replace(/-/g, '')}T${t.startTime.replace(':', '')}00`;
    const end = `${t.date.replace(/-/g, '')}T${t.endTime.replace(':', '')}00`;
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(t.title)}&dates=${start}/${end}&location=${encodeURIComponent(t.location)}`;
  };

  const respondedIds = responses.map(r => r.playerId);
  const pending = players.filter(p => !respondedIds.includes(p.id));

  return (
    <div className="page-enter max-w-3xl mx-auto">
      <div className="flex gap-2 mb-4">
        <button onClick={onBack} className="btn btn-ghost btn-sm flex items-center gap-1 text-[#404040]">
          <span className="material-icons-round text-[18px]">arrow_back</span> Retour
        </button>
      </div>

      {/* Header */}
      <div className="bg-white/60 backdrop-blur-md rounded-2xl border border-[#E5E5E5] p-6 sm:p-8 mb-6 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#000000] mb-3">{training.title}</h1>
            <div className="flex flex-wrap gap-4 text-[#404040] text-[0.9rem]">
              <span className="flex items-center gap-1.5"><span className="material-icons-round text-[18px] text-[#000000]">calendar_today</span>{fmt(training.date)}</span>
              <span className="flex items-center gap-1.5"><span className="material-icons-round text-[18px] text-[#000000]">schedule</span>{training.startTime} - {training.endTime}</span>
              <span className="flex items-center gap-1.5"><span className="material-icons-round text-[18px] text-[#000000]">location_on</span>{training.location}</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {/* Calendar sync */}
            <div className="relative">
              <button className="btn btn-ghost btn-sm flex items-center gap-1.5 text-[#000000]" onClick={() => setShowCalMenu(!showCalMenu)}>
                <span className="material-icons-round text-[18px]">calendar_month</span> Calendrier
              </button>
              {showCalMenu && (
                <div className="absolute top-full right-0 mt-1 bg-white border border-[#E5E5E5] rounded-xl p-2 z-10 min-w-[200px] shadow-lg">
                  <button onClick={() => { window.open(getGoogleCalendarUrl(training), '_blank'); setShowCalMenu(false); }} className="flex items-center gap-2 w-full px-3 py-2 border-none bg-transparent text-[#000000] text-[0.85rem] cursor-pointer rounded-lg font-['Montserrat'] uppercase hover:bg-gray-50 transition-colors">
                    <span className="material-icons-round text-[16px]">calendar_month</span> Google Calendar
                  </button>
                  <button onClick={() => { downloadICS(training); showToast('Fichier .ics téléchargé'); setShowCalMenu(false); }} className="flex items-center gap-2 w-full px-3 py-2 border-none bg-transparent text-[#000000] text-[0.85rem] cursor-pointer rounded-lg font-['Montserrat'] uppercase hover:bg-gray-50 transition-colors">
                    <span className="material-icons-round text-[16px]">phone_iphone</span> Télécharger .ics
                  </button>
                </div>
              )}
            </div>
            {isStaff && <button className="btn btn-ghost btn-sm flex items-center gap-1.5 text-red-500 hover:bg-red-50" onClick={handleDelete}>
              <span className="material-icons-round text-[18px]">delete</span> Supprimer
            </button>}
          </div>
        </div>
        {training.message && (
          <div className="mt-4 p-3 sm:px-4 sm:py-3 bg-[rgba(0,210,255,0.05)] border-l-4 border-[#000000] rounded-r-xl text-[0.88rem] text-[#404040] leading-relaxed flex items-start gap-2">
            <span className="material-icons-round text-[18px] text-[#000000]">info</span>
            <div>{training.message}</div>
          </div>
        )}
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            { l:'Présents', v:stats.present, c:'text-[#000000]', i:'check_circle' },
            { l:'Absents', v:stats.absent, c:'text-red-500', i:'cancel' },
            { l:'Retards', v:stats.late, c:'text-orange-400', i:'schedule' },
            { l:'En attente', v:stats.pending, c:'text-[#404040]', i:'hourglass_empty' },
          ].map(s => (
            <div key={s.l} className="bg-white rounded-2xl p-4 text-center border border-[#E5E5E5] shadow-sm">
              <span className={`material-icons-round text-2xl ${s.c}`}>{s.i}</span>
              <div className="text-xl font-extrabold font-['Montserrat'] mt-1 text-[#000000]">{s.v}</div>
              <div className="text-xs text-[#737373] font-medium">{s.l}</div>
            </div>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div className="role-switcher" style={{ marginBottom:24 }}>
        <button className={`role-option ${tab==='attendance'?'active':''}`} onClick={() => setTab('attendance')}>PRÉSENCE</button>
        <button className={`role-option ${tab==='chat'?'active':''}`} onClick={() => setTab('chat')}>DISCUSSION</button>
      </div>

      {/* Attendance */}
      {tab === 'attendance' && (
        <div className="flex flex-col gap-6">
          {responses.length > 0 && (
            <div>
              <h3 className="text-[0.95rem] mb-3 text-[#404040] font-semibold">Réponses reçues</h3>
              <div className="flex flex-col gap-2">
                {responses.map(r => { const p = getP(r.playerId); return (
                  <div key={r.id} className="bg-white/60 backdrop-blur-md rounded-xl p-3 sm:p-4 flex items-center gap-3 border border-[#E5E5E5] shadow-sm">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs font-bold shrink-0" style={{ background:p.avatarColor, color:'white' }}>{p.avatar}</div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-[0.9rem] text-[#000000] truncate">{p.name}</div>
                      {r.remark && <div className="text-[0.78rem] text-[#737373] mt-0.5 italic truncate">"{r.remark}"</div>}
                    </div>
                    <span className={`badge shrink-0 ${r.status==='present'?'badge-success':r.status==='absent'?'badge-danger':'badge-warning'}`}>
                      {r.status==='present'?'PRÉSENT':r.status==='absent'?'ABSENT':`RETARD ${r.arrivalTime}`}
                    </span>
                  </div>
                ); })}
              </div>
            </div>
          )}
          {pending.length > 0 && (
            <div>
              <h3 className="text-[0.95rem] mb-3 text-[#737373] font-semibold">En attente</h3>
              <div className="flex flex-col gap-2">
                {pending.map(p => (
                  <div key={p.id} className="bg-white p-3 sm:p-4 flex items-center gap-3 rounded-xl border border-dashed border-[#E5E5E5]">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs font-bold opacity-60 shrink-0" style={{ background:p.avatarColor, color:'white' }}>{p.avatar}</div>
                    <div className="flex-1 text-[0.9rem] text-[#737373] truncate">{p.name}</div>
                    <span className="badge badge-info shrink-0">ATTENTE</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Chat */}
      {tab === 'chat' && (
        <div className="flex flex-col h-[500px]">
          <div ref={chatRef} className="flex-1 overflow-y-auto flex flex-col gap-3 mb-4 p-2">
            {messages.length === 0 ? (
              <div className="text-center p-10 text-[#737373] flex flex-col items-center">
                <span className="material-icons-round text-4xl mb-2">chat_bubble_outline</span>
                <p>Aucun message. Démarrez la discussion !</p>
              </div>
            ) : messages.map(m => {
              const u = m.user || getP(m.userId); const mine = m.userId === user.id;
              return (
                <div key={m.id} className={`flex gap-2 items-end ${mine ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0" style={{ background:u?.avatarColor||'#666', color:'white' }}>{u?.avatar||'?'}</div>
                  <div className={`max-w-[80%] p-3 rounded-2xl ${mine ? 'bg-[#000000] text-white rounded-br-sm' : 'bg-white border border-[#E5E5E5] text-[#000000] rounded-bl-sm'}`}>
                    {!mine && <div className="text-[0.72rem] font-semibold mb-1" style={{ color:u?.avatarColor||'#737373' }}>{u?.name}</div>}
                    <div className="text-[0.88rem] leading-relaxed">{m.text}</div>
                    <div className={`text-[0.65rem] mt-1 text-right ${mine ? 'text-white/60' : 'text-[#737373]'}`}>
                      {new Date(m.timestamp).toLocaleTimeString('fr-FR', { hour:'2-digit', minute:'2-digit' })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <form onSubmit={handleSend} className="flex gap-2 shrink-0">
            <input className="input-field flex-1" placeholder="Écrire un message..." value={newMsg} onChange={e => setNewMsg(e.target.value)} />
            <button type="submit" className="btn bg-[#000000] text-white p-3 rounded-lg flex items-center justify-center hover:bg-[#404040] disabled:opacity-50" disabled={!newMsg.trim()}>
              <span className="material-icons-round text-xl">send</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
