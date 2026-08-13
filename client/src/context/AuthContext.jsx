import React, { createContext, useState, useEffect } from 'react';
import API from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('shopez_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await API.post('/auth/login', { email, password });
      setUser(response.data);
      localStorage.setItem('shopez_user', JSON.stringify(response.data));
      setLoading(false);
      return response.data;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  const register = async (name, email, password, confirmPassword) => {
    setLoading(true);
    setError(null);
    try {
      const response = await API.post('/auth/register', {
        name,
        email,
        password,
        confirmPassword
      });
      setUser(response.data);
      localStorage.setItem('shopez_user', JSON.stringify(response.data));
      setLoading(false);
      return response.data;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('shopez_user');
  };

  const updateProfile = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await API.put('/auth/profile', userData);
      setUser(response.data);
      localStorage.setItem('shopez_user', JSON.stringify(response.data));
      setLoading(false);
      return response.data;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        updateProfile,
        isAdmin: user && user.role === 'ADMIN'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
