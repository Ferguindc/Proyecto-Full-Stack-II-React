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
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorData = await response.text();
        console.error('❌ Error response from server:', errorData);
        errorMessage += ` - ${errorData}`;
      } catch (e) {
        console.error('❌ Could not read error response');
      }
      throw new Error(errorMessage);
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
    // Modo de desarrollo - usar localStorage
    if (API_CONFIG.DEV_MODE) {
      console.log('🔧 MODO DESARROLLO - Obteniendo pedidos del usuario:', usuarioId);
      const pedidos = JSON.parse(localStorage.getItem('pedidos_dev') || '[]');
      const pedidosUsuario = pedidos.filter(p => p.usuarioId === usuarioId || p.usuarioId === parseInt(usuarioId));
      console.log('📦 Pedidos encontrados para usuario:', pedidosUsuario);
      return pedidosUsuario;
    }
    
    try {
      return await fetchAPI(`/usuario/${usuarioId}`);
    } catch (error) {
      console.error('❌ Error obteniendo pedidos del usuario, usando fallback');
      const pedidos = JSON.parse(localStorage.getItem('pedidos_dev') || '[]');
      return pedidos.filter(p => p.usuarioId === usuarioId || p.usuarioId === parseInt(usuarioId));
    }
  },

  // GET /api/pedidos/estado/{estado} - Pedidos por estado
  obtenerPorEstado: async (estado) => {
    return await fetchAPI(`/estado/${estado}`);
  },

  // POST /api/pedidos - Crear nuevo pedido
  crear: async (pedidoData) => {
    console.log('📦 Enviando pedido al servidor:', JSON.stringify(pedidoData, null, 2));
    
    // Modo de desarrollo - usar localStorage
    if (API_CONFIG.DEV_MODE) {
      console.log('🔧 MODO DESARROLLO - Simulando creación de pedido');
      
      // Simular pedido exitoso
      const nuevoPedido = {
        id: Date.now(),
        ...pedidoData,
        estado: 'PENDIENTE',
        fechaCreacion: new Date().toISOString(),
        numeroOrden: `ORD-${Date.now()}`
      };
      
      // Guardar en localStorage para historial
      const pedidos = JSON.parse(localStorage.getItem('pedidos_dev') || '[]');
      pedidos.push(nuevoPedido);
      localStorage.setItem('pedidos_dev', JSON.stringify(pedidos));
      
      console.log('✅ Pedido simulado creado:', nuevoPedido);
      return nuevoPedido;
    }
    
    try {
      const result = await fetchAPI('', {
        method: 'POST',
        body: JSON.stringify(pedidoData)
      });
      console.log('✅ Pedido creado exitosamente:', result);
      return result;
    } catch (error) {
      console.error('❌ Error detallado al crear pedido:', error);
      
      // Si falla la API, usar modo desarrollo como fallback
      console.log('🔄 Fallback a modo desarrollo por error en API');
      const nuevoPedido = {
        id: Date.now(),
        ...pedidoData,
        estado: 'PENDIENTE',
        fechaCreacion: new Date().toISOString(),
        numeroOrden: `ORD-${Date.now()}`
      };
      
      const pedidos = JSON.parse(localStorage.getItem('pedidos_dev') || '[]');
      pedidos.push(nuevoPedido);
      localStorage.setItem('pedidos_dev', JSON.stringify(pedidos));
      
      console.log('✅ Pedido creado en fallback:', nuevoPedido);
      return nuevoPedido;
    }
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