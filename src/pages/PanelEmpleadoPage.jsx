import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function PanelEmpleadoPage() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [productosCreados, setProductosCreados] = useState([]);

  useEffect(() => {
    // Verificar que el usuario sea empleado
    if (!currentUser || currentUser.role !== 'empleado') {
      navigate('/sesion');
      return;
    }

    cargarProductos();
    cargarProductosCreados();
  }, [currentUser, navigate]);

  const cargarProductos = () => {
    const productosGuardados = JSON.parse(localStorage.getItem('productos')) || [];
    setProductos(productosGuardados);
  };

  const cargarProductosCreados = () => {
    const productosGuardados = JSON.parse(localStorage.getItem('productos')) || [];
    const productosPorEmpleado = productosGuardados.filter(
      producto => producto.creadoPor === currentUser?.email || producto.modificadoPor === currentUser?.email
    );
    setProductosCreados(productosPorEmpleado);
  };

  const handleLogout = () => {
    logout();
  };

  if (!currentUser || currentUser.role !== 'empleado') {
    return null;
  }

  return (
    <div className="container-fluid py-4" style={{backgroundColor: '#f8f9fa', minHeight: '100vh'}}>
      {/* Header Principal */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="bg-primary text-white p-4 rounded shadow">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
              <div className="d-flex align-items-center mb-3 mb-md-0">
                <div className="bg-white text-primary rounded-circle d-flex align-items-center justify-content-center me-3" 
                     style={{width: '60px', height: '60px'}}>
                  <i className="bi bi-person-badge" style={{fontSize: '1.5rem'}}></i>
                </div>
                <div>
                  <h2 className="mb-1 fw-bold">¡Bienvenido, {currentUser?.nombre || 'Empleado'}!</h2>
                  <div className="d-flex flex-column flex-sm-row gap-2">
                    <span className="badge bg-light text-dark">
                      <i className="bi bi-briefcase me-1"></i>
                      {currentUser?.cargo || 'Empleado'}
                    </span>
                    <span className="badge bg-light text-dark">
                      <i className="bi bi-building me-1"></i>
                      {currentUser?.departamento || 'General'}
                    </span>
                  </div>
                  <small className="opacity-75 d-block mt-1">
                    <i className="bi bi-envelope me-1"></i>
                    {currentUser?.email}
                  </small>
                </div>
              </div>
              <button className="btn btn-outline-light btn-lg" onClick={handleLogout}>
                <i className="bi bi-box-arrow-right me-2"></i>
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Estadísticas y Acciones */}
      <div className="row g-4 mb-5">
        {/* Estadística 1 */}
        <div className="col-lg-3 col-md-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center p-4">
              <div className="text-primary mb-3">
                <i className="bi bi-box-seam" style={{fontSize: '3rem'}}></i>
              </div>
              <h3 className="fw-bold text-dark">{productos.length}</h3>
              <p className="text-muted mb-0 small">Total Productos en Sistema</p>
            </div>
          </div>
        </div>

        {/* Estadística 2 */}
        <div className="col-lg-3 col-md-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center p-4">
              <div className="text-success mb-3">
                <i className="bi bi-plus-circle" style={{fontSize: '3rem'}}></i>
              </div>
              <h3 className="fw-bold text-dark">{productosCreados.length}</h3>
              <p className="text-muted mb-0 small">Productos Gestionados por Ti</p>
            </div>
          </div>
        </div>

        {/* Acciones Rápidas - Sin contenedor */}
        <div className="col-lg-3 col-md-6">
          <button 
            className="btn btn-primary w-100 d-flex flex-column align-items-center justify-content-center p-4 shadow-sm"
            onClick={() => navigate('/formulario-add')}
            style={{minHeight: '120px', fontSize: '1rem', borderRadius: '15px'}}
          >
            <i className="bi bi-plus-lg mb-3" style={{fontSize: '2.5rem'}}></i>
            <span className="fw-bold">AGREGAR</span>
            <span className="fw-bold">PRODUCTO</span>
          </button>
        </div>
        
        <div className="col-lg-3 col-md-6">
          <button 
            className="btn btn-outline-primary w-100 d-flex flex-column align-items-center justify-content-center p-4 shadow-sm"
            onClick={() => navigate('/admin')}
            style={{minHeight: '120px', fontSize: '1rem', borderRadius: '15px'}}
          >
            <i className="bi bi-list-ul mb-3" style={{fontSize: '2.5rem'}}></i>
            <span className="fw-bold">VER TODOS</span>
            <span className="fw-bold">PRODUCTOS</span>
          </button>
        </div>
      </div>

      {/* Productos Gestionados */}
      <div className="row">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-bottom">
              <h5 className="mb-0 d-flex align-items-center">
                <i className="bi bi-person-check me-2 text-success"></i>
                Productos Gestionados por Ti
              </h5>
            </div>
            <div className="card-body p-0">
              {productosCreados.length === 0 ? (
                <div className="text-center py-5">
                  <div className="mb-4">
                    <i className="bi bi-inbox text-muted" style={{fontSize: '4rem'}}></i>
                  </div>
                  <h4 className="text-muted">Aún no has gestionado productos</h4>
                  <p className="text-muted mb-4">Comienza agregando o editando productos para verlos aquí</p>
                  <button 
                    className="btn btn-primary btn-lg"
                    onClick={() => navigate('/formulario-add')}
                  >
                    <i className="bi bi-plus-lg me-2"></i>
                    Agregar Primer Producto
                  </button>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="table-light">
                      <tr>
                        <th style={{width: '80px'}}>Imagen</th>
                        <th>Producto</th>
                        <th style={{width: '120px'}}>Precio</th>
                        <th style={{width: '100px'}}>Stock</th>
                        <th style={{width: '140px'}}>Acción</th>
                        <th style={{width: '120px'}}>Fecha</th>
                        <th style={{width: '80px'}}>Editar</th>
                      </tr>
                    </thead>
                    <tbody>
                      {productosCreados.map(producto => (
                        <tr key={producto.id}>
                          <td>
                            <img 
                              src={producto.imagen} 
                              alt={producto.nombre || producto.titulo}
                              className="img-thumbnail"
                              style={{width: '50px', height: '50px', objectFit: 'cover'}}
                            />
                          </td>
                          <td>
                            <div>
                              <div className="fw-semibold text-truncate" style={{maxWidth: '200px'}}>
                                {producto.nombre || producto.titulo}
                              </div>
                              <small className="text-muted">{producto.categoria}</small>
                            </div>
                          </td>
                          <td>
                            <span className="fw-semibold text-success">
                              ${producto.precio?.toLocaleString()}
                            </span>
                          </td>
                          <td>
                            <span className={`badge ${producto.stock > 10 ? 'bg-success' : producto.stock > 0 ? 'bg-warning text-dark' : 'bg-danger'}`}>
                              {producto.stock || 0}
                            </span>
                          </td>
                          <td>
                            {producto.creadoPor === currentUser?.email ? (
                              <span className="badge bg-primary">
                                <i className="bi bi-plus-circle me-1"></i>
                                Creado
                              </span>
                            ) : (
                              <span className="badge bg-info">
                                <i className="bi bi-pencil me-1"></i>
                                Modificado
                              </span>
                            )}
                          </td>
                          <td>
                            <small className="text-muted">
                              {producto.creadoPor === currentUser?.email 
                                ? new Date(producto.fechaCreacion || Date.now()).toLocaleDateString('es-ES')
                                : new Date(producto.fechaModificacion || Date.now()).toLocaleDateString('es-ES')
                              }
                            </small>
                          </td>
                          <td>
                            <button 
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => navigate(`/formulario-editar/${producto.id}`)}
                              title="Editar producto"
                            >
                              <i className="bi bi-pencil"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default PanelEmpleadoPage;