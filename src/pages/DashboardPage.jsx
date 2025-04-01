import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import './DashboardPage.css'

const DashboardPage = () => {
  const { user } = useAuth();


  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="dashboard">
        <div className='cont-nav'>
      <h1 className='panel'>Panel de Control</h1>
      <Link to="/" onClick={handleRefresh}>
      <p className='login'>Cambiar Cuenta</p>
      </Link>
        </div>
      <div className="dashboard-grid">
        {user?.role === 'admin' && (
          <>
            <Link to="/users" className="dashboard-card">
              <h2>Administrar Usuarios</h2>
              <p>Gestión de cuentas de usuario</p>
            </Link>
            
            <Link to="/controllers" className="dashboard-card">
              <h2>Administrar Controladores</h2>
              <p>Configuración de controladores</p>
            </Link>
          </>
        )}

        <Link to="/controllers" className="dashboard-card">
          <h2>Manejar Controladores</h2>
          <p>Control en tiempo real</p>
        </Link>
      </div>
    </div>
  );
};

export default DashboardPage;