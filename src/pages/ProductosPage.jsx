// src/pages/ProductosPage.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // <-- Importamos Link
import "../styles/style3.css";

// 1. IMPORTAMOS LA LISTA CENTRAL
import { allProducts } from '../data/products.js';

// 2. FILTRAMOS PARA TENER SOLO LA ROPA
const todosLosProductos = allProducts.filter(p => p.categoria === 'ropa');


function ProductosPage() {
  // Estados
  const [productos, setProductos] = useState(todosLosProductos);
  const [categoria, setCategoria] = useState('todos');
  const [precioMax, setPrecioMax] = useState(50000);
  const [busqueda, setBusqueda] = useState('');

  // useEffect (función de filtrado)
  useEffect(() => {
    let productosFiltrados = todosLosProductos;

    if (categoria !== 'todos') {
      productosFiltrados = productosFiltrados.filter(
        (producto) => producto.categoria === categoria
      );
    }

    productosFiltrados = productosFiltrados.filter(
      (producto) => producto.precio <= precioMax
    );

    if (busqueda.length > 0) {
      productosFiltrados = productosFiltrados.filter(
        (producto) => producto.nombre.toLowerCase().includes(busqueda.toLowerCase())
      );
    }
    setProductos(productosFiltrados);
  }, [categoria, precioMax, busqueda]); 


  // Handlers (funciones de clic)
  const handleCategoriaChange = (nuevaCategoria) => {
    setCategoria(nuevaCategoria);
  };
  const handlePrecioChange = (evento) => {
    setPrecioMax(Number(evento.target.value));
  };
  const handleBusquedaChange = (evento) => {
    setBusqueda(evento.target.value);
  };


  // Renderizado
  return (
    <div className="container mt-5 mb-5">
      <div className="row">
        {/* --- Columna de Filtros (Sidebar) --- */}
        <div className="col-lg-3">
          <div className="p-4 bg-white rounded-3 shadow-sm">
            <h4 className="mb-4">Filtros</h4>
            <div className="mb-4 sidebar-filter">
              <h5>Categorías</h5>
              <ul className="list-unstyled">
                <li 
                  className={`text-decoration-none text-dark d-block mb-2 ${categoria === 'todos' ? 'fw-bold' : ''}`}
                  onClick={() => handleCategoriaChange('todos')}
                  style={{ cursor: 'pointer' }}
                >
                  Todos los productos
                </li>
                <li 
                  className={`text-decoration-none text-dark d-block mb-2 ${categoria === 'ropa' ? 'fw-bold' : ''}`}
                  onClick={() => handleCategoriaChange('ropa')}
                  style={{ cursor: 'pointer' }}
                >
                  Ropa
                </li>
                <li 
                  className={`text-decoration-none text-dark d-block mb-2 ${categoria === 'cuadros' ? 'fw-bold' : ''}`}
                  onClick={() => handleCategoriaChange('cuadros')}
                  style={{ cursor: 'pointer' }}
                >
                  Cuadros
                </li>
              </ul>
            </div>
            <hr />
            <div className="mb-4">
              <h5>Precio</h5>
              <label htmlFor="priceRange" className="form-label">Hasta: <span id="priceValue">${precioMax}</span></label>
              <input 
                type="range" 
                className="form-range" 
                min="0" 
                max="50000" 
                step="1000" 
                id="priceRange" 
                value={precioMax}
                onChange={handlePrecioChange} 
              />
            </div>
          </div>
        </div>

        {/* --- Columna de Productos --- */}
        <div className="col-lg-9">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div className="input-group">
              <span className="input-group-text"><i className="bi bi-search"></i></span>
              <input 
                id="searchInput" 
                type="text" 
                className="form-control" 
                placeholder="Buscar productos..." 
                value={busqueda}
                onChange={handleBusquedaChange}
              />
            </div>
            <select className="form-select ms-3" id="sortBy" style={{ maxWidth: '200px' }}>
              <option value="default">Ordenar por</option>
              <option value="price-asc">Precio: de menor a mayor</option>
              <option value="price-desc">Precio: de mayor a menor</option>
            </select>
          </div>
          

          {/* --- GRILLA DE PRODUCTOS --- */}
          <div id="product-grid" className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            
            {productos.length > 0 ? (
              productos.map((producto) => (
                <div 
                  className="col product-item" 
                  key={producto.id} 
                >
                  {/* El <Link> usa el ID del producto para la URL */}
                  <Link to={`/producto/${producto.id}`} className="product-link">
                    <div className="card h-100 product-card">
                      <span className="badge bg-danger">Oferta</span>
                      {/* --------Carrusel ---------*/}
                      <div id="carouselExampleControls" class="carousel slide" data-bs-ride="carousel">
                        <div class="carousel-inner">
                          <div class="carousel-item active">
                           <img style ={{height:"300px"}} src={producto.images[0]} className="card-img-top" alt={producto.nombre} />
                          </div>
                          <div class="carousel-item">
                            <img style ={{height:"300px"}} src={producto.images[1]} className="card-img-top" alt={producto.nombre} />
                          </div>
                          <div class="carousel-item">
                            <img style ={{height:"300px"}} src={producto.images[2]} className="card-img-top" alt={producto.nombre} />
                          </div>
                        </div>
                        <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="prev">
                          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                          <span class="visually-hidden">Previous</span>
                        </button>
                        <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="next">
                          <span class="carousel-control-next-icon" aria-hidden="true"></span>
                          <span class="visually-hidden">Next</span>
                        </button>
                      </div>
                      <div className="card-body d-flex flex-column">
                        <h5 className="card-title">{producto.nombre}</h5>
                        <p className="card-text text-muted mt-auto">
                          <span className="new-price">${producto.precio.toLocaleString('es-CL')}</span>
                        </p>
                        <div className="btn btn-primary w-100 mt-2">Ver detalles</div>
                      </div>
                    </div>
                  </Link> 
                </div>
              ))
            ) : (
              // Mensaje de "no resultados"
              <div id="no-results" className="text-center p-5 col-12">
                <h3>No se encontraron productos</h3>
                <p>Intenta ajustar tus filtros de búsqueda.</p>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductosPage;