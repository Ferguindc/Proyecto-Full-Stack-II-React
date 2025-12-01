import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { productoService } from '../services/productoService.js';
import { categoriaService } from '../services/categoriaService.js';
import { imagenesDisponibles, categoriaImagenes, obtenerUrlImagen } from '../data/imagenes';

function FormularioAddProductoMinimal() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  console.log('🔧 Debug - Component rendering');
  console.log('Current User:', currentUser);

  // Estados básicos
  const [formData, setFormData] = useState({
    nombre: '',
    precio: '',
    descripcion: '',
    stock: 0,
    imagenUrl: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });

  console.log('🔧 Debug - States initialized');

  // Verificación de autenticación
  if (!currentUser) {
    console.log('🔧 Debug - No currentUser, showing login message');
    return (
      <div className="container mt-5">
        <div className="alert alert-warning text-center">
          <h4>🔐 Necesitas Iniciar Sesión</h4>
          <p>Inicia sesión como admin o empleado para agregar productos</p>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/sesion')}
          >
            Ir a Sesión
          </button>
        </div>
      </div>
    );
  }

  console.log('🔧 Debug - User exists, checking permissions');

  if (currentUser.rol !== 'admin' && currentUser.rol !== 'empleado') {
    console.log('🔧 Debug - User has no permissions');
    return (
      <div className="container mt-5">
        <div className="alert alert-danger text-center">
          <h4>❌ Sin Permisos</h4>
          <p>Rol actual: {currentUser.rol}</p>
          <button className="btn btn-secondary" onClick={() => navigate('/')}>
            Ir al Inicio
          </button>
        </div>
      </div>
    );
  }

  console.log('🔧 Debug - Permissions OK, rendering form');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMensaje({ tipo: 'success', texto: 'Formulario enviado (prueba)' });
    console.log('Form submitted:', formData);
  };

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-8 mx-auto">
          <div className="card">
            <div className="card-header bg-primary text-white">
              <h3 className="mb-0">
                <i className="bi bi-plus-circle me-2"></i>
                Agregar Producto (Versión Minimal)
              </h3>
            </div>
            
            <div className="card-body">
              {/* Info del usuario */}
              <div className="alert alert-info">
                <strong>Usuario:</strong> {currentUser.nombre || currentUser.email} 
                ({currentUser.rol})
              </div>

              {/* Mensajes */}
              {mensaje.texto && (
                <div className={`alert alert-${mensaje.tipo === 'success' ? 'success' : 'danger'}`}>
                  {mensaje.texto}
                </div>
              )}

              {/* Formulario básico */}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Nombre del Producto *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    required
                    placeholder="Ej: Polera Anime"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Precio *</label>
                  <input
                    type="number"
                    className="form-control"
                    name="precio"
                    value={formData.precio}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                    placeholder="15990"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Descripción *</label>
                  <textarea
                    className="form-control"
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleInputChange}
                    required
                    rows="3"
                    placeholder="Describe el producto..."
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Stock</label>
                  <input
                    type="number"
                    className="form-control"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    min="0"
                    placeholder="25"
                  />
                </div>

                {/* Botones */}
                <div className="d-flex justify-content-between">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => navigate('/admin')}
                  >
                    <i className="bi bi-arrow-left me-2"></i>
                    Cancelar
                  </button>
                  
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Creando...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-circle me-2"></i>
                        Crear Producto
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Debug info */}
              <hr />
              <div className="text-muted small">
                <strong>Debug Info:</strong><br/>
                - Component loaded: ✅<br/>
                - User authenticated: ✅<br/>
                - Form rendering: ✅<br/>
                - Console logs: Revisa la consola del navegador
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FormularioAddProductoMinimal;