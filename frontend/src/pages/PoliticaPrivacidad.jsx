import { Link } from 'react-router-dom';

export default function PoliticaPrivacidad() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-primary-600 text-white py-6">
        <div className="max-w-4xl mx-auto px-4">
          <Link to="/" className="inline-flex items-center text-primary-100 hover:text-white mb-4">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Volver al inicio
          </Link>
          <h1 className="text-3xl font-bold">Politica de Privacidad</h1>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-xl shadow-sm p-8 space-y-8">

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Responsable del Tratamiento</h2>
            <div className="text-gray-600 space-y-2">
              <p><strong>Identidad:</strong> Ayuntamiento de Puerto del Rosario</p>
              <p><strong>CIF:</strong> P3502400J</p>
              <p><strong>Direccion:</strong> Calle Primero de Mayo, 39, 35600 Puerto del Rosario, Las Palmas</p>
              <p><strong>Telefono:</strong> 928 850 100</p>
              <p><strong>Email:</strong> ayuntamiento@pfrros.es</p>
              <p><strong>Delegado de Proteccion de Datos (DPO):</strong> dpd@pfrros.es</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Finalidad del Tratamiento</h2>
            <p className="text-gray-600 mb-4">
              Los datos personales recabados a traves de esta plataforma seran tratados con las siguientes finalidades:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Gestion del registro de usuarios en la plataforma de formacion en gestion de residuos.</li>
              <li>Administracion y seguimiento de la formacion online sobre gestion de residuos.</li>
              <li>Evaluacion de los conocimientos adquiridos mediante examenes.</li>
              <li>Emision y gestion de certificados oficiales de aprovechamiento.</li>
              <li>Comunicaciones relacionadas con el servicio (verificacion de email, recuperacion de contrasena, notificaciones del curso).</li>
              <li>Cumplimiento de obligaciones legales derivadas de la normativa aplicable.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Base Legal del Tratamiento</h2>
            <p className="text-gray-600 mb-4">
              La base legal para el tratamiento de sus datos personales es:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li><strong>Consentimiento del interesado</strong> (Art. 6.1.a RGPD): Al registrarse en la plataforma y aceptar la presente politica de privacidad.</li>
              <li><strong>Ejecucion de un contrato</strong> (Art. 6.1.b RGPD): Para la prestacion del servicio de formacion solicitado.</li>
              <li><strong>Cumplimiento de obligacion legal</strong> (Art. 6.1.c RGPD): Para cumplir con las obligaciones legales aplicables al Ayuntamiento.</li>
              <li><strong>Mision de interes publico</strong> (Art. 6.1.e RGPD): La formacion ciudadana en gestion de residuos es una actividad de interes publico.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Datos Personales Recogidos</h2>
            <p className="text-gray-600 mb-4">
              Los datos personales que recogemos incluyen:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li><strong>Datos identificativos:</strong> DNI/NIE, nombre, apellidos.</li>
              <li><strong>Datos de contacto:</strong> Email, telefono.</li>
              <li><strong>Datos de direccion:</strong> Direccion postal completa (calle, numero, piso, puerta, codigo postal, localidad).</li>
              <li><strong>Datos de acceso:</strong> Contrasena (almacenada de forma cifrada).</li>
              <li><strong>Datos academicos:</strong> Progreso en la formacion, resultados de examenes, certificados obtenidos.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Destinatarios de los Datos</h2>
            <p className="text-gray-600 mb-4">
              Sus datos personales podran ser comunicados a:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Empleados y funcionarios del Ayuntamiento de Puerto del Rosario debidamente autorizados.</li>
              <li>Administraciones Publicas cuando exista obligacion legal.</li>
              <li>Encargados de tratamiento que presten servicios al Ayuntamiento (hosting, mantenimiento informatico), con los que se han firmado los correspondientes contratos de encargo de tratamiento.</li>
            </ul>
            <p className="text-gray-600 mt-4">
              No se realizan transferencias internacionales de datos fuera del Espacio Economico Europeo.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Plazo de Conservacion</h2>
            <p className="text-gray-600">
              Los datos personales seran conservados durante el tiempo necesario para cumplir con la finalidad para la que fueron recogidos y, posteriormente, durante los plazos legales de prescripcion de responsabilidades. En particular:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mt-4">
              <li>Datos de registro y formacion: Durante la vigencia de la cuenta y 5 anos adicionales tras su baja.</li>
              <li>Certificados emitidos: De forma indefinida para garantizar su verificacion.</li>
              <li>Datos fiscales y contables: 6 anos segun la normativa tributaria.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Derechos del Interesado</h2>
            <p className="text-gray-600 mb-4">
              De conformidad con la LOPDGDD y el RGPD, usted tiene derecho a:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li><strong>Acceso:</strong> Conocer si se estan tratando sus datos y obtener una copia de los mismos.</li>
              <li><strong>Rectificacion:</strong> Solicitar la correccion de datos inexactos o incompletos.</li>
              <li><strong>Supresion:</strong> Solicitar la eliminacion de sus datos cuando ya no sean necesarios.</li>
              <li><strong>Limitacion:</strong> Solicitar la limitacion del tratamiento en determinadas circunstancias.</li>
              <li><strong>Portabilidad:</strong> Recibir sus datos en un formato estructurado y de uso comun.</li>
              <li><strong>Oposicion:</strong> Oponerse al tratamiento de sus datos por motivos relacionados con su situacion particular.</li>
            </ul>
            <p className="text-gray-600 mt-4">
              Para ejercer estos derechos, puede dirigirse al Delegado de Proteccion de Datos del Ayuntamiento mediante:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mt-2">
              <li>Email: dpd@pfrros.es</li>
              <li>Correo postal: Ayuntamiento de Puerto del Rosario, Calle Primero de Mayo, 39, 35600 Puerto del Rosario, Las Palmas</li>
              <li>Sede electronica del Ayuntamiento</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">8. Derecho a Reclamar</h2>
            <p className="text-gray-600">
              Si considera que el tratamiento de sus datos no se ajusta a la normativa vigente, tiene derecho a presentar una reclamacion ante la Agencia Espanola de Proteccion de Datos (AEPD):
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mt-4">
              <li>Web: <a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">www.aepd.es</a></li>
              <li>Direccion: C/ Jorge Juan, 6, 28001 Madrid</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">9. Medidas de Seguridad</h2>
            <p className="text-gray-600">
              El Ayuntamiento de Puerto del Rosario ha adoptado las medidas tecnicas y organizativas necesarias para garantizar la seguridad de los datos personales y evitar su alteracion, perdida, tratamiento o acceso no autorizado, de acuerdo con el estado de la tecnologia, la naturaleza de los datos y los riesgos a los que estan expuestos, incluyendo:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mt-4">
              <li>Cifrado de contrasenas mediante algoritmos seguros.</li>
              <li>Conexiones seguras mediante protocolo HTTPS.</li>
              <li>Control de acceso a los datos basado en perfiles de usuario.</li>
              <li>Copias de seguridad periodicas.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">10. Actualizacion de la Politica</h2>
            <p className="text-gray-600">
              Esta politica de privacidad puede ser actualizada periodicamente para adaptarse a cambios legislativos o a nuevas practicas. Le recomendamos revisar esta pagina periodicamente. La fecha de ultima actualizacion se indica a continuacion.
            </p>
            <p className="text-gray-600 mt-4">
              <strong>Ultima actualizacion:</strong> Enero 2026
            </p>
          </section>

        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="max-w-4xl mx-auto px-4 text-center text-sm text-gray-500">
          <div className="flex flex-wrap justify-center gap-4 mb-4">
            <Link to="/aviso-legal" className="hover:text-primary-600">Aviso Legal</Link>
            <Link to="/politica-cookies" className="hover:text-primary-600">Politica de Cookies</Link>
          </div>
          <p>Ayuntamiento de Puerto del Rosario - Fuerteventura</p>
        </div>
      </footer>
    </div>
  );
}
