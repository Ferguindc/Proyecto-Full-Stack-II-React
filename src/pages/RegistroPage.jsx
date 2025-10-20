// src/pages/RegistroPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/style2.css";

import powerImg from '../assets/img/power.png';
import makimaImg from '../assets/img/makima.png';

function RegistroPage() {
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    setError('');

    if (!email || !telefono || !contrasena || !confirmarContrasena) {
      setError('Todos los campos son obligatorios.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Por favor, ingrese un E-mail válido.');
      return;
    }

    if (contrasena !== confirmarContrasena) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    if (contrasena.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }

    // Guardar usuario en localStorage
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const usuarioExistente = usuarios.find((u) => u.email === email);

    if (usuarioExistente) {
      setError('Este E-mail ya está registrado.');
      return;
    }

    usuarios.push({ email, contrasena });
    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    alert('¡Registro exitoso! Serás redirigido al inicio de sesión.');
    navigate("/sesion");
  };

  const irALogin = (e) => {
    e.preventDefault();
    navigate('/sesion');
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
        <h1>Crear una Cuenta SIGMA</h1>
        <form id="registerForm" onSubmit={handleRegister}>
          <div className="username">
            <input
              type="email"
              id="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label>E-mail*</label>
          </div>

          <div className="username">
            <input
              type="tel"
              id="telefono"
              required
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              maxLength="9"
            />
            <label>Número (9 dígitos)</label>
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

          <div className="username">
            <input
              type="password"
              id="confirmPassword"
              required
              value={confirmarContrasena}
              onChange={(e) => setConfirmarContrasena(e.target.value)}
            />
            <label>Confirmar Contraseña</label>
          </div>

          {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

          <input type="submit" value="Registrarse" />

          <div className="registrarse">
            ¿Ya tienes cuenta? Inicia sesión <a href="/sesion" onClick={irALogin}>aquí!</a>
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

export default RegistroPage;
