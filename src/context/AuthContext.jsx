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

  // 4. Función de Login (copiada de tu SesionPage.jsx)
  const login = (email, contrasena) => {
    // Caso especial Admin
    if (email === "admin" && contrasena === "admin") {
      const adminUser = { email: "admin", role: "admin" };
      localStorage.setItem("currentUser", JSON.stringify(adminUser));
      setCurrentUser(adminUser);
      navigate("/admin");
      return true;
    }

    // Caso Usuario normal
    const usuariosGuardados = JSON.parse(localStorage.getItem("usuarios")) || [];
    const usuarioValido = usuariosGuardados.find(
      (u) => u.email === email && u.contrasena === contrasena
    );

    if (usuarioValido) {
      localStorage.setItem("currentUser", JSON.stringify(usuarioValido));
      setCurrentUser(usuarioValido);
      navigate("/"); // Redirige al inicio
      return true;
    }

    // Si nada funciona
    return false;
  };

  // 5. Función de Logout
  const logout = () => {
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
    navigate("/"); // Redirige al inicio al cerrar sesión
  };

  // 6. Valores que compartiremos
  const value = {
    currentUser,
    login,
    logout,
    loading, // Exponemos 'loading'
  };

  // 7. Retornamos el proveedor
  return (
    <AuthContext.Provider value={value}>
      {!loading && children} {/* Solo renderiza la app cuando no esté cargando */}
    </AuthContext.Provider>
  );
}

// 8. Hook personalizado para usar el contexto fácilmente
export function useAuth() {
  return useContext(AuthContext);
}