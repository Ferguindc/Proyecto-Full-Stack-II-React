import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function FormularioSimplePage() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carga
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  console.log('Current User:', currentUser);
  console.log('Loading:', loading);

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p>Cargando página...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="container mt-5">
        <div className="alert alert-warning">
          <h4>🔐 Acceso Requerido</h4>
          <p>Debes iniciar sesión como administrador o empleado.</p>
          <p><strong>Usuarios de prueba:</strong></p>
          <ul>
            <li>admin / admin</li>
            <li>empleado / empleado</li>
          </ul>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/sesion')}
          >
            Ir a Iniciar Sesión
          </button>
        </div>
      </div>
    );
  }

  if (currentUser.rol !== 'admin' && currentUser.rol !== 'empleado') {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">
          <h4>❌ Sin Permisos</h4>
          <p>Tu rol actual: <strong>{currentUser.rol}</strong></p>
          <p>Solo administradores y empleados pueden agregar productos.</p>
          <button 
            className="btn btn-secondary"
            onClick={() => navigate('/')}
          >
            Ir al Inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-8 mx-auto">
          <div className="card">
            <div className="card-header bg-success text-white">
              <h3 className="mb-0">✅ Página Funcionando</h3>
            </div>
            <div className="card-body">
              <div className="alert alert-success">
                <h4>🎉 ¡Perfecto! La autenticación funciona</h4>
                <p><strong>Usuario:</strong> {currentUser.nombre || currentUser.email}</p>
                <p><strong>Rol:</strong> {currentUser.rol}</p>
                <p><strong>ID:</strong> {currentUser.id}</p>
              </div>

              <h5>🛠️ Formulario de Prueba</h5>
              <form>
                <div className="mb-3">
                  <label className="form-label">Nombre del Producto</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Ej: Polera Anime"
                  />
                </div>
                
                <div className="mb-3">
                  <label className="form-label">Precio</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    placeholder="15990"
                  />
                </div>
                
                <div className="mb-3">
                  <label className="form-label">Descripción</label>
                  <textarea 
                    className="form-control" 
                    rows="3"
                    placeholder="Describe el producto..."
                  ></textarea>
                </div>

                <div className="d-flex justify-content-between">
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={() => navigate('/admin')}
                  >
                    ← Volver al Admin
                  </button>
                  
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                  >
                    💾 Crear Producto (Prueba)
                  </button>
                </div>
              </form>

              <hr />
              
              <div className="text-muted">
                <small>
                  <strong>Debug Info:</strong><br/>
                  - Autenticación: ✅ Funcionando<br/>
                  - Usuario cargado: ✅ {currentUser ? 'Sí' : 'No'}<br/>
                  - Rol válido: ✅ {(currentUser?.rol === 'admin' || currentUser?.rol === 'empleado') ? 'Sí' : 'No'}<br/>
                  - Página renderizada: ✅ Correctamente
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FormularioSimplePage;