# Frontend Dockerfile
FROM node:20-alpine

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm ci

# Copiar el resto del codigo
COPY . .

# Exponer puerto
EXPOSE 5173

# Comando de desarrollo (para produccion usar npm run build y servir con nginx)
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
