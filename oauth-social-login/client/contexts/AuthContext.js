import { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import api from '../utils/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = Cookies.get('accessToken');
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async () => {
    try {
      const response = await api.get('/auth/me');
      setUser(response.data);
    } catch (error) {
      Cookies.remove('accessToken');
      Cookies.remove('refreshToken');
    } finally {
      setLoading(false);
    }
  };

  const login = (provider) => {
    window.location.href = `http://localhost:5000/api/auth/${provider}`;
  };

  const logout = () => {
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
    setUser(null);
    window.location.href = '/login';
  };

  const updateProfile = async (data) => {
    const response = await api.put('/auth/profile', data);
    setUser(response.data);
    return response.data;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
