import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ClientePagestyle.css'; // Reutilizamos los mismos estilos

function FormularioAddPage({ tipo }) { // Recibe "Envío" o "Facturación"
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Dirección guardada (simulación)');
    navigate('/cuenta'); // Vuelve a la página de la cuenta
  };

  return (
    <div className="container my-5"> {/* Contenedor de Bootstrap */}
      <div className="cliente-form-container"> {/* Estilo del formulario */}
        <h3 className="form-title">Añadir Dirección de {tipo}</h3>
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6"><div className="form-group"><label htmlFor="nombre">Nombre *</label><input type="text" id="nombre" required /></div></div>
            <div className="col-md-6"><div className="form-group"><label htmlFor="apellidos">Apellidos *</label><input type="text" id="apellidos" required /></div></div>
            <div className="col-md-6"><div className="form-group"><label htmlFor="direccion">Dirección *</label><input type="text" id="direccion" required /></div></div>
            <div className="col-md-6"><div className="form-group"><label htmlFor="rut">RUT *</label><input type="text" id="rut" required /></div></div>
            <div className="col-md-6"><div className="form-group"><label htmlFor="ciudad">Ciudad *</label><input type="text" id="ciudad" required /></div></div>
            <div className="col-md-6"><div className="form-group"><label htmlFor="codigo-postal">Código postal</label><input type="text" id="codigo-postal" /></div></div>
            <div className="col-md-6"><div className="form-group"><label htmlFor="pais">País *</label><select id="pais" required><option value="Chile">Chile</option></select></div></div>
            <div className="col-md-6"><div className="form-group"><label htmlFor="region">Región *</label><select id="region" required><option value="Metropolitana de Santiago">Metropolitana de Santiago</option>{/* ...otras regiones... */}</select></div></div>
            <div className="col-md-6"><div className="form-group"><label htmlFor="cell">Cell</label><input type="tel" id="cell" /></div></div>
            <div className="col-md-6"><div className="form-group"><label htmlFor="rut-dni">Rut (DNI)</label><input type="text" id="rut-dni" /></div></div>
            <div className="col-12"><div className="form-group"><label htmlFor="instagram">INSTAGRAM</label><input type="text" id="instagram" /></div></div>
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

export default FormularioAddPage;