import React, { useState, useEffect } from 'react'; 
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom'; // 👈 Importa Link

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
              
              <div className="col-md-4 mb-4 mb-md-0"> 
                <div className="card cliente-card"> 
                  <div className="card-body">
                    <h5 className="card-title">Detalles de contacto</h5>
                    <hr />
                    <p><small>CORREO ELECTRÓNICO</small><br />{currentUser.email}</p>
                    <p><small>TELÉFONO</small><br />{telefonoUsuario}</p>
                    
                    {/* 👇 Botón "Editar" es ahora un Link */}
                    <Link to="/cuenta/editar" className="btn btn-editar">
                      <i className="bi bi-pencil-fill me-2"></i> Editar
                    </Link>
                  </div>
                </div>
              </div>

              <div className="col-md-8"> 
                <div className="card cliente-card mb-4">
                  <div className="card-body">
                    <h5 className="card-title">Direcciones de envío</h5>
                    <hr />
                    <p className="mb-2">Aún no tienes datos de envío...</p>
                    
                    {/* 👇 Botón "Añadir" es ahora un Link */}
                    <Link to="/cuenta/envio" className="btn btn-outline-primary-custom">
                      <i className="bi bi-plus-circle me-1"></i> Añadir Dirección de Envío
                    </Link>
                  </div>
                </div>
                <div className="card cliente-card">
                  <div className="card-body">
                    <h5 className="card-title">Direcciones de Facturación</h5>
                    <hr />
                    <p className="mb-2">Aún no tienes datos de facturación...</p>
                    
                    {/* 👇 Botón "Añadir" es ahora un Link */}
                    <Link to="/cuenta/facturacion" className="btn btn-outline-primary-custom">
                      <i className="bi bi-plus-circle me-1"></i> Añadir dirección de facturación
                    </Link>
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