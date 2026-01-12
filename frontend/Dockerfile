# Frontend Dockerfile - Production Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

# Install serve globally
RUN npm install -g serve

# Copy built files from builder stage
COPY --from=builder /app/dist ./dist

# Railway provides PORT environment variable
ENV PORT=3000
EXPOSE 3000

# Serve the static files
CMD ["sh", "-c", "serve -s dist -p ${PORT:-3000}"]
