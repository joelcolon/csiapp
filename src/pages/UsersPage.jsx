import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import UserForm from '../components/Users/UserForm';
import UserList from '../components/Users/UserList';
import './UsersPage.css';

const UsersPage = () => {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Solo administradores pueden acceder
  if (user?.role !== 'admin') {
    return (
      <div className="unauthorized">
        <div className="unauthorized-content">
          <h2>Acceso no autorizado</h2>
          <p>No tienes permisos para acceder a esta sección.</p>
          <i className="fas fa-lock"></i>
        </div>
      </div>
    );
  }

  // Mostrar formulario para agregar un nuevo usuario
  const handleAddUser = () => {
    setCurrentUser(null);  // Limpiar usuario actual
    setShowForm(true);     // Mostrar formulario
  };

  // Mostrar formulario para editar un usuario existente
  const handleEditUser = (user) => {
    setCurrentUser(user);  // Establecer el usuario actual
    setShowForm(true);     // Mostrar formulario
  };

  // Cerrar formulario
  const handleCloseForm = () => {
    setShowForm(false);    // Ocultar formulario
    setCurrentUser(null);  // Limpiar usuario actual
  };

  return (
    <div className="users-page">
      <header className="users-header">
      </header>

      <div className="users-content">
        <UserList 
          onEditUser={handleEditUser}  // Acción para editar usuario
          searchTerm={searchTerm}       // Filtro de búsqueda
        />
      </div>

      {showForm && (
        <UserForm
          user={currentUser}           // Usuario actual (para edición)
          onClose={handleCloseForm}    // Cerrar formulario
        />
      )}
    </div>
  );
};

export default UsersPage;
