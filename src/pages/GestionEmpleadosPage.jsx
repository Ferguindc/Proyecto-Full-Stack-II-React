import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

function GestionEmpleadosPage() {
  const { crearEmpleado, obtenerEmpleados, editarEmpleado, toggleEmpleadoActivo, currentUser } = useAuth();
  const [empleados, setEmpleados] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingEmpleado, setEditingEmpleado] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    contrasena: '',
    telefono: '',
    cargo: '',
    departamento: ''
  });
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });

  useEffect(() => {
    cargarEmpleados();
  }, []);

  const cargarEmpleados = async () => {
    try {
      console.log('🔄 Cargando empleados...');
      const listaEmpleados = await obtenerEmpleados();
      console.log('👥 Lista de empleados recibida:', listaEmpleados);
      setEmpleados(listaEmpleados);
      console.log('✅ Estado de empleados actualizado');
    } catch (error) {
      console.error('❌ Error al cargar empleados:', error);
      setMensaje({ tipo: 'error', texto: 'Error al cargar la lista de empleados' });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const limpiarFormulario = () => {
    setFormData({
      nombre: '',
      apellido: '',
      email: '',
      contrasena: '',
      telefono: '',
      cargo: '',
      departamento: ''
    });
    setEditingEmpleado(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validaciones básicas
    if (!formData.nombre || !formData.apellido || !formData.email || !formData.contrasena) {
      setMensaje({ tipo: 'error', texto: 'Por favor completa todos los campos obligatorios' });
      return;
    }

    try {
      if (editingEmpleado) {
        // Editar empleado
        const { contrasena, ...datosParaEditar } = formData;
        if (contrasena) {
          datosParaEditar.contrasena = contrasena;
        }
        
        const resultado = await editarEmpleado(editingEmpleado.id, datosParaEditar);
        if (resultado.success) {
          setMensaje({ tipo: 'success', texto: 'Empleado actualizado correctamente' });
          await cargarEmpleados();
          setShowModal(false);
          limpiarFormulario();
        } else {
          setMensaje({ tipo: 'error', texto: resultado.message });
        }
      } else {
        // Crear nuevo empleado
        console.log('🆕 CREANDO EMPLEADO - Datos del formulario:', formData);
        const resultado = await crearEmpleado(formData);
        console.log('🆕 RESULTADO CREACIÓN:', resultado);
        
        if (resultado.success) {
          setMensaje({ tipo: 'success', texto: 'Empleado creado correctamente' });
          console.log('✅ Empleado creado exitosamente, recargando lista...');
          
          // Esperar un poco y recargar
          setTimeout(async () => {
            await cargarEmpleados();
          }, 500);
          
          setShowModal(false);
          limpiarFormulario();
        } else {
          console.error('❌ Error en creación:', resultado.message);
          setMensaje({ tipo: 'error', texto: resultado.message });
        }
      }
    } catch (error) {
      console.error('Error en handleSubmit:', error);
      setMensaje({ tipo: 'error', texto: 'Error al procesar la solicitud' });
    }

    // Limpiar mensaje después de 3 segundos
    setTimeout(() => {
      setMensaje({ tipo: '', texto: '' });
    }, 3000);
  };

  const handleEditar = (empleado) => {
    setEditingEmpleado(empleado);
    setFormData({
      nombre: empleado.nombre,
      apellido: empleado.apellido,
      email: empleado.email,
      contrasena: '', // No mostramos la contraseña
      telefono: empleado.telefono || '',
      cargo: empleado.cargo || '',
      departamento: empleado.departamento || ''
    });
    setShowModal(true);
  };

  const handleToggleActivo = async (id) => {
    try {
      const resultado = await toggleEmpleadoActivo(id);
      if (resultado.success) {
        await cargarEmpleados();
        setMensaje({ 
          tipo: 'success', 
          texto: `Estado del empleado ${resultado.empleado.activo ? 'activado' : 'desactivado'}` 
        });
        setTimeout(() => {
          setMensaje({ tipo: '', texto: '' });
        }, 3000);
      }
    } catch (error) {
      console.error('Error al cambiar estado del empleado:', error);
      setMensaje({ tipo: 'error', texto: 'Error al cambiar el estado del empleado' });
    }
  };

  // Verificar permisos de administrador
  if (!currentUser || currentUser.rol !== 'admin') {
    return (
      <div className="container py-4">
        <div className="alert alert-danger" role="alert">
          <i className="bi bi-shield-x me-2"></i>
          <strong>Acceso denegado</strong><br />
          Solo los administradores pueden gestionar empleados.
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="text-primary">
              <i className="bi bi-people-fill me-2"></i>
              Gestión de Empleados
              <small className="text-muted ms-2">({empleados.length} empleados)</small>
            </h2>
            <div>
              <button 
                className="btn btn-outline-info me-2"
                onClick={() => {
                  // Debug completo
                  console.log('🔍 DEBUG COMPLETO:');
                  console.log('📊 Estado actual de empleados:', empleados);
                  console.log('🗄️ localStorage usuarios_dev:', localStorage.getItem('usuarios_dev'));
                  console.log('🗄️ localStorage empleados:', localStorage.getItem('empleados'));
                  console.log('👤 Usuario actual:', currentUser);
                  
                  // Forzar inicialización
                  const usuariosPorDefecto = [
                    {
                      id: 1,
                      nombre: 'Administrador',
                      apellido: 'Sistema',
                      email: 'admin@admin.com',
                      passwordHash: 'admin',
                      rol: 'admin',
                      telefono: '+56912345678',
                      cargo: 'Administrador del Sistema',
                      departamento: 'TI',
                      fechaRegistro: new Date().toISOString(),
                      activo: true
                    },
                    {
                      id: 2,
                      nombre: 'Empleado',
                      apellido: 'Demo',
                      email: 'empleado@demo.com',
                      passwordHash: 'empleado',
                      rol: 'empleado',
                      telefono: '+56987654321',
                      cargo: 'Vendedor',
                      departamento: 'Ventas',
                      fechaRegistro: new Date().toISOString(),
                      activo: true
                    }
                  ];
                  
                  localStorage.setItem('usuarios_dev', JSON.stringify(usuariosPorDefecto));
                  console.log('✅ Usuarios por defecto forzados en localStorage');
                  console.log('🔄 localStorage actualizado:', localStorage.getItem('usuarios_dev'));
                  
                  cargarEmpleados();
                }}
              >
                <i className="bi bi-bug me-2"></i>
                Debug
              </button>
              <button 
                className="btn btn-outline-secondary me-2"
                onClick={() => {
                  console.log('🔄 Recargando empleados manualmente...');
                  console.log('📊 Estado actual de empleados:', empleados);
                  cargarEmpleados();
                }}
              >
                <i className="bi bi-arrow-clockwise me-2"></i>
                Recargar
              </button>
              <button 
                className="btn btn-primary"
                onClick={() => {
                  limpiarFormulario();
                  setShowModal(true);
                }}
              >
                <i className="bi bi-person-plus me-2"></i>
                Agregar Empleado
              </button>
            </div>
          </div>

          {/* Mensajes */}
          {mensaje.texto && (
            <div className={`alert alert-${mensaje.tipo === 'error' ? 'danger' : 'success'} alert-dismissible fade show`}>
              <i className={`bi bi-${mensaje.tipo === 'error' ? 'exclamation-triangle' : 'check-circle'} me-2`}></i>
              {mensaje.texto}
            </div>
          )}

          {/* Cards de empleados */}
          {empleados.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-people display-1 text-muted"></i>
              <h4 className="text-muted mt-3">No hay empleados registrados</h4>
              <p className="text-muted">Crea el primer empleado para comenzar</p>
            </div>
          ) : (
            <div className="row g-4">
              {empleados.map(empleado => (
                <div key={empleado.id} className="col-lg-6 col-xl-4">
                  <div className="card h-100 shadow-sm border-0" style={{borderRadius: '15px'}}>
                    <div className="card-body p-4">
                      {/* Header con avatar y estado */}
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <div className="d-flex align-items-center">
                          <div className="avatar-lg bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3">
                            <span className="fw-bold fs-4">
                              {empleado.nombre.charAt(0)}{empleado.apellido.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <h5 className="card-title mb-1 fw-bold">
                              {empleado.nombre} {empleado.apellido}
                            </h5>
                            <span className={`badge ${empleado.activo ? 'bg-success' : 'bg-danger'}`}>
                              <i className={`bi bi-${empleado.activo ? 'check-circle' : 'x-circle'} me-1`}></i>
                              {empleado.activo ? 'Activo' : 'Inactivo'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Información principal */}
                      <div className="mb-3">
                        <div className="d-flex align-items-center mb-2">
                          <i className="bi bi-envelope-fill text-primary me-2"></i>
                          <span className="text-muted small">Email:</span>
                        </div>
                        <p className="mb-0 ms-3">{empleado.email}</p>
                      </div>

                      {empleado.telefono && (
                        <div className="mb-3">
                          <div className="d-flex align-items-center mb-2">
                            <i className="bi bi-telephone-fill text-success me-2"></i>
                            <span className="text-muted small">Teléfono:</span>
                          </div>
                          <p className="mb-0 ms-3">{empleado.telefono}</p>
                        </div>
                      )}

                      {empleado.cargo && (
                        <div className="mb-3">
                          <div className="d-flex align-items-center mb-2">
                            <i className="bi bi-briefcase-fill text-info me-2"></i>
                            <span className="text-muted small">Cargo:</span>
                          </div>
                          <span className="badge bg-info ms-3">{empleado.cargo}</span>
                        </div>
                      )}

                      {empleado.departamento && (
                        <div className="mb-3">
                          <div className="d-flex align-items-center mb-2">
                            <i className="bi bi-building text-warning me-2"></i>
                            <span className="text-muted small">Departamento:</span>
                          </div>
                          <p className="mb-0 ms-3">{empleado.departamento}</p>
                        </div>
                      )}

                      {/* Información de creación */}
                      <div className="border-top pt-3 mt-4">
                        <div className="d-flex align-items-center mb-2">
                          <i className="bi bi-calendar-event text-secondary me-2"></i>
                          <span className="text-muted small">Fecha de registro:</span>
                        </div>
                        <p className="mb-2 ms-3 small">
                          {new Date(empleado.fechaCreacion).toLocaleDateString('es-ES')}
                        </p>
                        <div className="d-flex align-items-center">
                          <i className="bi bi-person-plus text-secondary me-2"></i>
                          <span className="text-muted small">Creado por:</span>
                        </div>
                        <p className="mb-0 ms-3 small">{empleado.creadoPor}</p>
                      </div>

                      {/* Acciones */}
                      <div className="d-flex gap-2 mt-4">
                        <button 
                          className="btn btn-outline-primary flex-fill"
                          onClick={() => handleEditar(empleado)}
                        >
                          <i className="bi bi-pencil me-1"></i>
                          Editar
                        </button>
                        <button 
                          className="btn btn-outline-primary flex-fill"
                          onClick={() => {
                            const accion = empleado.activo ? 'desactivar' : 'activar';
                            const confirmMessage = `¿Estás seguro de que deseas ${accion} a ${empleado.nombre} ${empleado.apellido}?`;
                            if (window.confirm(confirmMessage)) {
                              handleToggleActivo(empleado.id);
                            }
                          }}
                          title={empleado.activo ? 'Desactivar empleado' : 'Activar empleado'}
                        >
                          <i className={`bi bi-${empleado.activo ? 'x-circle-fill' : 'check-circle-fill'} me-1`}></i>
                          {empleado.activo ? 'Desactivar' : 'Activar'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal para crear/editar empleado */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="bi bi-person me-2"></i>
                  {editingEmpleado ? 'Editar Empleado' : 'Nuevo Empleado'}
                </h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => {
                    setShowModal(false);
                    limpiarFormulario();
                  }}
                ></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Nombre *</label>
                        <input
                          type="text"
                          className="form-control"
                          name="nombre"
                          value={formData.nombre}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Apellido *</label>
                        <input
                          type="text"
                          className="form-control"
                          name="apellido"
                          value={formData.apellido}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Email *</label>
                        <input
                          type="email"
                          className="form-control"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">
                          {editingEmpleado ? 'Nueva Contraseña (dejar vacío para mantener)' : 'Contraseña *'}
                        </label>
                        <input
                          type="password"
                          className="form-control"
                          name="contrasena"
                          value={formData.contrasena}
                          onChange={handleInputChange}
                          required={!editingEmpleado}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Teléfono</label>
                        <input
                          type="tel"
                          className="form-control"
                          name="telefono"
                          value={formData.telefono}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Cargo</label>
                        <select
                          className="form-select"
                          name="cargo"
                          value={formData.cargo}
                          onChange={handleInputChange}
                        >
                          <option value="">Seleccionar cargo</option>
                          <option value="Vendedor">Vendedor</option>
                          <option value="Supervisor">Supervisor</option>
                          <option value="Encargado de Inventario">Encargado de Inventario</option>
                          <option value="Asistente de Gerencia">Asistente de Gerencia</option>
                          <option value="Otro">Otro</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Departamento</label>
                    <select
                      className="form-select"
                      name="departamento"
                      value={formData.departamento}
                      onChange={handleInputChange}
                    >
                      <option value="">Seleccionar departamento</option>
                      <option value="Ventas">Ventas</option>
                      <option value="Inventario">Inventario</option>
                      <option value="Administración">Administración</option>
                      <option value="Marketing">Marketing</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowModal(false);
                      limpiarFormulario();
                    }}
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary">
                    <i className="bi bi-check-circle me-2"></i>
                    {editingEmpleado ? 'Actualizar' : 'Crear'} Empleado
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .avatar-sm {
          width: 40px;
          height: 40px;
          font-size: 0.8rem;
          font-weight: 600;
        }
        
        .avatar-lg {
          width: 60px;
          height: 60px;
          font-size: 1.2rem;
          font-weight: 700;
        }
        
        .card {
          transition: all 0.3s ease;
          border: 1px solid rgba(0,0,0,0.1) !important;
        }
        
        .card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.15) !important;
        }
        
        .card-body {
          background: linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%);
        }
        
        .badge {
          font-size: 0.75rem;
          padding: 0.5em 0.75em;
        }
        
        .btn {
          border-radius: 8px;
          font-weight: 500;
          transition: all 0.2s ease;
          border-width: 2px;
        }
        
        .btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        
        .btn-outline-danger:hover {
          background-color: #dc3545;
          border-color: #dc3545;
          color: white;
        }
        
        .btn-outline-success:hover {
          background-color: #198754;
          border-color: #198754;
          color: white;
        }
        
        .btn-outline-primary:hover {
          background-color: #0d6efd;
          border-color: #0d6efd;
          color: white;
        }
      `}</style>
    </div>
  );
}

export default GestionEmpleadosPage;