import React, { useState, useEffect } from 'react'; 
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

import '../styles/ClientePagestyle.css'; 

function ClientePage() {
  const { currentUser, logout } = useAuth();
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
              
              {/* Columna Izquierda (CUADRADO) - 4 de 12 */}
              <div className="col-md-4 mb-4 mb-md-0"> 
                <div className="card cliente-card"> 
                  <div className="card-body">
                    <h5 className="card-title">Detalles de contacto</h5>
                    <hr />
                    <p>
                      <small>CORREO ELECTRÓNICO</small><br />
                      {currentUser.email}
                    </p>
                    <p>
                      <small>TELÉFONO</small><br />
                      {telefonoUsuario}
                    </p>
                    {/* Botón "Editar" (ya no centrado) */}
                    <button className="btn btn-editar">
                      <i className="bi bi-pencil-fill me-2"></i> Editar
                    </button>
                  </div>
                </div>
              </div>

              {/* Columna Derecha (RECTÁNGULOS) - 8 de 12 */}
              <div className="col-md-8"> 
                
                {/* --- CAMBIO AQUÍ --- */}
                {/* Tarjeta de Direcciones de Envío */}
                <div className="card cliente-card mb-4"> {/* Solo 'card' y 'cliente-card' */}
                  <div className="card-body"> {/* Añadido card-body */}
                    <h5 className="card-title">Direcciones de envío</h5> {/* Título movido adentro */}
                    <hr /> {/* Añadido hr */}
                    <p className="mb-2">
                      Aún no tienes datos de envío. Puedes incorporarlos haciendo clic en el botón de abajo o se agregarán automáticamente when realices una compra.
                    </p>
                    {/* Botón "Añadir" (ya no centrado) */}
                    <button className="btn btn-outline-primary-custom">
                      <i className="bi bi-plus-circle me-1"></i> Añadir Dirección de Envío
                    </button>
                  </div>
                </div>

                {/* --- CAMBIO AQUÍ --- */}
                {/* Tarjeta de Direcciones de Facturación */}
                <div className="card cliente-card"> {/* Solo 'card' y 'cliente-card' */}
                  <div className="card-body"> {/* Añadido card-body */}
                    <h5 className="card-title">Direcciones de Facturación</h5> {/* Título movido adentro */}
                    <hr /> {/* Añadido hr */}
                    <p className="mb-2">
                      Aún no tienes datos de facturación. Puedes incorporarlos haciendo clic en el botón de abajo o se agregarán automáticamente when realices una compra.
                    </p>
                    {/* Botón "Añadir" (ya no centrado) */}
                    <button className="btn btn-outline-primary-custom">
                      <i className="bi bi-plus-circle me-1"></i> Añadir dirección de facturación
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'historial' && (
          <div className="tab-pane fade show active cliente-content-wrapper">
            <div className="card cliente-card"> 
              <div className="card-body text-center">
                <h5 className="card-title">Historial de pedidos</h5>
                <hr />
                <p>Aún no has realizado ningún pedido.</p>
              </div>
            </div>
          </div>
        )}
      </div> 
    </div> 
  );
}

export default ClientePage;