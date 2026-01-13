import { Link } from 'react-router-dom';

export default function AvisoLegal() {
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
          <h1 className="text-3xl font-bold">Aviso Legal</h1>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-xl shadow-sm p-8 space-y-8">

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Datos Identificativos</h2>
            <p className="text-gray-600 mb-4">
              En cumplimiento del deber de informacion establecido en el articulo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Informacion y de Comercio Electronico (LSSI-CE), se facilitan los siguientes datos:
            </p>
            <div className="text-gray-600 space-y-2">
              <p><strong>Titular:</strong> Ayuntamiento de Puerto del Rosario</p>
              <p><strong>CIF:</strong> P3502400J</p>
              <p><strong>Domicilio:</strong> Calle Primero de Mayo, 39, 35600 Puerto del Rosario, Las Palmas</p>
              <p><strong>Telefono:</strong> 928 850 100</p>
              <p><strong>Email:</strong> ayuntamiento@pfrros.es</p>
              <p><strong>Sitio web:</strong> www.pfrros.es</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Objeto</h2>
            <p className="text-gray-600">
              El presente sitio web tiene como finalidad ofrecer a los ciudadanos del municipio de Puerto del Rosario una plataforma de formacion online gratuita sobre gestion de residuos, permitiendo obtener un certificado oficial tras completar la formacion y superar la evaluacion correspondiente.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Condiciones de Uso</h2>
            <p className="text-gray-600 mb-4">
              El acceso y uso del sitio web atribuye la condicion de usuario, que acepta desde dicho acceso y uso las presentes condiciones generales:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>El usuario se compromete a hacer un uso adecuado de los contenidos y servicios ofrecidos.</li>
              <li>Queda prohibido el uso del sitio web con fines ilicitos, lesivos de derechos e intereses de terceros, o que puedan danar, inutilizar, sobrecargar o deteriorar el sitio web.</li>
              <li>El usuario garantiza la veracidad y exactitud de los datos proporcionados en los formularios de registro.</li>
              <li>El usuario es responsable de mantener la confidencialidad de sus credenciales de acceso.</li>
              <li>Solo se permite un registro por vivienda, de acuerdo con los objetivos del programa de formacion.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Propiedad Intelectual e Industrial</h2>
            <p className="text-gray-600 mb-4">
              Todos los contenidos del sitio web, incluyendo a titulo enunciativo pero no limitativo: textos, fotografias, graficos, imagenes, iconos, tecnologia, software, enlaces y demas contenidos audiovisuales o sonoros, asi como su diseno grafico y codigos fuente, son propiedad intelectual del Ayuntamiento de Puerto del Rosario o de terceros, sin que puedan entenderse cedidos al usuario ninguno de los derechos de explotacion sobre los mismos.
            </p>
            <p className="text-gray-600">
              El usuario puede visualizar los elementos del sitio web e incluso imprimirlos, copiarlos y almacenarlos en su ordenador o cualquier otro soporte fisico siempre y cuando sea exclusivamente para su uso personal y privado. Queda prohibida cualquier otra forma de reproduccion, distribucion, comunicacion publica o transformacion sin autorizacion previa.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Exclusion de Garantias y Responsabilidad</h2>
            <p className="text-gray-600 mb-4">
              El Ayuntamiento de Puerto del Rosario no se hace responsable de:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>La falta de disponibilidad, continuidad o calidad del funcionamiento del sitio web.</li>
              <li>Los danos que puedan causarse por el uso inadecuado del sitio web por parte del usuario.</li>
              <li>Los danos derivados de la presencia de virus o programas maliciosos en los contenidos que puedan producir alteraciones en el sistema informatico del usuario.</li>
              <li>Los contenidos de sitios web de terceros a los que se pueda acceder mediante enlaces desde este sitio web.</li>
            </ul>
            <p className="text-gray-600 mt-4">
              El Ayuntamiento de Puerto del Rosario se reserva el derecho de efectuar las modificaciones que considere oportunas, pudiendo cambiar, suprimir o anadir contenidos y servicios, asi como la forma de presentacion o localizacion de los mismos.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Enlaces</h2>
            <p className="text-gray-600 mb-4">
              En el caso de que en el sitio web se incluyesen enlaces o hiperenlaces hacia otros sitios de Internet, el Ayuntamiento de Puerto del Rosario no ejercera ningun tipo de control sobre dichos sitios y contenidos.
            </p>
            <p className="text-gray-600">
              En ningun caso el Ayuntamiento asumira responsabilidad alguna por los contenidos de algun enlace perteneciente a un sitio web ajeno, ni garantizara la disponibilidad tecnica, calidad, fiabilidad, exactitud, amplitud, veracidad, validez y constitucionalidad de cualquier material o informacion contenida en dichos hiperenlaces u otros sitios de Internet.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Certificados</h2>
            <p className="text-gray-600 mb-4">
              Los certificados emitidos por esta plataforma tienen caracter oficial del Ayuntamiento de Puerto del Rosario y acreditan la superacion de la formacion en gestion de residuos. Cada certificado:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Dispone de un codigo unico de verificacion.</li>
              <li>Incluye firma digital del Ayuntamiento.</li>
              <li>Puede ser verificado a traves de la plataforma mediante su codigo QR o codigo alfanumerico.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">8. Legislacion Aplicable y Jurisdiccion</h2>
            <p className="text-gray-600 mb-4">
              Las relaciones entre el Ayuntamiento de Puerto del Rosario y el usuario se regiran por la normativa espanola vigente y cualquier controversia se sometera a los Juzgados y Tribunales competentes.
            </p>
            <p className="text-gray-600">
              Normativa aplicable:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mt-2">
              <li>Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Informacion y de Comercio Electronico (LSSI-CE).</li>
              <li>Ley Organica 3/2018, de 5 de diciembre, de Proteccion de Datos Personales y garantia de los derechos digitales (LOPDGDD).</li>
              <li>Reglamento (UE) 2016/679 del Parlamento Europeo y del Consejo (RGPD).</li>
              <li>Ley 39/2015, de 1 de octubre, del Procedimiento Administrativo Comun de las Administraciones Publicas.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">9. Accesibilidad</h2>
            <p className="text-gray-600">
              El Ayuntamiento de Puerto del Rosario se compromete a hacer accesible este sitio web de conformidad con el Real Decreto 1112/2018, de 7 de septiembre, sobre accesibilidad de los sitios web y aplicaciones para dispositivos moviles del sector publico. Si detecta algun problema de accesibilidad, puede comunicarlo a traves del email: accesibilidad@pfrros.es
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">10. Modificaciones</h2>
            <p className="text-gray-600">
              El Ayuntamiento de Puerto del Rosario se reserva el derecho de modificar el presente Aviso Legal en cualquier momento. Se recomienda al usuario revisar periodicamente estas condiciones.
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
            <Link to="/politica-privacidad" className="hover:text-primary-600">Politica de Privacidad</Link>
            <Link to="/politica-cookies" className="hover:text-primary-600">Politica de Cookies</Link>
          </div>
          <p>Ayuntamiento de Puerto del Rosario - Fuerteventura</p>
        </div>
      </footer>
    </div>
  );
}
