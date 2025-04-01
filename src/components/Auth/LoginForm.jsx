import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './LoginForm.css';

const LoginForm = () => {
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('Admin123!');
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const { login } = useAuth();

  const validateForm = () => {
    const newErrors = {};
    if (!email) newErrors.email = 'Email es requerido';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email no válido';
    
    if (!password) newErrors.password = 'Contraseña es requerida';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        await login(email, password, rememberMe);
      } catch (error) {
        setErrors({ 
          api: error.message,
          ...error.message.includes('Credenciales') && { 
            credentials: '¿Estás usando admin@example.com / Admin123!?'
          }
        });
      }
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Inicio de Sesión</h2>
        
        <form onSubmit={handleSubmit} className="auth-form">
          {errors.api && (
            <div className="error-message">
              <p>{errors.api}</p>
              {errors.credentials && <p className="hint">{errors.credentials}</p>}
            </div>
          )}
          
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`form-input ${errors.email ? 'input-error' : ''}`}
              placeholder="admin@example.com"
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>
          
          <div className="form-group">
            <label>Contraseña:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`form-input ${errors.password ? 'input-error' : ''}`}
              placeholder="Admin123!"
            />
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>
          
          <div className="form-group-checkbox">
            <label>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="checkbox-input"
              />
              Recordar sesión
            </label>
          </div>
          
          <button type="submit" className="submit-btn">
            Iniciar Sesión
          </button>
          
          <div className="test-credentials">
            <p>Credenciales de prueba:</p>
            <p>Email: admin@example.com</p>
            <p>Contraseña: Admin123!</p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;