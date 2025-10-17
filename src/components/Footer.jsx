// src/components/Footer.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css'; // Importamos los estilos del footer

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="row">
          <div className="col-md-4 mb-3">
            <h5>Sobre Crimewave</h5>
            <p>
              Crimewave es un sitio de venta de ropa estilo anime-streetwear y alternativa con diseños originales hechas por ferguinx.
            </p>
          </div>
          <div className="col-md-4 mb-3">
            <h5>Enlaces útiles</h5>
            <ul className="list-unstyled">
              <li><Link to="/" className="text-light text-decoration-none">Inicio</Link></li>
              <li><Link to="/productos" className="text-light text-decoration-none">Productos</Link></li>
              <li><Link to="/cuadros" className="text-light text-decoration-none">Cuadros</Link></li>
              <li><Link to="/sesion" className="text-light text-decoration-none">Contacto</Link></li>
            </ul>
          </div>
          <div className="col-md-4 mb-3">
            <h5>Síguenos</h5>
            <a href="https://www.instagram.com/crimewave.store/?hl=es" target="_blank" rel="noopener noreferrer" className="text-light me-3"><i className="bi bi-instagram fs-4"></i></a>
            <a href="https://github.com/Ferguindc/Proyecto-Desarrollo-Full-Stack-II" target="_blank" rel="noopener noreferrer" className="text-light me-3"><i className="bi bi-github fs-4"></i></a>
            <a href="#" className="text-light me-3"><i className="bi bi-facebook fs-4"></i></a>
            <a href="#" className="text-light me-3"><i className="bi bi-twitter fs-4"></i></a>
          </div>
        </div>
        <div className="text-center mt-3 border-top pt-3">
          <p className="mb-0">&copy; 2025 Crimewave Store. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;