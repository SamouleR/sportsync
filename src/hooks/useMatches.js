import { useState, useEffect, useCallback } from 'react';
import { matchService } from '../services/api.js';

export const useMatches = (team) => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMatches = useCallback(async () => {
    try {
      setLoading(true);
      const data = await matchService.getAll(team ? { team } : {});
      setMatches(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [team]);

  useEffect(() => { fetchMatches(); }, [fetchMatches]);

  const getUpcoming = () => {
    const now = new Date();
    return matches
      .filter(m => {
        let liveState = {};
        if (m.liveState && typeof m.liveState === 'string') {
          try { liveState = JSON.parse(m.liveState); } catch(e){}
        }
        return new Date(m.date) >= now && !liveState.isClosed;
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  const getById = (id) => matches.find(m => m.id === id);

  const create = async (data) => {
    const result = await matchService.create(data);
    await fetchMatches();
    return result;
  };

  const updateConvocations = async (id, convocations, convStatus) => {
    await matchService.updateConvocations(id, { convocations, convStatus });
    await fetchMatches();
  };

  const updateLineup = async (id, lineup) => {
    await matchService.updateLineup(id, { lineup });
    await fetchMatches();
  };

  const remove = async (id) => {
    await matchService.delete(id);
    await fetchMatches();
  };

  const setResponse = async (id, playerId, status) => {
    await matchService.setResponse(id, { playerId, status });
    await fetchMatches();
  };

  return {
    matches, loading, error,
    refresh: fetchMatches,
    getUpcoming, getById,
    create, updateConvocations, updateLineup, remove, setResponse
  };
};
