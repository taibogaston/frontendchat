# Guía de Despliegue

## Configuración de Variables de Entorno

### 1. Crear archivo .env.local

Copia el archivo `env.example` y renómbralo a `.env.local`:

```bash
cp env.example .env.local
```

### 2. Configurar Variables de Entorno

Edita el archivo `.env.local` con tus valores:

```env
# Backend API Configuration
NEXT_PUBLIC_API_URL=https://tu-backend-domain.com/api

# API Configuration
NEXT_PUBLIC_API_TIMEOUT=10000

# App Configuration
NEXT_PUBLIC_APP_NAME=ChatBot App
NEXT_PUBLIC_APP_VERSION=1.0.0

# Feature Flags
NEXT_PUBLIC_ENABLE_GOOGLE_AUTH=true
NEXT_PUBLIC_ENABLE_ANALYTICS=true
```

## Despliegue en Diferentes Plataformas

### Vercel

1. Conecta tu repositorio a Vercel
2. En la configuración del proyecto, agrega las variables de entorno:
   - `NEXT_PUBLIC_API_URL`: URL de tu backend
   - `NEXT_PUBLIC_API_TIMEOUT`: 10000
   - `NEXT_PUBLIC_APP_NAME`: Tu nombre de app
   - `NEXT_PUBLIC_ENABLE_GOOGLE_AUTH`: true/false
   - `NEXT_PUBLIC_ENABLE_ANALYTICS`: true/false

### Netlify

1. Conecta tu repositorio a Netlify
2. En Site settings > Environment variables, agrega las variables
3. Configura el build command: `npm run build`
4. Configura el publish directory: `.next`

### Docker

Crea un `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

Y un `docker-compose.yml`:

```yaml
version: '3.8'
services:
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=${API_URL}
      - NEXT_PUBLIC_API_TIMEOUT=10000
```

## Configuración del Backend

Asegúrate de que tu backend esté configurado para aceptar requests desde tu dominio frontend:

```javascript
// En tu backend (ejemplo con CORS)
app.use(cors({
  origin: [
    'http://localhost:3000', // Desarrollo
    'https://tu-frontend-domain.com' // Producción
  ],
  credentials: true
}));
```

## Verificación

Después del despliegue, verifica que:

1. La aplicación carga correctamente
2. Los requests al API funcionan
3. La autenticación funciona
4. No hay errores en la consola del navegador

## Troubleshooting

### Error: "NEXT_PUBLIC_API_URL not set"
- Verifica que la variable de entorno esté configurada correctamente
- Asegúrate de que el nombre de la variable sea exactamente `NEXT_PUBLIC_API_URL`

### Error de CORS
- Configura CORS en tu backend para incluir tu dominio frontend
- Verifica que las URLs sean correctas

### Error 404 en API calls
- Verifica que la URL del backend sea correcta
- Asegúrate de que el backend esté funcionando
- Revisa que la ruta `/api` esté incluida en la URL
