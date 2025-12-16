// src/services/productoService.js
import { API_CONFIG } from '../config/api.js';

// ===============================
// SERVICIO PARA GESTIÓN DE PRODUCTOS
// ===============================

const BASE_URL = `${API_CONFIG.BASE_URL}/productos`;

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
    console.log(`🛍️ Productos API: ${config.method || 'GET'} ${url}`);
    
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
    
  } catch (error) {
    console.error(`❌ Error en productos API:`, error);
    throw error;
  }
}

export const productoService = {
  // GET /api/productos - Obtener todos los productos
  obtenerTodos: async () => {
    const productos = await fetchAPI('');
    // Agregar imágenes locales desde localStorage
    return productos.map(producto => {
      const imagenLocal = localStorage.getItem(`producto_${producto.id}_imagen`);
      if (imagenLocal && !producto.imagenUrl) {
        return { ...producto, imagenUrl: imagenLocal };
      }
      return producto;
    });
  },

  // GET /api/productos/{id} - Obtener producto por ID
  obtenerPorId: async (id) => {
    const producto = await fetchAPI(`/${id}`);
    // Agregar imagen local desde localStorage si no tiene URL
    const imagenLocal = localStorage.getItem(`producto_${id}_imagen`);
    if (imagenLocal && !producto.imagenUrl) {
      return { ...producto, imagenUrl: imagenLocal };
    }
    return producto;
  },

  // GET /api/productos/buscar?nombre={nombre} - Buscar productos por nombre
  buscarPorNombre: async (nombre) => {
    return await fetchAPI(`/buscar?nombre=${encodeURIComponent(nombre)}`);
  },

  // GET /api/productos/categoria/{categoriaId} - Productos por categoría
  obtenerPorCategoria: async (categoriaId) => {
    const productos = await fetchAPI(`/categoria/${categoriaId}`);
    // Agregar imágenes locales desde localStorage
    return productos.map(producto => {
      const imagenLocal = localStorage.getItem(`producto_${producto.id}_imagen`);
      if (imagenLocal && !producto.imagenUrl) {
        return { ...producto, imagenUrl: imagenLocal };
      }
      return producto;
    });
  },

  // POST /api/productos - Crear nuevo producto
  crear: async (productoData) => {
    return await fetchAPI('', {
      method: 'POST',
      body: JSON.stringify(productoData)
    });
  },

  // PUT /api/productos/{id} - Actualizar producto
  actualizar: async (id, productoData) => {
    return await fetchAPI(`/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productoData)
    });
  },

  // POST /api/productos/{productoId}/categorias - Agregar categorías al producto
  agregarCategorias: async (productoId, categoriaIds) => {
    return await fetchAPI(`/${productoId}/categorias`, {
      method: 'POST',
      body: JSON.stringify(categoriaIds)
    });
  },

  // DELETE /api/productos/{id} - Eliminar producto
  eliminar: async (id) => {
    return await fetchAPI(`/${id}`, {
      method: 'DELETE'
    });
  }
};

export default productoService;