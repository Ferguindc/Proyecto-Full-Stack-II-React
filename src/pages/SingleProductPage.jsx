// src/pages/SingleProductPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { allProducts } from '../data/products.js'; // Importamos la data
import { useCart } from '../context/CartContext'; // Importamos el contexto del carrito
import '../styles/single-style.css'; // Importamos el CSS


function SingleProductPage() {
  // 1. Obtenemos el ID de la URL (ej: /producto/1)
  const { id } = useParams();
  const { addToCart, toggleCart } = useCart();

  // 2. Buscamos el producto en nuestra "base de datos"
  // Usamos parseInt porque el ID de la URL es texto, y en nuestro array es número
  const product = allProducts.find(p => p.id === parseInt(id));

  // 3. Estados para la funcionalidad
  const [mainImage, setMainImage] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);

  // 4. Efecto para poner la primera imagen del producto como la principal y establecer talla/medida inicial
  useEffect(() => {
    if (product) {
      setMainImage(product.images[0]);
      // Establecer talla/medida inicial según el tipo de producto
      if (product.categoria === 'cuadros') {
        setSelectedSize(product.medidas ? product.medidas[0] : '30x39');
      } else {
        setSelectedSize('M');
      }
    }
  }, [product]); // Se ejecuta cada vez que el 'product' cambia

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
    // Crear el producto adaptado para el carrito
    const cartProduct = {
      id: product.id,
      nombre: product.nombre,
      precio: product.precio,
      imagen: product.images[0], // Usamos la primera imagen
      categoria: product.categoria
    };
    
    addToCart(cartProduct, quantity, selectedSize);
    
    // Mostrar el carrito lateral después de agregar
    toggleCart();
    
    // Opcional: Mostrar una notificación
    alert(`¡${product.nombre} agregado al carrito!`);
  };

  // 6. Si no se encuentra el producto, mostramos un mensaje
  if (!product) {
    return (
      <div className="container text-center my-5">
        <h1>Producto no encontrado</h1>
        <p>El producto que buscas no existe.</p>
        <Link to="/poleras" className="btn btn-primary">Volver a la tienda</Link>
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

          {/* Miniaturas (Thumbnails) */}
          <div className="thumbnail-images d-flex justify-content-center gap-2">
            {product.images.map((imgSrc, index) => (
              <img 
                key={index}
                src={imgSrc} 
                alt={`Thumbnail ${index + 1}`}
                // Cambiamos la clase 'active' si es la imagen seleccionada
                className={`img-thumbnail ${mainImage === imgSrc ? 'active' : ''}`}
                // Al hacer clic, cambiamos la imagen principal
                onClick={() => setMainImage(imgSrc)}
              />
            ))}
          </div>
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
                {product.categoria === 'cuadros' ? 'Medida (cm):' : 'Talla:'}
              </label>
              <div className="size-buttons d-flex gap-2 mt-2 flex-wrap">
                {(product.categoria === 'cuadros' 
                  ? (product.medidas || ['30x39', '40x50', '50x70', '70x81'])
                  : ['S', 'M', 'L', 'XL']
                ).map(size => (
                  <button 
                    key={size}
                    className={`size-btn ${selectedSize === size ? 'active' : ''}`}
                    data-cuadro={product.categoria === 'cuadros' ? 'true' : 'false'}
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