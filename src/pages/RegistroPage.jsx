// src/pages/RegistroPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import "../styles/style2.css";

import powerImg from '../assets/img/power.png';
import makimaImg from '../assets/img/makima.png';

function RegistroPage() {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    rut: "",
    email: "",
    password: "",
    confirmPassword: "",
    telefono: "",
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Función para validar RUT chileno
  const validarRUT = (rut) => {
    if (!rut || rut.trim() === '') return false;
    
    // Eliminar puntos y guión
    const cleanRUT = rut.replace(/[.-]/g, '').trim();
    
    // Verificar longitud
    if (cleanRUT.length < 8 || cleanRUT.length > 9) {
      return false;
    }
    
    // Verificar que solo contenga números y K al final
    if (!/^[0-9]+[0-9kK]$/.test(cleanRUT)) {
      return false;
    }
    
    const body = cleanRUT.slice(0, -1);
    const dv = cleanRUT.slice(-1).toUpperCase();
    
    // Verificar que el cuerpo sean solo números
    if (!/^[0-9]+$/.test(body)) {
      return false;
    }
    
    let sum = 0;
    let multiplier = 2;
    
    // Calcular dígito verificador
    for (let i = body.length - 1; i >= 0; i--) {
      const digit = parseInt(body.charAt(i));
      if (isNaN(digit)) return false;
      sum += digit * multiplier;
      multiplier = multiplier === 7 ? 2 : multiplier + 1;
    }
    
    const expectedDV = 11 - (sum % 11);
    let calculatedDV;
    
    if (expectedDV === 11) {
      calculatedDV = '0';
    } else if (expectedDV === 10) {
      calculatedDV = 'K';
    } else {
      calculatedDV = expectedDV.toString();
    }
    
    return dv === calculatedDV;
  };

  // Función para formatear RUT mientras se escribe
  const formatearRUT = (rut) => {
    // Eliminar todo lo que no sea número o K
    let cleaned = rut.replace(/[^0-9kK]/g, '').toUpperCase();
    
    // Si está vacío o tiene solo 1 carácter, devolverlo tal como está
    if (cleaned.length <= 1) {
      return cleaned;
    }
    
    // Limitar a máximo 9 caracteres (8 números + 1 dígito verificador)
    if (cleaned.length > 9) {
      cleaned = cleaned.substring(0, 9);
    }
    
    // Separar cuerpo y dígito verificador
    const body = cleaned.slice(0, -1);
    const dv = cleaned.slice(-1);
    
    // Solo formatear si tiene al menos 2 dígitos
    if (body.length === 0) {
      return cleaned;
    }
    
    // Formatear cuerpo con puntos (cada 3 dígitos de derecha a izquierda)
    let formattedBody = '';
    for (let i = body.length - 1; i >= 0; i--) {
      formattedBody = body[i] + formattedBody;
      if ((body.length - i) % 3 === 0 && i > 0) {
        formattedBody = '.' + formattedBody;
      }
    }
    
    return `${formattedBody}-${dv}`;
  };

  // Validar nombre (solo letras y espacios)
  const validarNombre = (nombre) => {
    const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    return regex.test(nombre) && nombre.trim().length >= 2;
  };

  // Validar teléfono chileno
  const validarTelefono = (telefono) => {
    if (!telefono) return true; // Es opcional
    const regex = /^(\+56)?[9][0-9]{8}$/;
    return regex.test(telefono.replace(/\s/g, ''));
  };

  // Validar contraseña segura
  const validarPassword = (password) => {
    const minLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    return {
      isValid: minLength && hasUpperCase && hasLowerCase && hasNumbers,
      minLength,
      hasUpperCase,
      hasLowerCase,
      hasNumbers,
      hasSpecialChar
    };
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'rut') {
      // Solo procesar si el valor ha cambiado realmente
      const currentRUT = formData.rut;
      if (value !== currentRUT) {
        const formattedRUT = formatearRUT(value);
        setFormData({
          ...formData,
          [name]: formattedRUT,
        });
      }
    } else if (name === 'telefono') {
      // Permitir solo números y símbolo +
      const cleanedPhone = value.replace(/[^+0-9]/g, '');
      if (cleanedPhone.length <= 12) { // Limitar longitud
        setFormData({
          ...formData,
          [name]: cleanedPhone,
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  // Función especial para manejar teclas en el RUT
  const handleRutKeyDown = (e) => {
    // Permitir teclas de navegación y edición
    const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Enter'];
    if (allowedKeys.includes(e.key)) {
      return;
    }
    
    // Permitir solo números y la letra K
    if (!/[0-9kK]/.test(e.key)) {
      e.preventDefault();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validaciones básicas
      if (!formData.nombre || !formData.apellido || !formData.rut || !formData.email || !formData.password || !formData.confirmPassword) {
        setError('Todos los campos obligatorios (*) deben ser completados.');
        setLoading(false);
        return;
      }

      // Validar nombre y apellido
      if (!validarNombre(formData.nombre)) {
        setError('El nombre debe contener solo letras y al menos 2 caracteres.');
        setLoading(false);
        return;
      }

      if (!validarNombre(formData.apellido)) {
        setError('El apellido debe contener solo letras y al menos 2 caracteres.');
        setLoading(false);
        return;
      }

      // Validar RUT
      if (!validarRUT(formData.rut)) {
        setError('Por favor, ingrese un RUT válido.');
        setLoading(false);
        return;
      }

      // Validar email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setError('Por favor, ingrese un E-mail válido.');
        setLoading(false);
        return;
      }

      // Validar contraseña
      const passwordValidation = validarPassword(formData.password);
      if (!passwordValidation.isValid) {
        let errorMsg = 'La contraseña debe tener al menos: ';
        const requirements = [];
        if (!passwordValidation.minLength) requirements.push('8 caracteres');
        if (!passwordValidation.hasUpperCase) requirements.push('1 mayúscula');
        if (!passwordValidation.hasLowerCase) requirements.push('1 minúscula');
        if (!passwordValidation.hasNumbers) requirements.push('1 número');
        
        setError(errorMsg + requirements.join(', '));
        setLoading(false);
        return;
      }

      // Validar confirmación de contraseña
      if (formData.password !== formData.confirmPassword) {
        setError('Las contraseñas no coinciden.');
        setLoading(false);
        return;
      }

      // Validar teléfono si se proporciona
      if (formData.telefono && !validarTelefono(formData.telefono)) {
        setError('El teléfono debe tener el formato: +56912345678 o 912345678');
        setLoading(false);
        return;
      }

      // Crear objeto con datos del usuario
      const userData = {
        nombre: formData.nombre.trim(),
        apellido: formData.apellido.trim(),
        rut: formData.rut.replace(/[.-]/g, ''), // Guardar RUT limpio
        email: formData.email.trim().toLowerCase(),
        passwordHash: formData.password,
        telefono: formData.telefono ? formData.telefono.replace(/\s/g, '') : '',
        rol: "cliente"
      };
      
      console.log('🆕 Registrando usuario:', userData);
      
      const resultado = await register(userData);
      
      if (resultado.success) {
        console.log("✅ Usuario registrado exitosamente:", resultado.user);
        alert('¡Registro exitoso! Serás redirigido al inicio de sesión.');
        navigate("/sesion");
      } else {
        throw new Error(resultado.message || 'Error en el registro');
      }
    } catch (error) {
      console.error("Error completo:", error);
      
      // Mostrar mensaje más específico del error
      let errorMessage = "Error al registrar usuario";
      
      if (error.message.includes('email')) {
        errorMessage = "El email ya está en uso o es inválido";
      } else if (error.message.includes('rut')) {
        errorMessage = "El RUT ya está registrado o es inválido";
      } else if (error.message.includes('password') || error.message.includes('contraseña')) {
        errorMessage = "La contraseña no cumple con los requisitos";
      } else if (error.message.includes('nombre')) {
        errorMessage = "El nombre o apellido contiene caracteres inválidos";
      } else if (error.message.includes('telefono')) {
        errorMessage = "El número de teléfono no es válido";
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
              pattern="[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+"
              title="Solo se permiten letras y espacios"
            />
            <label>Nombre*</label>
          </div>

          <div className="username">
            <input
              type="text"
              name="apellido"
              required
              value={formData.apellido}
              onChange={handleChange}
              pattern="[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+"
              title="Solo se permiten letras y espacios"
            />
            <label>Apellido*</label>
          </div>

          <div className="username">
            <input
              type="text"
              name="rut"
              required
              value={formData.rut}
              onChange={handleChange}
              onKeyDown={handleRutKeyDown}
              maxLength="12"
              title="Formato: 12.345.678-9"
              autoComplete="off"
              style={{ fontFamily: 'monospace', letterSpacing: '1px' }}
            />
            <label>RUT*</label>
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
              placeholder="+56912345678"
              maxLength="12"
              title="Formato: +56912345678 o 912345678"
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
              minLength="8"
              title="Mínimo 8 caracteres, debe incluir mayúsculas, minúsculas y números"
            />
            <label>Contraseña*</label>
          </div>

          <div className="username">
            <input
              type="password"
              name="confirmPassword"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              minLength="8"
            />
            <label>Confirmar Contraseña*</label>
          </div>

          {/* Indicador de fortaleza de contraseña */}
          {formData.password && (
            <div style={{ margin: '10px 0', fontSize: '12px' }}>
              <div style={{ margin: '5px 0', fontWeight: 'bold', color: '#333' }}>Fortaleza de contraseña:</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                <span style={{ 
                  color: validarPassword(formData.password).minLength ? 'green' : 'red',
                  fontSize: '11px'
                }}>
                  {validarPassword(formData.password).minLength ? '✓' : '✗'} Mín. 8 caracteres
                </span>
                <span style={{ 
                  color: validarPassword(formData.password).hasUpperCase ? 'green' : 'red',
                  fontSize: '11px'
                }}>
                  {validarPassword(formData.password).hasUpperCase ? '✓' : '✗'} Mayúscula
                </span>
                <span style={{ 
                  color: validarPassword(formData.password).hasLowerCase ? 'green' : 'red',
                  fontSize: '11px'
                }}>
                  {validarPassword(formData.password).hasLowerCase ? '✓' : '✗'} Minúscula
                </span>
                <span style={{ 
                  color: validarPassword(formData.password).hasNumbers ? 'green' : 'red',
                  fontSize: '11px'
                }}>
                  {validarPassword(formData.password).hasNumbers ? '✓' : '✗'} Número
                </span>
              </div>
            </div>
          )}

          {/* Validación de coincidencia de contraseñas */}
          {formData.confirmPassword && formData.password !== formData.confirmPassword && (
            <div style={{ color: 'red', fontSize: '12px', textAlign: 'center', margin: '5px 0' }}>
              Las contraseñas no coinciden
            </div>
          )}

          {/* Validación de RUT en tiempo real */}
          {formData.rut && formData.rut.length > 8 && (
            <div style={{ 
              color: validarRUT(formData.rut) ? 'green' : 'red', 
              fontSize: '12px', 
              textAlign: 'center', 
              margin: '5px 0' 
            }}>
              {validarRUT(formData.rut) ? '✓ RUT válido' : '✗ RUT inválido'}
            </div>
          )}

          {error && <div style={{ color: 'red', textAlign: 'center', margin: '10px 0' }}>{error}</div>}

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
