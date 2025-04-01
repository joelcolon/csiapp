// src/services/authService.js

// Función para registrar usuario
export const registerUser = async (name, email, idNumber, password, role) => {
  try {
    const response = await fetch('http://localhost:3000/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, idNumber, password, role }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error de registro');
    }

    return await response.json();
  } catch (error) {
    console.error('Error en authService al registrar usuario:', error);
    throw error;
  }
};

// Función para login
export const login = async (email, password) => {
  try {
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error de autenticación');
    }

    const data = await response.json();

    // Guardar el usuario en localStorage
    localStorage.setItem('user', JSON.stringify(data.user));

    return data;
  } catch (error) {
    console.error('Error en authService:', error);
    throw error;
  }
};

// Función para obtener el usuario actual
export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};
