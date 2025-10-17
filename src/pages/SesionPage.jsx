// src/pages/SesionPage.jsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './style2.css'; // <-- 1. ¡IMPORTAMOS TU CSS!

// 2. Importamos las imágenes laterales
import powerImg from '../assets/img/power.png';
import makimaImg from '../assets/img/makima.png';

function SesionPage() {
  // 3. Estados para controlar los campos del formulario
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // 4. Función para manejar el envío del formulario
  const handleLogin = (e) => {
    e.preventDefault(); // Evita que la página se recargue
    console.log('Iniciando sesión con:', { username, password });
    // Aquí iría la lógica para enviar esto a tu backend
  };

  return (
    // 5. Replicamos la estructura de tu HTML
    <div className="contenedor-principal">
      
      <div className="imagen-lateral">
        {/* El enlace ahora usa <Link> de React Router */}
        <Link to="/">
          <img src={powerImg} alt="Power" />
        </Link>
      </div>

      <div className="formulario">
        <h1>Inicio de Sesión SIGMA</h1>
        <form id="loginForm" onSubmit={handleLogin}>
          
          {/* Campo de Usuario Controlado */}
          <div className="username">
            <input 
              type="text" 
              id="username" 
              required 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <label>Nombre de usuario</label>
          </div>

          {/* Campo de Contraseña Controlado */}
          <div className="username">
            <input 
              type="password" 
              id="password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label>Contraseña</label>
          </div>
          
          <div className="recordar">¿Olvidó su contraseña?</div>
          <p id="loginError" style={{ color: 'red' }}></p>
          <input type="submit" value="Iniciar sesión" />
          
          <div className="registrarse">
            ¿No tienes cuenta? Regístrate <a href="#">aquí!</a>
            {/* Este enlace <a href="#"> lo podemos cambiar luego si creas una página de registro */}
          </div>
        </form>
      </div>

      <div className="imagen-lateral">
        <Link to="/">
          <img src={makimaImg} alt="Makima" />
        </Link>
      </div>

    </div>
  );
}

export default SesionPage;