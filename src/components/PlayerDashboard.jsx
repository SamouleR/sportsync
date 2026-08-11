import { useState, useEffect } from 'react';
import { useAuth, useToast } from '../App.jsx';
import { useTrainings } from '../hooks/useTrainings.js';

export default function PlayerDashboard({ onViewTraining }) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const { getUpcoming, respond, loading } = useTrainings(user.team);
  const [trainings, setTrainings] = useState([]);
  const [responses, setResponses] = useState({});

  useEffect(() => {
    if (!loading) {
      const upcoming = getUpcoming();
      setTrainings(upcoming);
      // Build responses map from training data
      const resp = {};
      upcoming.forEach(tr => {
        if (tr.responses) {
          const r = tr.responses.find(r => r.playerId === user.id);
          if (r) resp[tr.id] = r;
        }
      });
      setResponses(resp);
    }
  }, [loading]);

  const fmt = (d) => new Date(d).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
  const days = (d) => {
    const now = new Date(); now.setHours(0,0,0,0);
    const diff = Math.ceil((new Date(d) - now) / 864e5);
    return diff === 0 ? "Aujourd'hui" : diff === 1 ? 'Demain' : `Dans ${diff} jours`;
  };
  const greet = () => { const h = new Date().getHours(); return h < 12 ? 'Bonjour' : h < 18 ? 'Bon après-midi' : 'Bonsoir'; };

  const handleRespond = async (tid, status, remark = '', arrivalTime = '') => {
    await respond(tid, user.id, status, remark, arrivalTime);
    showToast(`Réponse : ${{present:'Présent',absent:'Absent',late:'En retard'}[status]}`);
  };

  return (
    <div className="page-enter">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#000000] mb-2 uppercase font-['Montserrat']">
          {greet()}, <span className="text-black">{user.name.split(' ')[0]}</span>
        </h1>
        <p className="text-[#404040]">
          {trainings.length > 0 ? `${trainings.length} séance(s) à venir.` : 'Aucune séance prévue.'}
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        <div className="bg-white p-4 rounded-2xl border border-[#E5E5E5] shadow-sm card-enter">
          <span className="material-icons-round text-2xl text-[#000000] mb-2">check_circle</span>
          <div className="text-2xl font-extrabold font-['Montserrat'] text-[#000000]">
            {Object.values(responses).filter(r => r.status === 'present').length}
          </div>
          <div className="text-xs font-medium text-[#737373] mt-1">Confirmé(s)</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-[#E5E5E5] shadow-sm card-enter" style={{ animationDelay: '80ms' }}>
          <span className="material-icons-round text-2xl text-[#404040] mb-2">pending</span>
          <div className="text-2xl font-extrabold font-['Montserrat'] text-[#000000]">
            {trainings.length - Object.keys(responses).length}
          </div>
          <div className="text-xs font-medium text-[#737373] mt-1">En attente</div>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-[#000000] font-['Montserrat']">
        <span className="material-icons-round text-[22px] text-[#000000]">event</span>
        Mes entraînements
      </h2>

      {trainings.length === 0 ? (
        <div className="bg-white/60 backdrop-blur-md rounded-2xl border border-[#E5E5E5] p-10 text-center shadow-sm">
          <span className="material-icons-round text-5xl text-[#737373] mb-3">sports</span>
          <p className="text-[#404040] mb-4">Aucun entraînement prévu.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4 stagger">
          {trainings.map(t => (
            <Card key={t.id} t={t} r={responses[t.id]} onRespond={handleRespond} onView={() => onViewTraining(t.id)} fmt={fmt} days={days} />
          ))}
        </div>
      )}
    </div>
  );
}

function Card({ t, r, onRespond, onView, fmt, days }) {
  const [mode, setMode] = useState(null); // 'absent' | 'late'
  const [remark, setRemark] = useState('');
  const [arrTime, setArrTime] = useState('');
  const st = r?.status;

  return (
    <div className="bg-white/60 backdrop-blur-md rounded-2xl border border-[#E5E5E5] p-5 shadow-sm card-enter">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
        <div>
          <h3 className="text-[1.1rem] font-bold text-[#000000] mb-1.5">{t.title}</h3>
          <span className="badge badge-primary shrink-0">{days(t.date)}</span>
        </div>
        {st && <span className={`badge shrink-0 ${st==='present'?'badge-success':st==='absent'?'badge-danger':'badge-warning'}`}>
          {st==='present'?'PRÉSENT':st==='absent'?'ABSENT':`RETARD (${r.arrivalTime})`}
        </span>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4 p-4 bg-[rgba(108,92,231,0.05)] rounded-xl">
        <div className="flex items-center gap-2 text-[0.9rem]">
          <span className="material-icons-round text-[18px] text-[#000000]">calendar_today</span>
          <span className="text-[#404040] font-medium">{fmt(t.date)}</span>
        </div>
        <div className="flex items-center gap-2 text-[0.9rem]">
          <span className="material-icons-round text-[18px] text-[#000000]">schedule</span>
          <span className="text-[#404040] font-medium">{t.startTime} - {t.endTime}</span>
        </div>
        <div className="flex items-center gap-2 text-[0.9rem]">
          <span className="material-icons-round text-[18px] text-[#000000]">location_on</span>
          <span className="text-[#404040] font-medium">{t.location}</span>
        </div>
      </div>

      {t.message && (
        <div className="px-4 py-3 bg-[rgba(0,210,255,0.05)] border-l-4 border-[#000000] rounded-r-xl text-[0.85rem] text-[#404040] mb-4 leading-relaxed">
          {t.message}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-2">
        <button className={`btn w-full sm:flex-1 ${st==='present'?'btn-success':'btn-ghost'}`} onClick={() => { setMode(null); onRespond(t.id, 'present'); }}>PRÉSENT</button>
        <button className={`btn w-full sm:flex-1 ${st==='absent'?'btn-danger':'btn-ghost'}`} onClick={() => setMode('absent')}>ABSENT</button>
        <button className={`btn w-full sm:flex-1 ${st==='late'?'btn-warning':'btn-ghost'}`} onClick={() => setMode('late')}>EN RETARD</button>
      </div>

      <button onClick={onView} className="mt-3 flex items-center gap-1 bg-transparent border-none text-[#000000] text-[0.85rem] font-semibold cursor-pointer hover:underline">
        Voir les détails <span className="material-icons-round text-[16px]">arrow_forward</span>
      </button>

      {mode && (
        <div className="mt-4 p-4 bg-white rounded-xl shadow-sm border border-[#E5E5E5]">
          {mode === 'late' && <>
            <label className="input-label">Heure d'arrivée estimée</label>
            <input type="time" className="input-field mb-3" value={arrTime} onChange={e => setArrTime(e.target.value)} />
          </>}
          <label className="input-label">Remarque (optionnel)</label>
          <textarea className="textarea-field min-h-[60px] mb-3" placeholder={mode==='absent'?"Raison de l'absence...":"Raison du retard..."} value={remark} onChange={e => setRemark(e.target.value)} />
          <div className="flex gap-2">
            <button className={`btn btn-sm ${mode==='absent'?'btn-danger':'btn-warning'}`} onClick={() => { onRespond(t.id, mode, remark, arrTime); setMode(null); setRemark(''); setArrTime(''); }}>
              Confirmer
            </button>
            <button className="btn btn-ghost btn-sm" onClick={() => setMode(null)}>Annuler</button>
          </div>
        </div>
      )}
    </div>
  );
}
