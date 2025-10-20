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

  const cargarEmpleados = () => {
    setEmpleados(obtenerEmpleados());
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

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validaciones básicas
    if (!formData.nombre || !formData.apellido || !formData.email || !formData.contrasena) {
      setMensaje({ tipo: 'error', texto: 'Por favor completa todos los campos obligatorios' });
      return;
    }

    if (editingEmpleado) {
      // Editar empleado
      const { contrasena, ...datosParaEditar } = formData;
      if (contrasena) {
        datosParaEditar.contrasena = contrasena;
      }
      
      const resultado = editarEmpleado(editingEmpleado.id, datosParaEditar);
      if (resultado.success) {
        setMensaje({ tipo: 'success', texto: 'Empleado actualizado correctamente' });
        cargarEmpleados();
        setShowModal(false);
        limpiarFormulario();
      } else {
        setMensaje({ tipo: 'error', texto: resultado.message });
      }
    } else {
      // Crear nuevo empleado
      const resultado = crearEmpleado(formData);
      if (resultado.success) {
        setMensaje({ tipo: 'success', texto: 'Empleado creado correctamente' });
        cargarEmpleados();
        setShowModal(false);
        limpiarFormulario();
      } else {
        setMensaje({ tipo: 'error', texto: resultado.message });
      }
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

  const handleToggleActivo = (id) => {
    const resultado = toggleEmpleadoActivo(id);
    if (resultado.success) {
      cargarEmpleados();
      setMensaje({ 
        tipo: 'success', 
        texto: `Estado del empleado ${resultado.empleado.activo ? 'activado' : 'desactivado'}` 
      });
      setTimeout(() => {
        setMensaje({ tipo: '', texto: '' });
      }, 3000);
    }
  };

  return (
    <div className="container py-4">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="text-primary">
              <i className="bi bi-people-fill me-2"></i>
              Gestión de Empleados
            </h2>
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

          {/* Mensajes */}
          {mensaje.texto && (
            <div className={`alert alert-${mensaje.tipo === 'error' ? 'danger' : 'success'} alert-dismissible fade show`}>
              <i className={`bi bi-${mensaje.tipo === 'error' ? 'exclamation-triangle' : 'check-circle'} me-2`}></i>
              {mensaje.texto}
            </div>
          )}

          {/* Tabla de empleados */}
          <div className="card">
            <div className="card-body">
              {empleados.length === 0 ? (
                <div className="text-center py-5">
                  <i className="bi bi-people display-1 text-muted"></i>
                  <h4 className="text-muted mt-3">No hay empleados registrados</h4>
                  <p className="text-muted">Crea el primer empleado para comenzar</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead className="table-dark">
                      <tr>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>Cargo</th>
                        <th>Departamento</th>
                        <th>Estado</th>
                        <th>Fecha Creación</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {empleados.map(empleado => (
                        <tr key={empleado.id}>
                          <td>
                            <div className="d-flex align-items-center">
                              <div className="avatar-sm bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-2">
                                {empleado.nombre.charAt(0)}{empleado.apellido.charAt(0)}
                              </div>
                              <div>
                                <div className="fw-semibold">{empleado.nombre} {empleado.apellido}</div>
                                {empleado.telefono && (
                                  <small className="text-muted">
                                    <i className="bi bi-telephone me-1"></i>
                                    {empleado.telefono}
                                  </small>
                                )}
                              </div>
                            </div>
                          </td>
                          <td>{empleado.email}</td>
                          <td>
                            {empleado.cargo && (
                              <span className="badge bg-info">{empleado.cargo}</span>
                            )}
                          </td>
                          <td>{empleado.departamento || '-'}</td>
                          <td>
                            <span className={`badge ${empleado.activo ? 'bg-success' : 'bg-danger'}`}>
                              <i className={`bi bi-${empleado.activo ? 'check-circle' : 'x-circle'} me-1`}></i>
                              {empleado.activo ? 'Activo' : 'Inactivo'}
                            </span>
                          </td>
                          <td>
                            <small className="text-muted">
                              {new Date(empleado.fechaCreacion).toLocaleDateString('es-ES')}
                              <br />
                              <i className="bi bi-person me-1"></i>
                              {empleado.creadoPor}
                            </small>
                          </td>
                          <td>
                            <div className="btn-group btn-group-sm">
                              <button 
                                className="btn btn-outline-primary"
                                onClick={() => handleEditar(empleado)}
                                title="Editar"
                              >
                                <i className="bi bi-pencil"></i>
                              </button>
                              <button 
                                className={`btn btn-outline-${empleado.activo ? 'danger' : 'success'}`}
                                onClick={() => handleToggleActivo(empleado.id)}
                                title={empleado.activo ? 'Desactivar' : 'Activar'}
                              >
                                <i className={`bi bi-${empleado.activo ? 'x-circle' : 'check-circle'}`}></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
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
      `}</style>
    </div>
  );
}

export default GestionEmpleadosPage;