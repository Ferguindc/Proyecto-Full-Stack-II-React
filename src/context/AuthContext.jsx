import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// 1. Crear el Contexto
const AuthContext = createContext();

// 2. Crear el Proveedor del Contexto
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true); // Para saber si ya revisamos localStorage
  const navigate = useNavigate();

  // 3. Revisar si ya hay un usuario logueado en localStorage al cargar la app
  useEffect(() => {
    try {
      const userJson = localStorage.getItem("currentUser");
      if (userJson) {
        setCurrentUser(JSON.parse(userJson));
      }
    } catch (error) {
      console.error("Error al leer usuario de localStorage", error);
      localStorage.removeItem("currentUser");
    }
    setLoading(false); // Terminamos de cargar
  }, []);

  // 4. Función de Login (expandida para empleados)
  const login = (email, contrasena) => {
    // Caso especial Admin
    if (email === "admin" && contrasena === "admin") {
      const adminUser = { 
        email: "admin", 
        role: "admin", 
        nombre: "Administrador",
        id: "admin" 
      };
      localStorage.setItem("currentUser", JSON.stringify(adminUser));
      setCurrentUser(adminUser);
      navigate("/admin");
      return true;
    }

    // Buscar en empleados
    const empleados = JSON.parse(localStorage.getItem("empleados")) || [];
    const empleadoValido = empleados.find(
      (emp) => emp.email === email && emp.contrasena === contrasena && emp.activo
    );

    if (empleadoValido) {
      const empleadoUser = {
        ...empleadoValido,
        role: "empleado"
      };
      localStorage.setItem("currentUser", JSON.stringify(empleadoUser));
      setCurrentUser(empleadoUser);
      navigate("/panel-empleado");
      return true;
    }

    // Caso Usuario normal (clientes)
    const usuariosGuardados = JSON.parse(localStorage.getItem("usuarios")) || [];
    const usuarioValido = usuariosGuardados.find(
      (u) => u.email === email && u.contrasena === contrasena
    );

    if (usuarioValido) {
      const clienteUser = {
        ...usuarioValido,
        role: "cliente"
      };
      localStorage.setItem("currentUser", JSON.stringify(clienteUser));
      setCurrentUser(clienteUser);
      navigate("/"); // Redirige al inicio
      return true;
    }

    // Si nada funciona
    return false;
  };

  // 5. Funciones para gestión de empleados
  const crearEmpleado = (datosEmpleado) => {
    const empleados = JSON.parse(localStorage.getItem("empleados")) || [];
    
    // Verificar que no exista el email
    const empleadoExistente = empleados.find(emp => emp.email === datosEmpleado.email);
    if (empleadoExistente) {
      return { success: false, message: "Ya existe un empleado con ese email" };
    }

    const nuevoEmpleado = {
      id: Date.now().toString(),
      ...datosEmpleado,
      activo: true,
      fechaCreacion: new Date().toISOString(),
      creadoPor: currentUser?.email || "admin"
    };

    empleados.push(nuevoEmpleado);
    localStorage.setItem("empleados", JSON.stringify(empleados));
    
    return { success: true, empleado: nuevoEmpleado };
  };

  const obtenerEmpleados = () => {
    return JSON.parse(localStorage.getItem("empleados")) || [];
  };

  const editarEmpleado = (id, nuevosDatos) => {
    const empleados = JSON.parse(localStorage.getItem("empleados")) || [];
    const index = empleados.findIndex(emp => emp.id === id);
    
    if (index !== -1) {
      empleados[index] = {
        ...empleados[index],
        ...nuevosDatos,
        fechaModificacion: new Date().toISOString(),
        modificadoPor: currentUser?.email || "admin"
      };
      localStorage.setItem("empleados", JSON.stringify(empleados));
      return { success: true, empleado: empleados[index] };
    }
    
    return { success: false, message: "Empleado no encontrado" };
  };

  const toggleEmpleadoActivo = (id) => {
    const empleados = JSON.parse(localStorage.getItem("empleados")) || [];
    const index = empleados.findIndex(emp => emp.id === id);
    
    if (index !== -1) {
      empleados[index].activo = !empleados[index].activo;
      empleados[index].fechaModificacion = new Date().toISOString();
      empleados[index].modificadoPor = currentUser?.email || "admin";
      localStorage.setItem("empleados", JSON.stringify(empleados));
      return { success: true, empleado: empleados[index] };
    }
    
    return { success: false, message: "Empleado no encontrado" };
  };

  // 6. Función de Logout
  const logout = () => {
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
    navigate("/"); // Redirige al inicio al cerrar sesión
  };

  // 7. Valores que compartiremos
  const value = {
    currentUser,
    login,
    logout,
    loading,
    // Funciones de gestión de empleados
    crearEmpleado,
    obtenerEmpleados,
    editarEmpleado,
    toggleEmpleadoActivo,
  };

  // 8. Retornamos el proveedor
  return (
    <AuthContext.Provider value={value}>
      {!loading && children} {/* Solo renderiza la app cuando no esté cargando */}
    </AuthContext.Provider>
  );
}

// 9. Hook personalizado para usar el contexto fácilmente
export function useAuth() {
  return useContext(AuthContext);
}