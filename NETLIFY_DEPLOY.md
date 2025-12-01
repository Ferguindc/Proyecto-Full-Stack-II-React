# Despliegue en Netlify - Crime Wave Store

## Configuración realizada

✅ **Archivos configurados para Netlify:**

### 1. `vite.config.js`
- Comentado el `base: '/Proyecto-Full-Stack-II-React/'` (era para GitHub Pages)
- Mantenida configuración de build con `outDir: 'dist'`

### 2. `public/_redirects`
```
/*    /index.html   200
```
- Redirige todas las rutas a `index.html` para que React Router funcione correctamente

### 3. `netlify.toml`
```toml
[build]
  publish = "dist"
  command = "npm run build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "18"
```

### 4. `package.json`
- Eliminado `homepage` específico de GitHub Pages
- Mantenidos scripts de build

## Instrucciones de despliegue

### Opción 1: Netlify Drop (Arrastrar y soltar)
1. Ejecutar `npm run build` localmente
2. Ir a [netlify.com](https://netlify.com)
3. Arrastrar la carpeta `dist` a la zona de drop

### Opción 2: Conectar repositorio Git
1. Hacer push de estos cambios al repositorio
2. Conectar el repositorio en Netlify
3. Configurar:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Node version**: 18 (se configura automáticamente con netlify.toml)

## Verificación post-despliegue

✅ **Verificar que funcionen:**
- Navegación entre páginas (React Router)
- Recarga de página en rutas anidadas (ej: `/productos/123`)
- Carga de imágenes y assets
- Enlaces internos y externos

## Problemas comunes y soluciones

**Error 404 en rutas:** 
- Verificar que `_redirects` esté en `public/`
- Confirmar que `netlify.toml` esté en la raíz

**Imágenes no cargan:**
- Verificar que las rutas de imágenes sean relativas o usen import

**Build falla:**
- Verificar versión de Node (debe ser 18+)
- Ejecutar `npm install` antes del build