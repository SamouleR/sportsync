import { useState, useEffect } from 'react';
import { useAuth } from '../App.jsx';
import {
  getUpcomingTrainings,
  getTrainingStats,
  getPlayers,
  getClubName,
} from '../data/store.js';

export default function CoachDashboard({ onViewTraining, onCreateTraining }) {
  const { user } = useAuth();
  const [trainings, setTrainings] = useState([]);
  const [players, setPlayers] = useState([]);
  const clubName = getClubName();

  useEffect(() => {
    setTrainings(getUpcomingTrainings(user.team));
    setPlayers(getPlayers(user.team));
  }, [user.team]);

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
  };

  const getDaysUntil = (dateStr) => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const target = new Date(dateStr);
    const diff = Math.ceil((target - now) / (1000 * 60 * 60 * 24));
    if (diff === 0) return "Aujourd'hui";
    if (diff === 1) return 'Demain';
    return `Dans ${diff} jours`;
  };

  return (
    <div className="page-enter">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1 text-[0.8rem] text-[#737373] uppercase tracking-wide font-semibold">
          <span className="material-icons-round text-base">shield</span>
          {clubName} — {user.team}
        </div>
        <h1 className="text-3xl font-bold text-[#000000] mb-2 font-['Montserrat']">
          Tableau de bord
        </h1>
        <p className="text-[#404040] text-[0.95rem]">
          Bienvenue, <strong>{user.name}</strong>. Voici un aperçu de vos prochaines séances.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 stagger">
        <StatCard
          icon="event"
          iconColor="var(--primary-light)"
          label="Séances à venir"
          value={trainings.length}
          delay={0}
        />
        <StatCard
          icon="groups"
          iconColor="var(--accent)"
          label="Joueurs inscrits"
          value={players.length}
          delay={1}
        />
        <StatCard
          icon="trending_up"
          iconColor="var(--accent-green)"
          label="Taux de présence"
          value="76%"
          delay={2}
        />
        <StatCard
          icon="notifications_active"
          iconColor="var(--accent-orange)"
          label="En attente"
          value={trainings.length > 0 ? getTrainingStats(trainings[0].id, user.team).pending : 0}
          delay={3}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 mb-8">
        <button className="btn btn-primary" onClick={onCreateTraining}>
          <span className="material-icons-round" style={{ fontSize: 20 }}>add</span>
          Créer un entraînement
        </button>
      </div>

      {/* Upcoming Trainings */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-[#000000] font-['Montserrat']">
          <span className="material-icons-round text-[22px] text-[#000000]">
            calendar_month
          </span>
          Prochains entraînements
        </h2>

        {trainings.length === 0 ? (
          <div className="bg-white/60 backdrop-blur-md rounded-2xl border border-[#E5E5E5] p-10 text-center shadow-sm">
            <span className="material-icons-round text-5xl text-[#737373] mb-3">
              event_busy
            </span>
            <p className="text-[#404040] mb-4">
              Aucun entraînement planifié.
            </p>
            <button className="btn btn-primary" onClick={onCreateTraining}>
              <span className="material-icons-round" style={{ fontSize: 18 }}>add</span>
              Planifier une séance
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3 stagger">
            {trainings.map((training) => {
              const stats = getTrainingStats(training.id, user.team);
              return (
                <TrainingCard
                  key={training.id}
                  training={training}
                  stats={stats}
                  onClick={() => onViewTraining(training.id)}
                  getDaysUntil={getDaysUntil}
                  formatDate={formatDate}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon, iconColor, label, value, delay }) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#E5E5E5] card-enter" style={{ animationDelay: `${delay * 80}ms` }}>
      <div className="flex items-center justify-between mb-3">
        <span className="material-icons-round text-2xl" style={{ color: iconColor }}>
          {icon}
        </span>
      </div>
      <div className="text-2xl font-extrabold font-['Montserrat'] text-[#000000]">
        {value}
      </div>
      <div className="text-xs font-medium text-[#737373] mt-1">
        {label}
      </div>
    </div>
  );
}

function TrainingCard({ training, stats, onClick, getDaysUntil, formatDate }) {
  const progressPercent = stats.total > 0
    ? Math.round(((stats.present + stats.late) / stats.total) * 100)
    : 0;

  return (
    <div
      className="bg-white/60 backdrop-blur-md rounded-2xl border border-[#E5E5E5] p-5 cursor-pointer hover:shadow-md hover:bg-white transition-all card-enter"
      onClick={onClick}
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-3">
        <div>
          <h3 className="text-[1.05rem] font-bold text-[#000000] mb-1">{training.title}</h3>
          <div className="flex items-center gap-1.5 text-[#404040] text-[0.85rem]">
            <span className="material-icons-round text-base">calendar_today</span>
            {formatDate(training.date)}
          </div>
        </div>
        <span className="badge badge-primary shrink-0">{getDaysUntil(training.date)}</span>
      </div>

      <div className="flex flex-wrap items-center gap-4 text-[0.85rem] text-[#404040] mb-4">
        <span className="flex items-center gap-1">
          <span className="material-icons-round text-base">schedule</span>
          {training.startTime} - {training.endTime}
        </span>
        <span className="flex items-center gap-1">
          <span className="material-icons-round text-base">location_on</span>
          {training.location}
        </span>
      </div>

      {/* Attendance bar */}
      <div className="mb-3">
        <div className="flex justify-between text-[0.78rem] mb-1.5">
          <span className="text-[#404040]">Présence</span>
          <span className="font-semibold text-[#000000]">
            {stats.present + stats.late} / {stats.total}
          </span>
        </div>
        <div className="h-1.5 bg-[#E5E5E5] rounded-full overflow-hidden">
          <div className="h-full bg-[#000000] rounded-full transition-[width] duration-1000 ease-out" style={{ width: `${progressPercent}%` }} />
        </div>
      </div>

      {/* Response badges */}
      <div className="flex flex-wrap gap-2 mt-2">
        <span className="badge badge-success">PRÉS {stats.present}</span>
        <span className="badge badge-danger">ABS {stats.absent}</span>
        <span className="badge badge-warning">RET {stats.late}</span>
        {stats.pending > 0 && <span className="badge badge-info">ATT {stats.pending}</span>}
      </div>
    </div>
  );
}
