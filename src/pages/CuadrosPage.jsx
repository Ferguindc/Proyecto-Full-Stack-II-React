// src/pages/CuadrosPage.jsx

import React, { useState, useEffect } from 'react';
import './style3.css'; // Sigue usando el mismo CSS, ya que el layout es idéntico

// 1. Importamos las imágenes de los cuadros
import givenCuadro from '../assets/img/givencuadro.jpg';
// ...importa aquí el resto de tus cuadros...

// 2. Definimos nuestros cuadros como un array de objetos
const todosLosCuadros = [
  {
    id: 1,
    nombre: 'Cuadro Given',
    precio: 24990,
    categoria: 'cuadros',
    imagen: givenCuadro,
    link: 'singles2.html' // Más adelante cambiaremos esto
  },
  {
    id: 2,
    nombre: 'CUADRO PRUEBA',
    precio: 1990,
    categoria: 'cuadros',
    imagen: givenCuadro, // Usando la misma imagen de ejemplo
    link: 'singles2.html'
  }
  // ... aquí podrías agregar más cuadros
];


function CuadrosPage() {
  // 3. Creamos nuestros "estados" (la memoria del componente)
  const [productos, setProductos] = useState(todosLosCuadros); // Guarda los cuadros que se van a MOSTRAR
  const [categoria, setCategoria] = useState('todos'); // Guarda la categoría seleccionada
  const [precioMax, setPrecioMax] = useState(50000); // Guarda el valor del slider de precio
  const [busqueda, setBusqueda] = useState(''); // Guarda el texto de búsqueda

  // 4. Creamos la función que se ejecutará CADA VEZ que un filtro cambie
  useEffect(() => {
    let productosFiltrados = todosLosCuadros;

    // Filtramos por categoría
    if (categoria !== 'todos') {
      productosFiltrados = productosFiltrados.filter(
        (producto) => producto.categoria === categoria
      );
    }

    // Filtramos por precio
    productosFiltrados = productosFiltrados.filter(
      (producto) => producto.precio <= precioMax
    );

    // Filtramos por búsqueda
    if (busqueda.length > 0) {
      productosFiltrados = productosFiltrados.filter(
        (producto) => producto.nombre.toLowerCase().includes(busqueda.toLowerCase())
      );
    }

    // Actualizamos el estado de los productos que se van a mostrar
    setProductos(productosFiltrados);

  }, [categoria, precioMax, busqueda]); // <-- Vigila los filtros

  // 5. Funciones que conectamos a los inputs
  const handleCategoriaChange = (nuevaCategoria) => {
    setCategoria(nuevaCategoria);
  };

  const handlePrecioChange = (evento) => {
    setPrecioMax(Number(evento.target.value));
  };
  
  const handleBusquedaChange = (evento) => {
    setBusqueda(evento.target.value);
  };


  // 6. Renderizamos el componente
  return (
    <div className="container mt-5 mb-5">
      <div className="row">
        <div className="col-lg-3">
          <div className="p-4 bg-white rounded-3 shadow-sm">
            <h4 className="mb-4">Filtros</h4>
            <div className="mb-4 sidebar-filter">
              <h5>Categorías</h5>
              <ul className="list-unstyled">
                {/* Usamos onClick para llamar a nuestras funciones */}
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
              {/* Conectamos el input al estado */}
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

        <div className="col-lg-9">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div className="input-group">
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

          <div id="product-grid" className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            
            {/* 7. Mapeamos el estado 'productos' para crear los cards */}
            
            {productos.length > 0 ? (
              productos.map((producto) => (
                <div 
                  className="col product-item" 
                  key={producto.id} // React necesita un 'key' único
                >
                  <a href={producto.link} className="product-link">
                    <div className="card h-100 product-card">
                      <span className="badge bg-danger">Oferta</span>
                      <img src={producto.imagen} className="card-img-top" alt={producto.nombre} />
                      <div className="card-body d-flex flex-column">
                        <h5 className="card-title">{producto.nombre}</h5>
                        <p className="card-text text-muted mt-auto">
                          {/* <span className="old-price me-2">$2,500</span> */}
                          <span className="new-price">${producto.precio.toLocaleString('es-CL')}</span>
                        </p>
                        <div className="btn btn-primary w-100 mt-2">Ver detalles</div>
                      </div>
                    </div>
                  </a>
                </div>
              ))
            ) : (
              // 8. Mensaje si no hay resultados
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