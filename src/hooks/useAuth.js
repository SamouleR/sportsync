import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../App.jsx';
import { authService } from '../services/api.js';

export const useAuthHook = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const saved = sessionStorage.getItem('sportsync_session');
    if (saved) {
      const data = JSON.parse(saved);
      setUser(data.user); // We store { user, token } in session now
    }
    setLoading(false);
  }, []);

  const login = async (email, password, captchaId, captchaValue) => {
    try {
      setError(null);
      const data = await authService.login(email, password, captchaId, captchaValue);
      if (data.status === '2FA_REQUIRED') {
        return data;
      }
      setUser(data.user);
      sessionStorage.setItem('sportsync_session', JSON.stringify(data));
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const verify2FA = async (email, code) => {
    try {
      setError(null);
      const data = await authService.verify2FA(email, code);
      setUser(data.user);
      sessionStorage.setItem('sportsync_session', JSON.stringify(data));
      return data.user;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('sportsync_session');
  };

  return { user, loading, error, login, logout, setUser, verify2FA };
};
