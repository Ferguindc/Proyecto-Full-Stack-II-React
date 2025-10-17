import React from 'react';
import './style2.css'; // <-- 1. Importamos el CSS que acabas de mover

// 2. Importamos las imágenes (asegúrate de que estén en src/assets/img/)
import poleronSatoru from '../assets/img/293581278_145413034816483_8475974826237850925_n.jpg';
import camisetaOlas from '../assets/img/photo-1556011299-650a931cbfae.avif';
// (Si las otras imágenes son diferentes, impórtalas también)

function ProductosPage() {
  return (
    <div className="container mt-5 mb-5">
      <div className="row">
        <div className="col-lg-3">
          <div className="p-4 bg-white rounded-3 shadow-sm">
            <h4 className="mb-4">Filtros</h4>
            <div className="mb-4 sidebar-filter">
              <h5>Categorías</h5>
              <ul className="list-unstyled">
                <li><a className="text-decoration-none text-dark d-block mb-2" data-category="todos">Todos los productos</a></li>
                <li><a className="text-decoration-none text-dark d-block mb-2" data-category="ropa">Ropa</a></li>
                <li><a className="text-decoration-none text-dark d-block" data-category="cuadros">Cuadros</a></li>
              </ul>
            </div>
            <hr />
            <div className="mb-4">
              <h5>Precio</h5>
              <label htmlFor="priceRange" className="form-label">Hasta: <span id="priceValue">$50000</span></label>
              <input type="range" className="form-range" min="0" max="50000" step="1000" id="priceRange" defaultValue="50000" />
            </div>
          </div>
        </div>

        <div className="col-lg-9">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div className="input-group">
              <span className="input-group-text"><i className="bi bi-search"></i></span>
              <input id="searchInput" type="text" className="form-control" placeholder="Buscar productos..." />
            </div>
            <select className="form-select ms-3" id="sortBy" style={{ maxWidth: '200px' }}>
              <option value="default">Ordenar por</option>
              <option value="price-asc">Precio: de menor a mayor</option>
              <option value="price-desc">Precio: de mayor a menor</option>
            </select>
          </div>

          <div id="product-grid" className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            {/* --- Producto 1 --- */}
            <div className="col product-item" data-category="ropa" data-price="24990" data-name="Hoodie satoru">
              {/* Dejaremos el "a href" por ahora. Luego lo cambiaremos por <Link> */}
              <a href="single.html?product=camiseta-olas" className="product-link">
                <div className="card h-100 product-card">
                  <span className="badge bg-danger">Oferta</span>
                  <img src={poleronSatoru} className="card-img-top" alt="hoodie satoru" />
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">Poleron Satoru Gojo</h5>
                    <p className="card-text text-muted mt-auto">
                      <span className="old-price me-2">$2,500</span>
                      <span className="new-price">$24,990</span>
                    </p>
                    <div className="btn btn-primary w-100 mt-2">Ver detalles</div>
                  </div>
                </div>
              </a>
            </div>

            {/* --- Producto 2 (Ejemplo repetido de tu HTML) --- */}
            <div className="col product-item" data-category="ropa" data-price="24990" data-name="Hoodie satoru">
              <a href="single.html?product=camiseta-olas" className="product-link">
                <div className="card h-100 product-card">
                  <span className="badge bg-danger">Oferta</span>
                  <img src={poleronSatoru} className="card-img-top" alt="Camiseta Estampada" />
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">Poleron Satoru Gojo</h5>
                    <p className="card-text text-muted mt-auto">
                      <span className="old-price me-2">$2,500</span>
                      <span className="new-price">$24,990</span>
                    </p>
                    <div className="btn btn-primary w-100 mt-2">Ver detalles</div>
                  </div>
                </div>
              </a>
            </div>

            {/* --- Producto 3 (Ejemplo repetido de tu HTML) --- */}
            <div className="col product-item" data-category="ropa" data-price="24990" data-name="Hoodie satoru">
              <a href="single.html?product=camiseta-olas" className="product-link">
                <div className="card h-100 product-card">
                  <span className="badge bg-danger">Oferta</span>
                  <img src={poleronSatoru} className="card-img-top" alt="Camiseta Estampada" />
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">Poleron Satoru Gojo</h5>
                    <p className="card-text text-muted mt-auto">
                      <span className="old-price me-2">$2,500</span>
                      <span className="new-price">$24,990</span>
                    </p>
                    <div className="btn btn-primary w-100 mt-2">Ver detalles</div>
                  </div>
                </div>
              </a>
            </div>

            {/* --- Producto 4 --- */}
            <div className="col product-item" data-category="ropa" data-price="1990" data-name="Camiseta Olas">
              <div className="card h-100 product-card">
                <span className="badge bg-danger">Oferta</span>
                <img src={camisetaOlas} className="card-img-top" alt="Camiseta Estampada" />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">Camiseta "Olas"</h5>
                  <p className="card-text text-muted mt-auto">
                    <span className="old-price me-2">$2,500</span>
                    <span className="new-price">$1,990</span>
                  </p>
                  <a href="#" className="btn btn-primary w-100 mt-2">Añadir al carrito</a>
                </div>
              </div>
            </div>

            {/* ... Aquí pegarías el resto de tus productos ... */}

          </div>
          <div id="no-results" className="text-center p-5" style={{ display: 'none' }}>
            <h3>No se encontraron productos</h3>
            <p>Intenta ajustar tus filtros de búsqueda.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductosPage;