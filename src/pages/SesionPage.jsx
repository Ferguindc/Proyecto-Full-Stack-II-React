// src/pages/SesionPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../assets/styles/style2.css";

// Importamos las imágenes laterales
import powerImg from '../assets/img/power.png';
import makimaImg from '../assets/img/makima.png';

function SesionPage() {
  // Estados para controlar los campos del formulario
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const navigate = useNavigate(); 

  // Función para manejar login
  const handleLogin = (e) => {
    e.preventDefault();

    console.log('Iniciando sesión con:', { usuario, contrasena });

    // Validación simple de usuario y contraseña
    if (usuario === "admin" && contrasena === "admin") {
      navigate("/admin"); // Redirige a AdminPage
    } else {
      const errorElement = document.getElementById("loginError");
      if (errorElement) errorElement.textContent = "Credenciales incorrectas.";
    }
  };

  return (
    <div className="contenedor-principal">

      {/* Imagen izquierda */}
      <div className="imagen-lateral">
        <img
          src={powerImg}
          alt="Power"
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/")} // Navega correctamente
        />
      </div>

      {/* Formulario central */}
      <div className="formulario">
        <h1>Inicio de Sesión SIGMA</h1>
        <form id="loginForm" onSubmit={handleLogin}>
          
          {/* Campo de Usuario */}
          <div className="username">
            <input
              type="text"
              id="username"
              required
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
            />
            <label>E-MAIL</label>
          </div>

          {/* Campo de Contraseña */}
          <div className="username">
            <input
              type="password"
              id="password"
              required
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
            />
            <label>Contraseña</label>
          </div>

          <div className="recordar">Restablecer contraseña</div>
          <p id="loginError" style={{ color: 'red' }}></p>
          <input type="submit" value="Iniciar sesión" />

          <div className="registrarse">
            ¿No tienes cuenta? Regístrate <a href="/registro">aquí!</a>
          </div>
        </form>
      </div>

      {/* Imagen derecha */}
      <div className="imagen-lateral">
        <img
          src={makimaImg}
          alt="Makima"
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/")} // Navega correctamente a inicio
        />
      </div>

    </div>
  );
}

export default SesionPage;
