# --- Etapa 1: Construcción con Node ---
# Usamos una imagen de Node.js (versión 20) para construir el proyecto Angular.
FROM node:20-alpine AS build

# Establecemos el directorio de trabajo.
WORKDIR /app

# Copiamos los archivos de dependencias.
COPY package*.json ./

# Instalamos las dependencias del proyecto.
RUN npm install

# Copiamos el resto del código fuente del proyecto.
COPY . .

# Construimos la aplicación para producción (esto incluye la compilación SSR).
RUN npm run build

# --- Etapa 2: Servidor de Producción ---
# Usamos una imagen ligera de Node.js para servir la aplicación.
FROM node:20-alpine AS serve

WORKDIR /app

# Copiamos los artefactos de construcción (la carpeta 'dist') desde la etapa anterior.
COPY --from=build /app/dist/finix_frontend/ .

# El servidor SSR de Angular por defecto se ejecuta en el puerto 4200 dentro del contenedor.
EXPOSE 4200

# El comando para iniciar el servidor SSR, basado en tu package.json.
CMD ["node", "server/server.mjs"]
