const API_BASE_URL = "http://localhost:3000"; // Actualizado para coincidir con el backend

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(errorData || `Request failed with status ${response.status}`);
  }
  return response.json();
};

export const fetchControllers = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/controllers`);
    return await handleResponse(response);
  } catch (error) {
    console.error("Error fetching controllers:", error);
    throw error;
  }
};

export const sendCommand = async (controllerId, phaseId, command) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/controllers/${controllerId}/command`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phaseId, command }),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error("Error sending command:", error);
    throw error;
  }
};

export const deleteController = async (controllerId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/controllers/${controllerId}`, {
      method: "DELETE",
    });
    return await handleResponse(response);
  } catch (error) {
    console.error("Error deleting controller:", error);
    throw error;
  }
};
