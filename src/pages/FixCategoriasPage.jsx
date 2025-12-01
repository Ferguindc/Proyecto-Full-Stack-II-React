// src/pages/FixCategoriasPage.jsx
import React, { useState, useEffect } from 'react';
import { categoriaService } from '../services/categoriaService';

function FixCategoriasPage() {
  const [mensaje, setMensaje] = useState('');
  const [procesando, setProcesando] = useState(false);

  const eliminarTodasYCrear = async () => {
    try {
      setProcesando(true);
      setMensaje('Iniciando proceso...');

      // Obtener todas las categorías actuales
      setMensaje('Obteniendo categorías actuales...');
      const categoriasActuales = await categoriaService.obtenerTodas();
      console.log('Categorías actuales:', categoriasActuales);

      // Eliminar una por una
      setMensaje(`Eliminando ${categoriasActuales.length} categorías...`);
      for (let i = 0; i < categoriasActuales.length; i++) {
        const categoria = categoriasActuales[i];
        try {
          await categoriaService.eliminar(categoria.id);
          console.log(`✅ Eliminada: ${categoria.nombre}`);
          setMensaje(`Eliminando... ${i + 1}/${categoriasActuales.length}`);
        } catch (error) {
          console.error(`❌ Error eliminando ${categoria.nombre}:`, error);
        }
      }

      // Esperar un poco
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Crear las nuevas categorías
      setMensaje('Creando categorías correctas...');
      const nuevasCategorias = [
        { nombre: 'POLERA', descripcion: 'Camisetas y poleras' },
        { nombre: 'POLERON', descripcion: 'Sudaderas y hoodies' },
        { nombre: 'CUADRO', descripcion: 'Arte y decoración' }
      ];

      for (const categoria of nuevasCategorias) {
        try {
          const creada = await categoriaService.crear(categoria);
          console.log(`✅ Creada: ${creada.nombre}`);
        } catch (error) {
          console.error(`❌ Error creando ${categoria.nombre}:`, error);
        }
      }

      setMensaje('✅ Proceso completado! Las categorías han sido actualizadas.');

    } catch (error) {
      console.error('Error general:', error);
      setMensaje(`❌ Error: ${error.message}`);
    } finally {
      setProcesando(false);
    }
  };

  const verificarCategorias = async () => {
    try {
      const categorias = await categoriaService.obtenerTodas();
      console.log('Categorías actuales:', categorias);
      setMensaje(`Categorías actuales: ${categorias.map(c => c.nombre).join(', ')}`);
    } catch (error) {
      console.error('Error verificando:', error);
      setMensaje(`Error verificando: ${error.message}`);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>🔧 Arreglar Categorías</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={verificarCategorias}
          style={{ padding: '10px 20px', marginRight: '10px' }}
        >
          🔍 Verificar Categorías Actuales
        </button>
        
        <button 
          onClick={eliminarTodasYCrear}
          disabled={procesando}
          style={{
            padding: '15px 30px',
            backgroundColor: procesando ? '#ccc' : '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '5px'
          }}
        >
          {procesando ? '⏳ Procesando...' : '🗑️ ELIMINAR TODO Y RECREAR'}
        </button>
      </div>

      {mensaje && (
        <div style={{ 
          padding: '15px', 
          background: '#f8f9fa', 
          border: '1px solid #ddd',
          borderRadius: '5px',
          fontFamily: 'monospace'
        }}>
          {mensaje}
        </div>
      )}

      <div style={{ marginTop: '20px', padding: '15px', background: '#fff3cd' }}>
        <h3>⚠️ ATENCIÓN</h3>
        <p>Este proceso eliminará TODAS las categorías y creará:</p>
        <ul>
          <li><strong>POLERA</strong></li>
          <li><strong>POLERON</strong></li>
          <li><strong>CUADRO</strong></li>
        </ul>
        <p><strong>Abre la consola del navegador (F12) para ver el progreso detallado.</strong></p>
      </div>
    </div>
  );
}

export default FixCategoriasPage;