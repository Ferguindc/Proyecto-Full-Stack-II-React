// src/services/categoriaService.js
import { API_CONFIG } from '../config/api.js';

// ===============================
// SERVICIO PARA GESTIÓN DE CATEGORÍAS
// ===============================

const BASE_URL = `${API_CONFIG.BASE_URL}/categorias`;

// Función helper para peticiones
async function fetchAPI(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    console.log(`🏷️ Categorías API: ${config.method || 'GET'} ${url}`);
    
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
    
  } catch (error) {
    console.error(`❌ Error en categorías API:`, error);
    throw error;
  }
}

export const categoriaService = {
  // GET /api/categorias - Obtener todas las categorías
  obtenerTodas: async () => {
    return await fetchAPI('');
  },

  // GET /api/categorias/{id} - Obtener categoría por ID
  obtenerPorId: async (id) => {
    return await fetchAPI(`/${id}`);
  },

  // POST /api/categorias - Crear nueva categoría
  crear: async (categoriaData) => {
    return await fetchAPI('', {
      method: 'POST',
      body: JSON.stringify(categoriaData)
    });
  },

  // PUT /api/categorias/{id} - Actualizar categoría
  actualizar: async (id, categoriaData) => {
    return await fetchAPI(`/${id}`, {
      method: 'PUT',
      body: JSON.stringify(categoriaData)
    });
  },

  // DELETE /api/categorias/{id} - Eliminar categoría
  eliminar: async (id) => {
    return await fetchAPI(`/${id}`, {
      method: 'DELETE'
    });
  }
};

export default categoriaService;