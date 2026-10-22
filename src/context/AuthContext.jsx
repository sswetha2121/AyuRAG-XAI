import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const checkAuth = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const userData = await api.getAuthMe();
      setUser(userData);
    } catch (err) {
      // 401/403 or unauthenticated session
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (username, password) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.login(username, password);
      setUser(response.user);
      return response.user;
    } catch (err) {
      setError(err.message || 'Login failed.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const doctorLogin = async (username, password) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.doctorLogin(username, password);
      setUser(response.user);
      return response.user;
    } catch (err) {
      setError(err.message || 'Physician login failed.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (patientData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.register(patientData);
      setUser(response.user);
      return response.user;
    } catch (err) {
      setError(err.message || 'Registration failed.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const doctorRegister = async (doctorData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.doctorRegister(doctorData);
      return response;
    } catch (err) {
      setError(err.message || 'Doctor registration failed.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch (err) {
      // continue clearing local state
    }
    setUser(null);
  };

  const switchDemoPersona = async (role) => {
    setIsLoading(true);
    try {
      const response = await api.switchDemo(role);
      setUser(response.user);
      return response.user;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (profileData) => {
    setIsLoading(true);
    try {
      const response = await api.updateProfile(profileData);
      setUser(response.user);
      return response.user;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const isDoctor = user?.role === 'DOCTOR';
  const isPatient = user?.role === 'PATIENT';
  const isAuthenticated = Boolean(user);

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        isAuthenticated,
        isDoctor,
        isPatient,
        isLoading,
        error,
        login,
        doctorLogin,
        register,
        doctorRegister,
        logout,
        switchDemoPersona,
        checkAuth,
        updateProfile,
      }}
    >

      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
