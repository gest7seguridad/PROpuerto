import { Link } from 'react-router-dom';

export default function PoliticaCookies() {
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
          <h1 className="text-3xl font-bold">Politica de Cookies</h1>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-xl shadow-sm p-8 space-y-8">

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Que son las Cookies</h2>
            <p className="text-gray-600">
              Las cookies son pequenos archivos de texto que los sitios web almacenan en su dispositivo (ordenador, tablet, telefono movil) cuando los visita. Estas cookies permiten al sitio web recordar sus acciones y preferencias durante un periodo de tiempo, de modo que no tenga que volver a introducirlos cada vez que visite el sitio o navegue de una pagina a otra.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Tipos de Cookies que Utilizamos</h2>
            <p className="text-gray-600 mb-4">
              En este sitio web utilizamos los siguientes tipos de cookies:
            </p>

            <div className="space-y-6">
              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="font-semibold text-gray-800 mb-2">Cookies Tecnicas o Necesarias</h3>
                <p className="text-gray-600 text-sm mb-2">
                  Son imprescindibles para el funcionamiento del sitio web. Permiten navegar y utilizar las diferentes opciones y servicios.
                </p>
                <div className="bg-gray-50 rounded p-3 text-sm">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-gray-500">
                        <th className="pb-2">Cookie</th>
                        <th className="pb-2">Finalidad</th>
                        <th className="pb-2">Duracion</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-600">
                      <tr>
                        <td className="py-1">token</td>
                        <td className="py-1">Autenticacion del usuario</td>
                        <td className="py-1">Sesion / 7 dias</td>
                      </tr>
                      <tr>
                        <td className="py-1">cookieConsent</td>
                        <td className="py-1">Almacena preferencias de cookies</td>
                        <td className="py-1">1 ano</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="font-semibold text-gray-800 mb-2">Cookies de Preferencias</h3>
                <p className="text-gray-600 text-sm mb-2">
                  Permiten recordar sus preferencias para personalizar su experiencia.
                </p>
                <div className="bg-gray-50 rounded p-3 text-sm">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-gray-500">
                        <th className="pb-2">Cookie</th>
                        <th className="pb-2">Finalidad</th>
                        <th className="pb-2">Duracion</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-600">
                      <tr>
                        <td className="py-1">lastModule</td>
                        <td className="py-1">Recuerda el ultimo modulo visitado</td>
                        <td className="py-1">30 dias</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Cookies de Terceros</h2>
            <p className="text-gray-600">
              Este sitio web no utiliza cookies de terceros con fines publicitarios o de analisis. No compartimos informacion de navegacion con redes publicitarias, redes sociales u otros servicios de terceros.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Base Legal para el Uso de Cookies</h2>
            <p className="text-gray-600 mb-4">
              La base legal para el uso de cookies es:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li><strong>Cookies necesarias:</strong> Interes legitimo del responsable para garantizar el funcionamiento del servicio (Art. 6.1.f RGPD).</li>
              <li><strong>Cookies de preferencias:</strong> Consentimiento del usuario (Art. 6.1.a RGPD), que puede retirar en cualquier momento.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Como Gestionar las Cookies</h2>
            <p className="text-gray-600 mb-4">
              Puede gestionar sus preferencias de cookies de las siguientes formas:
            </p>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Panel de Configuracion</h3>
                <p className="text-gray-600 text-sm">
                  Puede modificar su consentimiento en cualquier momento haciendo clic en el boton "Configurar cookies" que aparece en el banner de cookies o en el pie de pagina.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Configuracion del Navegador</h3>
                <p className="text-gray-600 text-sm mb-2">
                  Tambien puede configurar su navegador para aceptar, rechazar o eliminar cookies:
                </p>
                <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
                  <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">Google Chrome</a></li>
                  <li><a href="https://support.mozilla.org/es/kb/habilitar-y-deshabilitar-cookies-sitios-web-rastrear-preferencias" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">Mozilla Firefox</a></li>
                  <li><a href="https://support.apple.com/es-es/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">Safari</a></li>
                  <li><a href="https://support.microsoft.com/es-es/microsoft-edge/eliminar-cookies-en-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">Microsoft Edge</a></li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Consecuencias de Deshabilitar las Cookies</h2>
            <p className="text-gray-600">
              Si decide deshabilitar las cookies, algunas funcionalidades del sitio web podrian no estar disponibles o funcionar de manera incorrecta. En particular:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mt-4">
              <li>No podra mantener la sesion iniciada entre visitas.</li>
              <li>No se recordaran sus preferencias de navegacion.</li>
              <li>Volvera a ver el banner de cookies en cada visita.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Actualizacion de la Politica</h2>
            <p className="text-gray-600">
              Esta politica de cookies puede ser actualizada periodicamente. Le recomendamos revisar esta pagina cada cierto tiempo para estar informado sobre como utilizamos las cookies.
            </p>
            <p className="text-gray-600 mt-4">
              <strong>Ultima actualizacion:</strong> Enero 2026
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">8. Mas Informacion</h2>
            <p className="text-gray-600">
              Para mas informacion sobre el uso de cookies, puede consultar:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mt-4">
              <li><a href="https://www.aepd.es/es/documento/guia-cookies.pdf" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">Guia de Cookies de la AEPD</a></li>
              <li>Contactar con nuestro Delegado de Proteccion de Datos: dpd@pfrros.es</li>
            </ul>
          </section>

        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="max-w-4xl mx-auto px-4 text-center text-sm text-gray-500">
          <div className="flex flex-wrap justify-center gap-4 mb-4">
            <Link to="/politica-privacidad" className="hover:text-primary-600">Politica de Privacidad</Link>
            <Link to="/aviso-legal" className="hover:text-primary-600">Aviso Legal</Link>
          </div>
          <p>Ayuntamiento de Puerto del Rosario - Fuerteventura</p>
        </div>
      </footer>
    </div>
  );
}
