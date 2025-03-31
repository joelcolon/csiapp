import React, { useState } from 'react';
import './UserForm.css';

const UserForm = ({ user, onClose, refreshUsers }) => {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    idNumber: user?.idNumber || '',
    password: '',
    confirmPassword: '',
    role: user?.role || 'operator'
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
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

  const handleSave = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/users', {
        method: user ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          idNumber: formData.idNumber,
          password: formData.password,
          role: formData.role
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Error al guardar usuario');

      alert(user ? 'Usuario actualizado' : 'Usuario creado');
      refreshUsers(); // Refrescar la lista de usuarios
      onClose();
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-form-modal">
      <div className="user-form-content">
        <h2>{user ? 'Editar Usuario' : 'Agregar Usuario'}</h2>
        <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
          <div className="form-group">
            <label>Nombre:</label>
            <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
            {errors.name && <span className="error">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label>Cédula:</label>
            <input type="text" value={formData.idNumber} onChange={(e) => setFormData({...formData, idNumber: e.target.value})} />
            {errors.idNumber && <span className="error">{errors.idNumber}</span>}
          </div>

          <div className="form-group">
            <label>Email:</label>
            <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
            {errors.email && <span className="error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label>Rol:</label>
            <select value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})}>
              <option value="admin">Administrador</option>
              <option value="operator">Operador</option>
            </select>
          </div>

          <div className="form-group">
            <label>Contraseña:</label>
            <input type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} placeholder={user ? "Dejar vacío para no cambiar" : ""} />
            {errors.password && <span className="error">{errors.password}</span>}
          </div>

          <div className="form-group">
            <label>Confirmar Contraseña:</label>
            <input type="password" value={formData.confirmPassword} onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} />
            {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose}>Cancelar</button>
            <button type="submit" disabled={loading}>{loading ? 'Guardando...' : 'Guardar'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserForm;
