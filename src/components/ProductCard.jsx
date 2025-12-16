import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { obtenerUrlImagen } from '../data/imagenes';
import './ProductCard.css';

function ProductCard({ producto }) {
  const { addToCart, toggleCart } = useCart();
  // Detectar si es cuadro
  const esCuadro = producto.categorias?.some(cat => 
    cat.nombre && (
      cat.nombre.toLowerCase().includes('cuadro') || 
      cat.nombre.toUpperCase() === 'CUADRO'
    )
  ) || producto.nombre?.toLowerCase().includes('cuadro');
  
  const [selectedSize, setSelectedSize] = useState(esCuadro ? '30x40 cm' : 'M');
  const [showSizeSelector, setShowSizeSelector] = useState(false);

  // Función para construir la URL de la imagen
  const getImageUrl = () => {
    return obtenerUrlImagen(producto.imagenUrl);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const handleAddToCart = (e) => {
    e.preventDefault(); // Evitar que el link se active
    e.stopPropagation();
    
    // Crear el producto adaptado para el carrito
    const cartProduct = {
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      imagen: getImageUrl(),
      categoria: producto.categorias?.[0]?.nombre || 'general'
    };
    
    addToCart(cartProduct, 1, selectedSize);
    
    // Mostrar el carrito lateral después de agregar
    toggleCart();
    
    // Ocultar selector de talla
    setShowSizeSelector(false);
  };

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowSizeSelector(!showSizeSelector);
  };

  return (
    <div className="col-md-6 col-lg-4 mb-4">
      <div className="card product-card h-100">
        <Link to={`/producto/${producto.id}`} className="text-decoration-none">
          <div className="card-img-container">
            <img 
              src={getImageUrl()} 
              className="card-img-top" 
              alt={producto.nombre}
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/300?text=Error';
              }}
            />
            <div className="card-overlay">
              <button 
                className="btn btn-primary btn-sm quick-add-btn"
                onClick={handleQuickAdd}
                title="Agregar al carrito"
              >
                <i className="bi bi-cart-plus"></i>
              </button>
            </div>
          </div>
        </Link>
        
        <div className="card-body d-flex flex-column">
          <Link to={`/producto/${producto.id}`} className="text-decoration-none text-dark">
            <h5 className="card-title">{producto.nombre}</h5>
            {producto.descripcion && producto.descripcion.includes('<') ? (
              <div 
                className="card-text text-muted small descripcion-preview"
                dangerouslySetInnerHTML={{ 
                  __html: producto.descripcion.substring(0, 100).replace(/<[^>]*>/g, ' ').trim() + '...' 
                }}
              />
            ) : (
              <p className="card-text text-muted small">
                {producto.descripcion ? producto.descripcion.substring(0, 100) + '...' : ''}
              </p>
            )}
            <p className="card-price fw-bold text-primary">
              {formatPrice(producto.precio)}
            </p>
          </Link>
          
          {/* Selector de talla/medida rápido */}
          {showSizeSelector && (
            <div className="size-selector-quick mb-2">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <small className="fw-bold">
                  {esCuadro ? 'Selecciona medida:' : 'Selecciona talla:'}
                </small>
                <button 
                  className="btn-close btn-sm"
                  onClick={() => setShowSizeSelector(false)}
                ></button>
              </div>
              <div className="size-buttons-quick d-flex gap-1 mb-2 flex-wrap">
                {(esCuadro ? ['30x40 cm', '40x50 cm', '50x70 cm', '70x100 cm'] : ['S', 'M', 'L', 'XL']).map(size => (
                  <button
                    key={size}
                    className={`btn btn-sm ${selectedSize === size ? 'btn-primary' : 'btn-outline-primary'}`}
                    data-cuadro={esCuadro ? 'true' : 'false'}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSelectedSize(size);
                    }}
                  >
                    {size}
                  </button>
                ))}
              </div>
              <button 
                className="btn btn-success btn-sm w-100"
                onClick={handleAddToCart}
              >
                <i className="bi bi-cart-plus me-1"></i>
                Agregar al Carrito
              </button>
            </div>
          )}
          
          <div className="mt-auto">
            <Link 
              to={`/producto/${producto.id}`} 
              className="btn btn-outline-primary w-100"
            >
              Ver Detalles
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;