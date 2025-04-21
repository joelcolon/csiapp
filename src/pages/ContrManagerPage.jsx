import React from 'react';
import { Link } from 'react-router-dom';
import ControllerManager from '../components/ControllerManager/ControllerManager';
import './ContrManagerPage.css'


const ContrManagerPage = () => {
  

  return (
    <div className="controllers-page">
        <div className='container-title'>
      <h1 className='tituloManager'>Manejador de Controladores</h1>
      <Link to="/dashboard"><h2 className='volver'>volver</h2></Link>
      </div>
      <div className="management-section1">
      <section className="management-section">
        <ControllerManager />
      </section>
      </div>
    </div>
  );
};

export default ContrManagerPage;