import React, { useState } from 'react';
import UserForm from './UserForm';
import './UserList.css';
import { Link } from 'react-router-dom';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const loadUsers = () => {
    setUsers([
      {
        id: 1,
        name: 'Admin Principal',
        email: 'admin@example.com',
        idNumber: '001-1234567-8',
        role: 'admin',
        active: true,
        isDefaultAdmin: true
      }
    ]);
  };

  React.useEffect(() => {
    loadUsers();
  }, []);

  const handleSave = (userData) => {
    if (editingUser) {
      setUsers(users.map(u => u.id === editingUser.id ? {...u, ...userData} : u));
    } else {
      const newUser = {
        id: Math.max(...users.map(u => u.id), 0) + 1,
        ...userData,
        active: true
      };
      setUsers([...users, newUser]);
    }
    setShowForm(false);
  };

  return (
    <div className="user-list-container">
      <div className="user-list-header">
        <h1 className="user-list-title">Administración de Usuarios</h1>
        <Link to="dashboard"><h2 className='volver'>volver</h2></Link>
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
          onSave={handleSave}
          onClose={() => setShowForm(false)}
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
          <tbody className='tbody'>
            {users.map(user => (
              <tr key={user.id} className={`user-row ${!user.active ? 'inactive' : ''}`}>
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
                          setUsers(users.map(u => 
                            u.id === user.id ? {...u, active: !u.active} : u
                          ));
                        }}
                      >
                        {user.active ? 'Desactivar' : 'Activar'}
                      </button>
                      
                      <button 
                        className="action-btn delete-btn"
                        onClick={() => {
                          if (window.confirm('¿Está seguro de eliminar este usuario?')) {
                            setUsers(users.filter(u => u.id !== user.id));
                          }
                        }}
                      >
                        Eliminar
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserList;