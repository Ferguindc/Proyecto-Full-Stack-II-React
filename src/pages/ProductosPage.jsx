// src/pages/ProductosPage.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import "../styles/style3.css";
import ProductCard from '../components/ProductCard';
import { productoService } from '../services/productoService.js';
import { categoriaService } from '../services/categoriaService.js';


function ProductosPage() {
  // Estados
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoria, setCategoria] = useState('todos');
  const [precioMax, setPrecioMax] = useState(50000);
  const [busqueda, setBusqueda] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Cargar productos y categorías al montar el componente
  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [productosResponse, categoriasResponse] = await Promise.all([
        productoService.obtenerTodos(),
        categoriaService.obtenerTodas()
      ]);
      
      setProductos(productosResponse);
      setCategorias(categoriasResponse);
      setError('');
    } catch (error) {
      console.error('Error cargando datos:', error);
      setError('Error al cargar los productos. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  // Filtrar productos cuando cambien los filtros
  useEffect(() => {
    filtrarProductos();
  }, [categoria, precioMax, busqueda]);

  const filtrarProductos = async () => {
    try {
      let productosFiltrados = [];

      // Si hay búsqueda por nombre, usar endpoint específico
      if (busqueda.length > 0) {
        productosFiltrados = await productoService.buscarPorNombre(busqueda);
        console.log('Productos encontrados por búsqueda:', productosFiltrados);
      } 
      // Si hay categoría específica, usar endpoint de categoría
      else if (categoria !== 'todos') {
        if (categoria === 'sin-categoria') {
          // Obtener todos los productos y filtrar los que no tienen categorías
          const todosProductos = await productoService.obtenerTodos();
          productosFiltrados = todosProductos.filter(p => !p.categorias || p.categorias.length === 0);
          console.log('Productos sin categoría:', productosFiltrados);
        } else {
          const categoriaObj = categorias.find(cat => cat.nombre.toLowerCase() === categoria.toLowerCase());
          if (categoriaObj) {
            productosFiltrados = await productoService.obtenerPorCategoria(categoriaObj.id);
            console.log('Productos por categoría:', productosFiltrados);
          } else {
            console.log('Categoría no encontrada:', categoria);
            productosFiltrados = [];
          }
        }
      } 
      // Si no hay filtros específicos, obtener todos
      else {
        productosFiltrados = await productoService.obtenerTodos();
        console.log('Todos los productos:', productosFiltrados);
      }

      // Aplicar filtro de precio localmente
      productosFiltrados = productosFiltrados.filter(
        (producto) => producto.precio <= precioMax
      );

      console.log('Productos después del filtro de precio:', productosFiltrados);
      setProductos(productosFiltrados);
    } catch (error) {
      console.error('Error filtrando productos:', error);
      setError('Error al filtrar productos.');
    }
  }; 


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
  if (loading) {
    return (
      <div className="container mt-5 mb-5">
        <div className="text-center p-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-3">Cargando productos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5 mb-5">
        <div className="alert alert-danger text-center">
          <h4>Error</h4>
          <p>{error}</p>
          <button className="btn btn-primary" onClick={cargarDatos}>
            Intentar de nuevo
          </button>
        </div>
      </div>
    );
  }

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
                {categorias.map((cat) => (
                  <li 
                    key={cat.id}
                    className={`text-decoration-none text-dark d-block mb-2 ${categoria === cat.nombre.toLowerCase() ? 'fw-bold' : ''}`}
                    onClick={() => handleCategoriaChange(cat.nombre.toLowerCase())}
                    style={{ cursor: 'pointer' }}
                  >
                    {cat.nombre}
                  </li>
                ))}
                <li 
                  className={`text-decoration-none text-dark d-block mb-2 ${categoria === 'sin-categoria' ? 'fw-bold' : ''}`}
                  onClick={() => handleCategoriaChange('sin-categoria')}
                  style={{ cursor: 'pointer' }}
                >
                  Sin categoría
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
          <div id="product-grid" className="row">
            
            {productos.length > 0 ? (
              productos.map((producto) => (
                <ProductCard key={producto.id} producto={producto} />
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