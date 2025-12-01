import React, { createContext, useState, useContext, useEffect } from 'react';
import { loginUsuario, registrarUsuario, obtenerUsuarios } from '../services/usuarioService';
import usuarioService from '../services/usuarioService';

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
          try {
            // Para tokens de desarrollo (admin-token, empleado-token), no validar timestamp
            if (storedToken === 'admin-token' || storedToken === 'empleado-token') {
              setToken(storedToken);
              setCurrentUser(JSON.parse(storedUser));
            } else {
              // Para tokens JWT reales, verificar validez
              try {
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
              } catch (decodeError) {
                // Token no válido, limpiar localStorage
                localStorage.removeItem("authToken");
                localStorage.removeItem("currentUser");
              }
            }
          } catch (error) {
            console.error("Error procesando token:", error);
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
      // Casos especiales para desarrollo
      if (email === "admin" && password === "admin") {
        const adminUser = { 
          email: "admin", 
          rol: "admin", 
          nombre: "Administrador",
          id: "admin" 
        };
        localStorage.setItem("currentUser", JSON.stringify(adminUser));
        localStorage.setItem("authToken", "admin-token");
        setCurrentUser(adminUser);
        setToken("admin-token");
        return { success: true, redirect: "/admin" };
      }

      if (email === "empleado" && password === "empleado") {
        const empleadoUser = { 
          email: "empleado", 
          rol: "empleado", 
          nombre: "Empleado de Prueba",
          id: "empleado" 
        };
        localStorage.setItem("currentUser", JSON.stringify(empleadoUser));
        localStorage.setItem("authToken", "empleado-token");
        setCurrentUser(empleadoUser);
        setToken("empleado-token");
        return { success: true, redirect: "/panel-empleado" };
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
      console.log('🆕 AuthContext - Registrando usuario:', userData);
      
      const usuario = await registrarUsuario(userData);
      console.log('✅ Usuario registrado en servicio:', usuario);
      
      // registrarUsuario devuelve directamente el usuario, no un objeto con success
      if (usuario && usuario.id) {
        return { 
          success: true, 
          user: usuario,
          message: "Usuario registrado exitosamente. Puedes iniciar sesión.",
          redirect: "/sesion"
        };
      }

      return { 
        success: false, 
        message: "Error al registrar usuario - respuesta inválida" 
      };
    } catch (error) {
      console.error("❌ Error en registro:", error);
      return { 
        success: false, 
        message: error.message || "Error de conexión con el servidor" 
      };
    }
  };

  // 6. Funciones para gestión de empleados usando API
  const crearEmpleado = async (datosEmpleado) => {
    try {
      // Crear usuario con rol empleado directamente con la API
      const empleadoData = { 
        nombre: datosEmpleado.nombre,
        apellido: datosEmpleado.apellido || '',
        email: datosEmpleado.email,
        passwordHash: datosEmpleado.contrasena || datosEmpleado.passwordHash,
        telefono: datosEmpleado.telefono || '',
        cargo: datosEmpleado.cargo || '',
        departamento: datosEmpleado.departamento || '',
        rol: 'empleado'
      };
      
      console.log('🆕 Creando empleado con datos:', empleadoData);
      
      // Usar registrarUsuario directamente para crear en la base de datos
      const nuevoEmpleado = await registrarUsuario(empleadoData);
      console.log('✅ Empleado creado en base de datos:', nuevoEmpleado);
      
      return { success: true, empleado: nuevoEmpleado };
    } catch (error) {
      console.error("❌ Error creando empleado:", error);
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
    try {
      console.log('🔍 OBTENER EMPLEADOS - Iniciando con API real...');
      
      // Obtener todos los usuarios desde el servicio (API real)
      const usuarios = await obtenerUsuarios();
      console.log('👥 Usuarios desde API:', usuarios);
      console.log('📊 Cantidad de usuarios desde API:', usuarios?.length || 0);
      
      if (usuarios && usuarios.length > 0) {
        // Filtrar empleados y admins de la API
        const empleadosAPI = usuarios.filter(user => 
          user.rol === 'empleado' || user.rol === 'admin'
        );
        console.log('👤 Empleados desde API:', empleadosAPI);
        
        // Si encontramos empleados en la API, los usamos
        if (empleadosAPI.length > 0) {
          return empleadosAPI;
        }
      }
      
      console.log('⚠️ No hay empleados en la API, usando fallback...');
      
      // Fallback: crear empleados por defecto si no hay ninguno
      const empleadosPorDefecto = [
        {
          id: 1,
          nombre: 'Admin',
          apellido: 'Sistema',
          email: 'admin@crimewave.com',
          rol: 'admin',
          telefono: '+56912345678',
          cargo: 'Administrador',
          departamento: 'TI',
          activo: true
        }
      ];
      
      // Intentar obtener empleados de localStorage como backup
      const usuariosDev = JSON.parse(localStorage.getItem("usuarios_dev") || '[]');
      const empleadosLegacy = JSON.parse(localStorage.getItem("empleados") || '[]');
      
      const empleadosLocal = [...usuariosDev, ...empleadosLegacy].filter(user => 
        user.rol === 'empleado' || user.rol === 'admin'
      );
      
      // Combinar empleados por defecto con los locales
      const todosEmpleados = [...empleadosPorDefecto, ...empleadosLocal];
      
      console.log('🔄 Empleados combinados (API + localStorage):', todosEmpleados);
      return todosEmpleados;
      
    } catch (error) {
      console.error("❌ Error obteniendo empleados:", error);
      
      // Fallback de emergencia
      return [
        {
          id: 1,
          nombre: 'Admin',
          apellido: 'Sistema', 
          email: 'admin@crimewave.com',
          rol: 'admin',
          telefono: '+56912345678',
          cargo: 'Administrador',
          departamento: 'TI',
          activo: true
        }
      ];
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