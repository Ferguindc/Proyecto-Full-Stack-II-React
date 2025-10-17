// src/components/Navbar.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/img/LOGODEF (2).png';
import './Navbar.css'; // Importamos los estilos del navbar

function Navbar() {
  return (
    <>
      {/* ----- Barra de envíos ----- */}
      <nav className="navbar bg-dark">
        {/* ... (el contenido de la barra de envíos no cambia) ... */}
        <div className="container-fluid d-flex justify-content-center">
          <p className="tamañoletra text-white mb-0">
            Envíos gratis sobre $50.000
          </p>
        </div>
      </nav>

      {/* ----- Barra de navegación principal ----- */}
      <nav className="navbar colornav navbar-expand-lg bg-body-tertiary opacity-20" data-bs-theme="dark">
        <div className="container-fluid">
          {/* 2. Cambia <a> por <Link> y 'href' por 'to' */}
          <Link to="/"> <img src={logo} alt="Logo Crimewave" width="160" height="80" className="logo" /></Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link active" aria-current="page" to="/">Inicio</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/cuadros">Cuadros</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/productos">Productos</Link>
              </li>
              <li className="nav-item">
                {/* Los enlaces externos siguen usando <a>, target y rel */}
                <a className="nav-link" href="https://www.instagram.com/crimewave.store/?hl=es" target="_blank" rel="noopener noreferrer">Sobre nosotros</a>
              </li>
            </ul>
            <form className="d-flex" role="search">
              <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
              <button className="btn btn-outline-white" type="submit">Buscar</button>
            </form>
            <Link to="/sesion"><button className="btn-ini">Iniciar Sesión</button></Link>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;