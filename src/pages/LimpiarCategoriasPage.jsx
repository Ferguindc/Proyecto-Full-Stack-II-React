// src/pages/LimpiarCategoriasPage.jsx
import React, { useState, useEffect } from 'react';
import { categoriaService } from '../services/categoriaService';

function LimpiarCategoriasPage() {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [procesando, setProcesando] = useState(false);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    cargarCategorias();
  }, []);

  const cargarCategorias = async () => {
    try {
      setLoading(true);
      const categoriasData = await categoriaService.obtenerTodas();
      setCategorias(categoriasData);
    } catch (error) {
      console.error('Error cargando categorías:', error);
    } finally {
      setLoading(false);
    }
  };

  const limpiarYCrearCategorias = async () => {
    try {
      setProcesando(true);
      setMensaje('Eliminando categorías existentes...');
      
      // Eliminar todas las categorías actuales
      for (const categoria of categorias) {
        try {
          await categoriaService.eliminar(categoria.id);
          console.log(`Eliminada categoría: ${categoria.nombre}`);
        } catch (error) {
          console.log(`Error eliminando ${categoria.nombre}:`, error);
        }
      }
      
      setMensaje('Creando categorías correctas...');
      
      // Crear las categorías correctas
      const categoriasCorrectas = [
        { nombre: 'POLERA', descripcion: 'Camisetas y poleras' },
        { nombre: 'POLERON', descripcion: 'Sudaderas y hoodies' },
        { nombre: 'CUADRO', descripcion: 'Arte y decoración' }
      ];
      
      for (const categoria of categoriasCorrectas) {
        try {
          const nuevaCategoria = await categoriaService.crear(categoria);
          console.log(`Creada categoría: ${nuevaCategoria.nombre}`);
        } catch (error) {
          console.log(`Error creando ${categoria.nombre}:`, error);
        }
      }
      
      setMensaje('¡Categorías actualizadas correctamente!');
      
      // Recargar categorías
      await cargarCategorias();
      
    } catch (error) {
      console.error('Error en proceso:', error);
      setMensaje('Error en el proceso');
    } finally {
      setProcesando(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>🧹 Limpiar y Recrear Categorías</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <h2>Categorías Actuales:</h2>
        {loading ? (
          <p>Cargando...</p>
        ) : categorias.length === 0 ? (
          <p>No hay categorías</p>
        ) : (
          <ul>
            {categorias.map(categoria => (
              <li key={categoria.id}>
                <strong>{categoria.nombre}</strong> - {categoria.descripcion}
              </li>
            ))}
          </ul>
        )}
      </div>
      
      {mensaje && (
        <div style={{ 
          background: '#d4edda', 
          padding: '10px', 
          marginBottom: '20px',
          borderRadius: '5px' 
        }}>
          {mensaje}
        </div>
      )}
      
      <button 
        onClick={limpiarYCrearCategorias}
        disabled={procesando}
        style={{
          padding: '15px 30px',
          fontSize: '16px',
          backgroundColor: procesando ? '#ccc' : '#dc3545',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: procesando ? 'not-allowed' : 'pointer'
        }}
      >
        {procesando ? '⏳ Procesando...' : '🗑️ Eliminar y Recrear Categorías'}
      </button>
      
      <div style={{ marginTop: '20px', padding: '15px', background: '#fff3cd', borderRadius: '5px' }}>
        <h3>⚠️ Atención:</h3>
        <p>Este proceso eliminará TODAS las categorías existentes y creará:</p>
        <ul>
          <li><strong>POLERA</strong> - Camisetas y poleras</li>
          <li><strong>POLERON</strong> - Sudaderas y hoodies</li>
          <li><strong>CUADRO</strong> - Arte y decoración</li>
        </ul>
      </div>
    </div>
  );
}

export default LimpiarCategoriasPage;