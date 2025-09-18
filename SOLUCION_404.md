# Solución para Error 404 en Rutas API

## 🚨 Problema Identificado
```
POST http://localhost:3000/api/onboarding/complete 404 (Not Found)
```

**Causa**: El frontend está intentando hacer peticiones al puerto 3000 (frontend) en lugar del puerto 4000 (backend).

## ✅ Solución Aplicada

### 1. Configuración Robusta de API
- ✅ Agregado fallback robusto en `api.ts`
- ✅ Prioridad: variable de entorno > fallback hardcodeado
- ✅ Logs de debug para verificar configuración

### 2. Verificación de Variables de Entorno
- ✅ Archivo `.env` configurado correctamente
- ✅ Variable `NEXT_PUBLIC_API_URL=http://localhost:4000/api` presente

## 🔧 Pasos para Resolver

### 1. Reiniciar Servidor de Desarrollo
```bash
# Detener servidor (Ctrl+C)
# Luego reiniciar
npm run dev
```

### 2. Verificar en Consola del Navegador
Abre las herramientas de desarrollador (F12) y busca estos logs:
```
🔧 Environment API URL: http://localhost:4000/api
🔧 Final API URL: http://localhost:4000/api
```

### 3. Si Sigue Fallando
1. **Verificar que el backend esté corriendo**:
   ```bash
   cd backend
   npm run dev
   ```

2. **Verificar que el frontend esté corriendo**:
   ```bash
   cd web
   npm run dev
   ```

3. **Verificar archivo .env**:
   ```bash
   # En la carpeta web
   type .env
   # Debe mostrar: NEXT_PUBLIC_API_URL=http://localhost:4000/api
   ```

## 🎯 URLs Correctas

### Backend API (Puerto 4000)
- ✅ `http://localhost:4000/api/onboarding/complete`
- ✅ `http://localhost:4000/api/auth/login`
- ✅ `http://localhost:4000/api/chats`

### Frontend (Puerto 3000)
- ✅ `http://localhost:3000/` (página principal)
- ✅ `http://localhost:3000/auth` (login)
- ✅ `http://localhost:3000/onboarding` (configuración)

## 🔍 Debug Adicional

Si el problema persiste, verifica:

1. **Puerto del backend**: Debe ser 4000
2. **Puerto del frontend**: Debe ser 3000
3. **Variables de entorno**: Deben cargarse correctamente
4. **CORS**: El backend debe permitir requests del frontend

## 📝 Nota Importante

Las variables de entorno de Next.js solo se cargan al iniciar el servidor. Si creaste o modificaste el archivo `.env` después de iniciar el servidor, **debes reiniciarlo** para que tome los cambios.
