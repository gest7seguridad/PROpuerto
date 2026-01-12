import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function AdminLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    const adminData = localStorage.getItem('admin');

    if (!adminToken || !adminData) {
      navigate('/admin/login');
      return;
    }

    setAdmin(JSON.parse(adminData));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('admin');
    navigate('/admin/login');
  };

  const navItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/admin/usuarios', label: 'Usuarios', icon: '👥' },
    { path: '/admin/modulos', label: 'Módulos', icon: '📚' },
    { path: '/admin/preguntas', label: 'Preguntas', icon: '❓' },
  ];

  if (!admin) return null;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 w-64 bg-gray-800 text-white">
        <div className="p-4">
          <img
            src="/logo-ayuntamiento.svg"
            alt="Ayuntamiento de Puerto del Rosario"
            className="h-14 w-auto mx-auto mb-2"
          />
          <p className="text-xs text-gray-400 text-center">Panel Administracion</p>
        </div>

        <nav className="mt-6">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-6 py-3 text-sm ${
                location.pathname === item.path
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-300 hover:bg-gray-700'
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full p-6 border-t border-gray-700">
          <p className="text-sm text-gray-400 mb-2">{admin.nombre}</p>
          <button
            onClick={handleLogout}
            className="text-sm text-gray-400 hover:text-white"
          >
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">
        {children}
      </main>
    </div>
  );
}
