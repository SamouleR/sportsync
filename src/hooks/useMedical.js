import { useState, useEffect, useCallback } from 'react';
import { medicalService } from '../services/api.js';

export const useMedical = (params = {}) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReports = useCallback(async () => {
    try {
      setLoading(true);
      const data = await medicalService.getAll(params);
      setReports(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(params)]);

  useEffect(() => { fetchReports(); }, [fetchReports]);

  const create = async (data) => {
    const result = await medicalService.create(data);
    await fetchReports();
    return result;
  };

  const markHealed = async (id) => {
    await medicalService.update(id, { status: 'guéri' });
    await fetchReports();
  };

  const activeCount = reports.filter(r => r.status === 'actif').length;

  return {
    reports, loading, error, activeCount,
    refresh: fetchReports,
    create, markHealed
  };
};
