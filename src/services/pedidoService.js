// src/services/pedidoService.js
import { API_CONFIG } from '../config/api.js';

// ===============================
// SERVICIO PARA GESTIÓN DE PEDIDOS
// ===============================

const BASE_URL = `${API_CONFIG.BASE_URL}/pedidos`;

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
    console.log(`📦 Pedidos API: ${config.method || 'GET'} ${url}`);
    
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
    
  } catch (error) {
    console.error(`❌ Error en pedidos API:`, error);
    throw error;
  }
}

export const pedidoService = {
  // GET /api/pedidos - Obtener todos los pedidos
  obtenerTodos: async () => {
    return await fetchAPI('');
  },

  // GET /api/pedidos/{id} - Obtener pedido por ID
  obtenerPorId: async (id) => {
    return await fetchAPI(`/${id}`);
  },

  // GET /api/pedidos/usuario/{usuarioId} - Pedidos de un usuario específico
  obtenerPorUsuario: async (usuarioId) => {
    return await fetchAPI(`/usuario/${usuarioId}`);
  },

  // GET /api/pedidos/estado/{estado} - Pedidos por estado
  obtenerPorEstado: async (estado) => {
    return await fetchAPI(`/estado/${estado}`);
  },

  // POST /api/pedidos - Crear nuevo pedido
  crear: async (pedidoData) => {
    return await fetchAPI('', {
      method: 'POST',
      body: JSON.stringify(pedidoData)
    });
  },

  // PATCH /api/pedidos/{id}/estado - Actualizar estado del pedido
  actualizarEstado: async (id, nuevoEstado) => {
    return await fetchAPI(`/${id}/estado`, {
      method: 'PATCH',
      body: JSON.stringify({ estado: nuevoEstado })
    });
  },

  // DELETE /api/pedidos/{id} - Eliminar pedido
  eliminar: async (id) => {
    return await fetchAPI(`/${id}`, {
      method: 'DELETE'
    });
  }
};

export default pedidoService;