import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { productoService } from '../services/productoService.js';
import { categoriaService } from '../services/categoriaService.js';
import { CKEditor } from 'ckeditor4-react';
import '../styles/rich-text-editor.css';

function FormularioEditarProductoPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { currentUser } = useAuth();

  const [formData, setFormData] = useState({
    nombre: '',
    precio: '',
    categoria: 'POLERA',
    descripcion: '',
    stock: '',
    imagenUrl: ''
  });
  const [tipoProducto, setTipoProducto] = useState('ropa'); // 'ropa' o 'cuadro'
  const [tallas, setTallas] = useState([{ talla: 'S', cantidad: 1 }]);
  const [medidas, setMedidas] = useState([{ medida: '30x40 cm', cantidad: 1 }]);
  const [imagenArchivo, setImagenArchivo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });
  const [producto, setProducto] = useState(null);
  const [modoRichText, setModoRichText] = useState(false);
  const textareaRef = useRef(null);

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

  // Función helper para obtener información del creador/editor desde localStorage
  const obtenerInfoCreadorEditor = (productoId) => {
    try {
      const info = localStorage.getItem(`producto_${productoId}_creador`);
      return info ? JSON.parse(info) : {};
    } catch (error) {
      console.error('Error al obtener info del creador:', error);
      return {};
    }
  };

  // Verificar permisos
  useEffect(() => {
    if (!currentUser || (currentUser.rol !== 'admin' && currentUser.rol !== 'empleado')) {
      navigate('/sesion');
      return;
    }
  }, [currentUser, navigate]);

  // Cargar datos del producto
  useEffect(() => {
    const cargarProducto = async () => {
      if (!id) {
        setMensaje({ tipo: 'error', texto: 'ID de producto no válido' });
        setLoadingData(false);
        return;
      }

      try {
        setLoadingData(true);
        console.log('📋 Cargando producto ID:', id);
        
        const productoEncontrado = await productoService.obtenerPorId(id);
        console.log('📋 Producto cargado:', productoEncontrado);
        
        if (productoEncontrado) {
          // Combinar datos de la API con información del creador/editor desde localStorage
          const infoCreadorEditor = obtenerInfoCreadorEditor(id);
          const productoCompleto = { ...productoEncontrado, ...infoCreadorEditor };
          
          console.log('📋 Info del creador/editor:', infoCreadorEditor);
          setProducto(productoCompleto);
          
          // Mapear categoría de la API a los valores del formulario y determinar tipo
          let categoriaFormulario = 'POLERA';
          let tipoProductoDetectado = 'ropa';
          
          if (productoEncontrado.categorias && productoEncontrado.categorias.length > 0) {
            const nombreCategoria = productoEncontrado.categorias[0].nombre.toLowerCase();
            if (nombreCategoria.includes('poleron') || nombreCategoria.includes('hoodie')) {
              categoriaFormulario = 'POLERON';
              tipoProductoDetectado = 'ropa';
            } else if (nombreCategoria.includes('cuadro')) {
              categoriaFormulario = 'CUADRO';
              tipoProductoDetectado = 'cuadro';
            } else {
              categoriaFormulario = 'POLERA';
              tipoProductoDetectado = 'ropa';
            }
          }
          
          setTipoProducto(tipoProductoDetectado);
          
          setFormData({
            nombre: productoEncontrado.nombre || '',
            precio: productoEncontrado.precio || '',
            categoria: categoriaFormulario,
            descripcion: productoEncontrado.descripcion || '',
            stock: productoEncontrado.stock || '',
            imagenUrl: productoEncontrado.imagenUrl || ''
          });
          
          // Cargar tallas o medidas según el tipo
          if (tipoProductoDetectado === 'ropa' && productoEncontrado.tallas && productoEncontrado.tallas.length > 0) {
            setTallas(productoEncontrado.tallas);
          } else if (tipoProductoDetectado === 'cuadro' && productoEncontrado.medidas && productoEncontrado.medidas.length > 0) {
            setMedidas(productoEncontrado.medidas);
          }
          
          setMensaje({ tipo: 'success', texto: 'Producto cargado correctamente' });
        } else {
          setMensaje({ tipo: 'error', texto: 'Producto no encontrado' });
          setTimeout(() => {
            navigate(currentUser?.rol === 'empleado' ? '/panel-empleado' : '/admin');
          }, 2000);
        }
      } catch (error) {
        console.error('❌ Error cargando producto:', error);
        setMensaje({ tipo: 'error', texto: `Error al cargar el producto: ${error.message}` });
        setTimeout(() => {
          navigate(currentUser?.rol === 'empleado' ? '/panel-empleado' : '/admin');
        }, 3000);
      } finally {
        setLoadingData(false);
      }
    };

    if (id && currentUser) {
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

  // Manejar cambios en medidas
  const handleMedidaChange = (index, field, value) => {
    const nuevasMedidas = [...medidas];
    nuevasMedidas[index][field] = value;
    setMedidas(nuevasMedidas);
  };

  const agregarMedida = () => {
    setMedidas([...medidas, { medida: '30x40 cm', cantidad: 1 }]);
  };

  const eliminarMedida = (index) => {
    if (medidas.length > 1) {
      setMedidas(medidas.filter((_, i) => i !== index));
    }
  };

  // Manejar cambio de tipo de producto
  const handleTipoProductoChange = (tipo) => {
    setTipoProducto(tipo);
    
    // Actualizar categoria automáticamente
    if (tipo === 'cuadro') {
      setFormData(prev => ({ ...prev, categoria: 'CUADRO' }));
    } else {
      // Para ropa, usar POLERA por defecto
      setFormData(prev => ({ ...prev, categoria: 'POLERA' }));
    }
  };

  // Función para insertar HTML en el textarea
  const insertarHTML = (tipo) => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const start = textarea.selectionStart || 0;
    const end = textarea.selectionEnd || 0;
    const textoActual = formData.descripcion || '';
    const textoSeleccionado = textoActual.substring(start, end);
    const textoAntes = textoActual.substring(0, start);
    const textoDespues = textoActual.substring(end);
    
    let nuevoHTML = '';

    switch(tipo) {
      case 'titulo':
        nuevoHTML = textoSeleccionado ? `<h2>${textoSeleccionado}</h2>` : '<h2>Título aquí</h2>';
        break;
      case 'parrafo':
        nuevoHTML = textoSeleccionado ? `<p>${textoSeleccionado}</p>` : '<p>Texto del párrafo</p>';
        break;
      case 'negrita':
        nuevoHTML = textoSeleccionado ? `<strong>${textoSeleccionado}</strong>` : '<strong>texto en negrita</strong>';
        break;
      case 'lista':
        nuevoHTML = '<ul>\n  <li>Punto 1</li>\n  <li>Punto 2</li>\n  <li>Punto 3</li>\n</ul>';
        break;
      case 'enlace':
        const url = prompt('Ingresa la URL:');
        if (!url) return;
        nuevoHTML = textoSeleccionado ? `<a href="${url}">${textoSeleccionado}</a>` : `<a href="${url}">texto del enlace</a>`;
        break;
      default:
        return;
    }

    const nuevoTexto = textoAntes + nuevoHTML + textoDespues;
    setFormData(prev => ({ ...prev, descripcion: nuevoTexto }));
    
    setTimeout(() => {
      textarea.focus();
      const newPos = start + nuevoHTML.length;
      textarea.setSelectionRange(newPos, newPos);
    }, 10);
  };

  const handleImagenChange = async (e) => {
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
        const reader = new FileReader();
        reader.onload = () => {
          setImagenArchivo(file);
          setFormData(prev => ({ ...prev, imagenUrl: reader.result }));
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error('Error al procesar imagen:', error);
        alert('Error al procesar la imagen');
      }
    }
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

      console.log('📝 Actualizando producto ID:', id);

      // Detectar si es una imagen base64 (local) o URL
      let imagenBase64 = null;
      let imagenUrlParaAPI = formData.imagenUrl;
      const esImagenLocal = formData.imagenUrl && formData.imagenUrl.startsWith('data:image');
      
      if (esImagenLocal) {
        // Guardar la imagen base64 para localStorage
        imagenBase64 = formData.imagenUrl;
        // NO enviar la imagen a la API
        imagenUrlParaAPI = null;
      }

      const datosActualizados = {
        nombre: formData.nombre,
        precio: parseFloat(formData.precio),
        descripcion: formData.descripcion,
        stock: formData.stock ? parseInt(formData.stock) : 0,
        imagenUrl: imagenUrlParaAPI || null
        // Nota: Los campos del creador/editor se manejan en localStorage
      };

      console.log('📝 Datos a actualizar:', datosActualizados);
      console.log('📝 Imagen local (base64):', esImagenLocal);

      // Actualizar el producto usando la API
      const productoActualizado = await productoService.actualizar(id, datosActualizados);
      console.log('✅ Producto actualizado:', productoActualizado);
      
      // Actualizar información del editor en localStorage
      const editorInfo = {
        editadoPor: currentUser?.email || currentUser?.usuario || 'Admin',
        editorNombre: currentUser?.nombre || currentUser?.email || currentUser?.usuario || 'Admin',
        fechaEdicion: new Date().toISOString()
      };
      
      // Obtener info existente del creador y combinar con editor
      let infoProducto = {};
      try {
        const infoExistente = localStorage.getItem(`producto_${id}_creador`);
        if (infoExistente) {
          infoProducto = JSON.parse(infoExistente);
        }
      } catch (error) {
        console.log('No hay info previa del creador');
      }
      
      // Combinar info del creador con la del editor
      const infoCompleta = { ...infoProducto, ...editorInfo };
      localStorage.setItem(`producto_${id}_creador`, JSON.stringify(infoCompleta));
      console.log('✅ Información del editor actualizada en localStorage');
      
      // Guardar imagen local (base64) en localStorage si existe
      if (imagenBase64) {
        localStorage.setItem(`producto_${id}_imagen`, imagenBase64);
        console.log('✅ Imagen local actualizada en localStorage');
      }

      setMensaje({ tipo: 'success', texto: 'Producto actualizado exitosamente' });
      
      // Redirigir después de 2 segundos
      setTimeout(() => {
        navigate(currentUser?.rol === 'empleado' ? '/panel-empleado' : '/admin');
      }, 2000);

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
      if (currentUser.rol === 'empleado') {
        navigate('/panel-empleado');
      } else {
        navigate('/admin');
      }
    }, 2000);
  };

  if (!currentUser || (currentUser.rol !== 'admin' && currentUser.rol !== 'empleado')) {
    return null;
  }

  console.log('🔍 Estado actual:', { loadingData, producto, currentUser, id });

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
    console.log('❌ Producto no encontrado, mostrando error');
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
              onClick={() => navigate(currentUser?.rol === 'empleado' ? '/panel-empleado' : '/admin')}
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
            ({currentUser?.rol === 'admin' ? 'Administrador' : 'Empleado'})
          </div>
        </div>
        <div className="col-md-6">
          <div className="alert alert-secondary border-0 shadow-sm">
            <i className="bi bi-person me-2"></i>
            <strong>Creado por:</strong> {producto?.creadorNombre || producto?.creadoPor || 'N/A'}
            {(producto?.editorNombre || producto?.editadoPor) && (
              <>
                <br />
                <i className="bi bi-pencil me-2"></i>
                <strong>Última edición:</strong> {producto?.editorNombre || producto?.editadoPor}
              </>
            )}
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
                    ({currentUser?.rol === 'admin' ? 'Administrador' : 'Empleado'})
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="alert alert-secondary border-0 shadow-sm">
                    <i className="bi bi-person me-2"></i>
                    <strong>Creado por:</strong> {producto?.creadorNombre || producto?.creadoPor || 'N/A'}
                    {(producto?.editorNombre || producto?.editadoPor) && (
                      <>
                        <br />
                        <i className="bi bi-pencil me-2"></i>
                        <strong>Última edición:</strong> {producto?.editorNombre || producto?.editadoPor}
                      </>
                    )}
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
                        <option value="POLERA">Poleras</option>
                        <option value="POLERON">Polerones</option>
                        <option value="CUADRO">Cuadros</option>
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
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <label className="form-label fw-semibold mb-0">
                      <i className="bi bi-card-text me-2 text-secondary"></i>
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
                        key="ckeditor-edit"
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
                      rows="4"
                      placeholder="Describe el producto, sus características, materiales, etc."
                      style={{resize: 'vertical'}}
                    />
                  )}
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold">
                    <i className="bi bi-image me-2 text-primary"></i>
                    URL de la Imagen
                  </label>
                  <input
                    type="url"
                    className="form-control form-control-lg"
                    name="imagenUrl"
                    value={formData.imagenUrl}
                    onChange={handleInputChange}
                    placeholder="https://ejemplo.com/imagen.jpg"
                  />
                  <div className="form-text">
                    URL de la imagen del producto. Si está vacía, se usará la imagen por defecto.
                  </div>
                  {formData.imagenUrl && (
                    <div className="mt-2">
                      <small className="text-muted">Vista previa:</small>
                      <br />
                      <img 
                        src={formData.imagenUrl} 
                        alt="Vista previa"
                        className="img-thumbnail mt-1"
                        style={{maxWidth: '150px', maxHeight: '150px'}}
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Tallas o Medidas según el tipo de producto */}
                {tipoProducto === 'ropa' ? (
                  <div className="mb-4">
                    <label className="form-label fw-semibold">
                      <i className="bi bi-rulers me-2 text-warning"></i>
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
                ) : (
                  <div className="mb-4">
                    <label className="form-label fw-semibold">
                      <i className="bi bi-aspect-ratio me-2 text-info"></i>
                      Medidas y Cantidades
                    </label>
                    <div className="border rounded p-3 bg-light">
                      {medidas.map((medida, index) => (
                        <div key={index} className="row align-items-center mb-3">
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
                  
                  {/* Mostrar imagen actual */}
                  {(producto?.imagenUrl || formData.imagenUrl) && (
                    <div className="mb-3">
                      <label className="form-label small">Imagen actual:</label>
                      <div className="border rounded p-2 bg-light">
                        <img 
                          src={formData.imagenUrl || producto?.imagenUrl} 
                          alt={producto?.nombre}
                          className="img-thumbnail"
                          style={{maxWidth: '300px', maxHeight: '300px', objectFit: 'contain'}}
                        />
                      </div>
                    </div>
                  )}
                  
                  {/* Subir nueva imagen */}
                  <div className="mb-3">
                    <label className="form-label small">Cambiar imagen (desde tu computadora):</label>
                    <input
                      type="file"
                      className="form-control"
                      onChange={handleImagenChange}
                      accept="image/*"
                    />
                    <div className="form-text">
                      Formatos: JPG, PNG, GIF, WEBP (Máximo 5MB). Si no seleccionas nada, se mantiene la actual.
                    </div>
                    {imagenArchivo && (
                      <div className="mt-2 small text-success">
                        <i className="bi bi-check-circle me-1"></i>
                        Nueva imagen seleccionada: {imagenArchivo.name}
                      </div>
                    )}
                  </div>
                </div>

                <div className="d-flex justify-content-between gap-3 pt-4 border-top">
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-lg px-4"
                    onClick={() => navigate(currentUser?.rol === 'empleado' ? '/panel-empleado' : '/admin')}
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