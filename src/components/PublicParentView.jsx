import React, { useState, useRef, useEffect } from 'react';
import PublicNavbar from './PublicNavbar.jsx';
import PublicFooter from './PublicFooter.jsx';
import { getMatchById } from '../data/store';

export default function PublicParentView({ onNavigate, currentView, onLoginClick }) {
  const [messages, setMessages] = useState([
    { id: 1, author: 'Parent de Lucas', text: 'Allez les enfants ! Super match !!', time: '15:02' },
    { id: 2, author: 'Parent de Théo', text: 'Belle défense de Théo.', time: '15:10' },
  ]);
  const [newMsg, setNewMsg] = useState('');
  const chatRef = useRef(null);

  const [liveState, setLiveState] = useState({
    time: 0,
    scoreHome: 0,
    scoreAway: 0,
    events: [],
    title: 'Match en attente',
    opponent: '',
    isHome: true
  });

  useEffect(() => {
    // Polling every second for demo real-time sync without WebSockets
    const interval = setInterval(() => {
      const match = getMatchById('m1'); // Assume we are watching match m1
      if (match && match.liveState) {
        setLiveState({
          time: match.liveState.time || 0,
          scoreHome: match.liveState.scoreHome || 0,
          scoreAway: match.liveState.scoreAway || 0,
          events: match.liveState.events || [],
          title: match.title,
          opponent: match.opponent,
          isHome: match.type === 'domicile'
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!newMsg.trim()) return;
    const msg = {
      id: Date.now(),
      author: 'Vous',
      text: newMsg.trim(),
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([...messages, msg]);
    setNewMsg('');
  };

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages, liveState.events]);

  return (
    <div className="min-h-screen flex flex-col bg-[#F9FAFB] text-[#000000]">
      <PublicNavbar onNavigate={onNavigate} currentView={currentView} onLoginClick={onLoginClick} />

      {/* Main Content */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-6 py-12 z-10 flex flex-col md:flex-row gap-8">
        
        {/* Camera Stream & Timeline */}
        <div className="flex-[2] flex flex-col gap-6">
          <h2 className="text-2xl font-extrabold font-['Montserrat'] tracking-tight">
            {liveState.title} - En direct
          </h2>
          
          <div className="w-full aspect-video bg-black rounded-3xl relative overflow-hidden flex flex-col items-center justify-center shadow-lg border border-gray-800">
            <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></div>
              LIVE
            </div>
            
            <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md border border-white/10 text-white px-4 py-2 rounded-xl flex items-center gap-6">
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold uppercase">{liveState.isHome ? 'SportSync' : liveState.opponent}</span>
                <span className="text-3xl font-extrabold">{liveState.scoreHome}</span>
              </div>
              <div className="w-px h-8 bg-white/20"></div>
              <div className="flex items-center gap-3">
                <span className="text-3xl font-extrabold">{liveState.scoreAway}</span>
                <span className="text-sm font-bold uppercase">{liveState.isHome ? liveState.opponent : 'SportSync'}</span>
              </div>
              <div className="w-px h-8 bg-white/20"></div>
              <div className="text-xl font-bold font-['Montserrat'] text-[#00D2FF] w-16 text-center">
                {formatTime(liveState.time)}
              </div>
            </div>

            <span className="material-icons-round text-6xl text-white/20">videocam_off</span>
            <div className="absolute bottom-6 text-sm text-white/50">Flux vidéo non disponible pour le moment</div>
          </div>

          {/* Match Timeline */}
          <div className="bg-white rounded-3xl border border-[#E5E5E5] overflow-hidden flex flex-col h-[300px] shadow-sm">
            <div className="px-6 py-4 border-b border-[#E5E5E5] font-bold">Fil du Match</div>
            <div className="p-6 flex-1 overflow-y-auto flex flex-col gap-4">
              {liveState.events.length === 0 ? (
                <div className="text-gray-400 text-sm text-center py-8">Le match va bientôt commencer ou aucun événement pour le moment.</div>
              ) : (
                liveState.events.map((ev, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <div className="font-bold text-[#6C5CE7] text-sm w-12">{ev.time}</div>
                    <div className="flex-1">
                      <div className="text-sm font-bold">{ev.type}</div>
                      <div className="text-sm text-gray-500">{ev.player}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Live Chat */}
        <div className="flex-1 bg-white rounded-3xl border border-[#E5E5E5] flex flex-col h-[calc(100vh-140px)] shadow-sm overflow-hidden">
          <div className="p-6 border-b border-[#E5E5E5] font-bold flex items-center gap-3">
            <span className="material-icons-round text-[#000000]">forum</span>
            Chat des Supporters
          </div>
          
          <div ref={chatRef} className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
            {messages.map(m => (
              <div key={m.id} className={`flex flex-col gap-1 ${m.author === 'Vous' ? 'items-end' : 'items-start'}`}>
                <div className="text-xs text-gray-400 font-medium">{m.author} • {m.time}</div>
                <div className={`px-4 py-2 text-sm max-w-[85%] ${
                  m.author === 'Vous' 
                    ? 'bg-black text-white rounded-[16px_16px_4px_16px]' 
                    : 'bg-gray-100 text-black rounded-[16px_16px_16px_4px]'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-[#E5E5E5] bg-gray-50">
            <form onSubmit={handleSend} className="flex gap-2">
              <input 
                type="text" 
                value={newMsg} 
                onChange={e => setNewMsg(e.target.value)} 
                placeholder="Votre message..." 
                className="flex-1 px-4 py-2 border border-[#E5E5E5] rounded-xl text-sm focus:outline-none focus:border-black transition-colors bg-white"
              />
              <button type="submit" disabled={!newMsg.trim()} className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center disabled:opacity-50 transition-opacity">
                <span className="material-icons-round text-[18px]">send</span>
              </button>
            </form>
          </div>
        </div>
      </div>
      
      <PublicFooter />
    </div>
  );
}
