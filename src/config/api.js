// src/config/api.js

// ===============================
// CONFIGURACIÓN PRINCIPAL DE LA API
// ===============================
export const API_CONFIG = {
  // URL base REAL de tu API Spring Boot
  BASE_URL: 'http://18.224.96.229:8082/api',
  
  // Modo de desarrollo sin servidor (cambiar a false cuando el servidor esté listo)
  DEV_MODE: false,

  // ===============================
  // ENDPOINTS REALES SEGÚN TU BACKEND
  // ===============================
  ENDPOINTS: {
    
    // ===== USUARIOS =====
    USUARIOS: {
      BASE: '/usuarios',                   // GET - POST
      BY_ID: '/usuarios/:id',              // GET - PUT - DELETE
      BY_EMAIL: '/usuarios/email/:email', // GET
      CREATE: '/usuarios',                 // POST
      UPDATE: '/usuarios/:id',             // PUT
      DELETE: '/usuarios/:id',             // DELETE
    },

    // ===== PRODUCTOS =====
    PRODUCTOS: {
      BASE: '/productos',                       
      BY_ID: '/productos/:id',
      BY_CATEGORIA: '/productos/categoria/:categoria',
      CREATE: '/productos',
      UPDATE: '/productos/:id',
      DELETE: '/productos/:id',
    },

    // ===== CATEGORIAS =====
    CATEGORIAS: {
      BASE: '/categorias',
      BY_ID: '/categorias/:id',
      CREATE: '/categorias',
      UPDATE: '/categorias/:id',
      DELETE: '/categorias/:id',
    },

    // ===== PEDIDOS =====
    PEDIDOS: {
      BASE: '/pedidos',
      BY_ID: '/pedidos/:id',
      BY_USUARIO: '/pedidos/usuario/:usuarioId',
      CREATE: '/pedidos',
      UPDATE: '/pedidos/:id',
      DELETE: '/pedidos/:id',
    }
  },

  // Timeout general
  TIMEOUT: 10000,

  // Headers por defecto
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
};

// ===============================
// HELPERS
// ===============================
export const buildApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

export const replaceUrlParams = (url, params) => {
  let newUrl = url;
  Object.keys(params).forEach(key => {
    newUrl = newUrl.replace(`:${key}`, params[key]);
  });
  return newUrl;
};

export const setApiBaseUrl = (newBaseUrl) => {
  API_CONFIG.BASE_URL = newBaseUrl;
};

export default API_CONFIG;
