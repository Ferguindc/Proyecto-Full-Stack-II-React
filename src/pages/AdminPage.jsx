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
  const [pedidoExpandido, setPedidoExpandido] = useState(null);

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
      console.log('📊 Datos de admin cargados:', estadisticasData);
      console.log('🛒 Pedidos recibidos:', estadisticasData.pedidos);
      
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
        console.log('🗑️ Eliminando producto con ID:', id);
        
        // Verificar que el producto existe en la lista local primero
        const productoExiste = productos.find(p => p.id === id);
        if (!productoExiste) {
          setError('El producto ya no existe en la lista. Recargando datos...');
          cargarDatos();
          return;
        }
        
        await productoService.eliminar(id);
        setError(''); // Limpiar errores previos
        setMensaje('✅ Producto eliminado correctamente');
        
        // Actualizar la lista de productos inmediatamente
        setProductos(prev => prev.filter(p => p.id !== id));
        
        // Limpiar mensaje de éxito después de 3 segundos
        setTimeout(() => {
          setMensaje('');
        }, 3000);
        
        // Recargar datos para asegurar sincronización
        setTimeout(() => {
          cargarDatos();
        }, 1000);
        
      } catch (error) {
        console.error('❌ Error eliminando producto:', error);
        
        // Manejo específico de errores
        if (error.message.includes('404')) {
          setError('El producto ya fue eliminado o no existe. Actualizando lista...');
          // Si el producto no existe en el servidor, quitarlo de la lista local
          setProductos(prev => prev.filter(p => p.id !== id));
          setTimeout(() => {
            cargarDatos();
          }, 500);
        } else if (error.message.includes('500')) {
          setError('Error interno del servidor. Intenta nuevamente en unos segundos.');
        } else if (error.message.includes('network') || error.message.includes('fetch')) {
          setError('Error de conexión. Verifica tu conexión a internet.');
        } else {
          const errorMessage = error.message || 'Error desconocido al eliminar el producto';
          setError(`Error al eliminar el producto: ${errorMessage}`);
        }
        
        setMensaje(''); // Limpiar mensajes de éxito previos
        
        // En caso de error, recargar datos para sincronizar
        setTimeout(() => {
          cargarDatos();
        }, 2000);
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
          {/* <button 
            className={`list-group-item mb-1 ${activeTab === 'empleados' ? 'active' : ''}`}
            onClick={() => cambiarTab('empleados')}
          >
            <i className="bi bi-people me-2"></i>
            Empleados
          </button> */}
          
          <hr className="my-2 text-light" />
          
          <button 
            className="list-group-item mb-1"
            onClick={() => navigate('/admin/utilidades')}
            style={{ backgroundColor: '#28a745', color: 'white', border: 'none' }}
          >
            <i className="bi bi-tools me-2"></i>
            Utilidades
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
              <div className="btn-group">
                <button 
                  onClick={cargarDatos} 
                  className="btn btn-outline-primary"
                  disabled={loading}
                >
                  <i className="bi bi-arrow-clockwise me-2"></i>
                  {loading ? 'Recargando...' : 'Recargar'}
                </button>
                <Link to="/admin/agregar-producto" className="btn btn-success">
                  <i className="bi bi-plus-circle me-2"></i>
                  Nuevo Producto
                </Link>
              </div>
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
                <Link to="/admin/agregar-producto" className="btn btn-primary">
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
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h1>Gestión de Pedidos</h1>
              <button 
                onClick={cargarDatos} 
                className="btn btn-outline-primary"
                disabled={loading}
              >
                <i className="bi bi-arrow-clockwise me-2"></i>
                Recargar
              </button>
            </div>
            
            {pedidos.length > 0 ? (
              <div className="table-responsive">
                <table className="table table-dark table-hover">
                  <thead>
                    <tr>
                      <th style={{width: '80px'}}>ID</th>
                      <th>Cliente</th>
                      <th>Dirección</th>
                      <th style={{width: '120px'}}>Fecha</th>
                      <th style={{width: '150px'}}>Total</th>
                      <th style={{width: '150px'}}>Estado</th>
                      <th style={{width: '100px'}}>Productos</th>
                      <th style={{width: '100px'}}>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pedidos.map((pedido) => (
                      <React.Fragment key={pedido.id}>
                        <tr>
                          <td className="align-middle">
                            <strong>#{pedido.id}</strong>
                          </td>
                          <td className="align-middle">
                            <div>
                              <strong>{pedido.usuario?.nombre || pedido.nombreCliente || 'Cliente'}</strong>
                            </div>
                            <small className="text-muted">{pedido.usuario?.email || pedido.emailCliente || 'No especificado'}</small>
                            <br />
                            <small className="text-muted">
                              <i className="bi bi-telephone me-1"></i>
                              {pedido.usuario?.telefono || pedido.telefonoCliente || 'N/A'}
                            </small>
                          </td>
                          <td className="align-middle">
                            <div><strong>{pedido.direccion || pedido.direccionEnvio || 'No especificada'}</strong></div>
                            <small className="text-muted">{pedido.ciudad || pedido.ciudadEnvio || 'No especificada'}</small>
                            {(pedido.notas || pedido.notasEnvio) && (
                              <>
                                <br />
                                <small className="text-info">
                                  <i className="bi bi-chat-left-text me-1"></i>
                                  {pedido.notas || pedido.notasEnvio}
                                </small>
                              </>
                            )}
                          </td>
                          <td className="align-middle">
                            <small>{new Date(pedido.fecha || pedido.fechaCreacion || pedido.fechaPedido).toLocaleDateString('es-CL')}</small>
                            <br />
                            <small className="text-muted">{new Date(pedido.fecha || pedido.fechaCreacion || pedido.fechaPedido).toLocaleTimeString('es-CL')}</small>
                          </td>
                          <td className="align-middle">
                            <strong className="text-success fs-5">
                              {formatPrice(pedido.total)}
                            </strong>
                            <br />
                            <small className="text-muted">
                              <i className="bi bi-credit-card me-1"></i>
                              {pedido.metodoPago || pedido.tipoPago || 'No especificado'}
                            </small>
                          </td>
                          <td className="align-middle">
                            <select 
                              className={`form-select form-select-sm ${
                                pedido.estado === 'pendiente' ? 'bg-warning text-dark' :
                                pedido.estado === 'entregado' ? 'bg-success' :
                                pedido.estado === 'cancelado' ? 'bg-danger' : 'bg-info'
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
                          <td className="align-middle text-center">
                            <span className="badge bg-secondary fs-6">
                              {pedido.detalles?.length || 0}
                            </span>
                          </td>
                          <td className="align-middle">
                            <div className="btn-group">
                              <button 
                                className="btn btn-sm btn-outline-info"
                                onClick={() => setPedidoExpandido(pedidoExpandido === pedido.id ? null : pedido.id)}
                                title="Ver detalles"
                              >
                                <i className={`bi bi-chevron-${pedidoExpandido === pedido.id ? 'up' : 'down'}`}></i>
                              </button>
                              <button 
                                className="btn btn-sm btn-outline-danger"
                                onClick={async () => {
                                  if (window.confirm(`¿Eliminar el pedido #${pedido.id}?\n\nEsta acción no se puede deshacer.`)) {
                                    try {
                                      await pedidoService.eliminar(pedido.id);
                                      setMensaje(`Pedido #${pedido.id} eliminado correctamente`);
                                      setTimeout(() => setMensaje(''), 3000);
                                      await cargarDatos();
                                    } catch (error) {
                                      console.error('Error eliminando pedido:', error);
                                      setError(`Error al eliminar el pedido: ${error.message}`);
                                      setTimeout(() => setError(''), 5000);
                                    }
                                  }
                                }}
                                title="Eliminar"
                              >
                                <i className="bi bi-trash"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                        
                        {/* Fila expandible con detalles de productos */}
                        {pedidoExpandido === pedido.id && (
                          <tr>
                            <td colSpan="8" className="bg-secondary">
                              <div className="p-3">
                                {/* Información adicional del pedido */}
                                <div className="row mb-3">
                                  <div className="col-md-6">
                                    <div className="card bg-dark">
                                      <div className="card-body">
                                        <h6 className="text-primary">
                                          <i className="bi bi-truck me-2"></i>
                                          Información de Envío
                                        </h6>
                                        <p className="mb-1 small"><strong>Dirección:</strong> {pedido.direccion || pedido.direccionEnvio || 'No especificada'}</p>
                                        <p className="mb-1 small"><strong>Ciudad:</strong> {pedido.ciudad || pedido.ciudadEnvio || 'No especificada'}</p>
                                        <p className="mb-0 small"><strong>Comuna:</strong> {pedido.comuna || pedido.comunaEnvio || 'No especificada'}</p>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-md-6">
                                    <div className="card bg-dark">
                                      <div className="card-body">
                                        <h6 className="text-success">
                                          <i className="bi bi-credit-card me-2"></i>
                                          Información de Pago
                                        </h6>
                                        <p className="mb-1 small"><strong>Método:</strong> {pedido.metodoPago || pedido.tipoPago || 'No especificado'}</p>
                                        <p className="mb-1 small"><strong>Total:</strong> <span className="text-success">{formatPrice(pedido.total)}</span></p>
                                        <p className="mb-0 small"><strong>Fecha:</strong> {new Date(pedido.fecha || pedido.fechaCreacion || pedido.fechaPedido).toLocaleString('es-CL')}</p>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <h5 className="text-info mb-3">
                                  <i className="bi bi-box-seam me-2"></i>
                                  Detalle de Productos
                                </h5>
                                <table className="table table-sm table-dark mb-0">
                                  <thead>
                                    <tr>
                                      <th style={{width: '80px'}}>Imagen</th>
                                      <th>Producto</th>
                                      <th style={{width: '120px'}}>Talla/Medida</th>
                                      <th style={{width: '100px'}} className="text-center">Cantidad</th>
                                      <th style={{width: '120px'}} className="text-end">Precio Unit.</th>
                                      <th style={{width: '120px'}} className="text-end">Subtotal</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {pedido.detalles && pedido.detalles.length > 0 ? (
                                      pedido.detalles.map((detalle, index) => (
                                        <tr key={index}>
                                          <td>
                                            <img 
                                              src={detalle.producto?.imagenUrl || '/placeholder.jpg'} 
                                              alt={detalle.producto?.nombre}
                                              style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                                              className="rounded"
                                            />
                                          </td>
                                          <td className="align-middle">
                                            <strong>{detalle.producto?.nombre || 'Producto eliminado'}</strong>
                                          </td>
                                          <td className="align-middle">
                                            <span className="badge bg-dark border">{detalle.talla || 'N/A'}</span>
                                          </td>
                                          <td className="align-middle text-center">
                                            <span className="badge bg-primary fs-6">{detalle.cantidad}</span>
                                          </td>
                                          <td className="align-middle text-end">
                                            {formatPrice(detalle.precioUnitario)}
                                          </td>
                                          <td className="align-middle text-end">
                                            <strong className="text-success">
                                              {formatPrice(detalle.precioUnitario * detalle.cantidad)}
                                            </strong>
                                          </td>
                                        </tr>
                                      ))
                                    ) : (
                                      <tr>
                                        <td colSpan="6" className="text-center text-muted">
                                          No hay detalles de productos
                                        </td>
                                      </tr>
                                    )}
                                  </tbody>
                                </table>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center p-5">
                <i className="bi bi-inbox" style={{fontSize: '4rem', opacity: 0.5}}></i>
                <h3 className="mt-3">No hay pedidos registrados</h3>
                <p className="text-muted">Los pedidos aparecerán aquí cuando los clientes realicen compras</p>
              </div>
            )}
          </>
        )}

        {/* Pestaña EMPLEADOS - TEMPORALMENTE DESHABILITADA */}
        {/* {activeTab === 'empleados' && (
          <GestionEmpleadosPage />
        )} */}
      </div>
    </div>
  );
}
