import React, { useState, useEffect } from 'react';
import UserForm from './UserForm';
import './UserList.css';
import { Link } from 'react-router-dom';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Función para cargar los usuarios desde el backend
  const loadUsers = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/users');
      if (!response.ok) {
        throw new Error('No se pudo obtener la lista de usuarios');
      }
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
    }
  };

  // Cargar usuarios cuando el componente se monte
  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <div className="user-list-container">
      <div className="user-list-header">
        <h1 className="user-list-title">Administración de Usuarios</h1>
        <Link to="/dashboard"><h2 className='volver'>Volver</h2></Link>
        <button
          className="add-user-btn"
          onClick={() => {
            setEditingUser(null);
            setShowForm(true);
          }}
        >
          Agregar Usuario
        </button>
      </div>

      {showForm && (
        <UserForm
          user={editingUser}
          onClose={() => setShowForm(false)}
          refreshUsers={loadUsers} // 🔥 PASAMOS LA FUNCIÓN CORRECTAMENTE
        />
      )}

      <div className="table-responsive">
        <table className="users-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody className="tbody">
  {users.map(user => {
    const userId = user.id || user._id || `temp-${Math.random().toString(36).substr(2, 9)}`;
    return (
      <tr key={userId} className={`user-row ${!user.active ? 'inactive' : ''}`}>
        <td>{user.name}</td>
        <td>{user.email}</td>
        <td>
          <span className={`role-badge ${user.role}`}>
            {user.role === 'admin' ? 'Administrador' : 'Operador'}
          </span>
        </td>
        <td>
          <span className={`status-badge ${user.active ? 'active' : 'inactive'}`}>
            {user.active ? 'Activo' : 'Inactivo'}
          </span>
        </td>
        <td className="actions-cell">
          <button
            className="action-btn edit-btn"
            onClick={() => {
              setEditingUser(user);
              setShowForm(true);
            }}
          >
            Editar
          </button>

          {!user.isDefaultAdmin && (
            <>
              <button
                className={`action-btn toggle-btn ${user.active ? 'deactivate' : 'activate'}`}
                onClick={() => {
                  fetch(`http://localhost:3000/api/users/${user.id}/toggle`, {
                    method: 'PUT'
                  }).then(() => loadUsers());
                }}
              >
                {user.active ? 'Desactivar' : 'Activar'}
              </button>

              <button
  className="action-btn delete-btn"
  onClick={() => {
    if (window.confirm('¿Está seguro de eliminar este usuario?')) {
      // Usar user._id en lugar de user.id
      fetch(`http://localhost:3000/api/users/${user._id}`, {
        method: 'DELETE'
      })
      .then(() => loadUsers())  // Vuelve a cargar los usuarios después de eliminar
      .catch((error) => console.error('Error al eliminar el usuario:', error));
    }
  }}
>
  Eliminar
</button>

            </>
          )}
        </td>
      </tr>
    );
  })}
</tbody>

        </table>
      </div>
    </div>
  );
};

export default UserList;
