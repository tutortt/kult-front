# Etapa de construcción: genera los archivos estáticos con Vite
FROM node:22-alpine AS build
WORKDIR /app

# Instalamos dependencias primero para aprovechar la caché de capas
COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Vite inserta VITE_API_URL en el bundle durante el build
ARG VITE_API_URL=http://localhost:8080
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# Etapa de ejecución: nginx sirve el SPA (con fallback a index.html para rutas profundas)
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
