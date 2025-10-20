import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDirecciones } from '../context/DireccionesContext';
import '../styles/ClientePagestyle.css'; // Reutilizamos los mismos estilos

function FormularioAddPage({ tipo }) { // Recibe "Envío" o "Facturación"
  const navigate = useNavigate();
  const { agregarDireccionEnvio, agregarDireccionFacturacion } = useDirecciones();

  // Estado para los campos del formulario
  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    direccion: '',
    rut: '',
    ciudad: '',
    codigoPostal: '',
    pais: 'Chile',
    region: '',
    cell: '',
    rutDni: '',
    instagram: ''
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
    
    // Validación básica de campos requeridos
    if (!formData.nombre || !formData.apellidos || !formData.direccion || 
        !formData.rut || !formData.ciudad || !formData.region) {
      alert('Por favor, completa todos los campos obligatorios');
      return;
    }
    
    // Guardar la dirección según el tipo
    let exito = false;
    if (tipo === 'Envío') {
      exito = agregarDireccionEnvio(formData);
    } else if (tipo === 'Facturación') {
      exito = agregarDireccionFacturacion(formData);
    }
    
    if (exito) {
      alert(`Dirección de ${tipo} guardada exitosamente`);
      navigate('/cliente'); // Vuelve a la página de la cuenta
    }
  };

  return (
    <div className="container my-5"> {/* Contenedor de Bootstrap */}
      <div className="cliente-form-container"> {/* Estilo del formulario */}
        <h3 className="form-title">Añadir Dirección de {tipo}</h3>
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6"><div className="form-group"><label htmlFor="nombre">Nombre *</label><input type="text" id="nombre" name="nombre" value={formData.nombre} onChange={handleInputChange} required /></div></div>
            <div className="col-md-6"><div className="form-group"><label htmlFor="apellidos">Apellidos *</label><input type="text" id="apellidos" name="apellidos" value={formData.apellidos} onChange={handleInputChange} required /></div></div>
            <div className="col-md-6"><div className="form-group"><label htmlFor="direccion">Dirección *</label><input type="text" id="direccion" name="direccion" value={formData.direccion} onChange={handleInputChange} required /></div></div>
            <div className="col-md-6"><div className="form-group"><label htmlFor="rut">RUT *</label><input type="text" id="rut" name="rut" value={formData.rut} onChange={handleInputChange} required /></div></div>
            <div className="col-md-6"><div className="form-group"><label htmlFor="ciudad">Ciudad *</label><input type="text" id="ciudad" name="ciudad" value={formData.ciudad} onChange={handleInputChange} required /></div></div>
            <div className="col-md-6"><div className="form-group"><label htmlFor="codigo-postal">Código postal</label><input type="text" id="codigo-postal" name="codigoPostal" value={formData.codigoPostal} onChange={handleInputChange} /></div></div>
            <div className="col-md-6"><div className="form-group"><label htmlFor="pais">País *</label><select id="pais" name="pais" value={formData.pais} onChange={handleInputChange} required><option value="Chile">Chile</option></select></div></div>
            <div className="col-md-6"><div className="form-group"><label htmlFor="region">Región *</label><select id="region" name="region" value={formData.region} onChange={handleInputChange} required><option value="">Seleccionar región</option><option value="Metropolitana de Santiago">Metropolitana de Santiago</option><option value="Valparaíso">Valparaíso</option><option value="O'Higgins">O'Higgins</option><option value="Maule">Maule</option><option value="Biobío">Biobío</option><option value="La Araucanía">La Araucanía</option><option value="Los Ríos">Los Ríos</option><option value="Los Lagos">Los Lagos</option></select></div></div>
            <div className="col-md-6"><div className="form-group"><label htmlFor="cell">Cell</label><input type="tel" id="cell" name="cell" value={formData.cell} onChange={handleInputChange} /></div></div>
            <div className="col-md-6"><div className="form-group"><label htmlFor="rut-dni">Rut (DNI)</label><input type="text" id="rut-dni" name="rutDni" value={formData.rutDni} onChange={handleInputChange} /></div></div>
            <div className="col-12"><div className="form-group"><label htmlFor="instagram">INSTAGRAM</label><input type="text" id="instagram" name="instagram" value={formData.instagram} onChange={handleInputChange} /></div></div>
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