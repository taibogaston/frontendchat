# Configuración de Rutas - Frontend y Backend

## ✅ Problemas Resueltos

### 1. URLs Hardcodeadas
**Problema**: Las páginas del frontend tenían URLs hardcodeadas (`http://localhost:4000/api/...`)
**Solución**: Reemplazadas por variables de entorno con fallback

### 2. Rutas Duplicadas en Backend
**Problema**: El backend tenía rutas duplicadas (con y sin prefijo `/api/`)
**Solución**: Eliminadas las rutas sin prefijo, manteniendo solo las con `/api/`

### 3. Configuración de CORS
**Problema**: CORS no era flexible para diferentes entornos
**Solución**: Configurado para usar variable de entorno `FRONTEND_URL`

## 🔧 Configuración Actual

### Frontend (Next.js)
- **Archivo de configuración**: `web/src/config/env.ts`
- **Variable principal**: `NEXT_PUBLIC_API_URL`
- **Valor por defecto**: `http://localhost:4000/api`
- **Fallback**: URLs hardcodeadas como respaldo

### Backend (Express)
- **Puerto**: 4000 (configurable con `PORT`)
- **Prefijo de rutas**: `/api/`
- **CORS**: Configurado para aceptar localhost y `FRONTEND_URL`

## 📁 Estructura de Rutas

### Backend API Endpoints
```
/api/auth/
  ├── POST /register
  ├── POST /login
  ├── GET /verify/:token
  ├── POST /forgot-password
  ├── POST /reset-password
  └── POST /resend-verification

/api/onboarding/
  ├── POST /complete
  └── GET /status

/api/users/
  ├── GET /me
  └── PATCH /preferences

/api/chats/
  ├── GET /
  ├── GET /:chatId
  ├── POST /
  └── PATCH /:chatId/deactivate

/api/messages/
  ├── GET /:chatId
  ├── POST /:chatId
  └── POST /test-new-character/:chatId
```

### Frontend Pages
```
/
├── /auth (login/register)
├── /verify-email/[token]
├── /onboarding
└── /chats/
    ├── / (lista de chats)
    └── /[chatId] (conversación)
```

## 🚀 Cómo Usar

### 1. Configurar Variables de Entorno

**Frontend** (`web/.env`):
```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_API_TIMEOUT=10000
NEXT_PUBLIC_APP_NAME=ChatBot App
```

**Backend** (`backend/.env`):
```env
MONGO_URI=mongodb://localhost:27017/chatbot
JWT_SECRET=tu_jwt_secret_aqui
FRONTEND_URL=http://localhost:3000
PORT=4000
```

### 2. Iniciar Servidores

**Backend**:
```bash
cd backend
npm run dev
```

**Frontend**:
```bash
cd web
npm run dev
```

### 3. Verificar Funcionamiento

1. Backend corriendo en `http://localhost:4000`
2. Frontend corriendo en `http://localhost:3000`
3. Las rutas API están disponibles en `http://localhost:4000/api/`

## 🔍 Debugging

### Verificar Configuración
```bash
# En el frontend
console.log('API URL:', process.env.NEXT_PUBLIC_API_URL);

# En el backend
console.log('Frontend URL:', process.env.FRONTEND_URL);
```

### Errores Comunes
1. **404 en rutas API**: Verificar que el backend esté corriendo y use el prefijo `/api/`
2. **CORS errors**: Verificar que `FRONTEND_URL` esté configurado correctamente
3. **Variables de entorno no cargadas**: Reiniciar el servidor después de cambiar `.env`

## 📝 Notas Importantes

- Las variables de entorno del frontend deben empezar con `NEXT_PUBLIC_`
- El backend usa solo rutas con prefijo `/api/` para consistencia
- CORS está configurado para desarrollo local y producción
- Todas las rutas API requieren autenticación excepto `/auth/register` y `/auth/login`
