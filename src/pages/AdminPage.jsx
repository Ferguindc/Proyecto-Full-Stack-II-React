// src/pages/AdminPage.jsx
import React, { useState, useEffect } from "react";
import { adminProductos } from "../data/adminProductos";
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import GestionEmpleadosPage from './GestionEmpleadosPage';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "../styles/styleadmin.css";


export default function AdminPage() {
  const { productos, eliminarProducto } = adminProductos();
  const { currentUser } = useAuth();
  const [mensaje, setMensaje] = useState("");
  const navigate = useNavigate(); 
  
  // Estado para controlar la pestaña activa
  const [activeTab, setActiveTab] = useState("productos");

  // Para aplicar la clase admin2 al body
  useEffect(() => {
    document.body.classList.add("admin2");
    return () => document.body.classList.remove("admin2");
  }, []);

  // Helper para cambiar de pestaña y limpiar el mensaje de éxito
  const cambiarTab = (tab) => {
    setActiveTab(tab);
    setMensaje(""); // Limpia el mensaje al cambiar de pestaña
  }

  return (
    <div className="d-flex vh-100">
      {/* Sidebar Modificada */}
      <div className="sidebar p-3 d-flex flex-column" style={{ width: "250px" }}>
        <h2 className="text-center mb-4">Admin</h2>
        <div className="nav flex-column nav-pills" role="tablist" aria-orientation="vertical">
          <button 
            className={`list-group-item mb-1 ${activeTab === 'productos' ? 'active' : ''}`}
            onClick={() => cambiarTab('productos')}
          >
            Productos
          </button>
          <button 
            className={`list-group-item mb-1 ${activeTab === 'pedidos' ? 'active' : ''}`}
            onClick={() => cambiarTab('pedidos')}
          >
            Pedidos
          </button>
          <button 
            className={`list-group-item mb-1 ${activeTab === 'historial' ? 'active' : ''}`}
            onClick={() => cambiarTab('historial')}
          >
            Historial de pedidos
          </button>
          <button 
            className={`list-group-item mb-1 ${activeTab === 'devoluciones' ? 'active' : ''}`}
            onClick={() => cambiarTab('devoluciones')}
          >
            Devoluciones
          </button>
          <button 
            className={`list-group-item mb-1 ${activeTab === 'empleados' ? 'active' : ''}`}
            onClick={() => cambiarTab('empleados')}
          >
            <i className="bi bi-people me-2"></i>
            Empleados
          </button>
        </div>
        
        {/* Botón Cerrar Sesión al final */}
        <div className="mt-auto">
           <button 
            className="list-group-item w-100" 
            style={{ backgroundColor: '#dc3545', color: 'white', border: 'none' }}
            onClick={() => navigate("/sesion")} // Agrega aquí tu lógica de logout
          >
            Cerrar sesión
          </button>
        </div>
      </div>

      {/* Contenido principal con renderizado condicional */}
      <div className="main-content2 flex-grow-1 p-4 overflow-auto">

        {/* Pestaña PRODUCTOS */}
        {activeTab === 'productos' && (
          <>
            <h1>Gestión de Productos</h1>
            {/* Tabla de productos */}
            {productos.length > 0 ? (
              <table className="table-dark2 table table-striped table-hover mt-3">
                <thead>
                  <tr>
                    <th>Imagen</th>
                    <th>Nombre</th>
                    <th>Precio</th>
                    <th>Tallas / Cantidad</th>
                    <th>Categoría</th>
                    <th>Descripción</th>
                    <th>Stock</th>
                    <th>Creado Por</th>
                    <th>Última Modificación</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {productos.map((p, index) => (
                    <tr key={index}>
                      <td>
                        <img src={p.imagen} className="img-tabla" alt={p.nombre} />
                      </td>
                      <td>
                        <div className="fw-semibold">{p.nombre}</div>
                        {p.id && <small className="text-muted">ID: {p.id}</small>}
                      </td>
                      <td>
                        <span className="fw-semibold text-success">
                          ${p.precio?.toLocaleString()}
                        </span>
                      </td>
                      <td>{p.tallas?.map(t => `${t.talla} x${t.cantidad}`).join(", ") || 'N/A'}</td>
                      <td>
                        <span className="badge bg-info">{p.categoria}</span>
                      </td>
                      <td>
                        <div style={{maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis'}}>
                          {p.descripcion}
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${p.stock > 10 ? 'bg-success' : p.stock > 0 ? 'bg-warning' : 'bg-danger'}`}>
                          {p.stock || 0} unidades
                        </span>
                      </td>
                      <td>
                        <div>
                          <strong>{p.creadorNombre || p.creadoPor || 'Admin'}</strong>
                          <br />
                          <small className="text-muted">
                            {p.fechaCreacion ? new Date(p.fechaCreacion).toLocaleDateString('es-ES') : 'N/A'}
                          </small>
                        </div>
                      </td>
                      <td>
                        {p.modificadoPor ? (
                          <div>
                            <strong>{p.modificadorNombre || p.modificadoPor}</strong>
                            <br />
                            <small className="text-muted">
                              {p.fechaModificacion ? new Date(p.fechaModificacion).toLocaleDateString('es-ES') : 'N/A'}
                            </small>
                          </div>
                        ) : (
                          <span className="text-muted">Sin modificaciones</span>
                        )}
                      </td>
                      <td>
                        <div className="btn-group">
                          <button 
                            className="btn btn-outline-primary btn-sm"
                            onClick={() => navigate(`/formulario-editar/${p.id}`)}
                            title="Editar producto"
                          >
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button 
                            className="btn btn-outline-danger btn-sm" 
                            onClick={() => eliminarProducto(index)}
                            title="Eliminar producto"
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="mt-3">No hay productos agregados aún.</p>
            )}
          </>
        )}
        
        {/* Pestaña PEDIDOS */}
        {activeTab === 'pedidos' && (
            <h1>Gestión de Pedidos</h1>
            // ... Aquí iría el contenido de la sección Pedidos ...
        )}

        {/* Pestaña HISTORIAL DE PEDIDOS */}
        {activeTab === 'historial' && (
            <h1>Historial de Pedidos</h1>
            // ... Aquí iría el contenido de la sección Historial ...
        )}

        {/* Pestaña DEVOLUCIONES */}
        {activeTab === 'devoluciones' && (
            <h1>Gestión de Devoluciones</h1>
            // ... Aquí iría el contenido de la sección Devoluciones ...
        )}

        {/* Pestaña EMPLEADOS */}
        {activeTab === 'empleados' && (
          <GestionEmpleadosPage />
        )}

      </div>
    </div>
  );
}
