// src/pages/RegistroPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../assets/styles/style2.css";


// Importamos las imágenes laterales
import powerImg from '../assets/img/power.png';
import makimaImg from '../assets/img/makima.png';
import SesionPage from './SesionPage';

function RegistroPage() {
    // Estados para los campos de registro
    const [email, setEmail] = useState('');
    const [codigoPais, setCodigoPais] = useState('+56'); // Código de país por defecto
    const [telefono, setTelefono] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [confirmarContrasena, setConfirmarContrasena] = useState('');
    
    // Estado para manejar errores
    const [error, setError] = useState('');
    
    const navigate = useNavigate();

    // Función para manejar el registro
    const handleRegister = (e) => {
        e.preventDefault();
        setError(''); // Limpiar errores previos

        // --- Validaciones ---

        // 1. Campos vacíos
        if (!email || !telefono || !contrasena || !confirmarContrasena) {
            setError('Todos los campos son obligatorios.');
            return;
        }

        // 2. Validación de Email (formato básico)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Por favor, ingrese un E-mail válido (ej: usuario@dominio.com).');
            return;
        }

        // 3. Validación de Teléfono (exactamente 9 dígitos)
        const telefonoRegex = /^\d{9}$/;
        if (!telefonoRegex.test(telefono)) {
            setError('El número de teléfono debe tener exactamente 9 dígitos.');
            return;
        }

        // 4. Validación de Contraseñas
        if (contrasena !== confirmarContrasena) {
            setError('Las contraseñas no coinciden.');
            return;
        }

        // (Opcional) Validación de fortaleza de contraseña
        if (contrasena.length < 8) {
             setError('La contraseña debe tener al menos 8 caracteres.');
             return;
        }

        // --- Si todo es válido ---
        console.log('Iniciando registro con:', { 
            email, 
            telefonoCompleto: `${codigoPais}${telefono}`, 
            contrasena 
        });

        // Simulación de registro exitoso
        alert('¡Registro exitoso! Serás redirigido al inicio de sesión.');
        
        // Redirige a la página de login (asumiendo que es /usuarios)
        navigate("/sesion"); 
    };

    // Navegar a la página de login
    const irALogin = (e) => {
        e.preventDefault();
        navigate('/sesion'); // Asume que /usuarios es tu página de login
    };

    return (
        <div className="contenedor-principal">

            {/* Imagen izquierda */}
            <div className="imagen-lateral">
                <img
                    src={powerImg}
                    alt="Power"
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate("/")} 
                />
            </div>

            {/* Formulario central de Registro */}
            <div className="formulario">
                <h1>Crear una Cuenta SIGMA</h1>
                <form id="registerForm" onSubmit={handleRegister}>
                    
                    {/* Campo de E-mail */}
                    <div className="username">
                        <input
                            type="email" // Tipo email para validación de navegador
                            id="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <label>E-mail*</label>
                    </div>

                    {/* Campo de Teléfono (con código de país) */}
                    <div className="telefono-grupo">
                        <div className="username" style={{flex: 1}}>
                            <input
                                type="tel" // Tipo teléfono
                                id="telefono"
                                required
                                value={telefono}
                                onChange={(e) => setTelefono(e.target.value)}
                                maxLength="9" // Forzar 9 dígitos
                            />
                            <label>Número (9 dígitos)</label>
                        </div>
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
                    
                    {/* Campo de Confirmar Contraseña */}
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

                    {/* Mensaje de Error */}
                    {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
                    
                    <input type="submit" value="Registrarse" />
                    
                    <div className="registrarse">
                        ¿Ya tienes cuenta? Inicia sesión <a href="/sesion" onClick={irALogin}>aquí!</a>
                    </div>
                </form>
            </div>

            {/* Imagen derecha */}
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