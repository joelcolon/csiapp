// context/AuthContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import { login as authLogin } from '../services/authService';
import { useNavigate } from 'react-router-dom';

// Crear contexto con valor inicial tipado
const AuthContext = createContext({
  user: null,
  login: () => {},
  logout: () => {},
  loading: true,
  error: null
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Cargar usuario al iniciar
  useEffect(() => {
    const loadUser = () => {
      try {
        const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (err) {
        console.error("Error al cargar usuario:", err);
        // Limpiar almacenamiento si hay datos corruptos
        localStorage.removeItem('user');
        sessionStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // Función de login mejorada
  const login = async (email, password, rememberMe = false) => {
    setLoading(true);
    setError(null);
    
    try {
      const userData = await authLogin(email, password);
      
      // Validar estructura de datos antes de guardar
      if (!userData?.user || !userData?.token) {
        throw new Error('Datos de usuario incompletos');
      }

      setUser(userData.user);
      
      if (rememberMe) {
        localStorage.setItem('user', JSON.stringify(userData.user));
        localStorage.setItem('token', userData.token);
      } else {
        sessionStorage.setItem('user', JSON.stringify(userData.user));
        sessionStorage.setItem('token', userData.token);
      }
      
      navigate('/dashboard');
    } catch (err) {
      console.error("Error en login:", err);
      setError(err.message || 'Error al iniciar sesión');
      throw err; // Re-lanzar para manejo en el componente
    } finally {
      setLoading(false);
    }
  };

  // Función de logout
  const logout = () => {
    setUser(null);
    setError(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('token');
    navigate('/login');
  };

  // Valor del contexto
  const contextValue = {
    user,
    login,
    logout,
    loading,
    error,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado con validación
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};