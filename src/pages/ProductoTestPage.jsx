import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productoService } from '../services/productoService.js';
import { categoriaService } from '../services/categoriaService.js';
import { imagenesDisponibles, categoriaImagenes, obtenerUrlImagen } from '../data/imagenes';

function ProductoTestPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: '',
    precio: '',
    descripcion: '',
    stock: 0,
    imagenUrl: ''
  });
  const [categorias, setCategorias] = useState([]);
  const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState([]);
  const [imagenSeleccionadaLocal, setImagenSeleccionadaLocal] = useState('');
  const [tipoImagen, setTipoImagen] = useState('local');
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });

  // Cargar categorías al iniciar
  useEffect(() => {
    cargarCategorias();
  }, []);

  const cargarCategorias = async () => {
    try {
      const categoriasData = await categoriaService.obtenerTodas();
      setCategorias(categoriasData);
    } catch (error) {
      console.error('Error cargando categorías:', error);
      setMensaje({ tipo: 'error', texto: 'Error al cargar categorías' });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImagenLocalChange = (nombreImagen) => {
    setImagenSeleccionadaLocal(nombreImagen);
    setPreviewUrl(obtenerUrlImagen(nombreImagen));
  };

  const handleTipoImagenChange = (tipo) => {
    setTipoImagen(tipo);
    setPreviewUrl(null);
    setImagenSeleccionadaLocal('');
  };

  const handleCategoriaChange = (categoriaId) => {
    setCategoriasSeleccionadas(prev => {
      const isSelected = prev.includes(categoriaId);
      if (isSelected) {
        return prev.filter(id => id !== categoriaId);
      } else {
        return [...prev, categoriaId];
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensaje({ tipo: '', texto: '' });

    try {
      if (categoriasSeleccionadas.length === 0) {
        throw new Error('Selecciona al menos una categoría');
      }

      let imagenUrl = formData.imagenUrl;
      if (tipoImagen === 'local' && imagenSeleccionadaLocal) {
        imagenUrl = imagenSeleccionadaLocal;
      }

      const producto = {
        nombre: formData.nombre,
        precio: parseFloat(formData.precio),
        descripcion: formData.descripcion,
        stock: parseInt(formData.stock) || 0,
        imagenUrl: imagenUrl || null
      };

      console.log('Creando producto:', producto);
      const productoCreado = await productoService.crear(producto);
      
      if (categoriasSeleccionadas.length > 0) {
        await productoService.agregarCategorias(productoCreado.id, categoriasSeleccionadas);
      }

      setMensaje({ 
        tipo: 'success', 
        texto: '¡Producto creado exitosamente!' 
      });

      // Limpiar formulario
      setFormData({
        nombre: '',
        precio: '',
        descripcion: '',
        stock: 0,
        imagenUrl: ''
      });
      setCategoriasSeleccionadas([]);
      setImagenSeleccionadaLocal('');
      setPreviewUrl(null);

    } catch (error) {
      console.error('Error creando producto:', error);
      setMensaje({ 
        tipo: 'error', 
        texto: 'Error al crear producto: ' + error.message 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-8 mx-auto">
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <h2 className="mb-0">
                <i className="bi bi-plus-circle me-2"></i>
                Crear Nuevo Producto (Página de Prueba)
              </h2>
            </div>
            
            <div className="card-body">
              {mensaje.texto && (
                <div className={`alert alert-${mensaje.tipo === 'success' ? 'success' : 'danger'}`}>
                  {mensaje.texto}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {/* Información básica */}
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Nombre del Producto *</label>
                      <input
                        type="text"
                        className="form-control"
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
                  </div>
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

                {/* Selector de imagen */}
                <div className="mb-4">
                  <label className="form-label">Imagen del Producto</label>
                  
                  <div className="btn-group mb-3" role="group">
                    <input 
                      type="radio" 
                      className="btn-check" 
                      name="tipoImagen" 
                      id="local-test" 
                      checked={tipoImagen === 'local'}
                      onChange={() => handleTipoImagenChange('local')}
                    />
                    <label className="btn btn-outline-primary" htmlFor="local-test">
                      <i className="bi bi-folder-fill me-1"></i>
                      Imágenes Locales
                    </label>

                    <input 
                      type="radio" 
                      className="btn-check" 
                      name="tipoImagen" 
                      id="url-test" 
                      checked={tipoImagen === 'url'}
                      onChange={() => handleTipoImagenChange('url')}
                    />
                    <label className="btn btn-outline-primary" htmlFor="url-test">
                      <i className="bi bi-link me-1"></i>
                      URL
                    </label>
                  </div>

                  {tipoImagen === 'local' && (
                    <select 
                      className="form-select mb-3"
                      value={imagenSeleccionadaLocal}
                      onChange={(e) => handleImagenLocalChange(e.target.value)}
                    >
                      <option value="">Selecciona una imagen...</option>
                      <optgroup label="Imágenes de Productos">
                        {categoriaImagenes.productos.map(img => (
                          <option key={img} value={img}>{img}</option>
                        ))}
                      </optgroup>
                      <optgroup label="Imágenes de Anime">
                        {categoriaImagenes.anime.map(img => (
                          <option key={img} value={img}>{img}</option>
                        ))}
                      </optgroup>
                    </select>
                  )}

                  {tipoImagen === 'url' && (
                    <input
                      type="url"
                      className="form-control"
                      name="imagenUrl"
                      value={formData.imagenUrl || ''}
                      onChange={handleInputChange}
                      placeholder="https://ejemplo.com/imagen.jpg"
                    />
                  )}

                  {previewUrl && (
                    <div className="mt-3">
                      <label className="form-label">Vista Previa:</label>
                      <div>
                        <img 
                          src={previewUrl} 
                          alt="Preview" 
                          className="img-thumbnail"
                          style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'cover' }} 
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Categorías */}
                <div className="mb-4">
                  <label className="form-label">Categorías *</label>
                  {categorias.length > 0 ? (
                    <div className="row">
                      {categorias.map(categoria => (
                        <div key={categoria.id} className="col-md-4 col-6 mb-2">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id={`test-categoria-${categoria.id}`}
                              checked={categoriasSeleccionadas.includes(categoria.id)}
                              onChange={() => handleCategoriaChange(categoria.id)}
                            />
                            <label 
                              className="form-check-label" 
                              htmlFor={`test-categoria-${categoria.id}`}
                            >
                              {categoria.nombre}
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="alert alert-warning">
                      <i className="bi bi-exclamation-triangle me-2"></i>
                      No hay categorías disponibles.
                    </div>
                  )}
                </div>

                {/* Botones */}
                <div className="d-flex justify-content-between">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => navigate('/admin')}
                  >
                    <i className="bi bi-arrow-left me-2"></i>
                    Volver
                  </button>
                  
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading || categoriasSeleccionadas.length === 0}
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductoTestPage;