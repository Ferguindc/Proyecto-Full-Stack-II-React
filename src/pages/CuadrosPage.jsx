import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import "../styles/style3.css";
import ProductCard from '../components/ProductCard';
import { allProducts } from '../data/products.js';

// Filtramos para tener solo los cuadros
const todosLosCuadros = allProducts.filter(p => p.categoria === 'cuadros');

function CuadrosPage() {
  // Estados
  const [productos, setProductos] = useState(todosLosCuadros);
  const [precioMax, setPrecioMax] = useState(50000);
  const [busqueda, setBusqueda] = useState('');

  // useEffect (función de filtrado)
  useEffect(() => {
    let productosFiltrados = todosLosCuadros;

    productosFiltrados = productosFiltrados.filter(
      (producto) => producto.precio <= precioMax
    );

    if (busqueda.length > 0) {
      productosFiltrados = productosFiltrados.filter(
        (producto) => producto.nombre.toLowerCase().includes(busqueda.toLowerCase())
      );
    }
    setProductos(productosFiltrados);
  }, [precioMax, busqueda]); 

  // Handlers (funciones de clic)
  const handlePrecioChange = (evento) => {
    setPrecioMax(Number(evento.target.value));
  };
  const handleBusquedaChange = (evento) => {
    setBusqueda(evento.target.value);
  };


  return (
    <div className="container mt-5 mb-5">
      <div className="row">
        {/* --- Columna de Filtros (Sidebar) --- */}
        <div className="col-lg-3">
          <div className="p-4 bg-white rounded-3 shadow-sm">
            <h4 className="mb-4">Filtros</h4>
            <div className="mb-4 sidebar-filter">
              <h5>Categoría</h5>
              <p className="fw-bold text-primary">CUADROS</p>
            </div>
            <hr />
            <div className="mb-4">
              <h5>Precio</h5>
              <label htmlFor="priceRange" className="form-label">Hasta: <span id="priceValue">${precioMax.toLocaleString('es-CL')}</span></label>
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
          <div className="mb-4">
            <h2 className="mb-3">CUADROS</h2>
            <div className="d-flex justify-content-between align-items-center">
              <div className="input-group" style={{ maxWidth: '300px' }}>
                <span className="input-group-text"><i className="bi bi-search"></i></span>
                <input 
                  id="searchInput" 
                  type="text" 
                  className="form-control" 
                  placeholder="Buscar cuadros..." 
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
          </div>
          
          {/* --- GRILLA DE PRODUCTOS --- */}
          <div id="product-grid" className="row">
            {productos.length > 0 ? (
              productos.map((producto) => (
                <ProductCard key={producto.id} producto={producto} />
              ))
            ) : (
              <div id="no-results" className="text-center p-5 col-12">
                <h3>No se encontraron cuadros</h3>
                <p>Intenta ajustar tus filtros de búsqueda.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CuadrosPage;