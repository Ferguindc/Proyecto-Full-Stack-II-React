import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/ClientePagestyle.css'; // Reutilizamos los mismos estilos

function FormularioEditarPage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // (Aquí puedes añadir los estados para los campos)

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Datos guardados (simulación)');
    navigate('/cuenta'); // Vuelve a la página de la cuenta
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
            <input type="tel" id="telefono" defaultValue={currentUser.telefono || '987654321'} />
          </div>
          <hr/>
          <div className="form-group">
            <label htmlFor="current-password">Contraseña actual *</label>
            <input type="password" id="current-password" />
          </div>
          <div className="form-group">
            <label htmlFor="new-password">Nueva contraseña</label>
            <input type="password" id="new-password" />
          </div>
          <div className="form-group">
            <label htmlFor="confirm-password">Confirmar nueva contraseña</label>
            <input type="password" id="confirm-password" />
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