import { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '@/constants/api';

export const useHistory = () => {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/scan-history`);
      setHistory(response.data);
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteScan = async (scanId: number) => {
    try {
      await axios.delete(`${API_BASE_URL}/scan/${scanId}`);
      setHistory(prev => prev.filter(scan => scan.id !== scanId));
      return true;
    } catch (error) {
      console.error('Error deleting scan:', error);
      return false;
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return {
    history,
    loading,
    refreshHistory: fetchHistory,
    deleteScan
  };
};
