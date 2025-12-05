// 1. Importamos NavLink, Link y AÑADIMOS useAuth
import React from 'react';
import { Link, NavLink } from 'react-router-dom'; 
import logo from '../assets/img/LOGODEF (2).png';
import './Navbar.css'; 
import { useAuth } from '../context/AuthContext'; // 👈 1. Importa useAuth
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import Ticker from '../components/Ticker.jsx';



function Navbar() {
  // 2. Obtenemos el usuario actual y la función logout del contexto
  const { currentUser, logout } = useAuth();
  const { getTotalItems, toggleCart } = useCart();
  const navigate = useNavigate();

  return (
    <>
      {/* ----- Barra de envíos navideña ----- */}
      <nav className="navbar" style={{ background: 'linear-gradient(45deg, #228B22, #DC143C)' }}>
        <div className="container-fluid d-flex justify-content-center">
          <div className="tamañoletra text-white mb-0">
                  <Ticker>
                  <div className="ticker-item">🎄 ¡Feliz Navidad! 🎅</div>
                  <div className="ticker-item">🎁 Envíos gratis sobre $50.000 ⭐</div>
                  <div className="ticker-item">❄️ ¡Ofertas Navideñas! 🎄</div>
                </Ticker>
          </div>
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
            
            {/* Links centrados */}
            <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
              <li className="nav-item">
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
                <NavLink className="nav-link" to="/blog">
                  Blog
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/preguntas-frecuentes">
                  FAQ
                </NavLink>
              </li>
            </ul>

            {/* ----- INICIO DE LA MODIFICACIÓN ----- */}
            {/* 3. Usamos currentUser (del contexto) en lugar de isLoggedIn (del estado local) */}
            <ul className="navbar-nav mb-2 mb-lg-0">
              {/* Carrito */}
              <li className="nav-item">
                <button 
                  className="nav-link btn btn-link position-relative"
                  onClick={toggleCart}
                  style={{ border: 'none', background: 'none', color: 'inherit' }}
                >
                  <i className="bi bi-bag"></i>
                  {getTotalItems() > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                      {getTotalItems()}
                    </span>
                  )}
                </button>
              </li>
              
              {currentUser ? (
                // --- MENÚ SI ESTÁ LOGUEADO ---
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
                    {/* Mostrar rol del usuario */}
                    {currentUser.rol === 'admin' ? 'Administrador' : 
                     currentUser.rol === 'empleado' ? 'Empleado' : 'Mi cuenta'}
                  </a>
                  <ul className="dropdown-menu dropdown-menu-dark dropdown-menu-end">
                    {/* Opciones comunes */}
                    <li>
                      <Link className="dropdown-item" to="/cliente">
                        Ir a Mi cuenta
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/cliente/editar">
                        Editar mis detalles
                      </Link>
                    </li>
                    
                    {/* Opciones específicas para admin */}
                    {currentUser.rol === 'admin' && (
                      <>
                        <li><hr className="dropdown-divider" /></li>
                        <li className="dropdown-header">
                          <i className="bi bi-shield-check me-1"></i>
                          Administración
                        </li>
                        <li>
                          <Link className="dropdown-item" to="/admin">
                            <i className="bi bi-speedometer2 me-2"></i>
                            Panel de Control
                          </Link>
                        </li>
                        <li>
                          <Link className="dropdown-item" to="/admin/productos/nuevo">
                            <i className="bi bi-plus-circle me-2"></i>
                            Agregar Producto
                          </Link>
                        </li>
                        <li>
                          <Link className="dropdown-item" to="/debug-productos">
                            <i className="bi bi-box-seam me-2"></i>
                            Gestión de Productos
                          </Link>
                        </li>
                        <li>
                          <Link className="dropdown-item" to="/asignar-categorias">
                            <i className="bi bi-tags me-2"></i>
                            Gestión de Categorías
                          </Link>
                        </li>
                        <li><hr className="dropdown-divider" /></li>
                        <li className="dropdown-header">
                          <i className="bi bi-people me-1"></i>
                          Personal
                        </li>
                        <li>
                          <Link className="dropdown-item" to="/gestion-empleados">
                            <i className="bi bi-person-gear me-2"></i>
                            Gestión de Empleados
                          </Link>
                        </li>
                        {/* <li>
                          <Link className="dropdown-item" to="/panel-empleado">
                            <i className="bi bi-briefcase me-2"></i>
                            Panel de Trabajo
                          </Link>
                        </li> */}

                      </>
                    )}
                    
                    {/* Opciones específicas para empleados - TEMPORALMENTE DESHABILITADO */}
                    {/* {currentUser.rol === 'empleado' && (
                      <>
                        <li><hr className="dropdown-divider" /></li>
                        <li>
                          <Link className="dropdown-item" to="/panel-empleado">
                            <i className="bi bi-briefcase me-2"></i>
                            Panel de Empleado
                          </Link>
                        </li>
                      </>
                    )} */}
                    
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      {/* 4. Usamos la función logout del contexto */}
                      <button className="dropdown-item" onClick={() => {
                        const result = logout();
                        if (result.success) {
                          navigate(result.redirect);
                        }
                      }}>
                        <i className="bi bi-box-arrow-right me-2"></i>
                        Cerrar sesión
                      </button>
                    </li>
                  </ul>
                </li>
              ) : (
                // --- MENÚ SI NO ESTÁ LOGUEADO ---
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
              )}
            </ul>
            {/* ----- FIN DE LA MODIFICACIÓN ----- */}
            
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;