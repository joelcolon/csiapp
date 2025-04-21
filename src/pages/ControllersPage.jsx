import React from 'react';
import ControllerList from '../components/Controllers/ControllerList';
import { useAuth } from '../context/AuthContext';
import './ControllersPage.css'
import { Link } from 'react-router-dom';

const ControllersPage = () => {
  const { user } = useAuth();

  return (
    <div className="controllers-page">
      <div className='container-title'>
      <h1 className='titulo'>Administración de Controladores</h1>
      <Link to="/dashboard"><h2 className='volver'>volver</h2></Link>
      </div>
      {user?.role === 'admin' && (
        <section className="admin-section">
          <ControllerList />
        </section>
      )}
    </div>
  );
};

export default ControllersPage;