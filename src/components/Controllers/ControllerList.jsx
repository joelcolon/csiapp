import React, { useState, useEffect } from 'react';
import ControllerForm from './ControllerForm'; // Importación corregida (sin llaves)
import './ControllerList.css';

const ControllerList = () => {
  const [controllers, setControllers] = useState([]);
  const [editingController, setEditingController] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Cargar los controladores desde la base de datos
  const loadControllers = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/controllers');
      if (response.ok) {
        const data = await response.json();
        setControllers(data); // Asumimos que la respuesta es un array de controladores
      } else {
        console.error('Error al obtener los controladores');
      }
    } catch (error) {
      console.error('Error de red:', error);
    }
  };

  // Cargar los controladores cuando el componente se monta
  useEffect(() => {
    loadControllers();
  }, []);

  // Guardar un nuevo controlador o actualizar uno existente
  const handleSave = (controllerData) => {
    if (editingController) {
      // Actualizar controlador existente
      setControllers(controllers.map(c => 
        c._id === editingController._id ? { ...c, ...controllerData } : c
      ));
    } else {
      // Crear nuevo controlador
      const newController = {
        _id: Math.max(...controllers.map(c => c._id), 0) + 1,  // Aquí se cambia id a _id
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
            <tr key={controller._id}>  {/* Cambié id a _id */}
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
                  onClick={async () => {
                    if (window.confirm('¿Está seguro de eliminar este controlador?')) {
                      try {
                        const response = await fetch(`http://localhost:3000/api/controllers/${controller._id}`, {  // Cambié id a _id
                          method: 'DELETE',
                        });
                        if (response.ok) {
                          setControllers(controllers.filter(c => c._id !== controller._id));  // Cambié id a _id
                        } else {
                          console.error('Error al eliminar el controlador');
                        }
                      } catch (error) {
                        console.error('Error de red:', error);
                      }
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
