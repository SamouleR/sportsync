import { useState, useEffect } from 'react';
import { eventService } from '../services/api.js';

export const useEvents = () => {
  const [trainings, setTrainings] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const data = await eventService.getAll();
      setTrainings(data.trainings || []);
      setMatches(data.matches || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const getUpcomingTrainings = (team) => {
    const now = new Date();
    return trainings
      .filter(t => new Date(t.date) >= now && (!team || t.team === team))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  const getTrainingStats = (trainingId, team) => {
    const training = trainings.find(t => t.id === trainingId);
    if (!training) return { present: 0, absent: 0, late: 0, pending: 0, total: 0 };
    
    let present = 0, absent = 0, late = 0, pending = 0;
    
    // In a real scenario, you'd calculate total based on team players
    // For now we rely on responses
    if (training.responses) {
      training.responses.forEach(r => {
        if (r.status === 'present') present++;
        else if (r.status === 'absent') absent++;
        else if (r.status === 'late') late++;
      });
    }
    
    return {
      present,
      absent,
      late,
      pending,
      total: present + absent + late + pending
    };
  };

  return { trainings, matches, loading, error, refresh: fetchEvents, getUpcomingTrainings, getTrainingStats };
};
