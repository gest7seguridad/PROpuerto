const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...\n');

  // 1. Crear administrador
  console.log('👤 Creando administrador...');
  const adminPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123456', 12);

  await prisma.administrador.upsert({
    where: { email: process.env.ADMIN_EMAIL || 'admin@puertoderosario.org' },
    update: {},
    create: {
      email: process.env.ADMIN_EMAIL || 'admin@puertoderosario.org',
      password: adminPassword,
      nombre: 'Administrador',
      activo: true
    }
  });
  console.log('✅ Administrador creado\n');

  // 2. Crear configuración del examen
  console.log('⚙️ Creando configuración del examen...');
  await prisma.configuracionExamen.upsert({
    where: { id: 1 },
    update: {},
    create: {
      numPreguntas: 20,
      notaMinAprobado: 70,
      tiempoLimiteMin: 30,
      maxIntentos: 3
    }
  });
  console.log('✅ Configuración creada\n');

  // 3. Crear módulos de formación
  console.log('📚 Creando módulos de formación...');

  const modulos = [
    {
      orden: 1,
      titulo: 'Introducción a la Gestión de Residuos',
      descripcion: 'Conceptos básicos sobre residuos, su impacto ambiental y la importancia del reciclaje.',
      duracionMin: 10,
      contenido: `
<h2>Bienvenido al Curso de Gestión de Residuos</h2>

<p>La gestión adecuada de los residuos es fundamental para proteger nuestro medio ambiente y garantizar un futuro sostenible para las próximas generaciones. En Puerto del Rosario, nos comprometemos con la correcta separación y tratamiento de los residuos domésticos.</p>

<h3>¿Qué son los residuos?</h3>
<p>Los residuos son todos aquellos materiales que desechamos tras su uso. Pueden ser de origen doméstico, comercial o industrial. En este curso nos centraremos en los residuos domésticos, que son los que generamos en nuestros hogares.</p>

<h3>Impacto ambiental de los residuos</h3>
<ul>
  <li><strong>Contaminación del suelo:</strong> Los residuos mal gestionados pueden filtrar sustancias tóxicas al suelo.</li>
  <li><strong>Contaminación del agua:</strong> Los lixiviados de los vertederos pueden contaminar acuíferos y ríos.</li>
  <li><strong>Contaminación del aire:</strong> La descomposición de residuos genera gases de efecto invernadero.</li>
  <li><strong>Impacto en la fauna:</strong> Animales marinos y terrestres pueden ingerir o quedar atrapados en residuos.</li>
</ul>

<h3>La economía circular</h3>
<p>Frente al modelo lineal de "usar y tirar", la economía circular propone un sistema donde los residuos se convierten en recursos. Los principios básicos son:</p>
<ol>
  <li><strong>Reducir:</strong> Consumir menos y de forma más consciente.</li>
  <li><strong>Reutilizar:</strong> Dar una segunda vida a los productos.</li>
  <li><strong>Reciclar:</strong> Transformar los residuos en nuevos productos.</li>
</ol>

<h3>Objetivos de reciclaje en España</h3>
<p>España tiene objetivos ambiciosos de reciclaje:</p>
<ul>
  <li>55% de reciclaje para 2025</li>
  <li>Máximo 40% de residuos en vertedero para 2025</li>
  <li>Máximo 10% de residuos en vertedero para 2035</li>
</ul>

<h3>Tu papel es fundamental</h3>
<p>Como ciudadano de Puerto del Rosario, tu participación en la correcta separación de residuos es esencial para alcanzar estos objetivos y mantener nuestra isla limpia y sostenible.</p>
      `
    },
    {
      orden: 2,
      titulo: 'Los Contenedores de Reciclaje',
      descripcion: 'Aprende a identificar cada contenedor y qué residuos depositar en cada uno.',
      duracionMin: 15,
      contenido: `
<h2>Sistema de Contenedores de Reciclaje</h2>

<p>En Puerto del Rosario disponemos de un sistema de 5 contenedores para la correcta separación de residuos. Conocerlos es fundamental para reciclar correctamente.</p>

<h3>🟡 Contenedor Amarillo - Envases</h3>
<p>Este contenedor es para <strong>envases ligeros</strong>:</p>
<ul>
  <li>✅ Botellas de plástico (agua, refrescos, leche)</li>
  <li>✅ Envases de yogur y postres</li>
  <li>✅ Bandejas de porexpán o corcho blanco</li>
  <li>✅ Bolsas de plástico</li>
  <li>✅ Latas de conservas y bebidas</li>
  <li>✅ Briks (leche, zumos, caldos)</li>
  <li>✅ Papel de aluminio y film transparente</li>
  <li>✅ Tapas y tapones metálicos</li>
</ul>
<p><strong>❌ NO depositar:</strong> Juguetes de plástico, utensilios de cocina, cubos, cápsulas de café de aluminio.</p>

<h3>🔵 Contenedor Azul - Papel y Cartón</h3>
<p>Destinado a <strong>papel y cartón limpio</strong>:</p>
<ul>
  <li>✅ Periódicos y revistas</li>
  <li>✅ Cajas de cartón (plegadas)</li>
  <li>✅ Folios y papel de oficina</li>
  <li>✅ Sobres (sin ventanilla de plástico)</li>
  <li>✅ Papel de regalo (sin brillos metálicos)</li>
  <li>✅ Hueveras de cartón</li>
</ul>
<p><strong>❌ NO depositar:</strong> Briks, papel plastificado, papel de cocina usado, pañuelos de papel, cartón manchado de grasa.</p>

<h3>🟢 Contenedor Verde - Vidrio</h3>
<p>Para <strong>envases de vidrio</strong>:</p>
<ul>
  <li>✅ Botellas de vidrio (vino, aceite, refrescos)</li>
  <li>✅ Tarros y frascos de conservas</li>
  <li>✅ Frascos de perfume vacíos</li>
</ul>
<p><strong>❌ NO depositar:</strong> Cristales de ventanas, espejos, bombillas, vajilla, cerámica, vidrio de laboratorio.</p>
<p><em>Importante: Retira siempre tapas y tapones antes de depositar el vidrio.</em></p>

<h3>🟤 Contenedor Marrón - Orgánico</h3>
<p>Para <strong>residuos orgánicos biodegradables</strong>:</p>
<ul>
  <li>✅ Restos de frutas y verduras</li>
  <li>✅ Restos de carne y pescado</li>
  <li>✅ Cáscaras de huevo</li>
  <li>✅ Posos de café e infusiones</li>
  <li>✅ Pan y bollería</li>
  <li>✅ Servilletas y papel de cocina usados</li>
  <li>✅ Pequeños restos de poda</li>
  <li>✅ Tapones de corcho</li>
</ul>
<p><strong>❌ NO depositar:</strong> Pañales, colillas, excrementos de animales, polvo de barrer, aceite de cocina.</p>

<h3>⬜ Contenedor Gris/Verde Oscuro - Resto</h3>
<p>Para <strong>residuos no reciclables</strong>:</p>
<ul>
  <li>✅ Pañales y productos de higiene personal</li>
  <li>✅ Colillas (apagadas)</li>
  <li>✅ Polvo de barrer</li>
  <li>✅ Juguetes rotos</li>
  <li>✅ Utensilios de cocina rotos</li>
  <li>✅ Objetos de cerámica</li>
</ul>

<h3>Consejos prácticos</h3>
<ol>
  <li>Enjuaga los envases antes de depositarlos</li>
  <li>Aplasta los envases para ocupar menos espacio</li>
  <li>Pliega las cajas de cartón</li>
  <li>Separa tapas y tapones de los envases</li>
  <li>Ante la duda, consulta la guía o pregunta</li>
</ol>
      `
    },
    {
      orden: 3,
      titulo: 'Residuos Especiales y Punto Limpio',
      descripcion: 'Conoce cómo gestionar residuos especiales y el funcionamiento del Punto Limpio.',
      duracionMin: 12,
      contenido: `
<h2>Residuos Especiales</h2>

<p>Algunos residuos no pueden depositarse en los contenedores habituales debido a su composición o peligrosidad. Estos requieren una gestión especial.</p>

<h3>🔴 Residuos Peligrosos</h3>
<p>Son aquellos que contienen sustancias tóxicas o peligrosas:</p>
<ul>
  <li><strong>Pilas y baterías:</strong> Contienen metales pesados muy contaminantes. Depositar en contenedores específicos (suelen estar en comercios y puntos de recogida).</li>
  <li><strong>Aceite usado de cocina:</strong> Un litro de aceite puede contaminar 1.000 litros de agua. Llevar a punto limpio o contenedores específicos.</li>
  <li><strong>Medicamentos caducados:</strong> Llevar a la farmacia (punto SIGRE).</li>
  <li><strong>Productos de limpieza:</strong> Llevar a punto limpio con su envase original.</li>
  <li><strong>Pinturas y disolventes:</strong> Altamente contaminantes. Solo en punto limpio.</li>
  <li><strong>Bombillas y fluorescentes:</strong> Contienen mercurio. Punto limpio o tiendas especializadas.</li>
</ul>

<h3>📱 Residuos de Aparatos Eléctricos y Electrónicos (RAEE)</h3>
<p>Todos los aparatos que funcionan con electricidad o pilas:</p>
<ul>
  <li>Electrodomésticos grandes (neveras, lavadoras)</li>
  <li>Electrodomésticos pequeños (tostadoras, secadores)</li>
  <li>Equipos informáticos (ordenadores, impresoras)</li>
  <li>Teléfonos móviles y tablets</li>
  <li>Televisores y monitores</li>
</ul>
<p><strong>Opciones de gestión:</strong></p>
<ol>
  <li>Punto limpio municipal</li>
  <li>Recogida gratuita al comprar uno nuevo (la tienda está obligada a recogerlo)</li>
  <li>Servicio de recogida de voluminosos del Ayuntamiento</li>
</ol>

<h3>🛋️ Residuos Voluminosos</h3>
<p>Muebles y objetos grandes que no caben en los contenedores:</p>
<ul>
  <li>Sofás y sillones</li>
  <li>Colchones</li>
  <li>Muebles de madera</li>
  <li>Puertas y ventanas</li>
</ul>
<p><strong>Servicio de recogida:</strong> Puerto del Rosario ofrece un servicio gratuito de recogida de voluminosos. Contacta con el Ayuntamiento para solicitar cita.</p>

<h3>👕 Ropa y Textiles</h3>
<p>La ropa en buen estado puede tener una segunda vida:</p>
<ul>
  <li>Contenedores de ropa (ONG y empresas de reciclaje)</li>
  <li>Punto limpio</li>
  <li>Donación a organizaciones benéficas</li>
</ul>

<h3>🏠 El Punto Limpio de Puerto del Rosario</h3>
<p>El Punto Limpio es una instalación donde los ciudadanos pueden depositar gratuitamente residuos especiales.</p>

<h4>¿Qué puedes llevar?</h4>
<ul>
  <li>Aceites (motor y cocina)</li>
  <li>Pilas y baterías</li>
  <li>Electrodomésticos</li>
  <li>Muebles</li>
  <li>Escombros (pequeñas cantidades)</li>
  <li>Pinturas y disolventes</li>
  <li>Fluorescentes y bombillas</li>
  <li>Neumáticos</li>
  <li>Podas y restos de jardín</li>
</ul>

<h4>Consejos para usar el Punto Limpio</h4>
<ol>
  <li>Separa los residuos antes de ir</li>
  <li>Lleva los productos en sus envases originales si es posible</li>
  <li>Consulta horarios de apertura</li>
  <li>Si tienes dudas, pregunta al personal</li>
</ol>

<h3>Punto Limpio Móvil</h3>
<p>El Ayuntamiento dispone de un Punto Limpio Móvil que recorre los barrios del municipio. Consulta el calendario de rutas en la web municipal.</p>
      `
    },
    {
      orden: 4,
      titulo: 'Reducción y Reutilización',
      descripcion: 'Estrategias para reducir la generación de residuos y reutilizar materiales.',
      duracionMin: 10,
      contenido: `
<h2>Reducir y Reutilizar: Las R más importantes</h2>

<p>Aunque el reciclaje es importante, las estrategias de <strong>reducción</strong> y <strong>reutilización</strong> son aún más efectivas para minimizar nuestro impacto ambiental. El mejor residuo es el que no se genera.</p>

<h3>♻️ La Jerarquía de Residuos</h3>
<p>Por orden de prioridad:</p>
<ol>
  <li><strong>Prevención:</strong> No generar el residuo</li>
  <li><strong>Reutilización:</strong> Usar de nuevo el producto</li>
  <li><strong>Reciclaje:</strong> Transformar en nuevos materiales</li>
  <li><strong>Valorización:</strong> Recuperar energía</li>
  <li><strong>Eliminación:</strong> Vertedero (última opción)</li>
</ol>

<h3>📉 Estrategias para REDUCIR</h3>

<h4>En la compra</h4>
<ul>
  <li>Lleva tu propia bolsa reutilizable</li>
  <li>Elige productos con menos envases</li>
  <li>Compra a granel cuando sea posible</li>
  <li>Evita productos de un solo uso</li>
  <li>Elige envases grandes en lugar de porciones individuales</li>
  <li>Compra productos locales (menos transporte y embalaje)</li>
</ul>

<h4>En el hogar</h4>
<ul>
  <li>Planifica las comidas para evitar desperdiciar alimentos</li>
  <li>Usa servilletas de tela en lugar de papel</li>
  <li>Opta por pilas recargables</li>
  <li>Evita imprimir documentos innecesarios</li>
  <li>Repara en lugar de reemplazar</li>
  <li>Rechaza publicidad en el buzón</li>
</ul>

<h4>El desperdicio alimentario</h4>
<p>Un tercio de los alimentos producidos se desperdicia. Consejos para evitarlo:</p>
<ul>
  <li>Haz una lista antes de comprar</li>
  <li>Revisa la nevera antes de ir al supermercado</li>
  <li>Distingue entre "consumir preferentemente antes de" y "fecha de caducidad"</li>
  <li>Congela los alimentos antes de que se estropeen</li>
  <li>Aprovecha las sobras para nuevas recetas</li>
</ul>

<h3>🔄 Estrategias para REUTILIZAR</h3>

<h4>Dar segunda vida a los objetos</h4>
<ul>
  <li><strong>Ropa:</strong> Donar, intercambiar, customizar o transformar</li>
  <li><strong>Muebles:</strong> Restaurar, pintar o tapizar</li>
  <li><strong>Electrodomésticos:</strong> Reparar antes de tirar</li>
  <li><strong>Libros:</strong> Bibliotecas, intercambios, donaciones</li>
  <li><strong>Juguetes:</strong> Regalar o donar cuando los niños crecen</li>
</ul>

<h4>Ideas creativas de reutilización</h4>
<ul>
  <li>Tarros de cristal → organizadores, portavelas</li>
  <li>Cajas de cartón → almacenaje decorativo</li>
  <li>Ropa vieja → trapos de limpieza</li>
  <li>Palés → muebles de jardín</li>
  <li>Botellas de plástico → maceteros</li>
</ul>

<h4>Economía colaborativa</h4>
<ul>
  <li>Mercados de segunda mano</li>
  <li>Aplicaciones de compraventa (Wallapop, etc.)</li>
  <li>Bibliotecas de objetos</li>
  <li>Grupos de intercambio vecinales</li>
</ul>

<h3>🌿 El Compostaje Doméstico</h3>
<p>El compostaje permite transformar los residuos orgánicos en abono natural.</p>

<h4>Beneficios</h4>
<ul>
  <li>Reduce hasta un 40% los residuos domésticos</li>
  <li>Produce compost de calidad para plantas</li>
  <li>Ahorra en fertilizantes</li>
  <li>Reduce emisiones de gases de efecto invernadero</li>
</ul>

<h4>Qué compostar</h4>
<ul>
  <li>✅ Restos de frutas y verduras</li>
  <li>✅ Posos de café y bolsitas de té</li>
  <li>✅ Cáscaras de huevo trituradas</li>
  <li>✅ Hojas secas y restos de poda</li>
  <li>❌ Carne, pescado, lácteos (atraen plagas)</li>
  <li>❌ Aceites y grasas</li>
</ul>

<h3>💡 Consejos finales</h3>
<p>Pequeños cambios en nuestros hábitos diarios pueden tener un gran impacto colectivo. Empieza con un cambio y ve incorporando más progresivamente.</p>
      `
    },
    {
      orden: 5,
      titulo: 'La Gestión de Residuos en Puerto del Rosario',
      descripcion: 'Información específica sobre los servicios y normativas locales.',
      duracionMin: 8,
      contenido: `
<h2>Gestión de Residuos en Puerto del Rosario</h2>

<p>El Ayuntamiento de Puerto del Rosario está comprometido con una gestión eficiente y sostenible de los residuos municipales. Conoce los servicios disponibles y cómo utilizarlos.</p>

<h3>🗑️ Servicios de Recogida</h3>

<h4>Recogida de contenedores</h4>
<p>El servicio de recogida de residuos opera con la siguiente frecuencia (puede variar según zonas):</p>
<ul>
  <li><strong>Orgánico (marrón):</strong> Diario</li>
  <li><strong>Resto (gris):</strong> Diario</li>
  <li><strong>Envases (amarillo):</strong> 3-4 veces por semana</li>
  <li><strong>Papel/Cartón (azul):</strong> 2-3 veces por semana</li>
  <li><strong>Vidrio (verde):</strong> 1-2 veces por semana</li>
</ul>

<h4>Horarios recomendados</h4>
<p>Deposita los residuos en horario de tarde-noche, preferiblemente a partir de las 20:00 horas. Así evitamos malos olores y problemas de salubridad.</p>

<h4>Servicio de recogida de voluminosos</h4>
<p>Para muebles y enseres grandes:</p>
<ol>
  <li>Llama al teléfono de atención ciudadana</li>
  <li>Solicita cita indicando qué objeto quieres desechar</li>
  <li>Déjalo en el lugar indicado el día acordado</li>
</ol>
<p><em>Este servicio es gratuito para residentes.</em></p>

<h3>🏭 Punto Limpio Municipal</h3>
<p>Instalación para residuos especiales que no pueden depositarse en contenedores.</p>

<h4>Ubicación y horarios</h4>
<p>Consulta en la web del Ayuntamiento o llamando al servicio de atención ciudadana los horarios actualizados del Punto Limpio.</p>

<h4>Documentación necesaria</h4>
<p>Para acceder al Punto Limpio, presenta tu DNI/NIE y justificante de residencia en Puerto del Rosario.</p>

<h3>🚐 Punto Limpio Móvil</h3>
<p>Un servicio que acerca el Punto Limpio a los barrios del municipio. Consulta el calendario de rutas:</p>
<ul>
  <li>Web municipal</li>
  <li>Tablones de anuncios de las oficinas municipales</li>
  <li>Redes sociales del Ayuntamiento</li>
</ul>

<h3>📋 Normativa Municipal</h3>

<h4>Obligaciones ciudadanas</h4>
<ul>
  <li>Separar correctamente los residuos en origen</li>
  <li>Depositar los residuos en los contenedores correspondientes</li>
  <li>Respetar los horarios de depósito</li>
  <li>No depositar residuos fuera de los contenedores</li>
  <li>No depositar residuos comerciales en contenedores domésticos</li>
</ul>

<h4>Infracciones y sanciones</h4>
<p>El incumplimiento de la ordenanza de residuos puede conllevar sanciones:</p>
<ul>
  <li><strong>Leves:</strong> Depositar residuos fuera de horario</li>
  <li><strong>Graves:</strong> Depositar residuos en contenedor incorrecto de forma reiterada</li>
  <li><strong>Muy graves:</strong> Vertidos ilegales, abandono de residuos peligrosos</li>
</ul>

<h3>📞 Contacto y Recursos</h3>

<h4>Teléfonos útiles</h4>
<ul>
  <li>Atención ciudadana: 010</li>
  <li>Concejalía de Medio Ambiente</li>
</ul>

<h4>Recursos online</h4>
<ul>
  <li>Web municipal: www.puertodelrosario.org</li>
  <li>Redes sociales del Ayuntamiento</li>
</ul>

<h3>🌴 Compromiso con Fuerteventura</h3>
<p>Puerto del Rosario, como capital de Fuerteventura, tiene una responsabilidad especial en la protección de nuestro entorno natural. La isla es Reserva de la Biosfera, lo que nos obliga a ser especialmente cuidadosos con la gestión de nuestros residuos.</p>

<h4>Problemáticas específicas insulares</h4>
<ul>
  <li>Espacio limitado para vertederos</li>
  <li>Coste elevado de transporte de residuos a la península</li>
  <li>Fragilidad del ecosistema insular</li>
  <li>Impacto del turismo en la generación de residuos</li>
</ul>

<h3>✅ Resumen del curso</h3>
<p>Has aprendido:</p>
<ol>
  <li>La importancia de la gestión de residuos</li>
  <li>Cómo usar correctamente cada contenedor</li>
  <li>Qué hacer con residuos especiales</li>
  <li>Estrategias para reducir y reutilizar</li>
  <li>Los servicios disponibles en Puerto del Rosario</li>
</ol>

<p><strong>¡Enhorabuena!</strong> Estás listo para realizar el examen y obtener tu certificado.</p>
      `
    }
  ];

  for (const modulo of modulos) {
    await prisma.modulo.upsert({
      where: { orden: modulo.orden },
      update: modulo,
      create: modulo
    });
  }
  console.log(`✅ ${modulos.length} módulos creados\n`);

  // 4. Crear preguntas del examen
  console.log('❓ Creando preguntas del examen...');

  const preguntas = [
    // Módulo 1 - Introducción
    {
      enunciado: '¿Cuál es el principio básico de la economía circular?',
      opciones: [
        'Usar y tirar',
        'Producir más para consumir más',
        'Los residuos se convierten en recursos',
        'Incinerar todos los residuos'
      ],
      respuestaCorrecta: 2,
      explicacion: 'La economía circular propone un sistema donde los residuos se convierten en recursos, frente al modelo lineal de "usar y tirar".'
    },
    {
      enunciado: '¿Cuál es el objetivo de reciclaje de España para 2025?',
      opciones: ['45%', '55%', '65%', '75%'],
      respuestaCorrecta: 1,
      explicacion: 'España tiene como objetivo alcanzar el 55% de reciclaje para 2025.'
    },
    {
      enunciado: '¿Qué porcentaje máximo de residuos puede ir a vertedero en 2025 según la normativa española?',
      opciones: ['50%', '40%', '30%', '20%'],
      respuestaCorrecta: 1,
      explicacion: 'La normativa establece un máximo del 40% de residuos en vertedero para 2025.'
    },
    {
      enunciado: '¿Cuáles son las tres R del reciclaje por orden de prioridad?',
      opciones: [
        'Reciclar, Reducir, Reutilizar',
        'Reducir, Reutilizar, Reciclar',
        'Reutilizar, Reciclar, Reducir',
        'Reciclar, Reparar, Recoger'
      ],
      respuestaCorrecta: 1,
      explicacion: 'El orden correcto es Reducir, Reutilizar y Reciclar. La reducción es la estrategia más efectiva.'
    },
    {
      enunciado: '¿Qué problema ambiental causan los lixiviados de los vertederos?',
      opciones: [
        'Ruido',
        'Contaminación lumínica',
        'Contaminación del agua',
        'Pérdida de biodiversidad directa'
      ],
      respuestaCorrecta: 2,
      explicacion: 'Los lixiviados son líquidos que se filtran de los residuos y pueden contaminar acuíferos y ríos.'
    },

    // Módulo 2 - Contenedores
    {
      enunciado: '¿En qué contenedor se depositan los briks de leche?',
      opciones: ['Azul', 'Verde', 'Amarillo', 'Marrón'],
      respuestaCorrecta: 2,
      explicacion: 'Los briks van al contenedor amarillo porque son envases ligeros, aunque tengan cartón en su composición.'
    },
    {
      enunciado: '¿Qué NO se debe depositar en el contenedor azul de papel?',
      opciones: ['Periódicos', 'Cajas de cartón', 'Briks', 'Folios'],
      respuestaCorrecta: 2,
      explicacion: 'Los briks NO van al contenedor azul, aunque tengan cartón. Deben ir al contenedor amarillo.'
    },
    {
      enunciado: '¿Qué se debe hacer con las tapas antes de depositar una botella de vidrio?',
      opciones: [
        'Dejarlas puestas',
        'Quitarlas y tirarlas al resto',
        'Quitarlas y depositarlas en el amarillo',
        'No importa'
      ],
      respuestaCorrecta: 2,
      explicacion: 'Las tapas metálicas deben quitarse y depositarse en el contenedor amarillo.'
    },
    {
      enunciado: '¿Dónde se depositan las servilletas de papel usadas?',
      opciones: ['Contenedor azul', 'Contenedor amarillo', 'Contenedor marrón', 'Contenedor gris'],
      respuestaCorrecta: 2,
      explicacion: 'Las servilletas usadas van al contenedor marrón (orgánico) porque están sucias y son biodegradables.'
    },
    {
      enunciado: '¿Qué residuo NO va al contenedor marrón (orgánico)?',
      opciones: ['Restos de fruta', 'Posos de café', 'Pañales', 'Cáscaras de huevo'],
      respuestaCorrecta: 2,
      explicacion: 'Los pañales no son biodegradables y deben ir al contenedor de resto (gris).'
    },
    {
      enunciado: '¿Dónde se depositan los espejos rotos?',
      opciones: ['Contenedor verde', 'Punto limpio', 'Contenedor amarillo', 'Contenedor azul'],
      respuestaCorrecta: 1,
      explicacion: 'Los espejos, cristales de ventanas y vajilla NO van al contenedor verde. Deben llevarse al punto limpio.'
    },
    {
      enunciado: '¿Cuál es el color del contenedor para residuos orgánicos?',
      opciones: ['Verde', 'Azul', 'Marrón', 'Amarillo'],
      respuestaCorrecta: 2,
      explicacion: 'El contenedor marrón es para residuos orgánicos biodegradables.'
    },
    {
      enunciado: '¿Qué tipo de bolsas de plástico van al contenedor amarillo?',
      opciones: ['Ninguna', 'Solo las de supermercado', 'Todas las bolsas de plástico', 'Solo las biodegradables'],
      respuestaCorrecta: 2,
      explicacion: 'Todas las bolsas de plástico son envases y van al contenedor amarillo.'
    },
    {
      enunciado: '¿Dónde se deposita el papel de aluminio usado?',
      opciones: ['Contenedor azul', 'Contenedor amarillo', 'Contenedor verde', 'Contenedor gris'],
      respuestaCorrecta: 1,
      explicacion: 'El papel de aluminio es un envase y va al contenedor amarillo.'
    },
    {
      enunciado: '¿Qué hacer con una caja de pizza manchada de grasa?',
      opciones: [
        'Contenedor azul',
        'Contenedor amarillo',
        'Contenedor marrón',
        'Contenedor gris/resto'
      ],
      respuestaCorrecta: 2,
      explicacion: 'El cartón manchado de grasa va al contenedor marrón (orgánico) porque no se puede reciclar como papel.'
    },

    // Módulo 3 - Residuos especiales
    {
      enunciado: '¿Dónde se deben depositar los medicamentos caducados?',
      opciones: ['Contenedor amarillo', 'Contenedor gris', 'Farmacia (punto SIGRE)', 'Punto limpio'],
      respuestaCorrecta: 2,
      explicacion: 'Los medicamentos caducados deben llevarse a las farmacias, donde hay un punto SIGRE para su recogida.'
    },
    {
      enunciado: '¿Cuántos litros de agua puede contaminar un litro de aceite usado?',
      opciones: ['100 litros', '500 litros', '1.000 litros', '10.000 litros'],
      respuestaCorrecta: 2,
      explicacion: 'Un litro de aceite usado puede contaminar hasta 1.000 litros de agua.'
    },
    {
      enunciado: '¿Dónde se depositan las pilas usadas?',
      opciones: [
        'Contenedor amarillo',
        'Contenedor gris',
        'Contenedores específicos o punto limpio',
        'Contenedor verde'
      ],
      respuestaCorrecta: 2,
      explicacion: 'Las pilas contienen metales pesados y deben depositarse en contenedores específicos o llevarse al punto limpio.'
    },
    {
      enunciado: '¿Por qué los fluorescentes requieren una gestión especial?',
      opciones: [
        'Son muy grandes',
        'Contienen mercurio',
        'Son muy frágiles',
        'Son muy caros'
      ],
      respuestaCorrecta: 1,
      explicacion: 'Los fluorescentes contienen mercurio, un metal altamente tóxico, por lo que deben llevarse al punto limpio.'
    },
    {
      enunciado: '¿Qué es un RAEE?',
      opciones: [
        'Residuo Altamente Explosivo y Energético',
        'Residuo de Aparatos Eléctricos y Electrónicos',
        'Residuo Aprovechable para Energía y Electricidad',
        'Registro de Actividades de Economía y Ecología'
      ],
      respuestaCorrecta: 1,
      explicacion: 'RAEE significa Residuo de Aparatos Eléctricos y Electrónicos.'
    },
    {
      enunciado: '¿Qué obligación tiene una tienda cuando compras un electrodoméstico nuevo?',
      opciones: [
        'Ninguna',
        'Regalarte pilas',
        'Recoger el aparato viejo gratuitamente',
        'Darte un descuento'
      ],
      respuestaCorrecta: 2,
      explicacion: 'Las tiendas están obligadas a recoger gratuitamente el aparato viejo cuando compras uno nuevo del mismo tipo.'
    },
    {
      enunciado: '¿Dónde se lleva el aceite de motor usado?',
      opciones: ['Contenedor amarillo', 'Punto limpio', 'Contenedor gris', 'Se puede tirar por el fregadero'],
      respuestaCorrecta: 1,
      explicacion: 'El aceite de motor usado es altamente contaminante y debe llevarse al punto limpio.'
    },
    {
      enunciado: '¿Qué son los residuos voluminosos?',
      opciones: [
        'Residuos muy pesados',
        'Residuos muy peligrosos',
        'Muebles y objetos grandes que no caben en contenedores',
        'Residuos industriales'
      ],
      respuestaCorrecta: 2,
      explicacion: 'Los residuos voluminosos son aquellos objetos grandes como muebles, colchones, etc., que no caben en los contenedores.'
    },
    {
      enunciado: '¿Dónde se debe depositar la ropa vieja en buen estado?',
      opciones: [
        'Contenedor amarillo',
        'Contenedor gris',
        'Contenedores de ropa o donar',
        'Contenedor azul'
      ],
      respuestaCorrecta: 2,
      explicacion: 'La ropa en buen estado puede depositarse en contenedores específicos de ropa o donarse a organizaciones.'
    },
    {
      enunciado: '¿Qué documento necesitas para acceder al Punto Limpio?',
      opciones: [
        'Pasaporte',
        'Carnet de conducir',
        'DNI/NIE y justificante de residencia',
        'No se necesita documentación'
      ],
      respuestaCorrecta: 2,
      explicacion: 'Para acceder al Punto Limpio necesitas presentar DNI/NIE y justificante de residencia en el municipio.'
    },

    // Módulo 4 - Reducción y reutilización
    {
      enunciado: '¿Cuál es la estrategia más efectiva en la jerarquía de residuos?',
      opciones: ['Reciclaje', 'Reutilización', 'Prevención', 'Valorización'],
      respuestaCorrecta: 2,
      explicacion: 'La prevención (no generar el residuo) es la estrategia más efectiva. El mejor residuo es el que no se genera.'
    },
    {
      enunciado: '¿Qué porcentaje de residuos domésticos puede reducirse con el compostaje?',
      opciones: ['10%', '20%', '40%', '60%'],
      respuestaCorrecta: 2,
      explicacion: 'El compostaje doméstico puede reducir hasta un 40% de los residuos domésticos.'
    },
    {
      enunciado: '¿Qué NO se debe compostar en casa?',
      opciones: ['Restos de fruta', 'Posos de café', 'Carne y pescado', 'Cáscaras de huevo'],
      respuestaCorrecta: 2,
      explicacion: 'La carne y el pescado no deben compostarse en casa porque atraen plagas y generan malos olores.'
    },
    {
      enunciado: '¿Cuál es la diferencia entre "consumir preferentemente" y "fecha de caducidad"?',
      opciones: [
        'Son lo mismo',
        'Consumir preferentemente indica que el producto puede consumirse después con seguridad',
        'Fecha de caducidad permite más margen',
        'Consumir preferentemente es más estricto'
      ],
      respuestaCorrecta: 1,
      explicacion: '"Consumir preferentemente" indica calidad óptima, pero el producto puede consumirse después. "Fecha de caducidad" indica seguridad alimentaria.'
    },
    {
      enunciado: '¿Qué fracción de los alimentos producidos se desperdicia a nivel mundial?',
      opciones: ['Un décimo', 'Un quinto', 'Un tercio', 'La mitad'],
      respuestaCorrecta: 2,
      explicacion: 'Aproximadamente un tercio de los alimentos producidos en el mundo se desperdicia.'
    },
    {
      enunciado: '¿Qué ventaja tiene comprar productos a granel?',
      opciones: [
        'Son más caros',
        'Tienen mejor sabor',
        'Se reduce el uso de envases',
        'Duran más tiempo'
      ],
      respuestaCorrecta: 2,
      explicacion: 'Comprar a granel reduce significativamente la cantidad de envases que generamos.'
    },
    {
      enunciado: '¿Qué tipo de pilas es más sostenible usar?',
      opciones: ['Alcalinas', 'Salinas', 'Recargables', 'De botón'],
      respuestaCorrecta: 2,
      explicacion: 'Las pilas recargables son más sostenibles porque pueden usarse cientos de veces.'
    },
    {
      enunciado: '¿Qué es la economía colaborativa?',
      opciones: [
        'Trabajar gratis',
        'Compartir, intercambiar y reutilizar recursos entre personas',
        'Una forma de gobierno',
        'Un tipo de empresa'
      ],
      respuestaCorrecta: 1,
      explicacion: 'La economía colaborativa se basa en compartir, intercambiar y reutilizar recursos entre personas.'
    },
    {
      enunciado: '¿Qué se obtiene del compostaje doméstico?',
      opciones: ['Energía eléctrica', 'Biogás', 'Compost (abono natural)', 'Plástico reciclado'],
      respuestaCorrecta: 2,
      explicacion: 'El compostaje doméstico produce compost, un abono natural de alta calidad para plantas.'
    },
    {
      enunciado: '¿Cuál es la mejor opción antes de tirar un electrodoméstico que no funciona?',
      opciones: ['Tirarlo al contenedor', 'Intentar repararlo', 'Dejarlo en la calle', 'Guardarlo en casa'],
      respuestaCorrecta: 1,
      explicacion: 'Antes de desechar, es mejor intentar reparar los electrodomésticos para alargar su vida útil.'
    },

    // Módulo 5 - Puerto del Rosario
    {
      enunciado: '¿Qué servicio ofrece el Ayuntamiento para recoger muebles viejos?',
      opciones: [
        'No existe tal servicio',
        'Hay que pagar una tasa',
        'Servicio gratuito de recogida de voluminosos',
        'Solo en días festivos'
      ],
      respuestaCorrecta: 2,
      explicacion: 'Puerto del Rosario ofrece un servicio gratuito de recogida de voluminosos para residentes.'
    },
    {
      enunciado: '¿A qué hora se recomienda depositar los residuos en los contenedores?',
      opciones: ['Por la mañana temprano', 'Al mediodía', 'A partir de las 20:00', 'A cualquier hora'],
      respuestaCorrecta: 2,
      explicacion: 'Se recomienda depositar los residuos a partir de las 20:00 para evitar malos olores y problemas de salubridad.'
    },
    {
      enunciado: '¿Qué es el Punto Limpio Móvil?',
      opciones: [
        'Una aplicación móvil',
        'Un vehículo que recorre los barrios recogiendo residuos especiales',
        'Un contenedor con ruedas',
        'Un servicio de limpieza de calles'
      ],
      respuestaCorrecta: 1,
      explicacion: 'El Punto Limpio Móvil es un servicio que acerca el punto limpio a los diferentes barrios del municipio.'
    },
    {
      enunciado: '¿Qué tipo de infracción es depositar residuos fuera de horario?',
      opciones: ['No es infracción', 'Leve', 'Grave', 'Muy grave'],
      respuestaCorrecta: 1,
      explicacion: 'Depositar residuos fuera de horario se considera una infracción leve según la ordenanza municipal.'
    },
    {
      enunciado: '¿Por qué Fuerteventura tiene especial responsabilidad en la gestión de residuos?',
      opciones: [
        'Porque tiene más población',
        'Porque es Reserva de la Biosfera',
        'Porque tiene más industrias',
        'Porque es más grande'
      ],
      respuestaCorrecta: 1,
      explicacion: 'Fuerteventura es Reserva de la Biosfera, lo que implica una responsabilidad especial en la protección del medio ambiente.'
    },
    {
      enunciado: '¿Qué problemática específica tiene una isla en la gestión de residuos?',
      opciones: [
        'Más contenedores disponibles',
        'Mejor clima para el compostaje',
        'Espacio limitado para vertederos',
        'Menos residuos generados'
      ],
      respuestaCorrecta: 2,
      explicacion: 'Las islas tienen espacio limitado para vertederos y alto coste de transporte de residuos.'
    },
    {
      enunciado: '¿Dónde puedes consultar el calendario del Punto Limpio Móvil?',
      opciones: [
        'No existe calendario',
        'Solo preguntando por teléfono',
        'Web municipal, tablones de anuncios y redes sociales',
        'En el supermercado'
      ],
      respuestaCorrecta: 2,
      explicacion: 'El calendario del Punto Limpio Móvil se puede consultar en la web municipal, tablones de anuncios y redes sociales del Ayuntamiento.'
    },
    {
      enunciado: '¿Qué número puedes marcar para contactar con atención ciudadana?',
      opciones: ['012', '010', '091', '112'],
      respuestaCorrecta: 1,
      explicacion: 'El 010 es el teléfono de atención ciudadana del Ayuntamiento.'
    },
    {
      enunciado: '¿Qué se considera una infracción muy grave en materia de residuos?',
      opciones: [
        'No separar correctamente',
        'Depositar fuera de horario',
        'Vertidos ilegales y abandono de residuos peligrosos',
        'Usar el contenedor equivocado'
      ],
      respuestaCorrecta: 2,
      explicacion: 'Los vertidos ilegales y el abandono de residuos peligrosos se consideran infracciones muy graves.'
    },
    {
      enunciado: '¿Pueden los comercios usar los contenedores domésticos para sus residuos?',
      opciones: ['Sí, siempre', 'Solo los pequeños comercios', 'No, está prohibido', 'Solo por las noches'],
      respuestaCorrecta: 2,
      explicacion: 'Los comercios no pueden depositar sus residuos en contenedores domésticos. Deben contratar gestión específica.'
    },

    // Preguntas adicionales variadas
    {
      enunciado: '¿El vidrio es reciclable al 100% sin perder calidad?',
      opciones: ['Sí', 'No', 'Solo algunas veces', 'Depende del color'],
      respuestaCorrecta: 0,
      explicacion: 'El vidrio es 100% reciclable y puede reciclarse infinitas veces sin perder calidad.'
    },
    {
      enunciado: '¿Cuánta energía se ahorra al reciclar una botella de vidrio?',
      opciones: [
        'Ninguna',
        'La suficiente para una bombilla 1 hora',
        'La suficiente para un televisor 3 horas',
        'La suficiente para un horno 1 hora'
      ],
      respuestaCorrecta: 2,
      explicacion: 'Reciclar una botella de vidrio ahorra la energía suficiente para mantener un televisor encendido durante 3 horas.'
    },
    {
      enunciado: '¿Qué significa el SDDR que se ha implantado en España?',
      opciones: [
        'Sistema de Depósito, Devolución y Retorno',
        'Servicio de Distribución de Residuos',
        'Sistema Digital de Reciclaje',
        'Servicio de Destrucción de Residuos'
      ],
      respuestaCorrecta: 0,
      explicacion: 'SDDR significa Sistema de Depósito, Devolución y Retorno para envases de bebidas.'
    },
    {
      enunciado: '¿Qué porcentaje de impropios hay en el contenedor de resto según estudios?',
      opciones: ['Menos del 20%', 'Alrededor del 50%', 'Más del 80%', 'Prácticamente 100%'],
      respuestaCorrecta: 2,
      explicacion: 'Más del 81% de los residuos del contenedor de resto son impropios que deberían ir a otros contenedores.'
    },
    {
      enunciado: '¿Desde cuándo es obligatorio que los envases indiquen en qué contenedor depositarlos?',
      opciones: ['2020', '2023', '2025', 'No es obligatorio'],
      respuestaCorrecta: 2,
      explicacion: 'Desde el 1 de enero de 2025, todos los envases domésticos deben incluir información sobre el contenedor correcto.'
    }
  ];

  for (const pregunta of preguntas) {
    await prisma.pregunta.create({ data: pregunta });
  }
  console.log(`✅ ${preguntas.length} preguntas creadas\n`);

  console.log('🎉 Seed completado con éxito!\n');
  console.log('📋 Resumen:');
  console.log(`   - 1 Administrador (${process.env.ADMIN_EMAIL || 'admin@puertoderosario.org'})`);
  console.log(`   - ${modulos.length} Módulos de formación`);
  console.log(`   - ${preguntas.length} Preguntas de examen`);
  console.log('   - Configuración de examen (20 preguntas, 70% para aprobar, 30 min, 3 intentos)\n');
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
