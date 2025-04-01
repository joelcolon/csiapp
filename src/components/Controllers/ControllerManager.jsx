/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { fetchControllers, sendCommand } from '../../services/controllerService';
import "./ControllerManager.css";

const ControllerManager = () => {
  const [controllers, setControllers] = useState([]);
  const [selectedController, setSelectedController] = useState(null);
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadControllers = async () => {
      try {
        const data = await fetchControllers();
        setControllers(data);
        if (data.length > 0) setSelectedController(data[0]);
      } catch (error) {
        console.error('Error loading controllers:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadControllers();
  }, []);

  const handleCommand = async (phaseId, command) => {
    if (!selectedController?.id) {
      setNotification({ message: 'No hay controlador seleccionado', type: 'error' });
      return;
    }
    try {
      await sendCommand(selectedController.id, phaseId, command);
      setNotification({ message: 'Comando enviado con éxito', type: 'success' });
    } catch (error) {
      setNotification({ message: 'Hubo un error al enviar el comando', type: 'error' });
    }
    setTimeout(() => setNotification(null), 3000);
  };

  if (loading) return <div className="loading-message">Cargando controladores...</div>;
  if (!selectedController) return <div className="no-controllers">No hay controladores disponibles</div>;

  return (
    <div className="controller-manager">
      <div className="controller-header">
        <h2 className="controller-title">Manejador de Controladores</h2>
      </div>
      
      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}
      
      <div className="controller-selector">
        <label className="selector-label">Seleccionar Controlador:</label>
        <select
          className="controller-select"
          value={selectedController.id || ''}
          onChange={(e) => {
            const controller = controllers.find(c => c.id === e.target.value);
            setSelectedController(controller || null);
          }}
        >
          {controllers.map(controller => (
            <option key={controller.id} value={controller.id}>
              {controller.name}
            </option>
          ))}
        </select>
      </div>
      
      <div className="controller-details">
        <h3 className="controller-name">{selectedController.name}</h3>
        
        <div className="phases-container">
          {Array.from({ length: selectedController.phases }).map((_, index) => (
            <div key={`phase-${selectedController.id}-${index}`} className="phase-section">
              <h4 className="phase-title">Semáforo {index + 1}</h4>
              <div className="phase-actions">
                <button 
                  className="action-btn primary"
                  onClick={() => handleCommand(index + 1, 'change')}
                >
                  Cambiar a esta semáforo
                </button>
                <button 
                  className="action-btn secondary"
                  onClick={() => handleCommand(index + 1, 'increase_30')}
                >
                  Aumentar a 30%
                </button>
                <button 
                  className="action-btn secondary"
                  onClick={() => handleCommand(index + 1, 'increase_60')}
                >
                  Aumentar a 60%
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ControllerManager;
