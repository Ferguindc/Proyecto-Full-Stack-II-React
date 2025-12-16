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
    console.log('📦 Creando pedido con datos:', JSON.stringify(pedidoData, null, 2));
    
    // SIEMPRE guardar localmente primero para asegurar que no se pierdan datos
    const nuevoPedido = {
      id: Date.now(),
      ...pedidoData,
      estado: pedidoData.estado || 'PENDIENTE',
      fechaCreacion: new Date().toISOString(),
      fechaPedido: new Date().toISOString(),
      fecha: new Date().toISOString(),
      numeroOrden: `ORD-${Date.now()}`
    };
    
    // Guardar en localStorage SIEMPRE
    const pedidos = JSON.parse(localStorage.getItem('pedidos_dev') || '[]');
    pedidos.push(nuevoPedido);
    localStorage.setItem('pedidos_dev', JSON.stringify(pedidos));
    console.log('✅ Pedido guardado localmente:', nuevoPedido);
    console.log('📊 Total de pedidos locales:', pedidos.length);
    
    // Modo de desarrollo - devolver el pedido local
    if (API_CONFIG.DEV_MODE) {
      console.log('🔧 MODO DESARROLLO - Usando pedido local');
      return nuevoPedido;
    }
    
    // Intentar enviar a la API pero no fallar si no funciona
    try {
      const result = await fetchAPI('', {
        method: 'POST',
        body: JSON.stringify(pedidoData)
      });
      console.log('✅ Pedido también creado en API:', result);
      // Retornar el local que ya tiene toda la info
      return nuevoPedido;
    } catch (error) {
      console.warn('⚠️ API no disponible, pero el pedido está guardado localmente:', error.message);
      // Devolver el pedido local que ya guardamos
      return nuevoPedido;
    }
  },

  // PATCH /api/pedidos/{id}/estado - Actualizar estado del pedido
  actualizarEstado: async (id, nuevoEstado) => {
    // Actualizar en localStorage primero
    try {
      const pedidos = JSON.parse(localStorage.getItem('pedidos_dev') || '[]');
      const index = pedidos.findIndex(p => p.id === id);
      if (index !== -1) {
        pedidos[index].estado = nuevoEstado;
        localStorage.setItem('pedidos_dev', JSON.stringify(pedidos));
        console.log(`✅ Estado del pedido #${id} actualizado localmente a: ${nuevoEstado}`);
      }
    } catch (error) {
      console.error('Error actualizando estado local:', error);
    }
    
    // Intentar actualizar en API si está disponible
    if (!API_CONFIG.DEV_MODE) {
      try {
        return await fetchAPI(`/${id}/estado`, {
          method: 'PATCH',
          body: JSON.stringify({ estado: nuevoEstado })
        });
      } catch (error) {
        console.warn('⚠️ No se pudo actualizar en API, pero el cambio está guardado localmente');
        return { success: true, message: 'Actualizado localmente' };
      }
    }
    return { success: true, message: 'Actualizado localmente' };
  },

  // DELETE /api/pedidos/{id} - Eliminar pedido
  eliminar: async (id) => {
    // Eliminar de localStorage primero
    try {
      const pedidos = JSON.parse(localStorage.getItem('pedidos_dev') || '[]');
      const pedidosFiltrados = pedidos.filter(p => p.id !== id);
      localStorage.setItem('pedidos_dev', JSON.stringify(pedidosFiltrados));
      console.log(`✅ Pedido #${id} eliminado localmente`);
    } catch (error) {
      console.error('Error eliminando pedido local:', error);
    }
    
    // Intentar eliminar en API si está disponible
    if (!API_CONFIG.DEV_MODE) {
      try {
        return await fetchAPI(`/${id}`, {
          method: 'DELETE'
        });
      } catch (error) {
        console.warn('⚠️ No se pudo eliminar en API, pero el pedido fue eliminado localmente');
        return { success: true, message: 'Eliminado localmente' };
      }
    }
    return { success: true, message: 'Eliminado localmente' };
  }
};

export default pedidoService;