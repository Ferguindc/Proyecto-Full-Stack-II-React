import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { adminProductos } from '../data/adminProductos';

function FormularioAddProductoPage() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { agregarProducto } = adminProductos();

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
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });

  // Verificar permisos
  React.useEffect(() => {
    if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'empleado')) {
      navigate('/sesion');
      return;
    }
  }, [currentUser, navigate]);

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

      const producto = {
        nombre: formData.nombre,
        precio: parseFloat(formData.precio),
        categoria: formData.categoria,
        descripcion: formData.descripcion,
        stock: formData.stock ? parseInt(formData.stock) : 0,
        tallas: tallas
      };

      await agregarProducto(producto, imagenArchivo, currentUser);
      
      setMensaje({ tipo: 'success', texto: 'Producto agregado correctamente' });
      
      // Limpiar formulario
      setFormData({
        nombre: '',
        precio: '',
        categoria: 'Poleras',
        descripcion: '',
        stock: ''
      });
      setTallas([{ talla: 'S', cantidad: 1 }]);
      setImagenArchivo(null);
      
      // Redirigir después de 2 segundos
      setTimeout(() => {
        if (currentUser.role === 'empleado') {
          navigate('/panel-empleado');
        } else {
          navigate('/admin');
        }
      }, 2000);

    } catch (error) {
      setMensaje({ tipo: 'error', texto: error.message });
    } finally {
      setLoading(false);
      
      // Limpiar mensaje después de 5 segundos
      setTimeout(() => {
        setMensaje({ tipo: '', texto: '' });
      }, 5000);
    }
  };

  if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'empleado')) {
    return null;
  }

  return (
    <div className="container-fluid py-5" style={{backgroundColor: '#f8f9fa', minHeight: '100vh'}}>
      {/* Header fijo */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center bg-primary text-white p-4 rounded shadow">
            <div>
              <h2 className="mb-0 fw-bold">
                <i className="bi bi-plus-circle me-3"></i>
                Agregar Nuevo Producto
              </h2>
              <p className="mb-0 opacity-75">
                Completa la información del producto que deseas agregar al inventario
              </p>
            </div>
            <button 
              className="btn btn-outline-light"
              onClick={() => navigate(currentUser?.role === 'empleado' ? '/panel-empleado' : '/admin')}
            >
              <i className="bi bi-arrow-left me-2"></i>
              Volver
            </button>
          </div>
        </div>
      </div>

      {/* Información del usuario */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="alert alert-info border-0 shadow-sm">
            <i className="bi bi-info-circle me-2"></i>
            <strong>Agregando como:</strong> {currentUser?.nombre || currentUser?.email} 
            ({currentUser?.role === 'admin' ? 'Administrador' : 'Empleado'})
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

                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">
                        <i className="bi bi-grid me-2"></i>
                        Categoría *
                      </label>
                      <select
                        className="form-select"
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
                      <label className="form-label">
                        <i className="bi bi-box me-2"></i>
                        Stock Total
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        name="stock"
                        value={formData.stock}
                        onChange={handleInputChange}
                        min="0"
                        placeholder="Ej: 50"
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">
                    <i className="bi bi-card-text me-2"></i>
                    Descripción *
                  </label>
                  <textarea
                    className="form-control"
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleInputChange}
                    required
                    rows="3"
                    placeholder="Describe el producto, sus características, materiales, etc."
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">
                    <i className="bi bi-rulers me-2"></i>
                    Tallas y Cantidades
                  </label>
                  {tallas.map((talla, index) => (
                    <div key={index} className="row align-items-center mb-2">
                      <div className="col-md-4">
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
                        <div className="btn-group">
                          {index === tallas.length - 1 && (
                            <button
                              type="button"
                              className="btn btn-outline-primary btn-sm"
                              onClick={agregarTalla}
                            >
                              <i className="bi bi-plus"></i>
                            </button>
                          )}
                          {tallas.length > 1 && (
                            <button
                              type="button"
                              className="btn btn-outline-danger btn-sm"
                              onClick={() => eliminarTalla(index)}
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mb-4">
                  <label className="form-label">
                    <i className="bi bi-image me-2"></i>
                    Imagen del Producto
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    onChange={handleImagenChange}
                    accept="image/*"
                  />
                  <div className="form-text">
                    Si no seleccionas una imagen, se usará una imagen predeterminada según la categoría.
                  </div>
                </div>

                <div className="d-flex justify-content-between">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => navigate(currentUser.role === 'empleado' ? '/panel-empleado' : '/admin')}
                  >
                    <i className="bi bi-x-circle me-2"></i>
                    Cancelar
                  </button>
                  
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Agregando...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-circle me-2"></i>
                        Agregar Producto
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

export default FormularioAddProductoPage;