import React, { useState } from 'react';
import './ControllerForm.css';

const ControllerForm = ({ controller, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: controller?.name || '',
    phoneNumber: controller?.phoneNumber || '',
    location: controller?.location || '',
    phases: controller?.phases || 1,
    actions: controller?.actions || [
      { description: 'Cambiar a esta semáfora', command: 'change' },
      { description: 'Aumentar a 30%', command: 'increase_30' },
      { description: 'Aumentar a 60%', command: 'increase_60' }
    ]
  });

  const [errors, setErrors] = useState({});

  // Validar formato de teléfono dominicano
  const validatePhone = (phone) => {
    const regex = /^(809|829|849)\d{7}$/;
    return regex.test(phone);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Nombre es requerido';
    if (!formData.phoneNumber) newErrors.phoneNumber = 'Teléfono es requerido';
    else if (!validatePhone(formData.phoneNumber)) newErrors.phoneNumber = 'Teléfono no válido (ej: 8091234567)';
    if (formData.phases < 1 || formData.phases > 8) newErrors.phases = 'Debe tener entre 1 y 8 fases';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleActionChange = (index, field, value) => {
    const updatedActions = [...formData.actions];
    updatedActions[index][field] = value;
    setFormData({ ...formData, actions: updatedActions });
  };

  const handleAddAction = () => {
    setFormData({ ...formData, actions: [...formData.actions, { description: '', command: '' }] });
  };

  const handleRemoveAction = (index) => {
    const updatedActions = formData.actions.filter((_, i) => i !== index);
    setFormData({ ...formData, actions: updatedActions });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      const controllerData = { ...formData };

      try {
        const response = await fetch('http://localhost:3000/api/controllers', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(controllerData),
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Controlador creado:', data);
          onSave(data);
        } else {
          const errorData = await response.json();
          console.error('Error en el servidor:', errorData.message);
          alert('Hubo un error al crear el controlador');
        }
      } catch (error) {
        console.error('Error de red:', error);
        alert('Error de conexión');
      }
    }
  };

  return (
    <div className="controller-form-modal">
      <div className="controller-form-content">
        <h2>{controller ? 'Editar Controlador' : 'Agregar Controlador'}</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nombre del Controlador:</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            {errors.name && <span className="error">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label>Número de Teléfono:</label>
            <input
              type="text"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
              placeholder="Ej: 8091234567"
            />
            {errors.phoneNumber && <span className="error">{errors.phoneNumber}</span>}
          </div>

          <div className="form-group">
            <label>Ubicación:</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Cantidad de Fases/Semáforos:</label>
            <input
              type="number"
              min="1"
              max="8"
              value={formData.phases}
              onChange={(e) => setFormData({ ...formData, phases: parseInt(e.target.value) || 1 })}
            />
            {errors.phases && <span className="error">{errors.phases}</span>}
          </div>

          <div className="actions-section">
            <h3>Acciones Disponibles:</h3>
            {formData.actions.map((action, index) => (
              <div key={index} className="action-item">
                <div className="form-group">
                  <label>Descripción:</label>
                  <input
                    type="text"
                    value={action.description}
                    onChange={(e) => handleActionChange(index, 'description', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Comando:</label>
                  <input
                    type="text"
                    value={action.command}
                    onChange={(e) => handleActionChange(index, 'command', e.target.value)}
                  />
                </div>
                <button type="button" onClick={() => handleRemoveAction(index)}>Eliminar</button>
              </div>
            ))}
            <button type="button" onClick={handleAddAction}>Agregar Acción</button>
          </div>

          <div className="form-actions">
            <button className="bt-cancelar" type="button" onClick={onClose}>Cancelar</button>
            <button type="submit">{controller ? 'Guardar' : 'Crear'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ControllerForm;
