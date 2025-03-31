// services/controllerService.jsx

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(errorData || 'Request failed');
  }
  return response.json();
};

export const fetchControllers = async () => {
  const response = await fetch('/api/controllers');
  return handleResponse(response);
};

export const sendCommand = async (controllerId, phaseId, command) => {
  const response = await fetch(`/api/controllers/${controllerId}/command`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phaseId, command }),
  });
  return handleResponse(response);
};

export const deleteController = async (controllerId) => {
  const response = await fetch(`/api/controllers/${controllerId}`, {
    method: 'DELETE',
  });
  return handleResponse(response);
};
