# Etapa de compilación
FROM node:18 AS build

WORKDIR /app

# Copiar archivos del proyecto y dependencias
COPY package.json package-lock.json ./
RUN npm install

COPY . .

# Construir la aplicación
RUN npm run build

# Etapa final: usar Nginx para servir la aplicación
FROM nginx:alpine
# Copiar la configuración personalizada (asegúrate de que nginx.conf esté en el mismo directorio que este Dockerfile)
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Copiar la aplicación compilada a la carpeta que Nginx sirve por defecto
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
