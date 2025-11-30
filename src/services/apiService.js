// src/services/apiService.js

import { API_CONFIG, buildApiUrl, replaceUrlParams } from '../config/api';

// Configuración por defecto para las peticiones
const defaultOptions = {
  headers: API_CONFIG.DEFAULT_HEADERS,
};

// Función helper para manejar respuestas
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || `Error ${response.status}: ${response.statusText}`);
  }
  
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  }
  return response.text();
};

// Servicios de Usuario (/api/usuarios) - Basado en tu UsuarioController
export const usuarioService = {
  // Registrar/Crear nuevo usuario (usa el endpoint POST /usuarios)
  register: async (userData) => {
    try {
      const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.USUARIOS.CREATE), {
        ...defaultOptions,
        method: 'POST',
        body: JSON.stringify(userData),
      });
      
      return await handleResponse(response);
    } catch (error) {
      console.error('Error en registro:', error);
      throw error;
    }
  },

  // Login - Buscar usuario por email y validar password (simulado)
  login: async (email, password) => {
    try {
      // Primero buscamos el usuario por email
      const url = replaceUrlParams(buildApiUrl(API_CONFIG.ENDPOINTS.USUARIOS.BY_EMAIL), { email });
      const response = await fetch(url, {
        ...defaultOptions,
        method: 'GET',
      });
      
      if (response.status === 404) {
        throw new Error('Usuario no encontrado');
      }
      
      const usuario = await handleResponse(response);
      
      // Aquí deberías implementar la validación de password en tu backend
      // Por ahora simulamos la validación
      if (usuario && usuario.password === password) {
        // Simular token JWT (en producción tu backend debería generar uno real)
        const token = btoa(JSON.stringify({ id: usuario.id, email: usuario.email }));
        return {
          token,
          user: {
            id: usuario.id,
            email: usuario.email,
            nombre: usuario.nombre,
            role: usuario.role || 'cliente'
          }
        };
      } else {
        throw new Error('Credenciales incorrectas');
      }
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  },

  // Obtener todos los usuarios (GET /usuarios)
  getAll: async () => {
    try {
      const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.USUARIOS.BASE), {
        ...defaultOptions,
        method: 'GET',
      });
      
      return await handleResponse(response);
    } catch (error) {
      console.error('Error obteniendo usuarios:', error);
      throw error;
    }
  },

  // Obtener usuario por ID (GET /usuarios/:id)
  getById: async (userId) => {
    try {
      const url = replaceUrlParams(buildApiUrl(API_CONFIG.ENDPOINTS.USUARIOS.BY_ID), { id: userId });
      const response = await fetch(url, {
        ...defaultOptions,
        method: 'GET',
      });
      
      return await handleResponse(response);
    } catch (error) {
      console.error('Error obteniendo usuario:', error);
      throw error;
    }
  },

  // Obtener usuario por email (GET /usuarios/email/:email)
  getByEmail: async (email) => {
    try {
      const url = replaceUrlParams(buildApiUrl(API_CONFIG.ENDPOINTS.USUARIOS.BY_EMAIL), { email });
      const response = await fetch(url, {
        ...defaultOptions,
        method: 'GET',
      });
      
      return await handleResponse(response);
    } catch (error) {
      console.error('Error obteniendo usuario por email:', error);
      throw error;
    }
  },

  // Actualizar usuario (PUT /usuarios/:id)
  update: async (userId, userData) => {
    try {
      const url = replaceUrlParams(buildApiUrl(API_CONFIG.ENDPOINTS.USUARIOS.UPDATE), { id: userId });
      const response = await fetch(url, {
        ...defaultOptions,
        method: 'PUT',
        body: JSON.stringify(userData),
      });
      
      return await handleResponse(response);
    } catch (error) {
      console.error('Error actualizando usuario:', error);
      throw error;
    }
  },

  // Eliminar usuario (DELETE /usuarios/:id)
  delete: async (userId) => {
    try {
      const url = replaceUrlParams(buildApiUrl(API_CONFIG.ENDPOINTS.USUARIOS.DELETE), { id: userId });
      const response = await fetch(url, {
        ...defaultOptions,
        method: 'DELETE',
      });
      
      return await handleResponse(response);
    } catch (error) {
      console.error('Error eliminando usuario:', error);
      throw error;
    }
  },

  // Verificar token (simulado - tu API no tiene este endpoint)
  verifyToken: async (token) => {
    try {
      // Como tu API no tiene endpoint de verify, simulamos la verificación
      // decodificando el token que creamos en login
      const decoded = JSON.parse(atob(token));
      return {
        valid: true,
        user: decoded
      };
    } catch (error) {
      console.error('Error verificando token:', error);
      return { valid: false };
    }
  },
};

// Servicios de Productos (/api/productos)
export const productoService = {
  // Obtener todos los productos
  getAll: async () => {
    try {
      const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.PRODUCTOS.BASE), {
        ...defaultOptions,
        method: 'GET',
      });
      
      return await handleResponse(response);
    } catch (error) {
      console.error('Error obteniendo productos:', error);
      throw error;
    }
  },

  // Obtener producto por ID
  getById: async (productId) => {
    try {
      const url = replaceUrlParams(buildApiUrl(API_CONFIG.ENDPOINTS.PRODUCTOS.BY_ID), { id: productId });
      const response = await fetch(url, {
        ...defaultOptions,
        method: 'GET',
      });
      
      return await handleResponse(response);
    } catch (error) {
      console.error('Error obteniendo producto:', error);
      throw error;
    }
  },

  // Obtener productos por categoría
  getByCategoria: async (categoria) => {
    try {
      const url = replaceUrlParams(buildApiUrl(API_CONFIG.ENDPOINTS.PRODUCTOS.BY_CATEGORIA), { categoria });
      const response = await fetch(url, {
        ...defaultOptions,
        method: 'GET',
      });
      
      return await handleResponse(response);
    } catch (error) {
      console.error('Error obteniendo productos por categoría:', error);
      throw error;
    }
  },

  // Crear producto (admin/empleado)
  create: async (productData, token) => {
    try {
      const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.PRODUCTOS.CREATE), {
        ...defaultOptions,
        method: 'POST',
        headers: {
          ...defaultOptions.headers,
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(productData),
      });
      
      return await handleResponse(response);
    } catch (error) {
      console.error('Error creando producto:', error);
      throw error;
    }
  },

  // Actualizar producto
  update: async (productId, productData, token) => {
    try {
      const url = replaceUrlParams(buildApiUrl(API_CONFIG.ENDPOINTS.PRODUCTOS.UPDATE), { id: productId });
      const response = await fetch(url, {
        ...defaultOptions,
        method: 'PUT',
        headers: {
          ...defaultOptions.headers,
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(productData),
      });
      
      return await handleResponse(response);
    } catch (error) {
      console.error('Error actualizando producto:', error);
      throw error;
    }
  },

  // Eliminar producto
  delete: async (productId, token) => {
    try {
      const url = replaceUrlParams(buildApiUrl(API_CONFIG.ENDPOINTS.PRODUCTOS.DELETE), { id: productId });
      const response = await fetch(url, {
        ...defaultOptions,
        method: 'DELETE',
        headers: {
          ...defaultOptions.headers,
          'Authorization': `Bearer ${token}`,
        },
      });
      
      return await handleResponse(response);
    } catch (error) {
      console.error('Error eliminando producto:', error);
      throw error;
    }
  },
};

// Servicios de Categorías (/api/categorias)
export const categoriaService = {
  // Obtener todas las categorías
  getAll: async () => {
    try {
      const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.CATEGORIAS.BASE), {
        ...defaultOptions,
        method: 'GET',
      });
      
      return await handleResponse(response);
    } catch (error) {
      console.error('Error obteniendo categorías:', error);
      throw error;
    }
  },

  // Obtener categoría por ID
  getById: async (categoriaId) => {
    try {
      const url = replaceUrlParams(buildApiUrl(API_CONFIG.ENDPOINTS.CATEGORIAS.BY_ID), { id: categoriaId });
      const response = await fetch(url, {
        ...defaultOptions,
        method: 'GET',
      });
      
      return await handleResponse(response);
    } catch (error) {
      console.error('Error obteniendo categoría:', error);
      throw error;
    }
  },

  // Crear categoría (admin)
  create: async (categoriaData, token) => {
    try {
      const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.CATEGORIAS.CREATE), {
        ...defaultOptions,
        method: 'POST',
        headers: {
          ...defaultOptions.headers,
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(categoriaData),
      });
      
      return await handleResponse(response);
    } catch (error) {
      console.error('Error creando categoría:', error);
      throw error;
    }
  },

  // Actualizar categoría
  update: async (categoriaId, categoriaData, token) => {
    try {
      const url = replaceUrlParams(buildApiUrl(API_CONFIG.ENDPOINTS.CATEGORIAS.UPDATE), { id: categoriaId });
      const response = await fetch(url, {
        ...defaultOptions,
        method: 'PUT',
        headers: {
          ...defaultOptions.headers,
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(categoriaData),
      });
      
      return await handleResponse(response);
    } catch (error) {
      console.error('Error actualizando categoría:', error);
      throw error;
    }
  },

  // Eliminar categoría
  delete: async (categoriaId, token) => {
    try {
      const url = replaceUrlParams(buildApiUrl(API_CONFIG.ENDPOINTS.CATEGORIAS.DELETE), { id: categoriaId });
      const response = await fetch(url, {
        ...defaultOptions,
        method: 'DELETE',
        headers: {
          ...defaultOptions.headers,
          'Authorization': `Bearer ${token}`,
        },
      });
      
      return await handleResponse(response);
    } catch (error) {
      console.error('Error eliminando categoría:', error);
      throw error;
    }
  },
};

// Servicios de Pedidos (/api/pedidos)
export const pedidoService = {
  // Obtener todos los pedidos (admin)
  getAll: async (token) => {
    try {
      const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.PEDIDOS.BASE), {
        ...defaultOptions,
        method: 'GET',
        headers: {
          ...defaultOptions.headers,
          'Authorization': `Bearer ${token}`,
        },
      });
      
      return await handleResponse(response);
    } catch (error) {
      console.error('Error obteniendo pedidos:', error);
      throw error;
    }
  },

  // Obtener pedido por ID
  getById: async (pedidoId, token) => {
    try {
      const url = replaceUrlParams(buildApiUrl(API_CONFIG.ENDPOINTS.PEDIDOS.BY_ID), { id: pedidoId });
      const response = await fetch(url, {
        ...defaultOptions,
        method: 'GET',
        headers: {
          ...defaultOptions.headers,
          'Authorization': `Bearer ${token}`,
        },
      });
      
      return await handleResponse(response);
    } catch (error) {
      console.error('Error obteniendo pedido:', error);
      throw error;
    }
  },

  // Obtener pedidos por usuario
  getByUsuario: async (usuarioId, token) => {
    try {
      const url = replaceUrlParams(buildApiUrl(API_CONFIG.ENDPOINTS.PEDIDOS.BY_USUARIO), { usuarioId });
      const response = await fetch(url, {
        ...defaultOptions,
        method: 'GET',
        headers: {
          ...defaultOptions.headers,
          'Authorization': `Bearer ${token}`,
        },
      });
      
      return await handleResponse(response);
    } catch (error) {
      console.error('Error obteniendo pedidos del usuario:', error);
      throw error;
    }
  },

  // Crear pedido
  create: async (pedidoData, token) => {
    try {
      const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.PEDIDOS.CREATE), {
        ...defaultOptions,
        method: 'POST',
        headers: {
          ...defaultOptions.headers,
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(pedidoData),
      });
      
      return await handleResponse(response);
    } catch (error) {
      console.error('Error creando pedido:', error);
      throw error;
    }
  },

  // Actualizar pedido
  update: async (pedidoId, pedidoData, token) => {
    try {
      const url = replaceUrlParams(buildApiUrl(API_CONFIG.ENDPOINTS.PEDIDOS.UPDATE), { id: pedidoId });
      const response = await fetch(url, {
        ...defaultOptions,
        method: 'PUT',
        headers: {
          ...defaultOptions.headers,
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(pedidoData),
      });
      
      return await handleResponse(response);
    } catch (error) {
      console.error('Error actualizando pedido:', error);
      throw error;
    }
  },

  // Eliminar pedido
  delete: async (pedidoId, token) => {
    try {
      const url = replaceUrlParams(buildApiUrl(API_CONFIG.ENDPOINTS.PEDIDOS.DELETE), { id: pedidoId });
      const response = await fetch(url, {
        ...defaultOptions,
        method: 'DELETE',
        headers: {
          ...defaultOptions.headers,
          'Authorization': `Bearer ${token}`,
        },
      });
      
      return await handleResponse(response);
    } catch (error) {
      console.error('Error eliminando pedido:', error);
      throw error;
    }
  },
};

export default {
  usuarioService,
  productoService,
  categoriaService,
  pedidoService,
};