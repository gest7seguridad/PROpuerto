import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Layout({ children }) {
  const { usuario, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navItems = [
    { path: '/dashboard', label: 'Formación', icon: '📚' },
    { path: '/examen', label: 'Examen', icon: '📝' },
    { path: '/certificado', label: 'Certificado', icon: '🎓' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-primary-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/dashboard" className="flex items-center">
              <img
                src="/logo-ayuntamiento.svg"
                alt="Ayuntamiento de Puerto del Rosario"
                className="h-12 w-auto"
              />
            </Link>

            {/* Nav Desktop */}
            <nav className="hidden md:flex items-center space-x-1">
              {navItems.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    location.pathname === item.path
                      ? 'bg-white/20 text-white'
                      : 'text-primary-100 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <span className="hidden sm:block text-sm text-primary-200">
                {usuario?.nombre}
              </span>
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 text-sm bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
              >
                Salir
              </button>
            </div>
          </div>
        </div>

        {/* Nav Mobile */}
        <nav className="md:hidden border-t border-primary-500">
          <div className="flex justify-around py-2">
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center px-3 py-1 rounded-lg ${
                  location.pathname === item.path
                    ? 'text-white'
                    : 'text-primary-200'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="text-xs mt-0.5">{item.label}</span>
              </Link>
            ))}
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500">
            <p>Ayuntamiento de Puerto del Rosario - Fuerteventura</p>
            <p className="mt-2 sm:mt-0">Formación en Gestión de Residuos</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
