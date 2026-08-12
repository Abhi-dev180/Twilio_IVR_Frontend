import React, { useState, useEffect } from 'react';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import './style/App.css';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('adminToken') || '');

  useEffect(() => {
    const stored = localStorage.getItem('adminToken');
    if (stored) {
      setToken(stored);
    }
  }, []);

  if (!token) {
    return <Login setToken={setToken} />;
  }

  return <Dashboard token={token} setToken={setToken} />;
}
