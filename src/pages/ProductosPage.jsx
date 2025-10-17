// src/pages/ProductosPage.jsx

// 1. Importamos los 'hooks' que usaremos: useState y useEffect
import React, { useState, useEffect } from 'react';
import './style3.css'; // Importamos el CSS

// 2. Importamos las imágenes
import poleronSatoru from '../assets/img/293581278_145413034816483_8475974826237850925_n.jpg';
import camisetaOlas from '../assets/img/photo-1556011299-650a931cbfae.avif';

// 3. Definimos nuestros productos como un array de objetos
// En un futuro, esto vendría de una base de datos.
const todosLosProductos = [
  {
    id: 1,
    nombre: 'Poleron Satoru Gojo',
    precio: 24990,
    categoria: 'ropa',
    imagen: poleronSatoru,
    link: 'single.html' // Más adelante cambiaremos esto
  },
  {
    id: 2,
    nombre: 'Camiseta "Olas"',
    precio: 1990,
    categoria: 'ropa',
    imagen: camisetaOlas,
    link: 'single.html'
  },
  {
    id: 3,
    nombre: 'Poleron Satoru (Otro)', // Producto de ejemplo
    precio: 24990,
    categoria: 'ropa',
    imagen: poleronSatoru,
    link: 'single.html'
  }
  // ... aquí podrías agregar más productos
];


function ProductosPage() {
  // 4. Creamos nuestros "estados" (la memoria del componente)
  const [productos, setProductos] = useState(todosLosProductos); // Guarda los productos que se van a MOSTRAR
  const [categoria, setCategoria] = useState('todos'); // Guarda la categoría seleccionada
  const [precioMax, setPrecioMax] = useState(50000); // Guarda el valor del slider de precio
  const [busqueda, setBusqueda] = useState(''); // Guarda el texto de búsqueda

  // 5. Creamos la función que se ejecutará CADA VEZ que un filtro cambie
  useEffect(() => {
    // 1. Empezamos con todos los productos
    let productosFiltrados = todosLosProductos;

    // 2. Filtramos por categoría
    if (categoria !== 'todos') {
      productosFiltrados = productosFiltrados.filter(
        (producto) => producto.categoria === categoria
      );
    }

    // 3. Filtramos por precio
    productosFiltrados = productosFiltrados.filter(
      (producto) => producto.precio <= precioMax
    );

    // 4. Filtramos por búsqueda (convertimos todo a minúsculas para que no sea sensible)
    if (busqueda.length > 0) {
      productosFiltrados = productosFiltrados.filter(
        (producto) => producto.nombre.toLowerCase().includes(busqueda.toLowerCase())
      );
    }

    // 5. Finalmente, actualizamos el estado de los productos que se van a mostrar
    setProductos(productosFiltrados);

  }, [categoria, precioMax, busqueda]); // <-- Este array "vigila" los filtros. Si cambian, se ejecuta el código de arriba.


  // 6. Estas son las funciones que conectamos a los inputs
  const handleCategoriaChange = (nuevaCategoria) => {
    setCategoria(nuevaCategoria);
  };

  const handlePrecioChange = (evento) => {
    setPrecioMax(Number(evento.target.value));
  };
  
  const handleBusquedaChange = (evento) => {
    setBusqueda(evento.target.value);
  };


  // 7. Renderizamos el componente
  return (
    <div className="container mt-5 mb-5">
      <div className="row">
        <div className="col-lg-3">
          <div className="p-4 bg-white rounded-3 shadow-sm">
            <h4 className="mb-4">Filtros</h4>
            <div className="mb-4 sidebar-filter">
              <h5>Categorías</h5>
              <ul className="list-unstyled">
                {/* Usamos onClick para llamar a nuestras funciones y actualizar el estado.
                  Ya no usamos `data-category` ni `<a>`. Usamos `div` o `li` con `onClick`.
                */}
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
              {/* Conectamos el input al estado usando `value` y `onChange`.
              */}
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
                placeholder="Buscar productos..." 
                value={busqueda}
                onChange={handleBusquedaChange}
              />
            </div>
            {/* El filtro de "Ordenar por" lo haremos después, es más complejo */}
            <select className="form-select ms-3" id="sortBy" style={{ maxWidth: '200px' }}>
              <option value="default">Ordenar por</option>
              <option value="price-asc">Precio: de menor a mayor</option>
              <option value="price-desc">Precio: de mayor a menor</option>
            </select>
          </div>

          <div id="product-grid" className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            
            {/* 8. EL GRAN CAMBIO: Mapeamos el estado 'productos' para crear los cards dinámicamente */}
            
            {productos.length > 0 ? (
              productos.map((producto) => (
                <div 
                  className="col product-item" 
                  key={producto.id} // React necesita un 'key' único para cada item
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
              // 9. Mostramos un mensaje si no hay resultados
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