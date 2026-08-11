import { useState } from 'react';
import { useAuth, useToast } from '../App.jsx';
import { useTrainings } from '../hooks/useTrainings.js';

const LOCATIONS = [
  'Terrain synthétique principal',
  'Gymnase municipal',
  'Stade André Lemoine',
  'Terrain annexe B',
];

export default function CreateTraining({ onBack }) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const { create } = useTrainings(user.team);

  const [form, setForm] = useState({
    title: '',
    date: '',
    startTime: '',
    endTime: '',
    location: LOCATIONS[0],
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const update = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await create({ ...form, team: user.team, createdBy: user.id });
      showToast('Entraînement créé avec succès !');
      onBack();
    } catch (err) {
      showToast(err.message, 'error');
    }
    setSubmitting(false);
  };

  return (
    <div className="page-enter" style={{ maxWidth: 600 }}>
      {/* Header */}
      <button onClick={onBack} className="btn btn-ghost btn-sm" style={{ marginBottom: 16 }}>
        <span className="material-icons-round" style={{ fontSize: 18 }}>arrow_back</span>
        Retour
      </button>

      <h1 style={{ fontSize: '1.6rem', marginBottom: 8 }}>
        <span className="material-icons-round" style={{ fontSize: 28, verticalAlign: 'middle', marginRight: 8, color: 'var(--primary-light)' }}>
          add_circle
        </span>
        Créer un entraînement
      </h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 32 }}>
        Planifiez une nouvelle séance pour votre équipe.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="glass-card" style={{ padding: 28 }}>
          {/* Title */}
          <div style={{ marginBottom: 20 }}>
            <label className="input-label" htmlFor="training-title">Titre de la séance</label>
            <input id="training-title" className="input-field" placeholder="Ex: Entraînement physique & tactique" value={form.title} onChange={e => update('title', e.target.value)} required />
          </div>

          {/* Date & Time Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 20 }}>
            <div>
              <label className="input-label" htmlFor="training-date">Date</label>
              <input id="training-date" type="date" className="input-field" value={form.date} onChange={e => update('date', e.target.value)} required />
            </div>
            <div>
              <label className="input-label" htmlFor="training-start">Début</label>
              <input id="training-start" type="time" className="input-field" value={form.startTime} onChange={e => update('startTime', e.target.value)} required />
            </div>
            <div>
              <label className="input-label" htmlFor="training-end">Fin</label>
              <input id="training-end" type="time" className="input-field" value={form.endTime} onChange={e => update('endTime', e.target.value)} required />
            </div>
          </div>

          {/* Location */}
          <div style={{ marginBottom: 20 }}>
            <label className="input-label" htmlFor="training-location">Lieu</label>
            <select id="training-location" className="select-field" value={form.location} onChange={e => update('location', e.target.value)}>
              {LOCATIONS.map(loc => <option key={loc} value={loc}>{loc}</option>)}
            </select>
          </div>

          {/* Message */}
          <div style={{ marginBottom: 24 }}>
            <label className="input-label" htmlFor="training-message">Consignes / Message</label>
            <textarea id="training-message" className="textarea-field" placeholder="Ex: Prévoir des baskets de course et des protège-tibias." value={form.message} onChange={e => update('message', e.target.value)} />
          </div>

          {/* Preview */}
          {form.title && form.date && (
            <div style={{ padding: 16, background: 'rgba(108,92,231,0.08)', borderRadius: 'var(--radius-md)', marginBottom: 24, border: '1px dashed rgba(108,92,231,0.3)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, marginBottom: 8 }}>Aperçu</div>
              <div style={{ fontWeight: 700, marginBottom: 4 }}>{form.title}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                <span> {new Date(form.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
                {form.startTime && <span>🕐 {form.startTime}{form.endTime ? ` - ${form.endTime}` : ''}</span>}
                <span>📍 {form.location}</span>
              </div>
            </div>
          )}

          {/* Actions */}
          <div style={{ display: 'flex', gap: 12 }}>
            <button type="submit" className="btn btn-primary btn-lg" disabled={submitting} style={{ flex: 1 }}>
              {submitting ? (
                <><span className="material-icons-round" style={{ fontSize: 20, animation: 'spin 1s linear infinite' }}>autorenew</span> Création...</>
              ) : (
                <><span className="material-icons-round" style={{ fontSize: 20 }}>check</span> Créer l'entraînement</>
              )}
            </button>
            <button type="button" className="btn btn-ghost btn-lg" onClick={onBack}>Annuler</button>
          </div>
        </div>
      </form>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
