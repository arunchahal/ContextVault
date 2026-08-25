import { createContext, useContext, useState, useEffect } from 'react';
import * as authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const authenticated = authService.isAuthenticated();
      if (authenticated) {
        const currentUser = authService.getCurrentUser();
        setUser(currentUser);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = (email, password) => {
    const result = authService.login(email, password);
    if (result && result.success !== false) {
      const currentUser = result.user || (typeof authService.getCurrentUser === 'function' ? authService.getCurrentUser() : result);
      setUser(currentUser);
      setIsAuthenticated(true);
    }
    return result;
  };

  const register = (data) => {
    const result = authService.register(data);
    if (result && result.success !== false) {
      const currentUser = result.user || (typeof authService.getCurrentUser === 'function' ? authService.getCurrentUser() : result);
      setUser(currentUser);
      setIsAuthenticated(true);
    }
    return result;
  };

  const logout = () => {
    try {
      if (typeof authService.logout === 'function') {
        authService.logout();
      }
    } finally {
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const updateProfile = (data) => {
    const result = authService.updateProfile(data);
    if (result && result.success !== false) {
      const updatedUser = result.user || (typeof authService.getCurrentUser === 'function' ? authService.getCurrentUser() : result);
      setUser(updatedUser);
    }
    return result;
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
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

export { AuthContext };
export default useAuth;
