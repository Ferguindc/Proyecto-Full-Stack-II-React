import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { crearProductosEjemplo } from '../data/productosEjemplo';
import { productoService } from '../services/productoService';
import { categoriaService } from '../services/categoriaService';
import { imagenesDisponibles, obtenerUrlImagen } from '../data/imagenes';

function UtilidadesAdminPage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });

  // Verificar permisos
  React.useEffect(() => {
    if (!currentUser || currentUser.rol !== 'admin') {
      navigate('/sesion');
    }
  }, [currentUser, navigate]);

  const handleCrearProductosEjemplo = async () => {
    setLoading(true);
    setMensaje({ tipo: '', texto: '' });
    
    try {
      const resultado = await crearProductosEjemplo(productoService, categoriaService);
      
      if (resultado) {
        setMensaje({ 
          tipo: 'success', 
          texto: 'Productos de ejemplo creados exitosamente. Revisa el panel de administración.' 
        });
      } else {
        setMensaje({ 
          tipo: 'error', 
          texto: 'Algunos productos no pudieron ser creados. Revisa la consola para detalles.' 
        });
      }
    } catch (error) {
      console.error('Error creando productos:', error);
      setMensaje({ 
        tipo: 'error', 
        texto: 'Error al crear productos de ejemplo: ' + error.message 
      });
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser || currentUser.rol !== 'admin') {
    return null;
  }

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-8 mx-auto">
          <div className="card">
            <div className="card-header bg-primary text-white">
              <h2 className="mb-0">
                <i className="bi bi-tools me-2"></i>
                Utilidades de Administración
              </h2>
            </div>
            
            <div className="card-body">
              {mensaje.texto && (
                <div className={`alert alert-${mensaje.tipo === 'success' ? 'success' : 'danger'}`}>
                  {mensaje.texto}
                </div>
              )}

              {/* Sección de productos de ejemplo */}
              <div className="mb-4">
                <h4>
                  <i className="bi bi-box-seam me-2"></i>
                  Productos de Ejemplo
                </h4>
                <p className="text-muted">
                  Crear productos de ejemplo con imágenes locales para probar el sistema.
                </p>
                <button 
                  className="btn btn-outline-primary"
                  onClick={handleCrearProductosEjemplo}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Creando...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-plus-circle me-2"></i>
                      Crear Productos de Ejemplo
                    </>
                  )}
                </button>
              </div>

              <hr />

              {/* Sección de imágenes disponibles */}
              <div className="mb-4">
                <h4>
                  <i className="bi bi-images me-2"></i>
                  Imágenes Disponibles ({imagenesDisponibles.length})
                </h4>
                <div className="row">
                  {imagenesDisponibles.slice(0, 12).map((imagen, index) => (
                    <div key={index} className="col-md-3 col-sm-4 col-6 mb-3">
                      <div className="card h-100">
                        <img 
                          src={obtenerUrlImagen(imagen)}
                          className="card-img-top" 
                          alt={imagen}
                          style={{ 
                            height: '150px', 
                            objectFit: 'cover',
                            cursor: 'pointer'
                          }}
                          onClick={() => window.open(obtenerUrlImagen(imagen), '_blank')}
                        />
                        <div className="card-body p-2">
                          <p className="card-text small text-truncate" title={imagen}>
                            {imagen}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {imagenesDisponibles.length > 12 && (
                  <p className="text-muted text-center">
                    Y {imagenesDisponibles.length - 12} imágenes más...
                  </p>
                )}
              </div>

              <hr />

              {/* Botones de navegación */}
              <div className="d-flex justify-content-between">
                <button 
                  className="btn btn-outline-secondary"
                  onClick={() => navigate('/admin')}
                >
                  <i className="bi bi-arrow-left me-2"></i>
                  Volver al Panel
                </button>
                
                <button 
                  className="btn btn-success"
                  onClick={() => navigate('/admin/agregar-producto')}
                >
                  <i className="bi bi-plus me-2"></i>
                  Agregar Producto
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UtilidadesAdminPage;