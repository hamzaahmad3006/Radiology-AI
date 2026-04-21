import { useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '@/constants/api';

export const useHome = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [chatMessages, setChatMessages] = useState<{role: 'user' | 'ai', content: string}[]>([]);
  const [chatLoading, setChatLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const uploadAndAnalyze = async () => {
    if (!file) return;

    setLoading(true);
    setResult(null);
    setChatMessages([]);
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(`${API_BASE_URL}/upload-xray`, formData);
      setResult(response.data);
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to analyze image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const askQuestion = async (question: string) => {
    if (!result || !question.trim()) return;

    const userMsg = { role: 'user' as const, content: question };
    setChatMessages(prev => [...prev, userMsg]);
    setChatLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/chat`, {
        scan_id: result.id,
        question: question
      });
      setChatMessages(prev => [...prev, { role: 'ai' as const, content: response.data.response }]);
    } catch (error) {
      console.error('Error in chat:', error);
      setChatMessages(prev => [...prev, { role: 'ai' as const, content: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setChatLoading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setChatMessages([]);
  };

  return {
    file,
    preview,
    loading,
    result,
    chatMessages,
    chatLoading,
    handleFileChange,
    uploadAndAnalyze,
    askQuestion,
    reset
  };
};
