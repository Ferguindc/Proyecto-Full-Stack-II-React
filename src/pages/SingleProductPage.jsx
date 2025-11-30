// src/pages/SingleProductPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productoService } from '../services/productoService.js';
import { useCart } from '../context/CartContext';
import '../styles/single-style.css';


function SingleProductPage() {
  const { id } = useParams();
  const { addToCart, toggleCart } = useCart();

  // Estados
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mainImage, setMainImage] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);

  // Cargar producto desde la API
  useEffect(() => {
    cargarProducto();
  }, [id]);

  const cargarProducto = async () => {
    try {
      setLoading(true);
      setError('');
      
      const productoData = await productoService.obtenerPorId(parseInt(id));
      setProduct(productoData);
      
      // Configurar imagen principal
      setMainImage(productoData.imagenUrl || '/placeholder.jpg');
      
      // Establecer talla/medida inicial según las categorías del producto
      const esCuadro = productoData.categorias?.some(cat => 
        cat.nombre.toLowerCase().includes('cuadro')
      );
      
      if (esCuadro) {
        setSelectedSize('30x39');
      } else {
        setSelectedSize('M');
      }
      
    } catch (error) {
      console.error('Error cargando producto:', error);
      setError('Error al cargar el producto');
    } finally {
      setLoading(false);
    }
  };

  // 5. Funciones para manejar interacciones
  const handleSizeSelect = (size) => {
    setSelectedSize(size);
  };

  const increaseQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleAddToCart = () => {
    // Crear el producto adaptado para el carrito usando estructura del backend
    const cartProduct = {
      id: product.id,
      nombre: product.nombre,
      precio: product.precio,
      imagen: product.imagenUrl || '/placeholder.jpg',
      categoria: product.categorias?.[0]?.nombre || 'general'
    };
    
    addToCart(cartProduct, quantity, selectedSize);
    toggleCart();
    
    // Opcional: Mostrar una notificación
    alert(`¡${product.nombre} agregado al carrito!`);
  };

  // Estados de carga y error
  if (loading) {
    return (
      <div className="container text-center my-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-3">Cargando producto...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container text-center my-5">
        <div className="alert alert-danger">
          <h1>Error</h1>
          <p>{error}</p>
          <button className="btn btn-primary" onClick={cargarProducto}>
            Intentar de nuevo
          </button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container text-center my-5">
        <h1>Producto no encontrado</h1>
        <p>El producto que buscas no existe.</p>
        <Link to="/productos" className="btn btn-primary">Volver a la tienda</Link>
      </div>
    );
  }

  // 7. Si se encuentra, renderizamos la página
  return (
    <div className="container product-detail-container my-5">
      <div className="row">

        {/* --- Columna de Imágenes --- */}
        <div className="col-md-6">
          {/* Imagen Principal */}
          <div className="mb-3">
            <img 
              src={mainImage} 
              alt={product.nombre} 
              className="main-image img-fluid" 
            />
          </div>

          {/* Miniaturas (Thumbnails) - Solo mostrar si hay múltiples imágenes */}
          {product.images && product.images.length > 1 && (
            <div className="thumbnail-images d-flex justify-content-center gap-2">
              {product.images.map((imgSrc, index) => (
                <img 
                  key={index}
                  src={imgSrc} 
                  alt={`Thumbnail ${index + 1}`}
                  className={`img-thumbnail ${mainImage === imgSrc ? 'active' : ''}`}
                  onClick={() => setMainImage(imgSrc)}
                />
              ))}
            </div>
          )}
        </div>

        {/* --- Columna de Detalles --- */}
        <div className="col-md-6">
          <h1 className="product-title">{product.nombre}</h1>

          <div className="product-price my-3">
            <span className="new-price">${product.precio.toLocaleString('es-CL')}</span>
            {/* <span className="old-price text-muted ms-2">$2,500</span> */}
          </div>

          <div className="product-options my-4">
            {/* Opciones de Talla/Medida */}
            <div className="mb-3">
              <label className="form-label fw-bold">
                {product.categorias?.some(cat => cat.nombre.toLowerCase().includes('cuadro')) ? 'Medida (cm):' : 'Talla:'}
              </label>
              <div className="size-buttons d-flex gap-2 mt-2 flex-wrap">
                {(product.categorias?.some(cat => cat.nombre.toLowerCase().includes('cuadro'))
                  ? ['30x39', '40x50', '50x70', '70x81']
                  : ['S', 'M', 'L', 'XL']
                ).map(size => (
                  <button 
                    key={size}
                    className={`size-btn ${selectedSize === size ? 'active' : ''}`}
                    data-cuadro={product.categorias?.some(cat => cat.nombre.toLowerCase().includes('cuadro')) ? 'true' : 'false'}
                    onClick={() => handleSizeSelect(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Opciones de Cantidad */}
            <div className="mb-3">
              <label className="form-label fw-bold">Cantidad:</label>
              <div className="quantity-controls mt-2">
                <button className="quantity-btn" onClick={decreaseQuantity}>-</button>
                <span className="quantity-display">{quantity}</span>
                <button className="quantity-btn" onClick={increaseQuantity}>+</button>
              </div>
            </div>
          </div>

          <button className="btn btn-primary w-100" onClick={handleAddToCart}>
            <i className="bi bi-cart-plus me-2"></i>
            Añadir al carrito
          </button>
        </div>

      </div>

      {/* Secciones desplegables */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="accordion" id="productAccordion">
            
            {/* Descripción Completa */}
            <div className="accordion-item">
              <h2 className="accordion-header" id="headingDescription">
                <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseDescription" aria-expanded="true" aria-controls="collapseDescription">
                  Descripción Completa
                </button>
              </h2>
              <div id="collapseDescription" className="accordion-collapse collapse show" aria-labelledby="headingDescription" data-bs-parent="#productAccordion">
                <div className="accordion-body">
                  <p>{product.descripcion}</p>
                  <p>Esta camiseta ha sido diseñada pensando en la comodidad y la durabilidad. El corte es moderno y se ajusta perfectamente al cuerpo sin ser demasiado apretado. El estampado utiliza una técnica de serigrafía de alta calidad para garantizar que los colores se mantengan vivos lavado tras lavado.</p>
                </div>
              </div>
            </div>

            {/* Material y Cuidado */}
            <div className="accordion-item">
              <h2 className="accordion-header" id="headingMaterial">
                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseMaterial" aria-expanded="false" aria-controls="collapseMaterial">
                  Material y Cuidado
                </button>
              </h2>
              <div id="collapseMaterial" className="accordion-collapse collapse" aria-labelledby="headingMaterial" data-bs-parent="#productAccordion">
                <div className="accordion-body">
                  <p><strong>Material:</strong> 100% Algodón Orgánico Peinado.</p>
                  <p><strong>Cuidado:</strong> Lavar a máquina con agua fría, del revés. No usar blanqueador. Secar a baja temperatura o colgar.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default SingleProductPage;