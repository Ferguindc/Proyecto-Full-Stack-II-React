// src/pages/SingleProductPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { allProducts } from '../data/products.js'; // Importamos la data
import './single-style.css'; // Importamos el CSS

function SingleProductPage() {
  // 1. Obtenemos el ID de la URL (ej: /producto/1)
  const { productId } = useParams();

  // 2. Buscamos el producto en nuestra "base de datos"
  // Usamos parseInt porque el ID de la URL es texto, y en nuestro array es número
  const product = allProducts.find(p => p.id === parseInt(productId));

  // 3. Estado para manejar la imagen principal que se está viendo
  const [mainImage, setMainImage] = useState('');

  // 4. Efecto para poner la primera imagen del producto como la principal
  useEffect(() => {
    if (product) {
      setMainImage(product.images[0]);
    }
  }, [product]); // Se ejecuta cada vez que el 'product' cambia

  // 5. Si no se encuentra el producto, mostramos un mensaje
  if (!product) {
    return (
      <div className="container text-center my-5">
        <h1>Producto no encontrado</h1>
        <p>El producto que buscas no existe.</p>
        <Link to="/productos" className="btn btn-primary">Volver a la tienda</Link>
      </div>
    );
  }

  // 6. Si se encuentra, renderizamos la página
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

          <p className="product-description">{product.descripcion}</p>

          <div className="product-options my-4">
            {/* Opciones de Talla */}
            <div className="mb-3">
              <label htmlFor="sizeSelect" className="form-label fw-bold">Talla:</label>
              <select id="sizeSelect" className="form-select w-50">
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
              </select>
            </div>

            {/* Opciones de Cantidad */}
            <div className="mb-3">
              <label htmlFor="quantityInput" className="form-label fw-bold">Cantidad:</label>
              <input type="number" id="quantityInput" className="form-control w-25" defaultValue="1" min="1" />
            </div>
          </div>

          <button className="btn btn-primary btn-lg w-100">
            <i className="bi bi-cart-plus me-2"></i>
            Añadir al carrito
          </button>
        </div>

      </div>
    </div>
  );
}

export default SingleProductPage;