import { useState, useEffect, useCallback } from 'react';
import { trainingService } from '../services/api.js';

export const useTrainings = (team) => {
  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTrainings = useCallback(async () => {
    try {
      setLoading(true);
      const data = await trainingService.getAll(team ? { team } : {});
      setTrainings(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [team]);

  useEffect(() => { fetchTrainings(); }, [fetchTrainings]);

  const getUpcoming = () => {
    const now = new Date();
    return trainings.filter(t => new Date(t.date) >= now).sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  const getById = (id) => trainings.find(t => t.id === id);

  const getStats = (trainingId, teamPlayers = []) => {
    const training = trainings.find(t => t.id === trainingId);
    if (!training) return { present: 0, absent: 0, late: 0, pending: 0, total: 0 };
    
    let present = 0, absent = 0, late = 0;
    const respondedIds = new Set();
    
    if (training.responses) {
      training.responses.forEach(r => {
        respondedIds.add(r.playerId);
        if (r.status === 'present') present++;
        else if (r.status === 'absent') absent++;
        else if (r.status === 'late') late++;
      });
    }
    
    const pending = teamPlayers.length > 0 
      ? teamPlayers.filter(p => !respondedIds.has(p.id)).length 
      : 0;
    
    return { present, absent, late, pending, total: present + absent + late + pending };
  };

  const create = async (data) => {
    const result = await trainingService.create(data);
    await fetchTrainings();
    return result;
  };

  const remove = async (id) => {
    await trainingService.delete(id);
    await fetchTrainings();
  };

  const respond = async (trainingId, playerId, status, remark, arrivalTime) => {
    await trainingService.setResponse(trainingId, { playerId, status, remark, arrivalTime });
    await fetchTrainings();
  };

  const sendMessage = async (trainingId, userId, text) => {
    const msg = await trainingService.sendMessage(trainingId, { userId, text });
    await fetchTrainings();
    return msg;
  };

  return {
    trainings, loading, error,
    refresh: fetchTrainings,
    getUpcoming, getById, getStats,
    create, remove, respond, sendMessage
  };
};
