import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import "../styles/style2.css";
import powerImg from '../assets/img/power.png';
import makimaImg from '../assets/img/makima.png';
import { useAuth } from '../context/AuthContext'; // 👈 1. Importa el hook useAuth

function SesionPage() {
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState(''); // 👈 2. Estado de error local
  const navigate = useNavigate(); 
  const { login } = useAuth(); // 👈 3. Obtén la función login del contexto

  const handleLogin = (e) => {
    e.preventDefault();
    setError(''); // Limpia errores

    // 👈 4. Llama a la función login del contexto
    const success = login(usuario, contrasena);

    if (!success) {
      setError("Credenciales incorrectas."); // 👈 5. Muestra error si falla
    }
    // Si tiene éxito, la función 'login' del contexto se encargará de redirigir
  };

  return (
    <div className="contenedor-principal">
      <div className="imagen-lateral">
        <img
          src={powerImg}
          alt="Power"
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/")}
        />
      </div>

      <div className="formulario">
        <h1>Inicio de Sesión SIGMA</h1>
        <form id="loginForm" onSubmit={handleLogin}>
          
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
          
          {/* 👈 6. Muestra el error local */}
          {error && <p id="loginError" style={{ color: 'red' }}>{error}</p>}
          
          <input type="submit" value="Iniciar sesión" />

          <div className="registrarse">
            ¿No tienes cuenta? Regístrate <Link to="/registro">aquí!</Link>

          </div>
        </form>
      </div>

      <div className="imagen-lateral">
        <img
          src={makimaImg}
          alt="Makima"
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/")}
        />
      </div>
    </div>
  );
}

export default SesionPage;