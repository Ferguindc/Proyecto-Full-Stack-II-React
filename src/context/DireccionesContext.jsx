import React, { createContext, useState, useContext, useEffect } from 'react';

// 1. Crear el Contexto
const DireccionesContext = createContext();

// 2. Crear el Proveedor del Contexto
export function DireccionesProvider({ children }) {
  const [direccionesEnvio, setDireccionesEnvio] = useState([]);
  const [direccionesFacturacion, setDireccionesFacturacion] = useState([]);

  // 3. Cargar direcciones del localStorage al iniciar
  useEffect(() => {
    try {
      const envioGuardado = localStorage.getItem("direccionesEnvio");
      const facturacionGuardado = localStorage.getItem("direccionesFacturacion");
      
      if (envioGuardado) {
        setDireccionesEnvio(JSON.parse(envioGuardado));
      }
      
      if (facturacionGuardado) {
        setDireccionesFacturacion(JSON.parse(facturacionGuardado));
      }
    } catch (error) {
      console.error("Error al cargar direcciones del localStorage", error);
    }
  }, []);

  // 4. Función para agregar dirección de envío
  const agregarDireccionEnvio = (direccion) => {
    if (direccionesEnvio.length >= 2) {
      alert("Máximo 2 direcciones de envío permitidas");
      return false;
    }
    
    const nuevaDireccion = {
      ...direccion,
      id: Date.now(),
      principal: direccionesEnvio.length === 0 // La primera es principal
    };
    
    const nuevasDirecciones = [...direccionesEnvio, nuevaDireccion];
    setDireccionesEnvio(nuevasDirecciones);
    localStorage.setItem("direccionesEnvio", JSON.stringify(nuevasDirecciones));
    return true;
  };

  // 5. Función para agregar dirección de facturación
  const agregarDireccionFacturacion = (direccion) => {
    if (direccionesFacturacion.length >= 2) {
      alert("Máximo 2 direcciones de facturación permitidas");
      return false;
    }
    
    const nuevaDireccion = {
      ...direccion,
      id: Date.now(),
      principal: direccionesFacturacion.length === 0 // La primera es principal
    };
    
    const nuevasDirecciones = [...direccionesFacturacion, nuevaDireccion];
    setDireccionesFacturacion(nuevasDirecciones);
    localStorage.setItem("direccionesFacturacion", JSON.stringify(nuevasDirecciones));
    return true;
  };

  // 6. Función para eliminar dirección de envío
  const eliminarDireccionEnvio = (id) => {
    const nuevasDirecciones = direccionesEnvio.filter(dir => dir.id !== id);
    setDireccionesEnvio(nuevasDirecciones);
    localStorage.setItem("direccionesEnvio", JSON.stringify(nuevasDirecciones));
  };

  // 7. Función para eliminar dirección de facturación
  const eliminarDireccionFacturacion = (id) => {
    const nuevasDirecciones = direccionesFacturacion.filter(dir => dir.id !== id);
    setDireccionesFacturacion(nuevasDirecciones);
    localStorage.setItem("direccionesFacturacion", JSON.stringify(nuevasDirecciones));
  };

  // 8. Función para editar dirección de envío
  const editarDireccionEnvio = (id, direccionActualizada) => {
    const nuevasDirecciones = direccionesEnvio.map(dir => 
      dir.id === id ? { ...direccionActualizada, id } : dir
    );
    setDireccionesEnvio(nuevasDirecciones);
    localStorage.setItem("direccionesEnvio", JSON.stringify(nuevasDirecciones));
  };

  // 9. Función para editar dirección de facturación
  const editarDireccionFacturacion = (id, direccionActualizada) => {
    const nuevasDirecciones = direccionesFacturacion.map(dir => 
      dir.id === id ? { ...direccionActualizada, id } : dir
    );
    setDireccionesFacturacion(nuevasDirecciones);
    localStorage.setItem("direccionesFacturacion", JSON.stringify(nuevasDirecciones));
  };

  // 10. Valores que compartiremos
  const value = {
    direccionesEnvio,
    direccionesFacturacion,
    agregarDireccionEnvio,
    agregarDireccionFacturacion,
    eliminarDireccionEnvio,
    eliminarDireccionFacturacion,
    editarDireccionEnvio,
    editarDireccionFacturacion
  };

  // 11. Retornamos el proveedor
  return (
    <DireccionesContext.Provider value={value}>
      {children}
    </DireccionesContext.Provider>
  );
}

// 12. Hook personalizado para usar el contexto
export function useDirecciones() {
  return useContext(DireccionesContext);
}