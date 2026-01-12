-- CreateTable
CREATE TABLE "usuarios" (
    "id" TEXT NOT NULL,
    "dni" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellidos" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefono" TEXT,
    "password" TEXT NOT NULL,
    "direccion_hash" TEXT NOT NULL,
    "direccion_completa" TEXT NOT NULL,
    "numero" TEXT,
    "piso" TEXT,
    "puerta" TEXT,
    "codigo_postal" TEXT NOT NULL,
    "localidad" TEXT NOT NULL DEFAULT 'Puerto del Rosario',
    "verificado" BOOLEAN NOT NULL DEFAULT false,
    "token_verificacion" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "administradores" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "administradores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "modulos" (
    "id" SERIAL NOT NULL,
    "orden" INTEGER NOT NULL,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT,
    "contenido" TEXT NOT NULL,
    "video_url" TEXT,
    "duracion_min" INTEGER NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "modulos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "progreso_modulos" (
    "id" TEXT NOT NULL,
    "usuario_id" TEXT NOT NULL,
    "modulo_id" INTEGER NOT NULL,
    "iniciado" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tiempo_acumulado" INTEGER NOT NULL DEFAULT 0,
    "completado" BOOLEAN NOT NULL DEFAULT false,
    "fecha_completado" TIMESTAMP(3),

    CONSTRAINT "progreso_modulos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "preguntas" (
    "id" SERIAL NOT NULL,
    "enunciado" TEXT NOT NULL,
    "opciones" JSONB NOT NULL,
    "respuesta_correcta" INTEGER NOT NULL,
    "explicacion" TEXT,
    "activa" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "preguntas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "examenes" (
    "id" TEXT NOT NULL,
    "usuario_id" TEXT NOT NULL,
    "intento_num" INTEGER NOT NULL,
    "preguntas_ids" JSONB NOT NULL,
    "respuestas" JSONB,
    "fecha_inicio" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_fin" TIMESTAMP(3),
    "puntuacion" DOUBLE PRECISION,
    "aprobado" BOOLEAN,

    CONSTRAINT "examenes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "certificados" (
    "id" TEXT NOT NULL,
    "usuario_id" TEXT NOT NULL,
    "codigo_verificacion" TEXT NOT NULL,
    "fecha_emision" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "nota_examen" DOUBLE PRECISION NOT NULL,
    "firma_solicitada" BOOLEAN NOT NULL DEFAULT false,
    "firma_id" TEXT,
    "firmado" BOOLEAN NOT NULL DEFAULT false,
    "fecha_firma" TIMESTAMP(3),
    "pdf_generado" BOOLEAN NOT NULL DEFAULT false,
    "pdf_path" TEXT,

    CONSTRAINT "certificados_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "configuracion_examen" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "num_preguntas" INTEGER NOT NULL DEFAULT 20,
    "nota_min_aprobado" DOUBLE PRECISION NOT NULL DEFAULT 70,
    "tiempo_limite_min" INTEGER NOT NULL DEFAULT 30,
    "max_intentos" INTEGER NOT NULL DEFAULT 3,

    CONSTRAINT "configuracion_examen_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "refresh_tokens" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "usuario_id" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_dni_key" ON "usuarios"("dni");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_direccion_hash_key" ON "usuarios"("direccion_hash");

-- CreateIndex
CREATE INDEX "usuarios_dni_idx" ON "usuarios"("dni");

-- CreateIndex
CREATE INDEX "usuarios_email_idx" ON "usuarios"("email");

-- CreateIndex
CREATE INDEX "usuarios_direccion_hash_idx" ON "usuarios"("direccion_hash");

-- CreateIndex
CREATE UNIQUE INDEX "administradores_email_key" ON "administradores"("email");

-- CreateIndex
CREATE UNIQUE INDEX "modulos_orden_key" ON "modulos"("orden");

-- CreateIndex
CREATE UNIQUE INDEX "progreso_modulos_usuario_id_modulo_id_key" ON "progreso_modulos"("usuario_id", "modulo_id");

-- CreateIndex
CREATE UNIQUE INDEX "certificados_usuario_id_key" ON "certificados"("usuario_id");

-- CreateIndex
CREATE UNIQUE INDEX "certificados_codigo_verificacion_key" ON "certificados"("codigo_verificacion");

-- CreateIndex
CREATE INDEX "certificados_codigo_verificacion_idx" ON "certificados"("codigo_verificacion");

-- CreateIndex
CREATE UNIQUE INDEX "refresh_tokens_token_key" ON "refresh_tokens"("token");

-- CreateIndex
CREATE INDEX "refresh_tokens_token_idx" ON "refresh_tokens"("token");

-- CreateIndex
CREATE INDEX "refresh_tokens_usuario_id_idx" ON "refresh_tokens"("usuario_id");

-- AddForeignKey
ALTER TABLE "progreso_modulos" ADD CONSTRAINT "progreso_modulos_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "progreso_modulos" ADD CONSTRAINT "progreso_modulos_modulo_id_fkey" FOREIGN KEY ("modulo_id") REFERENCES "modulos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "examenes" ADD CONSTRAINT "examenes_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "certificados" ADD CONSTRAINT "certificados_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;
