// src/components/Navbar.jsx

// 1. Importamos NavLink además de Link
import React from 'react';
import { Link, NavLink } from 'react-router-dom'; 
import logo from '../assets/img/LOGODEF (2).png';
import './Navbar.css'; 

// Asegúrate de tener los íconos de Bootstrap importados en tu App.jsx o index.js
// import 'bootstrap-icons/font/bootstrap-icons.css';

function Navbar() {
  return (
    <>
      {/* ----- Barra de envíos ----- */}
      <nav className="navbar bg-dark">
        <div className="container-fluid d-flex justify-content-center">
          <p className="tamañoletra text-white mb-0">
            Envíos gratis sobre $50.000
          </p>
        </div>
      </nav>

      {/* ----- Barra de navegación principal ----- */}
      <nav className="navbar colornav navbar-expand-lg bg-body-tertiary opacity-20" data-bs-theme="dark">
        <div className="container-fluid">
          
          <Link to="/"> <img src={logo} alt="Logo Crimewave" width="160" height="80" className="logo" /></Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            
            {/* 2. Usamos 'mx-auto' (margin horizontal automático) para centrar la lista */}
            <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
              
              {/* 3. Reemplazamos <Link> por <NavLink> para el manejo automático de la clase 'active' */}
              <li className="nav-item">
                {/* Añadimos 'end' para que 'Inicio' (/) no esté activo en otras rutas como /cuadros */}
                <NavLink className="nav-link" to="/" end>
                  Inicio
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/poleras">
                  Poleras
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/polerones">
                  Polerones
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/cuadros">
                  Cuadros
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/productos">
                  Ver todo
                </NavLink>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="https://www.instagram.com/crimewave.store/?hl=es" target="_blank" rel="noopener noreferrer">
                  Sobre nosotros
                </a>
              </li>
            </ul>
            
            {/* 1. Barra de búsqueda y botón eliminados */}

            {/* Menú de Acceso (Dropdown) - 'ms-auto' lo empuja al final si fuera necesario,
                pero al estar después del 'mx-auto' de los links, ya queda a la derecha. */}
            <ul className="navbar-nav mb-2 mb-lg-0"> 
              <li className="nav-item dropdown">
                <a 
                  className="nav-link dropdown-toggle" 
                  href="#"
                  role="button" 
                  data-bs-toggle="dropdown" 
                  aria-expanded="false"
                  style={{ display: 'flex', alignItems: 'center' }}
                >
                  <i className="bi bi-person-circle me-2"></i> 
                  Acceso
                </a>
                <ul className="dropdown-menu dropdown-menu-dark dropdown-menu-end">
                  <li>
                    <Link className="dropdown-item" to="/sesion">
                      Ingresar
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/registro">
                      Crear cuenta
                    </Link>
                  </li>
                </ul>
              </li>
            </ul>
            
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;