import React from 'react';
import LoginForm from '../components/Auth/LoginForm';
import './AuthPage.css'
const AuthPage = () => {
  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Inicio de Sesión</h2>
        <LoginForm />
      </div>
    </div>
  );
};

export default AuthPage;