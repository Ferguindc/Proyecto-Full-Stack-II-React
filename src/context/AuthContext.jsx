import React, { createContext, useState, useContext, useEffect } from 'react';
import { loginUsuario, registrarUsuario, obtenerUsuarios } from '../services/usuarioService';

// 1. Crear el Contexto
const AuthContext = createContext();

// 2. Crear el Proveedor del Contexto
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true); // Para saber si ya revisamos localStorage y token
  const [token, setToken] = useState(null);

  // 3. Revisar si ya hay un token válido al cargar la app
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const storedToken = localStorage.getItem("authToken");
        const storedUser = localStorage.getItem("currentUser");
        
        if (storedToken && storedUser) {
          // Verificar si el token sigue siendo válido (simulado)
          try {
            // Decodificar el token para verificar su validez
            const decoded = JSON.parse(atob(storedToken));
            const now = Date.now();
            const tokenAge = now - (decoded.timestamp || 0);
            
            // Token válido por 24 horas (86400000 ms)
            if (tokenAge < 86400000) {
              setToken(storedToken);
              setCurrentUser(JSON.parse(storedUser));
            } else {
              // Token expirado, limpiar localStorage
              localStorage.removeItem("authToken");
              localStorage.removeItem("currentUser");
            }
          } catch (error) {
            console.error("Token inválido:", error);
            localStorage.removeItem("authToken");
            localStorage.removeItem("currentUser");
          }
        }
      } catch (error) {
        console.error("Error verificando estado de autenticación:", error);
        localStorage.removeItem("authToken");
        localStorage.removeItem("currentUser");
      }
      
      setLoading(false); // Terminamos de cargar
    };

    checkAuthStatus();
  }, []);

  // 4. Función de Login usando API
  const login = async (email, password) => {
    try {
      // Caso especial Admin (mantenemos este caso local por ahora)
      if (email === "admin" && password === "admin") {
        const adminUser = { 
          email: "admin", 
          role: "admin", 
          nombre: "Administrador",
          id: "admin" 
        };
        localStorage.setItem("currentUser", JSON.stringify(adminUser));
        localStorage.setItem("authToken", "admin-token");
        setCurrentUser(adminUser);
        setToken("admin-token");
        return { success: true, redirect: "/admin" };
      }

      // Intentar login con la API
      const response = await loginUsuario(email, password);
      
      if (response && response.token) {
        const userData = {
          id: response.user.id,
          email: response.user.email,
          nombre: response.user.nombre,
          rol: response.user.rol || "cliente", // Usar "rol" no "role"
          ...response.user
        };

        // Guardar token y datos del usuario
        localStorage.setItem("authToken", response.token);
        localStorage.setItem("currentUser", JSON.stringify(userData));
        setToken(response.token);
        setCurrentUser(userData);

        // Determinar redirección basada en el rol
        let redirectPath = "/";
        if (userData.rol === "admin") {
          redirectPath = "/admin";
        } else if (userData.rol === "empleado") {
          redirectPath = "/panel-empleado";
        }

        return { success: true, redirect: redirectPath };
      }

      return { success: false, message: "Credenciales incorrectas" };
    } catch (error) {
      console.error("Error en login:", error);
      return { 
        success: false, 
        message: error.message || "Error de conexión con el servidor" 
      };
    }
  };

  // 5. Función de Registro usando API
  const register = async (userData) => {
    try {
      const response = await registrarUsuario(userData);
      
      if (response && response.success) {
        return { 
          success: true, 
          message: "Usuario registrado exitosamente. Puedes iniciar sesión.",
          redirect: "/sesion"
        };
      }

      return { 
        success: false, 
        message: response.message || "Error al registrar usuario" 
      };
    } catch (error) {
      console.error("Error en registro:", error);
      return { 
        success: false, 
        message: error.message || "Error de conexión con el servidor" 
      };
    }
  };

  // 6. Funciones para gestión de empleados usando API
  const crearEmpleado = async (datosEmpleado) => {
    if (!token) {
      return { success: false, message: "No autorizado" };
    }

    try {
      // Crear usuario con rol empleado
      const empleadoData = { ...datosEmpleado, role: 'empleado' };
      const response = await usuarioService.register(empleadoData);
      return { success: true, empleado: response };
    } catch (error) {
      console.error("Error creando empleado:", error);
      return { 
        success: false, 
        message: error.message || "Error al crear empleado" 
      };
    }
  };

  // Función legacy para mantener compatibilidad (ahora usa API)
  const crearEmpleadoLegacy = (datosEmpleado) => {
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

  // Obtener empleados usando API
  const obtenerEmpleados = async () => {
    if (!token) {
      // Fallback a localStorage si no hay token
      return JSON.parse(localStorage.getItem("empleados")) || [];
    }

    try {
      // Obtener usuarios con rol empleado desde la API
      const usuarios = await obtenerUsuarios();
      return usuarios.filter(user => user.rol === 'empleado');
    } catch (error) {
      console.error("Error obteniendo empleados:", error);
      // Fallback a localStorage si falla la API
      return JSON.parse(localStorage.getItem("empleados")) || [];
    }
  };

  // Editar empleado usando API
  const editarEmpleado = async (id, nuevosDatos) => {
    if (!token) {
      return { success: false, message: "No autorizado" };
    }

    try {
      const empleado = await usuarioService.update(id, nuevosDatos, token);
      return { success: true, empleado };
    } catch (error) {
      console.error("Error editando empleado:", error);
      return { 
        success: false, 
        message: error.message || "Error al editar empleado" 
      };
    }
  };

  // Toggle estado empleado usando API
  const toggleEmpleadoActivo = async (id) => {
    if (!token) {
      return { success: false, message: "No autorizado" };
    }

    try {
      // Actualizar estado activo del usuario empleado
      const usuario = await usuarioService.getById(id, token);
      const nuevoEstado = { activo: !usuario.activo };
      const empleado = await usuarioService.update(id, nuevoEstado, token);
      return { success: true, empleado };
    } catch (error) {
      console.error("Error cambiando estado de empleado:", error);
      return { 
        success: false, 
        message: error.message || "Error al cambiar estado del empleado" 
      };
    }
  };

  // 7. Función de Logout usando API
  const logout = async () => {
    try {
      if (token) {
        // Como no hay endpoint específico de logout, simplemente limpiamos el token local
        // Si tu API tiene un endpoint de logout, descomenta la siguiente línea:
        // await usuarioService.logout(token);
      }
    } catch (error) {
      console.error("Error en logout del servidor:", error);
      // Continuar con logout local aunque falle el servidor
    }

    // Limpiar estado local
    localStorage.removeItem("currentUser");
    localStorage.removeItem("authToken");
    setCurrentUser(null);
    setToken(null);
    return { success: true, redirect: "/" };
  };

  // 8. Valores que compartiremos
  const value = {
    currentUser,
    token,
    login,
    register,
    logout,
    loading,
    // Funciones de gestión de empleados
    crearEmpleado,
    obtenerEmpleados,
    editarEmpleado,
    toggleEmpleadoActivo,
    // Función legacy para compatibilidad
    crearEmpleadoLegacy,
  };

  // 9. Retornamos el proveedor
  return (
    <AuthContext.Provider value={value}>
      {!loading && children} {/* Solo renderiza la app cuando no esté cargando */}
    </AuthContext.Provider>
  );
}

// 10. Hook personalizado para usar el contexto fácilmente
export function useAuth() {
  return useContext(AuthContext);
}