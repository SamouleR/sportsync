import React, { useState, useEffect, useRef } from 'react';
import { useAuth, useToast } from '../App.jsx';
import { useEvents } from '../hooks/useEvents.js';
import { useUsers } from '../hooks/useUsers.js';
import { eventService, statsService } from '../services/api.js';

export default function MatchLiveTracker() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const { matches: allMatches, refresh: refreshEvents } = useEvents();
  const { users } = useUsers();
  
  // Get upcoming matches (could move this logic to useEvents similar to getUpcomingTrainings)
  const matches = allMatches.filter(m => (!user.team || m.team === user.team) && (!m.liveState || !JSON.parse(m.liveState).isClosed));
  
  const getUserById = (id) => users.find(u => u.id === id);

  const [activeMatch, setActiveMatch] = useState(null);
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [events, setEvents] = useState([]);
  const [scoreHome, setScoreHome] = useState(0);
  const [scoreAway, setScoreAway] = useState(0);

  const [isCameraOn, setIsCameraOn] = useState(false);
  const videoRef = useRef(null);

  const toggleCamera = async () => {
    if (isCameraOn) {
      const stream = videoRef.current?.srcObject;
      const tracks = stream?.getTracks() || [];
      tracks.forEach(track => track.stop());
      if (videoRef.current) videoRef.current.srcObject = null;
      setIsCameraOn(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
        setIsCameraOn(true);
      } catch (err) {
        showToast('Impossible d\'accéder à la caméra', 'error');
      }
    }
  };

  // Sync state to store whenever it changes
  useEffect(() => {
    const updateLiveState = async () => {
      if (activeMatch) {
        try {
          await eventService.updateMatchLiveState(activeMatch.id, {
            time,
            isRunning,
            events,
            scoreHome,
            scoreAway
          });
        } catch (error) {
          console.error("Failed to update live state", error);
        }
      }
    };
    updateLiveState();
  }, [time, isRunning, events, scoreHome, scoreAway, activeMatch]);

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setTime(t => t + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleEvent = (type, player) => {
    const newEvent = { id: Date.now(), time: formatTime(time), type, player: player ? player.name : 'Adversaire' };
    setEvents([newEvent, ...events]);
    
    if (type === 'BUT') {
      if (activeMatch.type === 'domicile') {
        setScoreHome(prev => prev + 1);
      } else {
        setScoreAway(prev => prev + 1);
      }
    } else if (type === 'BUT ADVERSAIRE') {
      if (activeMatch.type === 'domicile') {
        setScoreAway(prev => prev + 1);
      } else {
        setScoreHome(prev => prev + 1);
      }
    }

    showToast(`${type} : ${player ? player.name : 'Équipe Adverse'}`);
  };

  const startTracking = (m) => {
    setActiveMatch(m);
    let parsedState = {};
    if (m.liveState && typeof m.liveState === 'string') {
      try { parsedState = JSON.parse(m.liveState); } catch(e){}
    } else if (m.liveState) {
      parsedState = m.liveState;
    }
    
    if (parsedState) {
      setTime(parsedState.time || 0);
      setIsRunning(parsedState.isRunning || false);
      setEvents(parsedState.events || []);
      setScoreHome(parsedState.scoreHome || 0);
      setScoreAway(parsedState.scoreAway || 0);
    } else {
      setTime(0);
      setIsRunning(false);
      setEvents([]);
      setScoreHome(0);
      setScoreAway(0);
    }
  };

  const handleCloseMatch = async () => {
    if (window.confirm("Voulez-vous clôturer ce match ? Cela recalculera la note (Rating) et la forme des joueurs ayant participé.")) {
      setIsRunning(false);
      
      // Update player stats
      let parsedLineup = {};
      if (activeMatch.lineup && typeof activeMatch.lineup === 'string') {
        try { parsedLineup = JSON.parse(activeMatch.lineup); } catch(e){}
      } else if (activeMatch.lineup) {
        parsedLineup = activeMatch.lineup;
      }
      
      const lineupIds = Object.values(parsedLineup);
      for (const playerId of lineupIds) {
        const player = getUserById(playerId);
        if (player) {
          const playerEvents = events.filter(e => e.player === player.name);
          // Just a mock stat update calculation based on events
          let formModifier = 0;
          playerEvents.forEach(e => {
            if (e.type === 'BUT') formModifier += 1;
            if (e.type === 'PASSE D.') formModifier += 0.5;
            if (e.type === 'CARTON J.') formModifier -= 0.5;
            if (e.type === 'CARTON R.') formModifier -= 2;
          });
          
          await statsService.updateUserStats(playerId, {
            form: (player.stats?.form || 7.0) + formModifier
          });
        }
      }

      await eventService.closeMatch(activeMatch.id);
      showToast('Match clôturé ! Statistiques des joueurs mises à jour.', 'success');
      setActiveMatch(null);
      refreshEvents();
    }
  };

  if (!activeMatch) {
    return (
      <div className="page-enter" style={{ maxWidth: 700 }}>
        <h1 style={{ fontSize: '1.8rem', marginBottom: 24, textTransform: 'uppercase' }}>SUIVI DE MATCH EN DIRECT</h1>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {matches.map(m => (
            <div key={m.id} className="glass-card" style={{ padding: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 600 }}>{m.title}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>vs {m.opponent}</div>
              </div>
              <button className="btn btn-primary btn-sm" onClick={() => startTracking(m)}>
                DÉMARRER LE SUIVI
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const lineupIds = activeMatch.lineup ? Object.values(activeMatch.lineup) : [];
  const lineupPlayers = lineupIds.map(id => getUserById(id)).filter(Boolean);

  return (
    <div className="page-enter" style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
      <div style={{ flex: 1, minWidth: 300 }}>
        <div className="glass-card" style={{ padding: 24, marginBottom: 24, textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.2rem', textTransform: 'uppercase', marginBottom: 8 }}>{activeMatch.title}</h2>
          
          {/* Camera Feed */}
          <div style={{ width: '100%', aspectRatio: '16/9', background: '#000', borderRadius: 'var(--radius-lg)', overflow: 'hidden', position: 'relative', marginBottom: 16 }}>
            <video ref={videoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover', display: isCameraOn ? 'block' : 'none' }} />
            {!isCameraOn && (
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.5)' }}>
                <span className="material-icons-round" style={{ fontSize: 48, marginBottom: 8 }}>videocam_off</span>
                <span>Caméra désactivée</span>
              </div>
            )}
          </div>
          <button onClick={toggleCamera} className={`btn ${isCameraOn ? 'btn-ghost' : 'btn-primary'} btn-sm`} style={{ marginBottom: 24, width: '100%', display: 'flex', justifyContent: 'center' }}>
            <span className="material-icons-round" style={{ fontSize: 16 }}>{isCameraOn ? 'videocam_off' : 'videocam'}</span>
            {isCameraOn ? 'Désactiver la caméra' : 'Diffuser ma caméra'} (Simulation Live)
          </button>

          {/* Score Display */}
          <div className="flex justify-center items-center gap-8 my-6">
            <div className="text-center">
              <div className="text-xs font-bold text-gray-500 uppercase mb-1">{activeMatch.type === 'domicile' ? user.team : activeMatch.opponent}</div>
              <div className="text-5xl font-extrabold font-['Montserrat'] bg-black text-white w-20 h-20 flex items-center justify-center rounded-xl">{scoreHome}</div>
            </div>
            <div className="text-xl font-bold text-gray-400">-</div>
            <div className="text-center">
              <div className="text-xs font-bold text-gray-500 uppercase mb-1">{activeMatch.type === 'domicile' ? activeMatch.opponent : user.team}</div>
              <div className="text-5xl font-extrabold font-['Montserrat'] bg-white border-2 border-gray-200 text-black w-20 h-20 flex items-center justify-center rounded-xl">{scoreAway}</div>
            </div>
          </div>

          <div style={{ fontSize: '3rem', fontFamily: "'Montserrat'", fontWeight: 800, margin: '16px 0', color: isRunning ? 'var(--text-primary)' : 'var(--text-muted)' }}>
            {formatTime(time)}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
            <button className={`btn ${isRunning ? 'btn-ghost' : 'btn-primary'}`} onClick={() => setIsRunning(!isRunning)}>
              {isRunning ? 'PAUSE' : 'DÉMARRER'}
            </button>
            <button className="btn btn-ghost" onClick={() => { setActiveMatch(null); setIsRunning(false); }}>
              QUITTER
            </button>
            <button className="btn btn-danger" onClick={handleCloseMatch}>
              CLÔTURER LE MATCH
            </button>
          </div>
        </div>

        <div className="glass-card" style={{ padding: 16 }}>
          <div className="flex justify-between items-center mb-4">
            <h3 style={{ fontSize: '0.9rem', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>JOUEURS SUR LE TERRAIN</h3>
            <button onClick={() => handleEvent('BUT ADVERSAIRE', null)} className="px-3 py-1.5 bg-red-50 text-red-600 font-bold text-xs rounded-lg hover:bg-red-100 flex items-center gap-1 border border-red-100">
              <span className="material-icons-round text-[14px]">sports_soccer</span> But Adversaire
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 12 }}>
            {lineupPlayers.map(p => (
              <div key={p.id} style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', padding: 12 }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: 8 }}>{p.name}</div>
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                  <button className="btn btn-ghost btn-icon" onClick={() => handleEvent('BUT', p)} title="But"><span className="material-icons-round" style={{ fontSize: 16 }}>sports_soccer</span></button>
                  <button className="btn btn-ghost btn-icon" onClick={() => handleEvent('PASSE D.', p)} title="Passe Déisive"><span className="material-icons-round" style={{ fontSize: 16 }}>moving</span></button>
                  <button className="btn btn-ghost btn-icon" onClick={() => handleEvent('CARTON J.', p)} title="Carton Jaune"><span className="material-icons-round" style={{ fontSize: 16, color: '#f1c40f' }}>style</span></button>
                  <button className="btn btn-ghost btn-icon" onClick={() => handleEvent('CARTON R.', p)} title="Carton Rouge"><span className="material-icons-round" style={{ fontSize: 16, color: '#e74c3c' }}>style</span></button>
                </div>
              </div>
            ))}
            {lineupPlayers.length === 0 && <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Aucun joueur dans la composition. Allez dans Matchs &gt; Tactique.</div>}
          </div>
        </div>
      </div>

      <div className="glass-card" style={{ width: 300, padding: 16, display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ fontSize: '0.9rem', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: 16 }}>FIL DU MATCH</h3>
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {events.length === 0 && <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Aucun événement.</div>}
          {events.map(ev => (
            <div key={ev.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 12px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, width: 40 }}>{ev.time}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{ev.type}</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{ev.player}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
