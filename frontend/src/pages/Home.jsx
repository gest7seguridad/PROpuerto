import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-600 to-primary-800">
      {/* Header */}
      <header className="p-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <img
              src="/logo-ayuntamiento.svg"
              alt="Ayuntamiento de Puerto del Rosario"
              className="h-14 w-auto"
            />
          </div>
          <div className="flex space-x-4">
            <Link to="/login" className="px-4 py-2 text-white hover:bg-white/10 rounded-lg transition-colors">
              Iniciar sesión
            </Link>
            <Link to="/registro" className="px-4 py-2 bg-white text-primary-600 rounded-lg hover:bg-primary-50 transition-colors">
              Registrarse
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="max-w-6xl mx-auto px-6 py-16 text-center text-white">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          Curso en Gestión de Residuos
        </h1>
        <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
          Completa la formación online, supera el examen y obtén tu certificado oficial
          del Ayuntamiento de Puerto del Rosario
        </p>

        <Link to="/registro" className="inline-block px-8 py-4 bg-white text-primary-600 rounded-xl font-semibold text-lg hover:bg-primary-50 transition-colors shadow-lg">
          Comenzar formación gratuita
        </Link>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="bg-white/10 backdrop-blur rounded-xl p-6">
            <div className="text-4xl mb-4">📚</div>
            <h3 className="text-lg font-semibold mb-2">5 Módulos de Formación</h3>
            <p className="text-primary-200 text-sm">
              Aprende sobre separación de residuos, reciclaje y gestión sostenible
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur rounded-xl p-6">
            <div className="text-4xl mb-4">📝</div>
            <h3 className="text-lg font-semibold mb-2">Examen Online</h3>
            <p className="text-primary-200 text-sm">
              20 preguntas para demostrar tus conocimientos. 70% para aprobar
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur rounded-xl p-6">
            <div className="text-4xl mb-4">🎓</div>
            <h3 className="text-lg font-semibold mb-2">Certificado Oficial</h3>
            <p className="text-primary-200 text-sm">
              Recibe tu certificado con firma digital y código QR verificable
            </p>
          </div>
        </div>

        {/* Process */}
        <div className="mt-20">
          <h2 className="text-2xl font-bold mb-10">¿Cómo funciona?</h2>
          <div className="flex flex-col md:flex-row justify-center items-center md:items-start space-y-8 md:space-y-0 md:space-x-8">
            {[
              { step: '1', title: 'Regístrate', desc: 'Con tu DNI y dirección' },
              { step: '2', title: 'Completa la formación', desc: '5 módulos interactivos' },
              { step: '3', title: 'Realiza el examen', desc: '20 preguntas, 30 minutos' },
              { step: '4', title: 'Obtén tu certificado', desc: 'Descarga o verificación online' },
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div className="w-12 h-12 bg-white text-primary-600 rounded-full flex items-center justify-center font-bold text-xl mb-3">
                  {item.step}
                </div>
                <h4 className="font-semibold mb-1">{item.title}</h4>
                <p className="text-sm text-primary-200">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-20 py-8 border-t border-primary-500">
        <div className="max-w-6xl mx-auto px-6 text-center text-primary-200 text-sm">
          <p>Ayuntamiento de Puerto del Rosario - Fuerteventura</p>
          <p className="mt-2">Desarrollado por <a href="https://gestsiete.es" target="_blank" rel="noopener noreferrer" className="text-white hover:underline">gestsiete.es</a></p>
          <div className="mt-4">
            <Link to="/verificar" className="hover:text-white">Verificar certificado</Link>
            <span className="mx-3">|</span>
            <Link to="/admin/login" className="hover:text-white">Acceso administración</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
