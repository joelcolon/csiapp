import React from 'react';
import ControllerList from '../components/Controllers/ControllerList';
import ControllerManager from '../components/Controllers/ControllerManager';
import { useAuth } from '../context/AuthContext';
import './ControllersPage.css'
import { Link } from 'react-router-dom';

const ControllersPage = () => {
  const { user } = useAuth();

  return (
    <div className="controllers-page">
      <h1 className='titulo'>Administración de Controladores</h1>
      <Link to="/dashboard">
      <h2 className='volver'>volver</h2>
      </Link>
      {user?.role === 'admin' && (
        <section className="admin-section">
          <h2>Lista de Controladores</h2>
          <ControllerList />
        </section>
      )}

      <section className="management-section">
        <h2>Manejo de Controladores</h2>
        <ControllerManager />
      </section>
    </div>
  );
};

export default ControllersPage;