import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Cargar usuario al iniciar
  useEffect(() => {
    const cargarUsuario = async () => {
      const token = localStorage.getItem('accessToken');
      const usuarioGuardado = localStorage.getItem('usuario');

      if (token && usuarioGuardado) {
        try {
          // Verificar token con el backend
          const response = await authAPI.me();
          setUsuario(response.data.usuario);
          setIsAuthenticated(true);
        } catch (error) {
          // Token inválido, limpiar
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('usuario');
        }
      }

      setLoading(false);
    };

    cargarUsuario();
  }, []);

  const login = useCallback(async (email, password) => {
    const response = await authAPI.login({ email, password });
    const { accessToken, refreshToken, usuario: user } = response.data;

    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('usuario', JSON.stringify(user));

    setUsuario(user);
    setIsAuthenticated(true);

    return response.data;
  }, []);

  const registro = useCallback(async (datos) => {
    const response = await authAPI.registro(datos);
    return response.data;
  }, []);

  const logout = useCallback(async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        await authAPI.logout(refreshToken);
      }
    } catch (error) {
      console.error('Error en logout:', error);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('usuario');
      setUsuario(null);
      setIsAuthenticated(false);
    }
  }, []);

  const actualizarUsuario = useCallback(async () => {
    try {
      const response = await authAPI.me();
      setUsuario(response.data.usuario);
      localStorage.setItem('usuario', JSON.stringify(response.data.usuario));
      return response.data;
    } catch (error) {
      console.error('Error actualizando usuario:', error);
      throw error;
    }
  }, []);

  const value = {
    usuario,
    loading,
    isAuthenticated,
    login,
    registro,
    logout,
    actualizarUsuario
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
}
