# Configuración para Desarrollo Local

## 🚀 Configuración Rápida

### 1. **Crear archivo .env.local**

Crea un archivo `.env.local` en la raíz del proyecto con:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_API_TIMEOUT=10000
NEXT_PUBLIC_APP_NAME=ChatBot App
NEXT_PUBLIC_ENABLE_GOOGLE_AUTH=false
NEXT_PUBLIC_ENABLE_ANALYTICS=false
```

### 2. **Configurar Backend**

En tu backend, asegúrate de tener en el `.env`:

```env
FRONTEND_URL=http://localhost:3000
```

### 3. **Ejecutar en Orden**

1. **Backend primero:**
   ```bash
   cd tu-backend
   npm start
   # Debería estar en http://localhost:4000
   ```

2. **Frontend después:**
   ```bash
   cd web
   npm run dev
   # Debería estar en http://localhost:3000
   ```

## 🔍 Verificación

1. **Abre** http://localhost:3000
2. **Abre la consola** (F12)
3. **Deberías ver:**
   ```
   🔧 Environment config: {api: {baseUrl: "http://localhost:4000/api", ...}}
   🌐 API Base URL: http://localhost:4000/api
   ⏱️ API Timeout: 10000
   ```

## 📧 Test de Email

1. **Regístrate** con un email real
2. **Revisa tu email** - debería tener un enlace como:
   ```
   http://localhost:3000/verify-email/tu-token-aqui
   ```
3. **Haz clic** en el enlace
4. **Debería redirigirte** al onboarding o chats

## 🐛 Troubleshooting

### Si el email no llega:
- Revisa la carpeta de spam
- Verifica que el servicio de email esté configurado
- Revisa los logs del backend

### Si el enlace no funciona:
- Verifica que `FRONTEND_URL=http://localhost:3000` esté en el backend
- Asegúrate de que el frontend esté corriendo en puerto 3000

### Si hay errores de CORS:
- Verifica que el backend tenga CORS configurado para `http://localhost:3000`
