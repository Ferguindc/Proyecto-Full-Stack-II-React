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
      apellido: usuario.apellido || '',
      email: usuario.email,
      passwordHash: usuario.passwordHash || usuario.contrasena, // En desarrollo no hasheamos
      rol: usuario.rol || "cliente",
      telefono: usuario.telefono || '',
      cargo: usuario.cargo || '',
      departamento: usuario.departamento || '',
      fechaRegistro: new Date().toISOString(),
      activo: true
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
  // Modo de desarrollo - usar localStorage
  if (API_CONFIG.DEV_MODE) {
    console.log('🔧 MODO DESARROLLO - Obteniendo usuarios desde localStorage');
    const usuarios = JSON.parse(localStorage.getItem('usuarios_dev') || '[]');
    return usuarios;
  }

  try {
    const url = buildApiUrl(API_CONFIG.ENDPOINTS.USUARIOS.BASE);
    const response = await fetch(url, {
      method: 'GET',
      headers: API_CONFIG.DEFAULT_HEADERS,
    });

    return await handleResponse(response);
  } catch (error) {
    console.error('Error obteniendo usuarios:', error);
    // Fallback a localStorage si falla la API
    console.log('⚠️ Fallback a localStorage por error en API');
    const usuarios = JSON.parse(localStorage.getItem('usuarios_dev') || '[]');
    return usuarios;
  }
};

// Obtener usuario por ID
export const obtenerUsuarioPorId = async (id, token) => {
  // Modo de desarrollo - usar localStorage
  if (API_CONFIG.DEV_MODE) {
    console.log('🔧 MODO DESARROLLO - Obteniendo usuario por ID desde localStorage');
    const usuarios = JSON.parse(localStorage.getItem('usuarios_dev') || '[]');
    const usuario = usuarios.find(u => u.id === parseInt(id));
    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }
    return usuario;
  }

  try {
    const url = buildApiUrl(API_CONFIG.ENDPOINTS.USUARIOS.BASE) + `/${id}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        ...API_CONFIG.DEFAULT_HEADERS,
        'Authorization': `Bearer ${token}`
      },
    });

    return await handleResponse(response);
  } catch (error) {
    console.error('Error obteniendo usuario por ID:', error);
    // Fallback a localStorage
    const usuarios = JSON.parse(localStorage.getItem('usuarios_dev') || '[]');
    const usuario = usuarios.find(u => u.id === parseInt(id));
    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }
    return usuario;
  }
};

// Actualizar usuario
export const actualizarUsuario = async (id, datos, token) => {
  // Modo de desarrollo - usar localStorage
  if (API_CONFIG.DEV_MODE) {
    console.log('🔧 MODO DESARROLLO - Actualizando usuario en localStorage');
    const usuarios = JSON.parse(localStorage.getItem('usuarios_dev') || '[]');
    const index = usuarios.findIndex(u => u.id === parseInt(id));
    
    if (index === -1) {
      throw new Error('Usuario no encontrado');
    }
    
    // Actualizar usuario manteniendo algunos campos
    usuarios[index] = {
      ...usuarios[index],
      ...datos,
      id: usuarios[index].id, // Mantener ID original
      fechaActualizacion: new Date().toISOString()
    };
    
    localStorage.setItem('usuarios_dev', JSON.stringify(usuarios));
    console.log('✅ Usuario actualizado en localStorage');
    return usuarios[index];
  }

  try {
    const url = buildApiUrl(API_CONFIG.ENDPOINTS.USUARIOS.BASE) + `/${id}`;
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        ...API_CONFIG.DEFAULT_HEADERS,
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(datos)
    });

    return await handleResponse(response);
  } catch (error) {
    console.error('Error actualizando usuario:', error);
    // Fallback a localStorage
    const usuarios = JSON.parse(localStorage.getItem('usuarios_dev') || '[]');
    const index = usuarios.findIndex(u => u.id === parseInt(id));
    
    if (index === -1) {
      throw new Error('Usuario no encontrado');
    }
    
    usuarios[index] = {
      ...usuarios[index],
      ...datos,
      fechaActualizacion: new Date().toISOString()
    };
    
    localStorage.setItem('usuarios_dev', JSON.stringify(usuarios));
    return usuarios[index];
  }
};

// Inicializar datos por defecto en localStorage (solo para desarrollo)
const inicializarDatosDev = () => {
  if (API_CONFIG.DEV_MODE && !localStorage.getItem('usuarios_dev')) {
    const usuariosPorDefecto = [
      {
        id: 1,
        nombre: 'Administrador',
        email: 'admin@admin.com',
        passwordHash: 'admin', // En desarrollo, sin hash
        rol: 'admin',
        telefono: '+56912345678',
        cargo: 'Administrador del Sistema',
        departamento: 'TI',
        fechaRegistro: new Date().toISOString(),
        activo: true
      },
      {
        id: 2,
        nombre: 'Empleado Demo',
        email: 'empleado@demo.com',
        passwordHash: 'empleado',
        rol: 'empleado',
        telefono: '+56987654321',
        cargo: 'Vendedor',
        departamento: 'Ventas',
        fechaRegistro: new Date().toISOString(),
        activo: true
      }
    ];
    
    localStorage.setItem('usuarios_dev', JSON.stringify(usuariosPorDefecto));
    console.log('✅ Usuarios por defecto inicializados en localStorage');
  }
};

// Inicializar datos al cargar el servicio
if (typeof window !== 'undefined') {
  inicializarDatosDev();
}

// Objeto usuarioService para compatibilidad con AuthContext
const usuarioService = {
  register: registrarUsuario,
  login: loginUsuario,
  getAll: obtenerUsuarios,
  getById: obtenerUsuarioPorId,
  getByEmail: obtenerUsuarioPorEmail,
  update: actualizarUsuario
};

export default usuarioService;
