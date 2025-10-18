// src/pages/AdminPage.jsx
import React, { useState, useEffect } from "react";
import { adminProductos } from "../data/adminProductos";
import { Link, useNavigate } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "../assets/styles/styleadmin.css";

export default function AdminPage() {
  const { productos, agregarProducto, eliminarProducto } = adminProductos();
  const [mensaje, setMensaje] = useState("");
  const navigate = useNavigate(); 
  
  // Estado para controlar la pestaña activa
  const [activeTab, setActiveTab] = useState("productos");

  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [categoria, setCategoria] = useState("Poleras");
  const [descripcion, setDescripcion] = useState("");
  const [tallas, setTallas] = useState([{ talla: "S", cantidad: 1 }]);
  const [imagenArchivo, setImagenArchivo] = useState(null);

  // Para aplicar la clase admin2 al body
  useEffect(() => {
    document.body.classList.add("admin2");
    return () => document.body.classList.remove("admin2");
  }, []);

  // Función para agregar producto
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validaciones: no permitir valores negativos
    if (precio < 0) {
      alert("El precio no puede ser negativo");
      return;
    }

    for (const t of tallas) {
      if (t.cantidad < 1) {
        alert("La cantidad de tallas debe ser al menos 1");
        return;
      }
    }

    const producto = { nombre, precio, categoria, descripcion, tallas };
    await agregarProducto(producto, imagenArchivo);

    setMensaje(`Producto "${nombre}" agregado correctamente!`);
    setNombre(""); 
    setPrecio(""); 
    setCategoria("Poleras"); 
    setDescripcion("");
    setTallas([{ talla: "S", cantidad: 1 }]); 
    setImagenArchivo(null);
  };

  // Funciones para manejar tallas
  const agregarFilaTalla = () => setTallas([...tallas, { talla: "S", cantidad: 1 }]);
  const eliminarFilaTalla = (index) => {
    if (tallas.length > 1) setTallas(tallas.filter((_, i) => i !== index));
  };
  const actualizarTalla = (index, field, value) => {
    const nuevasTallas = [...tallas];
    nuevasTallas[index][field] = value;
    setTallas(nuevasTallas);
  };

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
            className={`list-group-item mb-1 ${activeTab === 'añadir' ? 'active' : ''}`}
            onClick={() => cambiarTab('añadir')}
          >
            Añadir producto
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

        {/* Pestaña AÑADIR PRODUCTO */}
        {activeTab === 'añadir' && (
          <>
            <h1>Añadir Nuevo Producto</h1>
            <form className="form-admin2" onSubmit={handleSubmit}>
              <label className="form-label">Nombre</label>
              <input
                className="form-control"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />

              <label className="form-label">Precio</label>
              <input
                type="number"
                className="form-control"
                value={precio}
                onChange={(e) => setPrecio(e.target.value)}
                required
                min="0" // No permitir negativos
              />

              <label className="form-label">Categoría</label>
              <select
                className="form-select"
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
              >
                <option value="Poleras">Poleras</option>
                <option value="Hoodies">Hoodies</option>
                <option value="AnimeBags">AnimeBags</option>
                <option value="Cuadros">Cuadros</option>
              </select>

              <label className="form-label">Descripción</label>
              <textarea
                className="form-control"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                required
              ></textarea>

              <label className="form-label">Imagen (opcional)</label>
              <input
                type="file"
                className="form-control"
                onChange={(e) => setImagenArchivo(e.target.files[0])}
              />

              <label className="form-label">Tallas y Cantidad</label>
              {tallas.map((t, index) => (
                <div key={index} className="row mb-2">
                  <div className="col-5">
                    <select
                      className="form-select"
                      value={t.talla}
                      onChange={(e) => actualizarTalla(index, "talla", e.target.value)}
                    >
                      <option value="S">S</option>
                      <option value="M">M</option>
                      <option value="L">L</option>
                      <option value="XL">XL</option>
                    </select>
                  </div>
                  <div className="col-4">
                    <input
                      type="number"
                      className="form-control"
                      min="1" // No permitir menos de 1
                      value={t.cantidad}
                      onChange={(e) => actualizarTalla(index, "cantidad", e.target.value)}
                    />
                  </div>
                  <div className="col-3 d-flex gap-1">
                    <button type="button" className="btn-talla" onClick={agregarFilaTalla}>+</button>
                    <button type="button" className="btn-talla btn-talla-eliminar" onClick={() => eliminarFilaTalla(index)}>-</button>
                  </div>
                </div>
              ))}

              <button type="submit" className="btn-agregar mt-2">Agregar Producto</button>
            </form>

            {mensaje && <p style={{ color: "green", marginTop: "10px" }}>{mensaje}</p>}
          </>
        )}

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
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {productos.map((p, index) => (
                    <tr key={index}>
                      <td>
                        <img src={p.imagen} className="img-tabla" alt={p.nombre} />
                      </td>
                      <td>{p.nombre}</td>
                      <td>{p.precio}</td>
                      <td>{p.tallas.map(t => `${t.talla} x${t.cantidad}`).join(", ")}</td>
                      <td>{p.categoria}</td>
                      <td>{p.descripcion}</td>
                      <td>
                        <button className="btn-eliminar btn-sm" onClick={() => eliminarProducto(index)}>Eliminar</button>
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

      </div>
    </div>
  );
}
