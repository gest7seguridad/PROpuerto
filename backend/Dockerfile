# Backend Dockerfile
FROM node:20-alpine

WORKDIR /app

# Instalar dependencias del sistema para Prisma
RUN apk add --no-cache openssl

# Copiar archivos de dependencias
COPY package*.json ./
COPY prisma ./prisma/

# Instalar dependencias
RUN npm ci --only=production

# Generar cliente Prisma
RUN npx prisma generate

# Copiar el resto del codigo
COPY . .

# Crear directorio de uploads
RUN mkdir -p uploads

# Exponer puerto
EXPOSE 3000

# Comando de inicio
CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]
