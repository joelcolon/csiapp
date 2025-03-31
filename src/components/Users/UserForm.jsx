import React, { useState } from 'react';
import './UserForm.css'

const UserForm = ({ user, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    idNumber: user?.idNumber || '',
    password: '',
    confirmPassword: '',
    role: user?.role || 'operator'
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    // Validaciones según tus requisitos
    if (!formData.name) newErrors.name = 'Nombre es requerido';
    if (!formData.email) newErrors.email = 'Email es requerido';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email no válido';
    
    if (!user && !formData.password) newErrors.password = 'Contraseña es requerida';
    if (formData.password && formData.password.length < 8) newErrors.password = 'Mínimo 8 caracteres';
    if (formData.password && !/[A-Z]/.test(formData.password)) newErrors.password = 'Debe contener al menos 1 mayúscula';
    if (formData.password && !/[!@#$%^&*]/.test(formData.password)) newErrors.password = 'Debe contener al menos 1 carácter especial';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Las contraseñas no coinciden';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSave({
        ...formData,
        // No enviar confirmPassword al backend
        confirmPassword: undefined
      });
    }
  };

  return (
    <div className="user-form-modal">
      <div className="user-form-content">
        <h2>{user ? 'Editar Usuario' : 'Agregar Usuario'}</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nombre:</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
            {errors.name && <span className="error">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label>Cédula:</label>
            <input
              type="text"
              value={formData.idNumber}
              onChange={(e) => setFormData({...formData, idNumber: e.target.value})}
            />
            {errors.idNumber && <span className="error">{errors.idNumber}</span>}
          </div>

          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
            {errors.email && <span className="error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label>Rol:</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
            >
              <option value="admin">Administrador</option>
              <option value="operator">Operador</option>
            </select>
          </div>

          <div className="form-group">
            <label>Contraseña:</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              placeholder={user ? "Dejar vacío para no cambiar" : ""}
            />
            {errors.password && <span className="error">{errors.password}</span>}
          </div>

          <div className="form-group">
            <label>Confirmar Contraseña:</label>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
            />
            {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}
          </div>

          <div className="form-actions">
            <button className='bt-cancelar' type="button" onClick={onClose}>Cancelar</button>
            <button type="submit">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserForm; // Exportación por defecto añadida