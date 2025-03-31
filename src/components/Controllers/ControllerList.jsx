import React, { useState } from 'react';
import ControllerForm from './ControllerForm'; // Importación corregida (sin llaves)
import './ControllerList.css';

const ControllerList = () => {
  const [controllers, setControllers] = useState([]);
  const [editingController, setEditingController] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Ejemplo de datos iniciales (deberías obtenerlos de tu API)
  const loadControllers = () => {
    setControllers([
      {
        id: 1,
        name: 'San Vicente de Paul con Costa Rica',
        phoneNumber: '8091234567',
        phases: 4,
        actions: [
          { description: 'Cambiar a esta semáfora', command: 'change' },
          { description: 'Aumentar a 30%', command: 'increase_30' },
          { description: 'Aumentar a 60%', command: 'increase_60' }
        ]
      }
    ]);
  };

  React.useEffect(() => {
    loadControllers();
  }, []);

  const handleSave = (controllerData) => {
    if (editingController) {
      // Actualizar controlador existente
      setControllers(controllers.map(c => 
        c.id === editingController.id ? {...c, ...controllerData} : c
      ));
    } else {
      // Crear nuevo controlador
      const newController = {
        id: Math.max(...controllers.map(c => c.id), 0) + 1,
        ...controllerData
      };
      setControllers([...controllers, newController]);
    }
    setShowForm(false);
  };

  return (
    <div className="controller-list-container">
      <div className="controller-list-header">
        <h2 className="controller-list-title">Lista de Controladores</h2>
        <button
          className="add-controller-btn"
          onClick={() => {
            setEditingController(null);
            setShowForm(true);
          }}
        >
          Agregar Controlador
        </button>
      </div>
      
      {showForm && (
        <ControllerForm
          controller={editingController}
          onSave={handleSave}
          onClose={() => setShowForm(false)}
        />
      )}
      
      <table className="controllers-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Teléfono</th>
            <th>Fases</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {controllers.map(controller => (
            <tr key={controller.id}>
              <td>{controller.name}</td>
              <td>{controller.phoneNumber}</td>
              <td>{controller.phases}</td>
              <td>
                <button
                  className="controller-action-btn controller-edit-btn"
                  onClick={() => {
                    setEditingController(controller);
                    setShowForm(true);
                  }}
                >
                  Editar
                </button>
                
                <button
                  className="controller-action-btn controller-delete-btn"
                  onClick={() => {
                    if (window.confirm('¿Está seguro de eliminar este controlador?')) {
                      setControllers(controllers.filter(c => c.id !== controller.id));
                    }
                  }}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ControllerList;
