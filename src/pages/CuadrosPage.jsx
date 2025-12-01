import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import "../styles/style3.css";
import ProductCard from '../components/ProductCard';
import { productoService } from '../services/productoService';
import { categoriaService } from '../services/categoriaService';

function CuadrosPage() {
  // Estados
  const [productos, setProductos] = useState([]);
  const [todosLosProductos, setTodosLosProductos] = useState([]);
  const [precioMax, setPrecioMax] = useState(50000);
  const [busqueda, setBusqueda] = useState('');
  const [ordenamiento, setOrdenamiento] = useState('default');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Cargar productos al iniciar
  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Obtener todos los productos
      const todosProductos = await productoService.obtenerTodos();
      
      // Filtrar cuadros - buscar categorías relacionadas con cuadros
      let cuadros = todosProductos.filter(producto => {
        if (producto.categorias && producto.categorias.length > 0) {
          return producto.categorias.some(categoria => {
            const nombreCategoria = categoria.nombre.toLowerCase();
            return nombreCategoria.includes('cuadro') || 
                   nombreCategoria.includes('arte') ||
                   nombreCategoria.includes('poster') ||
                   nombreCategoria.includes('decoracion');
          });
        }
        // Si no tiene categorías, filtrar por nombre del producto
        const nombreProducto = producto.nombre.toLowerCase();
        return nombreProducto.includes('cuadro') || 
               nombreProducto.includes('arte') ||
               nombreProducto.includes('poster');
      });
      
      // Si no hay cuadros específicos, mostrar algunos productos
      if (cuadros.length === 0 && todosProductos.length > 0) {
        console.log('🖼️ No hay cuadros, mostrando productos generales');
        const tercio = Math.ceil(todosProductos.length / 3);
        cuadros = todosProductos.slice(tercio * 2);
      }
      
      console.log('🖼️ DEBUG Cuadros - Total productos:', todosProductos.length);
      console.log('🖼️ DEBUG Cuadros - Productos filtrados:', cuadros.length);
      
      setTodosLosProductos(cuadros);
      setProductos(cuadros);
      
    } catch (error) {
      console.error('Error cargando productos:', error);
      setError('Error al cargar productos. Intenta recargar la página.');
    } finally {
      setLoading(false);
    }
  };

  // useEffect (función de filtrado y ordenamiento)
  useEffect(() => {
    let productosFiltrados = [...todosLosProductos];

    // Filtrar por precio
    productosFiltrados = productosFiltrados.filter(
      (producto) => producto.precio <= precioMax
    );

    // Filtrar por búsqueda
    if (busqueda.length > 0) {
      productosFiltrados = productosFiltrados.filter(
        (producto) => producto.nombre.toLowerCase().includes(busqueda.toLowerCase())
      );
    }

    // Ordenar productos
    if (ordenamiento === 'price-asc') {
      productosFiltrados.sort((a, b) => a.precio - b.precio);
    } else if (ordenamiento === 'price-desc') {
      productosFiltrados.sort((a, b) => b.precio - a.precio);
    }

    setProductos(productosFiltrados);
  }, [precioMax, busqueda, ordenamiento, todosLosProductos]); 

  // Handlers (funciones de clic)
  const handlePrecioChange = (evento) => {
    setPrecioMax(Number(evento.target.value));
  };
  const handleBusquedaChange = (evento) => {
    setBusqueda(evento.target.value);
  };

  const handleOrdenamientoChange = (evento) => {
    setOrdenamiento(evento.target.value);
  };

  if (loading) {
    return (
      <div className="container mt-5 mb-5">
        <div className="text-center p-5">
          <h2>Cargando cuadros...</h2>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5 mb-5">
        <div className="text-center p-5">
          <h2>Error al cargar cuadros</h2>
          <p className="text-danger">{error}</p>
          <button onClick={cargarProductos} className="btn btn-primary">
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
              <select 
                className="form-select ms-3" 
                id="sortBy" 
                style={{ maxWidth: '200px' }}
                value={ordenamiento}
                onChange={handleOrdenamientoChange}
              >
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
                <p>No hay cuadros disponibles en este momento.</p>
                <div className="mt-3">
                  <p>¿Eres administrador?</p>
                  <Link to="/admin/productos/nuevo" className="btn btn-primary">
                    Agregar Cuadros
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CuadrosPage;