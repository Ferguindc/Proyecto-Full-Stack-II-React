// src/pages/RegistroPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registrarUsuario } from "../services/usuarioService";
import "../styles/style2.css";

import powerImg from '../assets/img/power.png';
import makimaImg from '../assets/img/makima.png';

function RegistroPage() {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    password: "",
    telefono: "",
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validaciones básicas
      if (!formData.nombre || !formData.email || !formData.password) {
        setError('Todos los campos obligatorios deben ser completados.');
        setLoading(false);
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setError('Por favor, ingrese un E-mail válido.');
        setLoading(false);
        return;
      }

      if (formData.password.length < 6) {
        setError('La contraseña debe tener al menos 6 caracteres.');
        setLoading(false);
        return;
      }

      // Crear objeto con datos del usuario para la API
      // Estructura exacta según tu modelo Usuario de Spring Boot
      const userData = {
        nombre: formData.nombre.trim(),
        email: formData.email.trim().toLowerCase(),
        passwordHash: formData.password, // Tu backend debe hashear esto
        rol: "cliente" // Usar "rol" no "role"
      };
      
      // Nota: el ID es autoincremental, no lo enviamos

      console.log('Enviando datos:', userData);
      
      const data = await registrarUsuario(userData);
      console.log("Usuario registrado:", data);

      alert('¡Registro exitoso! Serás redirigido al inicio de sesión.');
      navigate("/sesion");
    } catch (error) {
      console.error("Error completo:", error);
      
      // Mostrar mensaje más específico del error
      let errorMessage = "Error al registrar usuario";
      
      if (error.message.includes('email')) {
        errorMessage = "El email ya está en uso o es inválido";
      } else if (error.message.includes('password') || error.message.includes('contraseña')) {
        errorMessage = "La contraseña no cumple con los requisitos";
      } else if (error.message.includes('nombre')) {
        errorMessage = "El nombre es inválido";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
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
        <form id="registerForm" onSubmit={handleSubmit}>
          <div className="username">
            <input
              type="text"
              name="nombre"
              required
              value={formData.nombre}
              onChange={handleChange}
            />
            <label>Nombre completo*</label>
          </div>

          <div className="username">
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
            />
            <label>E-mail*</label>
          </div>

          <div className="username">
            <input
              type="tel"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              maxLength="9"
            />
            <label>Teléfono (opcional)</label>
          </div>

          <div className="username">
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
            />
            <label>Contraseña*</label>
          </div>

          {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

          <input 
            type="submit" 
            value={loading ? "Registrando..." : "Registrarse"}
            disabled={loading}
          />

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
