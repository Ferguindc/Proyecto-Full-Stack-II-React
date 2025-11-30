// src/services/index.js

// ===============================
// ÍNDICE PRINCIPAL DE SERVICIOS
// ===============================

// Servicios principales
export { usuarioService } from './usuarioService.js';
export { productoService } from './productoService.js';
export { categoriaService } from './categoriaService.js';
export { pedidoService } from './pedidoService.js';

// Servicios de administración
export { adminService } from './adminService.js';

// Exportaciones por defecto para compatibilidad
export { default as usuarioService_default } from './usuarioService.js';
export { default as productoService_default } from './productoService.js';
export { default as categoriaService_default } from './categoriaService.js';
export { default as pedidoService_default } from './pedidoService.js';
export { default as adminService_default } from './adminService.js';

// Configuración API
export { API_CONFIG } from '../config/api.js';