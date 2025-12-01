import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "../styles/style2.css";
import powerImg from '../assets/img/power.png';
import makimaImg from '../assets/img/makima.png';
import { useAuth } from '../context/AuthContext';

function SesionPage() {
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); 
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); // Limpia errores

    try {
      const result = await login(usuario, contrasena);

      if (result.success) {
        navigate(result.redirect);
      } else {
        setError(result.message || "Credenciales incorrectas.");
      }
    } catch (error) {
      console.error("Error en login:", error);
      setError("Error de conexión. Intenta de nuevo.");
    }
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
        
        {/* Usuarios de prueba */}
        <div className="mb-3 p-3 bg-light rounded">
          <h6>👤 Usuarios de Prueba:</h6>
          <div className="row">
            <div className="col-6">
              <button 
                type="button" 
                className="btn btn-outline-primary btn-sm w-100 mb-1"
                onClick={() => {setUsuario('admin'); setContrasena('admin');}}
              >
                🔧 Admin
              </button>
            </div>
            <div className="col-6">
              <button 
                type="button" 
                className="btn btn-outline-success btn-sm w-100 mb-1"
                onClick={() => {setUsuario('empleado'); setContrasena('empleado');}}
              >
                👤 Empleado
              </button>
            </div>
          </div>
          <small className="text-muted">Haz clic para autocompletar credenciales</small>
        </div>
        
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