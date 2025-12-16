import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { productoService } from '../services/productoService.js';
import { categoriaService } from '../services/categoriaService.js';
import { CKEditor } from 'ckeditor4-react';
import '../styles/rich-text-editor.css';


function FormularioAddProductoPage() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [formData, setFormData] = useState({
    nombre: '',
    precio: '',
    descripcion: '',
    stock: 0,
    imagenUrl: ''
  });
  const [categorias, setCategorias] = useState([]);
  const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState([]);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [tipoProducto, setTipoProducto] = useState('ropa'); // 'ropa' o 'cuadro'
  const [tallas, setTallas] = useState([{ talla: 'M', cantidad: 1 }]);
  const [medidas, setMedidas] = useState([{ medida: '30x40 cm', cantidad: 1 }]);
  const [loading, setLoading] = useState(false);
  const [categoriasLoading, setCategoriasLoading] = useState(true);
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });
  const [modoRichText, setModoRichText] = useState(false);
  const textareaRef = useRef(null);
  const [imagenArchivo, setImagenArchivo] = useState(null);

  // Medidas predefinidas para cuadros
  const medidasPredefinidas = [
    '20x25 cm',
    '30x40 cm',
    '40x50 cm',
    '50x60 cm',
    '50x70 cm',
    '60x80 cm',
    '70x100 cm',
    '80x120 cm',
    '100x150 cm'
  ];

  // Función para convertir imagen a base64
  const convertirImagenABase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Manejar selección de archivo de imagen
  const handleImagenArchivoChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validar que sea una imagen
      if (!file.type.startsWith('image/')) {
        alert('Por favor selecciona un archivo de imagen válido');
        return;
      }
      
      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('La imagen es muy grande. Máximo 5MB');
        return;
      }

      try {
        const base64 = await convertirImagenABase64(file);
        setImagenArchivo(file);
        setFormData(prev => ({ ...prev, imagenUrl: base64 }));
        setPreviewUrl(base64);
      } catch (error) {
        console.error('Error al convertir imagen:', error);
        alert('Error al procesar la imagen');
      }
    }
  };

  // Cargar categorías al iniciar
  useEffect(() => {
    cargarCategorias();
  }, []);

  // Este useEffect se removió porque manejamos la autenticación más abajo con return statements

  const cargarCategorias = async () => {
    try {
      setCategoriasLoading(true);
      
      // USAR SIEMPRE LAS CATEGORÍAS CORRECTAS
      const categoriasCorrectas = [
        { id: 1, nombre: 'POLERA', descripcion: 'Camisetas y poleras' },
        { id: 2, nombre: 'POLERON', descripcion: 'Sudaderas y hoodies' },
        { id: 3, nombre: 'CUADRO', descripcion: 'Arte y decoración' }
      ];
      
      setCategorias(categoriasCorrectas);
      console.log('✅ Categorías fijas configuradas:', categoriasCorrectas);
      
    } catch (error) {
      console.error('Error cargando categorías:', error);
      // Usar categorías por defecto
      setCategorias([
        { id: 1, nombre: 'POLERA', descripcion: 'Camisetas y poleras' },
        { id: 2, nombre: 'POLERON', descripcion: 'Sudaderas y hoodies' },
        { id: 3, nombre: 'CUADRO', descripcion: 'Arte y decoración' }
      ]);
    } finally {
      setCategoriasLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'precio' || name === 'stock' ? parseFloat(value) : value
    }));
  };

  // Manejar URL de imagen
  const handleImageUrlChange = (e) => {
    const url = e.target.value;
    setFormData(prev => ({ ...prev, imagenUrl: url }));
    setPreviewUrl(url);
  };

  // Manejar selección de categorías
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

  // Manejar cambios en las tallas
  const handleTallaChange = (index, field, value) => {
    setTallas(prev => 
      prev.map((talla, i) => 
        i === index ? { ...talla, [field]: value } : talla
      )
    );
  };

  // Agregar nueva talla
  const agregarTalla = () => {
    setTallas(prev => [...prev, { talla: 'M', cantidad: 1 }]);
  };

  // Eliminar talla
  const eliminarTalla = (index) => {
    if (tallas.length > 1) {
      setTallas(prev => prev.filter((_, i) => i !== index));
    }
  };

  // Manejar cambios en medidas
  const handleMedidaChange = (index, field, value) => {
    setMedidas(prev => 
      prev.map((medida, i) => 
        i === index ? { ...medida, [field]: value } : medida
      )
    );
  };

  // Agregar medida
  const agregarMedida = () => {
    setMedidas(prev => [...prev, { medida: '30x40 cm', cantidad: 1 }]);
  };

  // Eliminar medida
  const eliminarMedida = (index) => {
    if (medidas.length > 1) {
      setMedidas(prev => prev.filter((_, i) => i !== index));
    }
  };

  // Manejar cambio de tipo de producto
  const handleTipoProductoChange = (tipo) => {
    setTipoProducto(tipo);
    
    // Actualizar categorías seleccionadas automáticamente
    if (tipo === 'cuadro') {
      const cuadroCategoria = categorias.find(cat => cat.nombre === 'CUADRO');
      if (cuadroCategoria) {
        setCategoriasSeleccionadas([cuadroCategoria.id]);
      }
    } else {
      // Para ropa, limpiar selección para que el usuario elija
      setCategoriasSeleccionadas([]);
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

      if (formData.stock < 0) {
        throw new Error('El stock no puede ser negativo');
      }

      if (categoriasSeleccionadas.length === 0) {
        throw new Error('Selecciona al menos una categoría');
      }

      // Preparar datos del producto
      let imagenUrl = formData.imagenUrl;
      let imagenBase64 = null;
      
      // Detectar si es una imagen base64 (local) o URL
      const esImagenLocal = imagenUrl && imagenUrl.startsWith('data:image');
      
      if (esImagenLocal) {
        // Guardar la imagen base64 para localStorage
        imagenBase64 = imagenUrl;
        // NO enviar la imagen a la API
        imagenUrl = null;
      }
      
      const producto = {
        nombre: formData.nombre,
        precio: parseFloat(formData.precio),
        descripcion: formData.descripcion,
        stock: parseInt(formData.stock) || 0,
        imagenUrl: imagenUrl || null // Solo URLs, no base64
        // Nota: Los campos del creador se manejan en localStorage después de la creación
      };

      console.log('Creando producto:', producto);
      console.log('Imagen local (base64):', esImagenLocal);
      console.log('Usuario actual:', currentUser);

      // 1. Crear el producto primero
      const productoCreado = await productoService.crear(producto);
      
      console.log('Producto creado:', productoCreado);
      
      // Guardar información del creador en localStorage (temporal hasta actualización del backend)
      const creadorInfo = {
        creadoPor: currentUser?.email || currentUser?.usuario || 'Admin',
        creadorNombre: currentUser?.nombre || currentUser?.email || currentUser?.usuario || 'Admin',
        fechaCreacion: new Date().toISOString()
      };
      
      // Usar el ID del producto creado para almacenar la info del creador
      if (productoCreado?.id) {
        localStorage.setItem(`producto_${productoCreado.id}_creador`, JSON.stringify(creadorInfo));
        console.log('✅ Información del creador guardada en localStorage');
        
        // Guardar imagen local (base64) en localStorage si existe
        if (imagenBase64) {
          localStorage.setItem(`producto_${productoCreado.id}_imagen`, imagenBase64);
          console.log('✅ Imagen local guardada en localStorage');
        }
      }

      // 2. Asignar categorías al producto
      if (categoriasSeleccionadas.length > 0) {
        try {
          // Primero obtener las categorías reales de la base de datos
          const categoriasReales = await categoriaService.obtenerTodas();
          console.log('Categorías reales en BD:', categoriasReales);
          
          // Mapear los IDs seleccionados a los nombres y luego a los IDs reales
          const idsReales = [];
          for (const idSeleccionado of categoriasSeleccionadas) {
            // Encontrar el nombre de la categoría seleccionada
            const categoriaSeleccionada = categorias.find(c => c.id === idSeleccionado);
            if (categoriaSeleccionada) {
              // Buscar la categoría real por nombre
              const categoriaReal = categoriasReales.find(cr => 
                cr.nombre === categoriaSeleccionada.nombre ||
                cr.nombre.toLowerCase() === categoriaSeleccionada.nombre.toLowerCase()
              );
              if (categoriaReal) {
                idsReales.push(categoriaReal.id);
              }
            }
          }
          
          console.log('IDs reales a asignar:', idsReales);
          
          if (idsReales.length > 0) {
            await productoService.agregarCategorias(productoCreado.id, idsReales);
            console.log('Categorías asignadas correctamente');
          }
        } catch (error) {
          console.error('Error asignando categorías:', error);
        }
      }


      
      setMensaje({ tipo: 'success', texto: 'Producto creado exitosamente con imagen y categorías' });
      
      // Limpiar formulario
      setFormData({
        nombre: '',
        precio: '',
        descripcion: '',
        stock: 0,
        imagenUrl: ''
      });
      setCategoriasSeleccionadas([]);
      setPreviewUrl(null);
      setTipoProducto('ropa');
      setTallas([{ talla: 'M', cantidad: 1 }]);
      setMedidas([{ medida: '30x40 cm', cantidad: 1 }]);
      
      // Redirigir después de 2 segundos
      setTimeout(() => {
        if (currentUser.rol === 'empleado') {
          navigate('/panel-empleado');
        } else {
          navigate('/admin');
        }
      }, 2000);

    } catch (error) {
      console.error('Error creando producto:', error);
      setMensaje({ tipo: 'error', texto: error.message || 'Error al crear el producto' });
    } finally {
      setLoading(false);
      
      // Limpiar mensaje después de 5 segundos
      setTimeout(() => {
        setMensaje({ tipo: '', texto: '' });
      }, 5000);
    }
  };

  if (!currentUser) {
    return (
      <div className="container mt-5">
        <div className="row">
          <div className="col-md-6 mx-auto">
            <div className="card">
              <div className="card-body text-center">
                <i className="bi bi-exclamation-triangle display-1 text-warning"></i>
                <h3 className="mt-3">Acceso Requerido</h3>
                <p className="text-muted">
                  Debes iniciar sesión como administrador o empleado para agregar productos.
                </p>
                <div className="alert alert-info">
                  <strong>Usuarios de prueba:</strong><br/>
                  👤 admin / admin<br/>
                  👤 empleado / empleado
                </div>
                <button 
                  className="btn btn-primary me-2"
                  onClick={() => navigate('/sesion')}
                >
                  Iniciar Sesión
                </button>
                <button 
                  className="btn btn-outline-secondary"
                  onClick={() => navigate('/test-producto')}
                >
                  Página de Prueba
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentUser.rol !== 'admin' && currentUser.rol !== 'empleado') {
    return (
      <div className="container mt-5">
        <div className="row">
          <div className="col-md-6 mx-auto">
            <div className="card">
              <div className="card-body text-center">
                <i className="bi bi-shield-exclamation display-1 text-danger"></i>
                <h3 className="mt-3">Sin Permisos</h3>
                <p className="text-muted">
                  No tienes permisos para agregar productos. Solo administradores y empleados pueden hacerlo.
                </p>
                <button 
                  className="btn btn-secondary"
                  onClick={() => navigate('/')}
                >
                  Ir al Inicio
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-5" style={{backgroundColor: '#f8f9fa', minHeight: '100vh', paddingBottom: '120px'}}>
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
              onClick={() => navigate(currentUser?.rol === 'empleado' ? '/panel-empleado' : '/admin')}
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
            ({currentUser?.rol === 'admin' ? 'Administrador' : 'Empleado'})
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
                {/* Selector de tipo de producto */}
                <div className="row mb-4">
                  <div className="col-12">
                    <div className="mb-3">
                      <label className="form-label fw-semibold">
                        <i className="bi bi-grid-3x3-gap me-2 text-info"></i>
                        Tipo de Producto *
                      </label>
                      <div className="btn-group w-100" role="group">
                        <input 
                          type="radio" 
                          className="btn-check" 
                          name="tipoProducto" 
                          id="tipoRopa" 
                          value="ropa" 
                          checked={tipoProducto === 'ropa'}
                          onChange={(e) => handleTipoProductoChange(e.target.value)}
                        />
                        <label className="btn btn-outline-primary" htmlFor="tipoRopa">
                          <i className="bi bi-person me-2"></i>
                          Ropa (Poleras, Polerones)
                        </label>

                        <input 
                          type="radio" 
                          className="btn-check" 
                          name="tipoProducto" 
                          id="tipoCuadro" 
                          value="cuadro" 
                          checked={tipoProducto === 'cuadro'}
                          onChange={(e) => handleTipoProductoChange(e.target.value)}
                        />
                        <label className="btn btn-outline-secondary" htmlFor="tipoCuadro">
                          <i className="bi bi-image me-2"></i>
                          Cuadros y Arte
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

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
                        Categorías * (selecciona una o más)
                      </label>
                      <div className="border rounded p-3" style={{ maxHeight: '150px', overflowY: 'auto' }}>
                        {categoriasLoading ? (
                          <div className="text-center">
                            <div className="spinner-border spinner-border-sm me-2"></div>
                            Cargando categorías...
                          </div>
                        ) : categorias.length > 0 ? (
                          categorias.map(categoria => (
                            <div key={categoria.id} className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                id={`categoria-${categoria.id}`}
                                checked={categoriasSeleccionadas.includes(categoria.id)}
                                onChange={() => handleCategoriaChange(categoria.id)}
                              />
                              <label className="form-check-label" htmlFor={`categoria-${categoria.id}`}>
                                {categoria.nombre}
                              </label>
                            </div>
                          ))
                        ) : (
                          <div className="text-muted">
                            <i className="bi bi-exclamation-circle me-2"></i>
                            No hay categorías disponibles. 
                            <button 
                              type="button" 
                              className="btn btn-link p-0 ms-1"
                              onClick={() => navigate('/admin')}
                            >
                              Crear una categoría primero
                            </button>
                          </div>
                        )}
                      </div>
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
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <label className="form-label mb-0">
                      <i className="bi bi-card-text me-2"></i>
                      Descripción *
                    </label>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => setModoRichText(!modoRichText)}
                    >
                      <i className={`bi bi-${modoRichText ? 'code-slash' : 'type-bold'} me-1`}></i>
                      {modoRichText ? 'Modo Simple' : 'Editor Rico'}
                    </button>
                  </div>
                  
                  {modoRichText ? (
                    <div className="border rounded p-2">
                      <CKEditor
                        key="ckeditor-add"
                        initData={formData.descripcion || '<p>Escribe la descripción del producto aquí...</p>'}
                        editorUrl="https://cdn.ckeditor.com/4.22.1/full/ckeditor.js"
                        onInstanceReady={(editor) => {
                          console.log('CKEditor listo', editor);
                        }}
                        onChange={(evt) => {
                          const data = evt.editor.getData();
                          setFormData(prev => ({ ...prev, descripcion: data }));
                        }}
                        config={{
                          toolbar: [
                            { name: 'basicstyles', items: ['Bold', 'Italic', 'Underline', 'Strike'] },
                            { name: 'paragraph', items: ['NumberedList', 'BulletedList'] },
                            { name: 'styles', items: ['Format'] },
                            { name: 'insert', items: ['Image'] },
                            { name: 'links', items: ['Link', 'Unlink'] },
                            { name: 'tools', items: ['RemoveFormat'] }
                          ],
                          height: 300,
                          format_tags: 'p;h2;h3',
                          removePlugins: 'elementspath',
                          resize_enabled: false,
                          filebrowserImageBrowseUrl: '',
                          filebrowserUploadUrl: '',
                          extraPlugins: 'uploadimage,clipboard',
                          uploadUrl: '',
                          imageUploadUrl: '',
                          pasteFromWordRemoveStyles: false,
                          pasteFromWordRemoveFontStyles: false,
                          forcePasteAsPlainText: false,
                          allowedContent: true
                        }}
                      />
                      <small className="text-muted d-block mt-2">
                        <i className="bi bi-info-circle me-1"></i>
                        Usa la barra de herramientas para dar formato al texto
                      </small>
                    </div>
                  ) : (
                    <textarea
                      className="form-control"
                      name="descripcion"
                      value={formData.descripcion}
                      onChange={handleInputChange}
                      required
                      rows="3"
                      placeholder="Describe el producto, sus características, materiales, etc."
                    />
                  )}
                </div>

                {/* Tallas o Medidas según el tipo de producto */}
                {tipoProducto === 'ropa' ? (
                  <div className="mb-3">
                    <label className="form-label">
                      <i className="bi bi-rulers me-2 text-warning"></i>
                      Tallas y Cantidades
                    </label>
                    <div className="border rounded p-3 bg-light">
                      {tallas.map((talla, index) => (
                        <div key={index} className="row align-items-center mb-2">
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
                ) : (
                  <div className="mb-3">
                    <label className="form-label">
                      <i className="bi bi-aspect-ratio me-2 text-info"></i>
                      Medidas y Cantidades
                    </label>
                    <div className="border rounded p-3 bg-light">
                      {medidas.map((medida, index) => (
                        <div key={index} className="row align-items-center mb-2">
                          <div className="col-md-4">
                            <label className="form-label small">Medida</label>
                            <select
                              className="form-select"
                              value={medida.medida}
                              onChange={(e) => handleMedidaChange(index, 'medida', e.target.value)}
                            >
                              {medidasPredefinidas.map(med => (
                                <option key={med} value={med}>{med}</option>
                              ))}
                            </select>
                          </div>
                          <div className="col-md-4">
                            <label className="form-label small">Cantidad</label>
                            <input
                              type="number"
                              className="form-control"
                              placeholder="Cantidad"
                              min="1"
                              value={medida.cantidad}
                              onChange={(e) => handleMedidaChange(index, 'cantidad', parseInt(e.target.value) || 1)}
                            />
                          </div>
                          <div className="col-md-4">
                            <label className="form-label small">Acciones</label>
                            <div className="btn-group w-100">
                              {index === medidas.length - 1 && (
                                <button
                                  type="button"
                                  className="btn btn-outline-success btn-sm"
                                  onClick={agregarMedida}
                                >
                                  <i className="bi bi-plus"></i> Agregar
                                </button>
                              )}
                              {medidas.length > 1 && (
                                <button
                                  type="button"
                                  className="btn btn-outline-danger btn-sm"
                                  onClick={() => eliminarMedida(index)}
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
                )}

                <div className="mb-4">
                  <label className="form-label fw-semibold">
                    <i className="bi bi-image me-2 text-info"></i>
                    Imagen del Producto
                  </label>
                  
                  {/* Opción 1: Subir archivo */}
                  <div className="mb-3">
                    <label className="form-label small">Subir imagen desde tu computadora:</label>
                    <input
                      type="file"
                      className="form-control"
                      accept="image/*"
                      onChange={handleImagenArchivoChange}
                    />
                    <div className="form-text">
                      Formatos: JPG, PNG, GIF, WEBP (Máximo 5MB)
                    </div>
                  </div>

                  {/* Opción 2: URL */}
                  <div className="mb-3">
                    <label className="form-label small">O ingresa una URL:</label>
                    <input
                      type="url"
                      className="form-control"
                      name="imagenUrl"
                      value={imagenArchivo ? '' : (formData.imagenUrl || '')}
                      onChange={handleImageUrlChange}
                      placeholder="https://ejemplo.com/imagen.jpg"
                      disabled={!!imagenArchivo}
                    />
                    {imagenArchivo && (
                      <button 
                        type="button" 
                        className="btn btn-sm btn-outline-secondary mt-2"
                        onClick={() => {
                          setImagenArchivo(null);
                          setFormData(prev => ({ ...prev, imagenUrl: '' }));
                          setPreviewUrl(null);
                        }}
                      >
                        <i className="bi bi-x-circle me-1"></i>
                        Quitar imagen y usar URL
                      </button>
                    )}
                  </div>

                  {/* Vista previa de imagen */}
                  {previewUrl && (
                    <div className="mt-3">
                      <label className="form-label">Vista Previa:</label>
                      <div className="image-preview border rounded p-2 bg-light">
                        <img 
                          src={previewUrl} 
                          alt="Preview" 
                          className="img-thumbnail"
                          style={{ maxWidth: '300px', maxHeight: '300px', objectFit: 'contain' }} 
                        />
                        {imagenArchivo && (
                          <div className="mt-2 small text-muted">
                            <i className="bi bi-check-circle text-success me-1"></i>
                            Archivo: {imagenArchivo.name} ({(imagenArchivo.size / 1024).toFixed(1)} KB)
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Sección de categorías */}
                <div className="mb-4">
                  <label className="form-label">
                    <i className="bi bi-tags me-2"></i>
                    Categorías *
                  </label>
                  <div className="form-text mb-3">
                    {tipoProducto === 'cuadro' 
                      ? 'Categoria seleccionada automáticamente para cuadros:'
                      : 'Selecciona las categorías de ropa:'
                    }
                  </div>
                  {categorias.length > 0 ? (
                    <div className="row">
                      {categorias
                        .filter(categoria => 
                          tipoProducto === 'cuadro' 
                            ? categoria.nombre === 'CUADRO'
                            : categoria.nombre !== 'CUADRO'
                        )
                        .map(categoria => (
                        <div key={categoria.id} className="col-md-4 col-6 mb-2">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id={`categoria-${categoria.id}`}
                              checked={categoriasSeleccionadas.includes(categoria.id)}
                              onChange={() => handleCategoriaChange(categoria.id)}
                              disabled={tipoProducto === 'cuadro'}
                            />
                            <label 
                              className="form-check-label" 
                              htmlFor={`categoria-${categoria.id}`}
                            >
                              {categoria.nombre}
                              {categoria.nombre === 'POLERA' && ' (Camisetas)'}
                              {categoria.nombre === 'POLERON' && ' (Sudaderas)'}
                              {categoria.nombre === 'CUADRO' && ' (Arte y Decoración)'}
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="alert alert-warning">
                      <i className="bi bi-exclamation-triangle me-2"></i>
                      No hay categorías disponibles. Crea una categoría primero en el panel de administración.
                    </div>
                  )}
                  {categoriasSeleccionadas.length === 0 && (
                    <div className="form-text text-danger">
                      Debe seleccionar al menos una categoría
                    </div>
                  )}
                </div>

                <div className="d-flex justify-content-between">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => navigate(currentUser.rol === 'empleado' ? '/panel-empleado' : '/admin')}
                  >
                    <i className="bi bi-x-circle me-2"></i>
                    Cancelar
                  </button>
                  
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading || categoriasSeleccionadas.length === 0}
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