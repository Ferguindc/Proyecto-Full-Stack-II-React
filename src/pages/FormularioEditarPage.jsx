import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/ClientePagestyle.css'; // Reutilizamos los mismos estilos

function FormularioEditarPage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Estados para los campos del formulario
  const [formData, setFormData] = useState({
    telefono: currentUser?.telefono || '987654321',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validación básica
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }
    
    if (formData.newPassword && !formData.currentPassword) {
      alert('Debes ingresar tu contraseña actual para cambiarla');
      return;
    }
    
    alert('Datos guardados (simulación)');
    navigate('/cliente'); // Vuelve a la página de la cuenta
  };

  return (
    <div className="container my-5"> {/* Contenedor de Bootstrap */}
      <div className="cliente-form-container"> {/* Estilo del formulario */}
        <h3 className="form-title">Edita tus datos</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">E-mail *</label>
            <input type="email" id="email" value={currentUser.email} readOnly disabled />
          </div>
          <div className="form-group">
            <label htmlFor="telefono">Teléfono</label>
            <input 
              type="tel" 
              id="telefono" 
              name="telefono"
              value={formData.telefono}
              onChange={handleInputChange}
            />
          </div>
          <hr/>
          <div className="form-group">
            <label htmlFor="current-password">Contraseña actual *</label>
            <input 
              type="password" 
              id="current-password" 
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="new-password">Nueva contraseña</label>
            <input 
              type="password" 
              id="new-password" 
              name="newPassword"
              value={formData.newPassword}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirm-password">Confirmar nueva contraseña</label>
            <input 
              type="password" 
              id="confirm-password" 
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-secondary-custom" onClick={() => navigate('/cliente')}>Volver</button>
            <button type="submit" className="btn btn-confirmar">Confirmar</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FormularioEditarPage;