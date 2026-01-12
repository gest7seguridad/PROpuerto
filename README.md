# Sistema de Certificacion de Gestion de Residuos

Sistema web para la certificacion de formacion en gestion de residuos del Ayuntamiento de Puerto del Rosario.

![Puerto del Rosario](https://puertodelrosario.org)

## Descripcion

Este sistema permite a los ciudadanos de Puerto del Rosario:

- Registrarse con sus datos personales y direccion
- Completar modulos de formacion sobre gestion de residuos
- Realizar un examen de evaluacion
- Obtener un certificado digital firmado
- Descargar el certificado en formato PDF con codigo QR de verificacion

## Tecnologias

### Backend
- **Node.js** con Express
- **PostgreSQL** con Prisma ORM
- **JWT** para autenticacion
- **PDFKit** para generacion de certificados
- **QRCode** para codigos de verificacion
- **Nodemailer** para envio de emails

### Frontend
- **React** con Vite
- **Tailwind CSS** para estilos
- **React Router** para navegacion
- **Axios** para peticiones HTTP
- **React Hot Toast** para notificaciones

## Requisitos previos

- Node.js 18+
- PostgreSQL 14+
- npm o yarn

## Instalacion

### 1. Clonar el repositorio

```bash
git clone https://github.com/ayuntamiento-puerto-rosario/gestion-residuos.git
cd gestion-residuos
```

### 2. Configurar el Backend

```bash
cd backend

# Instalar dependencias
npm install

# Copiar archivo de configuracion
cp .env.example .env

# Editar .env con tus valores
nano .env
```

Configurar las siguientes variables en `.env`:

```env
DATABASE_URL="postgresql://usuario:password@localhost:5432/residuos_db"
JWT_SECRET="tu_secreto_jwt_minimo_32_caracteres"
JWT_REFRESH_SECRET="tu_secreto_refresh_minimo_32_caracteres"
EMAIL_HOST="smtp.tuservidor.com"
EMAIL_PORT=587
EMAIL_USER="tu_usuario"
EMAIL_PASS="tu_password"
EMAIL_FROM="noreply@puertodelrosario.org"
FRONTEND_URL="http://localhost:5173"
```

### 3. Configurar la base de datos

```bash
# Crear las tablas
npx prisma migrate dev

# Cargar datos de ejemplo (modulos, preguntas, admin)
npx prisma db seed
```

### 4. Configurar el Frontend

```bash
cd ../frontend

# Instalar dependencias
npm install

# Copiar archivo de configuracion (opcional)
# El frontend usa VITE_API_URL por defecto a http://localhost:3000/api
```

### 5. Iniciar la aplicacion

En dos terminales diferentes:

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

La aplicacion estara disponible en:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
- Panel Admin: http://localhost:5173/admin/login

## Instalacion con Docker

```bash
# Construir y ejecutar
docker-compose up -d

# Ver logs
docker-compose logs -f

# Ejecutar migraciones y seed
docker-compose exec backend npx prisma migrate deploy
docker-compose exec backend npx prisma db seed
```

## Estructura del proyecto

```
proyecto-residuos/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma      # Esquema de base de datos
│   │   └── seed.js            # Datos iniciales
│   ├── src/
│   │   ├── controllers/       # Controladores de rutas
│   │   ├── middleware/        # Middlewares (auth, validacion)
│   │   ├── routes/            # Definicion de rutas
│   │   ├── utils/             # Utilidades (JWT, PDF, email)
│   │   └── app.js             # Aplicacion Express
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/        # Componentes React
│   │   ├── context/           # Contextos (Auth)
│   │   ├── pages/             # Paginas de la aplicacion
│   │   ├── services/          # Servicios API
│   │   └── App.jsx            # Componente principal
│   └── package.json
├── docker-compose.yml
└── README.md
```

## Usuarios de prueba

Despues de ejecutar el seed:

**Administrador:**
- Email: admin@puertodelrosario.org
- Password: admin123

## API Endpoints

### Autenticacion
- `POST /api/auth/registro` - Registro de usuario
- `POST /api/auth/login` - Inicio de sesion
- `POST /api/auth/refresh` - Renovar token
- `GET /api/auth/verificar-email` - Verificar email

### Modulos
- `GET /api/modulos` - Listar modulos
- `GET /api/modulos/:id` - Obtener modulo
- `POST /api/modulos/:id/progreso` - Actualizar progreso
- `POST /api/modulos/:id/completar` - Marcar completado

### Examen
- `GET /api/examen/estado` - Estado del examen
- `POST /api/examen/iniciar` - Iniciar examen
- `POST /api/examen/:id/respuesta` - Guardar respuesta
- `POST /api/examen/:id/finalizar` - Finalizar examen
- `GET /api/examen/:id/resultado` - Ver resultado

### Certificado
- `GET /api/certificado/estado` - Estado del certificado
- `POST /api/certificado/firmar` - Firmar certificado
- `GET /api/certificado/descargar` - Descargar PDF
- `GET /api/certificado/verificar/:codigo` - Verificar certificado

### Admin
- `POST /api/admin/login` - Login administrador
- `GET /api/admin/estadisticas` - Estadisticas generales
- `GET /api/admin/usuarios` - Listar usuarios
- `GET /api/admin/modulos` - CRUD modulos
- `GET /api/admin/preguntas` - CRUD preguntas

## Caracteristicas de seguridad

- **Validacion de DNI/NIE** con algoritmo oficial
- **Unicidad de direccion** por hash SHA256 normalizado
- **Rate limiting** en endpoints sensibles
- **JWT con refresh tokens** para sesiones seguras
- **Bcrypt** para hash de contrasenas
- **Sanitizacion** de entradas de usuario

## Configuracion del examen

Por defecto:
- 20 preguntas aleatorias
- 30 minutos de tiempo
- 70% nota minima para aprobar
- 3 intentos maximos

Modificable en `ConfiguracionExamen` de la base de datos.

## Personalizacion

### Colores corporativos

Los colores del Ayuntamiento de Puerto del Rosario estan configurados en:
- `frontend/tailwind.config.js` - Color granate #7B2D5B
- `backend/src/utils/pdfGenerator.js` - Colores del PDF

### Contenido de modulos

Los modulos y preguntas se pueden modificar:
- Desde el panel de administracion
- Editando `backend/prisma/seed.js`

## Soporte

Para consultas tecnicas contactar con el Ayuntamiento de Puerto del Rosario.

## Licencia

Propiedad del Ayuntamiento de Puerto del Rosario, Fuerteventura.
