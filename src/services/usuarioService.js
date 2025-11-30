import { API_CONFIG, buildApiUrl, replaceUrlParams } from "../config/api";

// Función helper para manejar respuestas
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || `Error ${response.status}: ${response.statusText}`);
  }
  
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  }
  return response.text();
};

// Registrar usuario
export const registrarUsuario = async (usuario) => {
  // Modo de desarrollo - simular el registro si el servidor no está disponible
  if (API_CONFIG.DEV_MODE) {
    console.log('🔧 MODO DESARROLLO - Simulando registro de usuario:', usuario);
    
    // Verificar que no exista en localStorage
    const usuarios = JSON.parse(localStorage.getItem('usuarios_dev') || '[]');
    const existe = usuarios.find(u => u.email === usuario.email);
    
    if (existe) {
      throw new Error('El email ya está registrado');
    }
    
    // Simular usuario registrado con estructura correcta
    const nuevoUsuario = {
      id: Date.now(),
      nombre: usuario.nombre,
      email: usuario.email,
      passwordHash: usuario.passwordHash, // En desarrollo no hasheamos
      rol: usuario.rol || "cliente",
      fechaRegistro: new Date().toISOString()
    };
    
    usuarios.push(nuevoUsuario);
    localStorage.setItem('usuarios_dev', JSON.stringify(usuarios));
    
    console.log('✅ Usuario registrado en modo desarrollo');
    return nuevoUsuario;
  }

  const url = buildApiUrl(API_CONFIG.ENDPOINTS.USUARIOS.CREATE);
  
  // Debug: mostrar datos que se envían
  console.log('URL:', url);
  console.log('Datos del usuario:', usuario);

  try {
    const response = await fetch(url, {
      method: "POST",
      mode: 'cors', // Asegurar que use CORS
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(usuario),
    });

    console.log('Status de respuesta:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error de la API:', errorText);
      throw new Error(errorText || `Error ${response.status}: ${response.statusText}`);
    }

    return await handleResponse(response);
  } catch (error) {
    // Si hay error de conexión, mostrar mensaje específico
    if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
      console.error('⚠️ Servidor no disponible. Cambiando a modo desarrollo...');
      
      // Activar modo desarrollo automáticamente
      API_CONFIG.DEV_MODE = true;
      
      // Reintentar con modo desarrollo
      return await registrarUsuario(usuario);
    }
    throw error;
  }
};

// Obtener usuario por email
export const obtenerUsuarioPorEmail = async (email) => {
  try {
    const url = replaceUrlParams(buildApiUrl(API_CONFIG.ENDPOINTS.USUARIOS.BY_EMAIL), { email });
    const response = await fetch(url, {
      method: 'GET',
      headers: API_CONFIG.DEFAULT_HEADERS,
    });

    return await handleResponse(response);
  } catch (error) {
    console.error('Error obteniendo usuario por email:', error);
    throw error;
  }
};

// Login simulado usando obtener por email
export const loginUsuario = async (email, password) => {
  try {
    // Modo de desarrollo - usar localStorage
    if (API_CONFIG.DEV_MODE) {
      console.log('🔧 MODO DESARROLLO - Login con localStorage');
      
      const usuarios = JSON.parse(localStorage.getItem('usuarios_dev') || '[]');
      const usuario = usuarios.find(u => u.email === email);
      
      if (usuario && usuario.passwordHash === password) { // Usar passwordHash
        const token = btoa(JSON.stringify({ id: usuario.id, email: usuario.email, timestamp: Date.now() }));
        return {
          token,
          user: {
            id: usuario.id,
            email: usuario.email,
            nombre: usuario.nombre,
            rol: usuario.rol || 'cliente' // Usar "rol" no "role"
          }
        };
      } else {
        throw new Error('Credenciales incorrectas');
      }
    }

    // Obtener usuario por email desde API
    const usuario = await obtenerUsuarioPorEmail(email);
    
    // Verificar password (en producción esto debería hacerse en el backend)
    if (usuario && usuario.passwordHash === password) { // Usar passwordHash
      // Simular token JWT
      const token = btoa(JSON.stringify({ id: usuario.id, email: usuario.email, timestamp: Date.now() }));
      return {
        token,
        user: {
          id: usuario.id,
          email: usuario.email,
          nombre: usuario.nombre,
          rol: usuario.rol || 'cliente' // Usar "rol" no "role"
        }
      };
    } else {
      throw new Error('Credenciales incorrectas');
    }
  } catch (error) {
    console.error('Error en login:', error);
    throw error;
  }
};

// Obtener todos los usuarios
export const obtenerUsuarios = async () => {
  try {
    const url = buildApiUrl(API_CONFIG.ENDPOINTS.USUARIOS.BASE);
    const response = await fetch(url, {
      method: 'GET',
      headers: API_CONFIG.DEFAULT_HEADERS,
    });

    return await handleResponse(response);
  } catch (error) {
    console.error('Error obteniendo usuarios:', error);
    throw error;
  }
};
