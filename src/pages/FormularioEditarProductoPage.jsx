import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function FormularioEditarProductoPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { currentUser } = useAuth();

  const [formData, setFormData] = useState({
    nombre: '',
    precio: '',
    categoria: 'Poleras',
    descripcion: '',
    stock: ''
  });
  const [tallas, setTallas] = useState([{ talla: 'S', cantidad: 1 }]);
  const [imagenArchivo, setImagenArchivo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });
  const [producto, setProducto] = useState(null);

  // Verificar permisos
  useEffect(() => {
    if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'empleado')) {
      navigate('/sesion');
      return;
    }
  }, [currentUser, navigate]);

  // Cargar datos del producto
  useEffect(() => {
    const cargarProducto = () => {
      try {
        const productosGuardados = JSON.parse(localStorage.getItem('productos')) || [];
        const productoEncontrado = productosGuardados.find(p => p.id === parseInt(id));
        
        if (productoEncontrado) {
          setProducto(productoEncontrado);
          setFormData({
            nombre: productoEncontrado.nombre || '',
            precio: productoEncontrado.precio || '',
            categoria: productoEncontrado.categoria || 'Poleras',
            descripcion: productoEncontrado.descripcion || '',
            stock: productoEncontrado.stock || ''
          });
          
          if (productoEncontrado.tallas && productoEncontrado.tallas.length > 0) {
            setTallas(productoEncontrado.tallas);
          }
        } else {
          setMensaje({ tipo: 'error', texto: 'Producto no encontrado' });
          setTimeout(() => {
            navigate(currentUser?.role === 'empleado' ? '/panel-empleado' : '/admin');
          }, 2000);
        }
      } catch (error) {
        console.error('Error cargando producto:', error);
        setMensaje({ tipo: 'error', texto: 'Error al cargar el producto' });
      } finally {
        setLoadingData(false);
      }
    };

    if (id) {
      cargarProducto();
    }
  }, [id, navigate, currentUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTallaChange = (index, field, value) => {
    const nuevasTallas = [...tallas];
    nuevasTallas[index][field] = value;
    setTallas(nuevasTallas);
  };

  const agregarTalla = () => {
    setTallas([...tallas, { talla: 'M', cantidad: 1 }]);
  };

  const eliminarTalla = (index) => {
    if (tallas.length > 1) {
      setTallas(tallas.filter((_, i) => i !== index));
    }
  };

  const handleImagenChange = (e) => {
    setImagenArchivo(e.target.files[0]);
  };

  const editarProducto = (id, datosActualizados) => {
    try {
      const productosGuardados = JSON.parse(localStorage.getItem('productos')) || [];
      const productoIndex = productosGuardados.findIndex(p => p.id === parseInt(id));
      
      if (productoIndex !== -1) {
        productosGuardados[productoIndex] = {
          ...productosGuardados[productoIndex],
          ...datosActualizados,
          fechaModificacion: new Date().toISOString(),
          modificadoPor: currentUser?.email || 'admin',
          modificadorNombre: currentUser?.nombre || 'Administrador'
        };
        
        localStorage.setItem('productos', JSON.stringify(productosGuardados));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error editando producto:', error);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validaciones
      if (!formData.nombre || !formData.precio || !formData.descripcion) {
        throw new Error('Por favor completa todos los campos obligatorios');
      }

      if (parseFloat(formData.precio) <= 0) {
        throw new Error('El precio debe ser mayor a 0');
      }

      if (formData.stock && parseInt(formData.stock) < 0) {
        throw new Error('El stock no puede ser negativo');
      }

      for (const talla of tallas) {
        if (talla.cantidad < 1) {
          throw new Error('La cantidad de cada talla debe ser al menos 1');
        }
      }

      const datosActualizados = {
        nombre: formData.nombre,
        precio: parseFloat(formData.precio),
        categoria: formData.categoria,
        descripcion: formData.descripcion,
        stock: formData.stock ? parseInt(formData.stock) : 0,
        tallas: tallas
      };

      // Si hay nueva imagen, procesarla
      if (imagenArchivo) {
        const lector = new FileReader();
        lector.onload = (e) => {
          datosActualizados.imagen = e.target.result;
          const resultado = editarProducto(id, datosActualizados);
          if (resultado) {
            completarEdicion();
          } else {
            throw new Error('Error al actualizar el producto');
          }
        };
        lector.readAsDataURL(imagenArchivo);
      } else {
        const resultado = editarProducto(id, datosActualizados);
        if (resultado) {
          completarEdicion();
        } else {
          throw new Error('Error al actualizar el producto');
        }
      }

    } catch (error) {
      setMensaje({ tipo: 'error', texto: error.message });
      setLoading(false);
      
      // Limpiar mensaje después de 5 segundos
      setTimeout(() => {
        setMensaje({ tipo: '', texto: '' });
      }, 5000);
    }
  };

  const completarEdicion = () => {
    setMensaje({ tipo: 'success', texto: 'Producto actualizado correctamente' });
    setLoading(false);
    
    // Redirigir después de 2 segundos
    setTimeout(() => {
      if (currentUser.role === 'empleado') {
        navigate('/panel-empleado');
      } else {
        navigate('/admin');
      }
    }, 2000);
  };

  if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'empleado')) {
    return null;
  }

  if (loadingData) {
    return (
      <div className="container py-4">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-2">Cargando datos del producto...</p>
        </div>
      </div>
    );
  }

  if (!producto) {
    return (
      <div className="container py-4">
        <div className="alert alert-danger">
          <i className="bi bi-exclamation-triangle me-2"></i>
          Producto no encontrado
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-5" style={{backgroundColor: '#f8f9fa', minHeight: '100vh'}}>
      {/* Header fijo */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center bg-warning text-dark p-4 rounded shadow">
            <div>
              <h2 className="mb-0 fw-bold">
                <i className="bi bi-pencil-square me-3"></i>
                Editar Producto
              </h2>
              <p className="mb-0">
                Modifica la información del producto seleccionado
              </p>
            </div>
            <button 
              className="btn btn-outline-dark"
              onClick={() => navigate(currentUser?.role === 'empleado' ? '/panel-empleado' : '/admin')}
            >
              <i className="bi bi-arrow-left me-2"></i>
              Volver
            </button>
          </div>
        </div>
      </div>

      {/* Información del producto y usuario */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="alert alert-info border-0 shadow-sm">
            <i className="bi bi-info-circle me-2"></i>
            <strong>Editando como:</strong> {currentUser?.nombre || currentUser?.email} 
            ({currentUser?.role === 'admin' ? 'Administrador' : 'Empleado'})
          </div>
        </div>
        <div className="col-md-6">
          <div className="alert alert-secondary border-0 shadow-sm">
            <i className="bi bi-person me-2"></i>
            <strong>Creado por:</strong> {producto?.creadorNombre || producto?.creadoPor || 'N/A'}
            <br />
            <small className="text-muted">
              {producto?.fechaCreacion ? new Date(producto.fechaCreacion).toLocaleDateString('es-ES') : 'N/A'}
            </small>
          </div>
        </div>
      </div>

      {/* Mensajes */}
      {mensaje.texto && (
        <div className="row mb-4">
          <div className="col-12">
            <div className={`alert alert-${mensaje.tipo === 'error' ? 'danger' : 'success'} alert-dismissible fade show border-0 shadow-sm`}>
              <i className={`bi bi-${mensaje.tipo === 'error' ? 'exclamation-triangle' : 'check-circle'} me-2`}></i>
              {mensaje.texto}
            </div>
          </div>
        </div>
      )}

      {/* Formulario principal */}
      <div className="row">
        <div className="col-12">
          <div className="bg-white rounded shadow p-5">
              {/* Información del producto y usuario */}
              <div className="row mb-4">
                <div className="col-md-6">
                  <div className="alert alert-info border-0 shadow-sm">
                    <i className="bi bi-info-circle me-2"></i>
                    <strong>Editando como:</strong> {currentUser?.nombre || currentUser?.email} 
                    ({currentUser?.role === 'admin' ? 'Administrador' : 'Empleado'})
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="alert alert-secondary border-0 shadow-sm">
                    <i className="bi bi-person me-2"></i>
                    <strong>Creado por:</strong> {producto?.creadorNombre || producto?.creadoPor || 'N/A'}
                    <br />
                    <small className="text-muted">
                      {producto?.fechaCreacion ? new Date(producto.fechaCreacion).toLocaleDateString('es-ES') : 'N/A'}
                    </small>
                  </div>
                </div>
              </div>

              {/* Mensajes */}
              {mensaje.texto && (
                <div className={`alert alert-${mensaje.tipo === 'error' ? 'danger' : 'success'} alert-dismissible fade show`}>
                  <i className={`bi bi-${mensaje.tipo === 'error' ? 'exclamation-triangle' : 'check-circle'} me-2`}></i>
                  {mensaje.texto}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="row g-4">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label fw-semibold">
                        <i className="bi bi-tag me-2 text-primary"></i>
                        Nombre del Producto *
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-lg"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleInputChange}
                        required
                        placeholder="Ej: Polera Anime Naruto"
                      />
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label fw-semibold">
                        <i className="bi bi-currency-dollar me-2 text-success"></i>
                        Precio *
                      </label>
                      <input
                        type="number"
                        className="form-control form-control-lg"
                        name="precio"
                        value={formData.precio}
                        onChange={handleInputChange}
                        required
                        min="0"
                        step="0.01"
                        placeholder="Ej: 15000"
                      />
                    </div>
                  </div>
                </div>

                <div className="row g-4">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label fw-semibold">
                        <i className="bi bi-grid me-2 text-info"></i>
                        Categoría *
                      </label>
                      <select
                        className="form-select form-select-lg"
                        name="categoria"
                        value={formData.categoria}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="Poleras">Poleras</option>
                        <option value="Hoodies">Hoodies</option>
                        <option value="Polerones">Polerones</option>
                        <option value="AnimeBags">Bolsas Anime</option>
                        <option value="Cuadros">Cuadros</option>
                        <option value="Accesorios">Accesorios</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label fw-semibold">
                        <i className="bi bi-box me-2 text-warning"></i>
                        Stock Total
                      </label>
                      <input
                        type="number"
                        className="form-control form-control-lg"
                        name="stock"
                        value={formData.stock}
                        onChange={handleInputChange}
                        min="0"
                        placeholder="Ej: 50"
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold">
                    <i className="bi bi-card-text me-2 text-secondary"></i>
                    Descripción *
                  </label>
                  <textarea
                    className="form-control"
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleInputChange}
                    required
                    rows="4"
                    placeholder="Describe el producto, sus características, materiales, etc."
                    style={{resize: 'vertical'}}
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold">
                    <i className="bi bi-rulers me-2 text-danger"></i>
                    Tallas y Cantidades
                  </label>
                  <div className="border rounded p-3 bg-light">
                    {tallas.map((talla, index) => (
                      <div key={index} className="row align-items-center mb-3">
                        <div className="col-md-4">
                          <label className="form-label small">Talla</label>
                          <select
                            className="form-select"
                            value={talla.talla}
                            onChange={(e) => handleTallaChange(index, 'talla', e.target.value)}
                          >
                            <option value="XS">XS</option>
                            <option value="S">S</option>
                            <option value="M">M</option>
                            <option value="L">L</option>
                            <option value="XL">XL</option>
                            <option value="XXL">XXL</option>
                            <option value="XXXL">XXXL</option>
                            <option value="Único">Talla Única</option>
                          </select>
                        </div>
                        <div className="col-md-4">
                          <label className="form-label small">Cantidad</label>
                          <input
                            type="number"
                            className="form-control"
                            placeholder="Cantidad"
                            min="1"
                            value={talla.cantidad}
                            onChange={(e) => handleTallaChange(index, 'cantidad', parseInt(e.target.value) || 1)}
                          />
                        </div>
                        <div className="col-md-4">
                          <label className="form-label small">Acciones</label>
                          <div className="btn-group w-100">
                            {index === tallas.length - 1 && (
                              <button
                                type="button"
                                className="btn btn-outline-success btn-sm"
                                onClick={agregarTalla}
                              >
                                <i className="bi bi-plus"></i> Agregar
                              </button>
                            )}
                            {tallas.length > 1 && (
                              <button
                                type="button"
                                className="btn btn-outline-danger btn-sm"
                                onClick={() => eliminarTalla(index)}
                              >
                                <i className="bi bi-trash"></i> Eliminar
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label">
                    <i className="bi bi-image me-2"></i>
                    Nueva Imagen del Producto
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    onChange={handleImagenChange}
                    accept="image/*"
                  />
                  <div className="form-text">
                    Si no seleccionas una nueva imagen, se mantendrá la imagen actual.
                  </div>
                  
                  {/* Mostrar imagen actual */}
                  {producto.imagen && (
                    <div className="mt-2">
                      <small className="text-muted">Imagen actual:</small>
                      <br />
                      <img 
                        src={producto.imagen} 
                        alt={producto.nombre}
                        className="img-thumbnail mt-1"
                        style={{maxWidth: '150px', maxHeight: '150px'}}
                      />
                    </div>
                  )}
                </div>

                <div className="d-flex justify-content-between gap-3 pt-4 border-top">
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-lg px-4"
                    onClick={() => navigate(currentUser?.role === 'empleado' ? '/panel-empleado' : '/admin')}
                  >
                    <i className="bi bi-x-circle me-2"></i>
                    Cancelar
                  </button>
                  
                  <button
                    type="submit"
                    className="btn btn-warning btn-lg px-4"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Actualizando...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-circle me-2"></i>
                        Actualizar Producto
                      </>
                    )}
                  </button>
                </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FormularioEditarProductoPage;