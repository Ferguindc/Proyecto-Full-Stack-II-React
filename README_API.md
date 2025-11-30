# Configuración de la API

## Configurar la URL de tu API de Spring Boot

Para conectar tu aplicación React con tu API de Spring Boot, necesitas configurar la URL base en el archivo de configuración.

### 1. Ubicación del archivo de configuración

El archivo de configuración se encuentra en:
```
src/config/api.js
```

### 2. Cambiar la URL base

Abre el archivo `src/config/api.js` y modifica la línea:

```javascript
BASE_URL: 'http://localhost:8080/api',
```

Reemplaza `http://localhost:8080` por la URL de tu servidor Spring Boot.

### Ejemplos comunes:

- **Desarrollo local**: `http://localhost:8080/api`
- **Desarrollo local con puerto diferente**: `http://localhost:3000/api`
- **Servidor remoto**: `http://tu-servidor.com:8080/api`
- **HTTPS**: `https://tu-servidor.com/api`

### 3. Endpoints esperados por la aplicación

Tu API de Spring Boot debe tener los siguientes endpoints basados en tus controladores:

#### Usuarios (/api/usuarios)
- `POST /api/usuarios/login` - Iniciar sesión
- `POST /api/usuarios/register` - Registrar usuario
- `GET /api/usuarios` - Obtener todos los usuarios (admin)
- `GET /api/usuarios/:id` - Obtener usuario por ID
- `PUT /api/usuarios/:id` - Actualizar usuario
- `DELETE /api/usuarios/:id` - Eliminar usuario (admin)
- `GET /api/usuarios/profile` - Obtener perfil del usuario actual
- `POST /api/usuarios/verify-token` - Verificar token

#### Productos (/api/productos)
- `GET /api/productos` - Obtener todos los productos
- `GET /api/productos/:id` - Obtener producto por ID
- `GET /api/productos/categoria/:categoria` - Obtener productos por categoría
- `POST /api/productos` - Crear producto (admin/empleado)
- `PUT /api/productos/:id` - Actualizar producto
- `DELETE /api/productos/:id` - Eliminar producto

#### Categorías (/api/categorias)
- `GET /api/categorias` - Obtener todas las categorías
- `GET /api/categorias/:id` - Obtener categoría por ID
- `POST /api/categorias` - Crear categoría (admin)
- `PUT /api/categorias/:id` - Actualizar categoría
- `DELETE /api/categorias/:id` - Eliminar categoría

#### Pedidos (/api/pedidos)
- `GET /api/pedidos` - Obtener todos los pedidos (admin)
- `GET /api/pedidos/:id` - Obtener pedido por ID
- `GET /api/pedidos/usuario/:usuarioId` - Obtener pedidos por usuario
- `POST /api/pedidos` - Crear pedido
- `PUT /api/pedidos/:id` - Actualizar pedido
- `DELETE /api/pedidos/:id` - Eliminar pedido

### 4. Formato de respuestas esperadas

#### Login exitoso:
```json
{
  "token": "jwt-token-aqui",
  "user": {
    "id": 1,
    "email": "usuario@email.com",
    "nombre": "Nombre Usuario", 
    "role": "cliente" // o "admin" o "empleado"
  }
}
```

#### Registro exitoso:
```json
{
  "success": true,
  "message": "Usuario registrado exitosamente"
}
```

#### Verificación de token:
```json
{
  "valid": true,
  "user": {
    "id": 1,
    "email": "usuario@email.com",
    "nombre": "Nombre Usuario",
    "role": "cliente"
  }
}
```

### 5. Manejo de errores

La aplicación espera que los errores HTTP (4xx, 5xx) retornen un mensaje de error en texto plano o JSON con un campo `message`.

### 6. CORS

Asegúrate de configurar CORS en tu API de Spring Boot para permitir peticiones desde `http://localhost:3001` (puerto de desarrollo de Vite).

Ejemplo de configuración CORS en Spring Boot:

```java
@Configuration
@EnableWebMvc
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:3001", "http://localhost:3000")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
```

### 7. Autenticación con JWT

La aplicación envía el token JWT en el header `Authorization` con formato:
```
Authorization: Bearer tu-jwt-token
```

Asegúrate de que tu API de Spring Boot valide este token en los endpoints protegidos.