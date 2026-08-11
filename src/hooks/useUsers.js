import { useState, useEffect } from 'react';
import { userService } from '../services/api.js';

export const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.getAll();
      setUsers(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const getPlayers = (team) => {
    return users.filter(u => u.role === 'player' && (!team || u.team === team));
  };

  return { users, loading, error, refresh: fetchUsers, getPlayers };
};
