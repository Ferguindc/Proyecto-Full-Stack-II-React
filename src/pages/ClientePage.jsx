import React, { useState, useEffect } from 'react'; 
import { useAuth } from '../context/AuthContext';
import { useDirecciones } from '../context/DireccionesContext';
import { useNavigate, Link } from 'react-router-dom'; // 👈 Importa Link

import '../styles/ClientePagestyle.css';

// Componente para mostrar una dirección guardada
function DireccionGuardada({ direccion, tipo, onEliminar, onEditar }) {
  const handleEliminar = () => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar esta dirección de ${tipo.toLowerCase()}?`)) {
      onEliminar(direccion.id);
    }
  };

  return (
    <div className="direccion-guardada mb-3">
      <div className="direccion-header">
        <h6 className="direccion-titulo">
          Dirección #{direccion.id} 
          {direccion.principal && <span className="badge-principal">PRINCIPAL</span>}
        </h6>
      </div>
      
      <div className="direccion-info">
        <div className="row">
          <div className="col-md-6">
            <p className="info-item">
              <span className="info-label">NOMBRE / APELLIDO</span><br />
              {direccion.nombre} {direccion.apellidos}
            </p>
            <p className="info-item">
              <span className="info-label">DIRECCIÓN COMPLETA</span><br />
              {direccion.direccion}, {direccion.ciudad}, {direccion.region}, {direccion.pais}
            </p>
            <p className="info-item">
              <span className="info-label">CELL</span><br />
              {direccion.cell || 'No especificado'}
            </p>
          </div>
          <div className="col-md-6">
            <p className="info-item">
              <span className="info-label">IDENTIFICACIÓN TRIBUTARIA</span><br />
              {direccion.rutDni || direccion.rut}
            </p>
            <p className="info-item">
              <span className="info-label">RUT (DNI)</span><br />
              {direccion.rut}
            </p>
            <p className="info-item">
              <span className="info-label">INSTAGRAM</span><br />
              {direccion.instagram || 'No especificado'}
            </p>
          </div>
        </div>
      </div>
      
      <div className="direccion-acciones">
        <button className="btn btn-editar-direccion" onClick={() => onEditar(direccion.id)}>
          <i className="bi bi-pencil-fill me-2"></i> Editar
        </button>
        <button className="btn btn-borrar-direccion" onClick={handleEliminar}>
          <i className="bi bi-trash-fill me-2"></i> Borrar
        </button>
      </div>
    </div>
  );
}
function HistorialPedidos() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Cargar pedidos del localStorage
    const savedOrders = JSON.parse(localStorage.getItem('userOrders') || '[]');
    setOrders(savedOrders.reverse()); // Mostrar los más recientes primero
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'confirmada': return 'bg-success';
      case 'pendiente': return 'bg-warning';
      case 'enviado': return 'bg-info';
      case 'entregado': return 'bg-primary';
      default: return 'bg-secondary';
    }
  };

  if (orders.length === 0) {
    return (
      <div className="container-fluid py-4">
        <h5 className="mb-4">Historial de Pedidos</h5>
        <div className="text-center py-5">
          <i className="bi bi-bag-x" style={{ fontSize: '4rem', color: '#6c757d' }}></i>
          <h4 className="mt-3 mb-3">No hay pedidos</h4>
          <p className="text-muted mb-4">Aún no has realizado ningún pedido.</p>
          <a href="/" className="btn btn-primary">
            Explorar Productos
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      <h5 className="mb-4">Historial de Pedidos</h5>
      <div className="table-responsive">
        <table className="table table-hover">
          <thead className="table-dark">
            <tr>
              <th>Pedido</th>
              <th>Fecha</th>
              <th>Productos</th>
              <th>Total</th>
              <th>Método Pago</th>
              <th>Estado</th>
              <th>Detalles</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <React.Fragment key={order.orderNumber}>
                <tr>
                  <td>
                    <strong>#{order.orderNumber}</strong>
                  </td>
                  <td>
                    <small>{formatDate(order.date)}</small>
                  </td>
                  <td>
                    <div className="d-flex flex-column">
                      {order.items.map((item, index) => (
                        <div key={item.cartId} className="d-flex align-items-center mb-1">
                          <img 
                            src={item.imagen} 
                            alt={item.nombre} 
                            style={{ width: '30px', height: '30px', objectFit: 'cover' }}
                            className="rounded me-2"
                          />
                          <div className="flex-grow-1">
                            <small className="d-block fw-bold">{item.nombre}</small>
                            <small className="text-muted">
                              {(item.categoria?.toLowerCase().includes('cuadro') || 
                                item.nombre?.toLowerCase().includes('cuadro')) ? 'Medida' : 'Talla'}: {item.selectedSize} | Cant: {item.quantity}
                            </small>
                          </div>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td>
                    <div className="d-flex flex-column">
                      <span className="fw-bold">{formatPrice(order.payment.total)}</span>
                      {order.payment.amountPaid && (
                        <small className="text-muted">
                          Pagado: {formatPrice(order.payment.amountPaid)}
                        </small>
                      )}
                      {order.payment.amountDue > 0 && (
                        <small className="text-danger">
                          Falta: {formatPrice(order.payment.amountDue)}
                        </small>
                      )}
                    </div>
                  </td>
                  <td>
                    <small>{order.payment.method === 'transferencia' ? 'Transferencia' : 'WebPay'}</small>
                  </td>
                  <td>
                    <span className={`badge ${getStatusBadgeClass(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </td>
                  <td>
                    <button 
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => {
                        const detailsRow = document.getElementById(`details-${order.orderNumber}`);
                        if (detailsRow.style.display === 'none') {
                          detailsRow.style.display = 'table-row';
                        } else {
                          detailsRow.style.display = 'none';
                        }
                      }}
                    >
                      <i className="bi bi-eye"></i>
                    </button>
                  </td>
                </tr>
                <tr id={`details-${order.orderNumber}`} style={{ display: 'none' }}>
                  <td colSpan="7">
                    <div className="p-3 bg-light">
                      <div className="row">
                        <div className="col-md-6">
                          <h6>Información de Envío:</h6>
                          <p className="mb-1"><strong>{order.customer.nombre}</strong></p>
                          <p className="mb-1">{order.customer.email} | {order.customer.telefono}</p>
                          <p className="mb-1">{order.customer.direccion}, {order.customer.comuna}</p>
                          {order.customer.notas && <p className="mb-0"><em>Notas: {order.customer.notas}</em></p>}
                        </div>
                        <div className="col-md-6">
                          <h6>Resumen de Pago:</h6>
                          <div className="d-flex justify-content-between">
                            <small>Subtotal:</small>
                            <small>{formatPrice(order.payment.subtotal)}</small>
                          </div>
                          {order.payment.discount > 0 && (
                            <div className="d-flex justify-content-between text-success">
                              <small>Descuento:</small>
                              <small>-{formatPrice(order.payment.discount)}</small>
                            </div>
                          )}
                          <div className="d-flex justify-content-between">
                            <small>Envío:</small>
                            <small>{order.payment.shipping === 0 ? 'GRATIS' : formatPrice(order.payment.shipping)}</small>
                          </div>
                          <hr className="my-2" />
                          <div className="d-flex justify-content-between fw-bold">
                            <small>Total:</small>
                            <small>{formatPrice(order.payment.total)}</small>
                          </div>
                          {order.payment.amountPaid && (
                            <>
                              <div className="d-flex justify-content-between">
                                <small>Monto Pagado:</small>
                                <small className="text-success">{formatPrice(order.payment.amountPaid)}</small>
                              </div>
                              {order.payment.amountDue > 0 && (
                                <div className="d-flex justify-content-between">
                                  <small>Monto Pendiente:</small>
                                  <small className="text-danger">{formatPrice(order.payment.amountDue)}</small>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 

function ClientePage() {
  const { currentUser, logout } = useAuth();
  const { 
    direccionesEnvio, 
    direccionesFacturacion, 
    eliminarDireccionEnvio, 
    eliminarDireccionFacturacion 
  } = useDirecciones();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('detalles');

  useEffect(() => {
    if (!currentUser) {
      navigate('/sesion');
    }
  }, [currentUser, navigate]); 

  if (!currentUser) {
    return <p>Cargando...</p>;
  }
  
  const telefonoUsuario = currentUser.telefono || '987654321';

  const handleEditarDireccion = (id, tipo) => {
    // Por ahora, redirigir al formulario de agregar (se puede mejorar más tarde)
    if (tipo === 'envio') {
      navigate('/cliente/envio');
    } else {
      navigate('/cliente/facturacion');
    }
  };

  return (
    <div className="container my-5"> 
      
      <div className="cliente-header d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">{currentUser.email}</h2>
        <button className="btn btn-cerrar-sesion" onClick={logout}>
          Cerrar sesión
        </button>
      </div>

      <ul className="nav nav-tabs cliente-tabs mb-4" role="tablist">
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'historial' ? 'active' : ''}`}
            onClick={() => setActiveTab('historial')}
            type="button"
            role="tab"
          >
            <i className="bi bi-list-ul me-2"></i> Historial de pedidos
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'detalles' ? 'active' : ''}`}
            onClick={() => setActiveTab('detalles')}
            type="button"
            role="tab"
          >
            <i className="bi bi-person-fill me-2"></i> Detalles de la cuenta
          </button>
        </li>
      </ul>

      <div className="tab-content">
        {activeTab === 'detalles' && (
          <div className="tab-pane fade show active cliente-content-wrapper"> 
            <div className="row">
              
              <div className="col-md-2 mb-4 mb-md-0"> 
                <div className="card cliente-card"> 
                  <div className="card-body">
                    <h5 className="card-title">Detalles de contacto</h5>
                    <hr />
                    <p><small>CORREO ELECTRÓNICO</small><br />{currentUser.email}</p>
                    <p><small>TELÉFONO</small><br />{telefonoUsuario}</p>
                    
                    {/* 👇 Botón "Editar" es ahora un Link */}
                    <Link to="/cliente/editar" className="btn btn-editar">
                      <i className="bi bi-pencil-fill me-2"></i> Editar
                    </Link>
                  </div>
                </div>
              </div>

              <div className="col-md-10 direcciones-container"> 
                <div className="card direcciones-card mb-4">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h5 className="card-title mb-0">Direcciones de envío</h5>
                      {direccionesEnvio.length < 2 && (
                        <Link to="/cliente/envio" className="btn btn-outline-primary-custom">
                          <i className="bi bi-plus-circle me-1"></i> Agregar nueva
                        </Link>
                      )}
                    </div>
                    <hr />
                    
                    {direccionesEnvio.length === 0 ? (
                      <p>Aún no tienes datos de envío. Puedes incorporarlos haciendo clic en el botón de arriba o se agregarán automáticamente cuando realices una compra.</p>
                    ) : (
                      direccionesEnvio.map((direccion) => (
                        <DireccionGuardada
                          key={direccion.id}
                          direccion={direccion}
                          tipo="Envío"
                          onEliminar={eliminarDireccionEnvio}
                          onEditar={(id) => handleEditarDireccion(id, 'envio')}
                        />
                      ))
                    )}
                  </div>
                </div>
                
                <div className="card direcciones-card">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h5 className="card-title mb-0">Direcciones de Facturación</h5>
                      {direccionesFacturacion.length < 2 && (
                        <Link to="/cliente/facturacion" className="btn btn-outline-primary-custom">
                          <i className="bi bi-plus-circle me-1"></i> Agregar nueva
                        </Link>
                      )}
                    </div>
                    <hr />
                    
                    {direccionesFacturacion.length === 0 ? (
                      <p>Aún no tienes datos de facturación. Puedes incorporarlos haciendo clic en el botón de arriba o se agregarán automáticamente cuando realices una compra.</p>
                    ) : (
                      direccionesFacturacion.map((direccion) => (
                        <DireccionGuardada
                          key={direccion.id}
                          direccion={direccion}
                          tipo="Facturación"
                          onEliminar={eliminarDireccionFacturacion}
                          onEditar={(id) => handleEditarDireccion(id, 'facturacion')}
                        />
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'historial' && (
          <HistorialPedidos />
        )}
      </div> 
    </div> 
  );
}

export default ClientePage;