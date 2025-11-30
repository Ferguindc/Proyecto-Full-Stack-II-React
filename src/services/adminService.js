// src/services/adminService.js
import { API_CONFIG } from '../config/api.js';
import { productoService } from './productoService.js';
import { categoriaService } from './categoriaService.js';
import { pedidoService } from './pedidoService.js';

// ===============================
// SERVICIO PARA PANEL DE ADMINISTRACIÓN
// ===============================

export const adminService = {
  // ===== GESTIÓN DE PRODUCTOS =====
  productos: {
    obtenerTodos: () => productoService.obtenerTodos(),
    obtenerPorId: (id) => productoService.obtenerPorId(id),
    crear: (data) => productoService.crear(data),
    actualizar: (id, data) => productoService.actualizar(id, data),
    eliminar: (id) => productoService.eliminar(id),
    buscar: (nombre) => productoService.buscarPorNombre(nombre)
  },

  // ===== GESTIÓN DE CATEGORÍAS =====
  categorias: {
    obtenerTodas: () => categoriaService.obtenerTodas(),
    obtenerPorId: (id) => categoriaService.obtenerPorId(id),
    crear: (data) => categoriaService.crear(data),
    actualizar: (id, data) => categoriaService.actualizar(id, data),
    eliminar: (id) => categoriaService.eliminar(id)
  },

  // ===== GESTIÓN DE PEDIDOS =====
  pedidos: {
    obtenerTodos: () => pedidoService.obtenerTodos(),
    obtenerPorId: (id) => pedidoService.obtenerPorId(id),
    obtenerPorEstado: (estado) => pedidoService.obtenerPorEstado(estado),
    actualizarEstado: (id, estado) => pedidoService.actualizarEstado(id, estado),
    eliminar: (id) => pedidoService.eliminar(id)
  },

  // ===== ESTADÍSTICAS GENERALES =====
  estadisticas: {
    obtenerResumen: async () => {
      try {
        const [productos, categorias, pedidos] = await Promise.all([
          productoService.obtenerTodos(),
          categoriaService.obtenerTodas(),
          pedidoService.obtenerTodos()
        ]);

        const pedidosPendientes = pedidos.filter(p => p.estado === 'pendiente').length;
        const pedidosCompletados = pedidos.filter(p => p.estado === 'entregado').length;
        
        const ventasTotal = pedidos
          .filter(p => p.estado !== 'cancelado')
          .reduce((total, pedido) => total + (pedido.total || 0), 0);

        return {
          totalProductos: productos.length,
          totalCategorias: categorias.length,
          totalPedidos: pedidos.length,
          pedidosPendientes,
          pedidosCompletados,
          ventasTotal,
          productos,
          categorias,
          pedidos
        };
      } catch (error) {
        console.error('Error obteniendo estadísticas:', error);
        throw error;
      }
    }
  }
};

export default adminService;