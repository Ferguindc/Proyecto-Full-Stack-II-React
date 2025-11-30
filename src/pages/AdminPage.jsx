// src/pages/AdminPage.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { adminService } from '../services/adminService.js';
import { productoService } from '../services/productoService.js';
import { categoriaService } from '../services/categoriaService.js';
import { pedidoService } from '../services/pedidoService.js';
import GestionEmpleadosPage from './GestionEmpleadosPage';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "../styles/styleadmin.css";


export default function AdminPage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate(); 
  
  // Estados para datos
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [estadisticas, setEstadisticas] = useState({});
  
  // Estados de UI
  const [activeTab, setActiveTab] = useState("dashboard");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  // Para aplicar la clase admin2 al body
  useEffect(() => {
    document.body.classList.add("admin2");
    return () => document.body.classList.remove("admin2");
  }, []);

  // Cargar datos iniciales
  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      setError("");
      
      const estadisticasData = await adminService.estadisticas.obtenerResumen();
      setEstadisticas(estadisticasData);
      setProductos(estadisticasData.productos);
      setCategorias(estadisticasData.categorias);
      setPedidos(estadisticasData.pedidos);
      
    } catch (error) {
      console.error('Error cargando datos admin:', error);
      setError('Error al cargar datos del panel de administración');
    } finally {
      setLoading(false);
    }
  };

  // Helper para cambiar de pestaña y limpiar el mensaje de éxito
  const cambiarTab = (tab) => {
    setActiveTab(tab);
    setMensaje(""); // Limpia el mensaje al cambiar de pestaña
  };

  // Función para eliminar producto
  const eliminarProducto = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      try {
        await productoService.eliminar(id);
        setMensaje('Producto eliminado correctamente');
        cargarDatos(); // Recargar datos
      } catch (error) {
        console.error('Error eliminando producto:', error);
        setError('Error al eliminar el producto');
      }
    }
  };

  // Función para actualizar estado de pedido
  const actualizarEstadoPedido = async (id, nuevoEstado) => {
    try {
      await pedidoService.actualizarEstado(id, nuevoEstado);
      setMensaje('Estado del pedido actualizado correctamente');
      cargarDatos(); // Recargar datos
    } catch (error) {
      console.error('Error actualizando estado:', error);
      setError('Error al actualizar el estado del pedido');
    }
  };

  // Formatear precio
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="d-flex vh-100">
      {/* Sidebar Modificada */}
      <div className="sidebar p-3 d-flex flex-column" style={{ width: "250px" }}>
        <h2 className="text-center mb-4">Admin</h2>
        <div className="nav flex-column nav-pills" role="tablist" aria-orientation="vertical">
          <button 
            className={`list-group-item mb-1 ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => cambiarTab('dashboard')}
          >
            <i className="bi bi-speedometer2 me-2"></i>
            Dashboard
          </button>
          <button 
            className={`list-group-item mb-1 ${activeTab === 'productos' ? 'active' : ''}`}
            onClick={() => cambiarTab('productos')}
          >
            <i className="bi bi-box me-2"></i>
            Productos
          </button>
          <button 
            className={`list-group-item mb-1 ${activeTab === 'categorias' ? 'active' : ''}`}
            onClick={() => cambiarTab('categorias')}
          >
            <i className="bi bi-tags me-2"></i>
            Categorías
          </button>
          <button 
            className={`list-group-item mb-1 ${activeTab === 'pedidos' ? 'active' : ''}`}
            onClick={() => cambiarTab('pedidos')}
          >
            <i className="bi bi-cart me-2"></i>
            Pedidos
          </button>
          <button 
            className={`list-group-item mb-1 ${activeTab === 'empleados' ? 'active' : ''}`}
            onClick={() => cambiarTab('empleados')}
          >
            <i className="bi bi-people me-2"></i>
            Empleados
          </button>
        </div>
        
        {/* Botón Cerrar Sesión al final */}
        <div className="mt-auto">
           <button 
            className="list-group-item w-100" 
            style={{ backgroundColor: '#dc3545', color: 'white', border: 'none' }}
            onClick={() => navigate("/sesion")} // Agrega aquí tu lógica de logout
          >
            Cerrar sesión
          </button>
        </div>
      </div>

      {/* Contenido principal con renderizado condicional */}
      <div className="main-content2 flex-grow-1 p-4 overflow-auto">
        
        {/* Loading State */}
        {loading && (
          <div className="text-center p-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
            <p className="mt-3">Cargando datos del panel...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="alert alert-danger">
            <h4>Error</h4>
            <p>{error}</p>
            <button className="btn btn-primary" onClick={cargarDatos}>
              Reintentar
            </button>
          </div>
        )}

        {/* Success Message */}
        {mensaje && (
          <div className="alert alert-success alert-dismissible fade show">
            {mensaje}
            <button 
              type="button" 
              className="btn-close" 
              onClick={() => setMensaje("")}
            ></button>
          </div>
        )}

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && !loading && (
          <div>
            <h1>Dashboard Administrativo</h1>
            <div className="row mt-4">
              <div className="col-md-3">
                <div className="card bg-primary text-white">
                  <div className="card-body">
                    <h5>Total Productos</h5>
                    <h2>{estadisticas.totalProductos || 0}</h2>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card bg-success text-white">
                  <div className="card-body">
                    <h5>Ventas Total</h5>
                    <h2>{formatPrice(estadisticas.ventasTotal || 0)}</h2>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card bg-warning text-white">
                  <div className="card-body">
                    <h5>Pedidos Pendientes</h5>
                    <h2>{estadisticas.pedidosPendientes || 0}</h2>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card bg-info text-white">
                  <div className="card-body">
                    <h5>Total Categorías</h5>
                    <h2>{estadisticas.totalCategorias || 0}</h2>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="row mt-4">
              <div className="col-md-6">
                <h4>Productos Recientes</h4>
                <div className="list-group">
                  {productos.slice(0, 5).map(producto => (
                    <div key={producto.id} className="list-group-item">
                      <strong>{producto.nombre}</strong>
                      <span className="float-end">{formatPrice(producto.precio)}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="col-md-6">
                <h4>Pedidos Recientes</h4>
                <div className="list-group">
                  {pedidos.slice(0, 5).map(pedido => (
                    <div key={pedido.id} className="list-group-item">
                      <strong>Pedido #{pedido.id}</strong>
                      <span className={`badge ms-2 ${
                        pedido.estado === 'pendiente' ? 'bg-warning' :
                        pedido.estado === 'entregado' ? 'bg-success' : 'bg-info'
                      }`}>
                        {pedido.estado}
                      </span>
                      <span className="float-end">{formatPrice(pedido.total)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Pestaña PRODUCTOS */}
        {activeTab === 'productos' && !loading && (
          <>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h1>Gestión de Productos</h1>
              <Link to="/admin/productos/nuevo" className="btn btn-success">
                <i className="bi bi-plus-circle me-2"></i>
                Nuevo Producto
              </Link>
            </div>
            
            {productos.length > 0 ? (
              <div className="table-responsive">
                <table className="table table-dark table-striped table-hover">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Imagen</th>
                      <th>Nombre</th>
                      <th>Precio</th>
                      <th>Stock</th>
                      <th>Categorías</th>
                      <th>Descripción</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productos.map((producto) => (
                      <tr key={producto.id}>
                        <td>{producto.id}</td>
                        <td>
                          <img 
                            src={producto.imagenUrl || '/placeholder.jpg'} 
                            className="img-thumbnail" 
                            style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                            alt={producto.nombre} 
                          />
                        </td>
                        <td>
                          <div className="fw-semibold">{producto.nombre}</div>
                        </td>
                        <td>
                          <span className="fw-semibold text-success">
                            {formatPrice(producto.precio)}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${producto.stock > 10 ? 'bg-success' : producto.stock > 0 ? 'bg-warning' : 'bg-danger'}`}>
                            {producto.stock || 0}
                          </span>
                        </td>
                        <td>
                          {producto.categorias?.map(cat => (
                            <span key={cat.id} className="badge bg-info me-1">
                              {cat.nombre}
                            </span>
                          ))}
                        </td>
                        <td>
                          <span className="text-truncate" style={{ maxWidth: '200px', display: 'inline-block' }}>
                            {producto.descripcion || 'Sin descripción'}
                          </span>
                        </td>
                        <td>
                          <div className="btn-group">
                            <Link 
                              to={`/admin/productos/editar/${producto.id}`} 
                              className="btn btn-sm btn-outline-primary"
                            >
                              <i className="bi bi-pencil"></i>
                            </Link>
                            <button 
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => eliminarProducto(producto.id)}
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center p-5">
                <h3>No hay productos registrados</h3>
                <Link to="/admin/productos/nuevo" className="btn btn-primary">
                  Crear primer producto
                </Link>
              </div>
            )}
          </>
        )}

        {/* Pestaña CATEGORÍAS */}
        {activeTab === 'categorias' && !loading && (
          <>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h1>Gestión de Categorías</h1>
              <button className="btn btn-success">
                <i className="bi bi-plus-circle me-2"></i>
                Nueva Categoría
              </button>
            </div>
            
            {categorias.length > 0 ? (
              <div className="table-responsive">
                <table className="table table-dark table-striped table-hover">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nombre</th>
                      <th>Productos Asociados</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categorias.map((categoria) => (
                      <tr key={categoria.id}>
                        <td>{categoria.id}</td>
                        <td>{categoria.nombre}</td>
                        <td>
                          <span className="badge bg-secondary">
                            {productos.filter(p => p.categorias?.some(c => c.id === categoria.id)).length} productos
                          </span>
                        </td>
                        <td>
                          <div className="btn-group">
                            <button className="btn btn-sm btn-outline-primary">
                              <i className="bi bi-pencil"></i>
                            </button>
                            <button className="btn btn-sm btn-outline-danger">
                              <i className="bi bi-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center p-5">
                <h3>No hay categorías registradas</h3>
                <button className="btn btn-primary">
                  Crear primera categoría
                </button>
              </div>
            )}
          </>
        )}

        {/* Pestaña PEDIDOS */}
        {activeTab === 'pedidos' && !loading && (
          <>
            <h1>Gestión de Pedidos</h1>
            
            {pedidos.length > 0 ? (
              <div className="table-responsive">
                <table className="table table-dark table-striped table-hover mt-3">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Cliente</th>
                      <th>Fecha</th>
                      <th>Total</th>
                      <th>Estado</th>
                      <th>Productos</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pedidos.map((pedido) => (
                      <tr key={pedido.id}>
                        <td>{pedido.id}</td>
                        <td>
                          <div>
                            <strong>{pedido.usuario?.nombre}</strong>
                            <br />
                            <small className="text-muted">{pedido.usuario?.email}</small>
                          </div>
                        </td>
                        <td>
                          {new Date(pedido.fecha).toLocaleDateString('es-CL')}
                        </td>
                        <td>
                          <span className="fw-semibold text-success">
                            {formatPrice(pedido.total)}
                          </span>
                        </td>
                        <td>
                          <select 
                            className={`form-select form-select-sm ${
                              pedido.estado === 'pendiente' ? 'bg-warning' :
                              pedido.estado === 'entregado' ? 'bg-success' : 'bg-info'
                            }`}
                            value={pedido.estado}
                            onChange={(e) => actualizarEstadoPedido(pedido.id, e.target.value)}
                          >
                            <option value="pendiente">Pendiente</option>
                            <option value="pagado">Pagado</option>
                            <option value="enviado">Enviado</option>
                            <option value="entregado">Entregado</option>
                            <option value="cancelado">Cancelado</option>
                          </select>
                        </td>
                        <td>
                          <span className="badge bg-secondary">
                            {pedido.detalles?.length || 0} productos
                          </span>
                        </td>
                        <td>
                          <div className="btn-group">
                            <button className="btn btn-sm btn-outline-info" title="Ver detalles">
                              <i className="bi bi-eye"></i>
                            </button>
                            <button 
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => {
                                if (window.confirm('¿Eliminar este pedido?')) {
                                  pedidoService.eliminar(pedido.id).then(() => {
                                    setMensaje('Pedido eliminado correctamente');
                                    cargarDatos();
                                  });
                                }
                              }}
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center p-5">
                <h3>No hay pedidos registrados</h3>
              </div>
            )}
          </>
        )}

        {/* Pestaña EMPLEADOS */}
        {activeTab === 'empleados' && (
          <GestionEmpleadosPage />
        )}
      </div>
    </div>
  );
}
