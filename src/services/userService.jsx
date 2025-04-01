// services/userService.js
export const fetchUsers = async () => {
    const response = await fetch('/api/users');
    if (!response.ok) throw new Error('Error al cargar usuarios');
    return response.json();
  };
  
  export const deleteUser = async (userId) => {
    const response = await fetch(`/api/users/${userId}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) throw new Error('Error al eliminar usuario');
    return response.json();
  };
  
  export const toggleUserStatus = async (userId) => {
    const response = await fetch(`/api/users/${userId}/toggle-status`, {
      method: 'PUT',
    });
    
    if (!response.ok) throw new Error('Error al cambiar estado del usuario');
    return response.json();
  };