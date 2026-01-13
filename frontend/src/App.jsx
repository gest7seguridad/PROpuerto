import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Layouts
import Layout from './components/Layout';
import AdminLayout from './components/AdminLayout';

// Componentes globales
import CookieBanner from './components/CookieBanner';

// Pages publicas
import Home from './pages/Home';
import Login from './pages/Login';
import Registro from './pages/Registro';
import VerificarEmail from './pages/VerificarEmail';
import RecuperarPassword from './pages/RecuperarPassword';
import ResetPassword from './pages/ResetPassword';
import VerificarCertificado from './pages/VerificarCertificado';

// Pages legales (LOPD)
import PoliticaPrivacidad from './pages/PoliticaPrivacidad';
import AvisoLegal from './pages/AvisoLegal';
import PoliticaCookies from './pages/PoliticaCookies';

// Pages privadas
import Dashboard from './pages/Dashboard';
import Modulo from './pages/Modulo';
import Examen from './pages/Examen';
import ResultadoExamen from './pages/ResultadoExamen';
import Certificado from './pages/Certificado';

// Pages admin
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsuarios from './pages/admin/AdminUsuarios';
import AdminModulos from './pages/admin/AdminModulos';
import AdminPreguntas from './pages/admin/AdminPreguntas';

// Loading
function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="mt-4 text-gray-600">Cargando...</p>
      </div>
    </div>
  );
}

// Ruta protegida
function PrivateRoute({ children }) {
  const { isAuthenticated, loading, usuario } = useAuth();

  if (loading) return <LoadingScreen />;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (usuario && !usuario.verificado) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="card max-w-md text-center">
          <div className="text-6xl mb-4">📧</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Verifica tu email</h2>
          <p className="text-gray-600">
            Hemos enviado un enlace de verificación a tu correo electrónico.
            Por favor, revisa tu bandeja de entrada y haz clic en el enlace para continuar.
          </p>
        </div>
      </div>
    );
  }

  return children;
}

// Ruta pública (redirige si ya está autenticado)
function PublicRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <LoadingScreen />;

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

function App() {
  return (
    <>
      <CookieBanner />
      <Routes>
        {/* Rutas publicas */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/registro" element={<PublicRoute><Registro /></PublicRoute>} />
        <Route path="/verificar-email" element={<VerificarEmail />} />
        <Route path="/recuperar-password" element={<RecuperarPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verificar/:codigo" element={<VerificarCertificado />} />

        {/* Rutas legales LOPD */}
        <Route path="/politica-privacidad" element={<PoliticaPrivacidad />} />
        <Route path="/aviso-legal" element={<AvisoLegal />} />
        <Route path="/politica-cookies" element={<PoliticaCookies />} />

        {/* Rutas privadas */}
        <Route path="/dashboard" element={<PrivateRoute><Layout><Dashboard /></Layout></PrivateRoute>} />
        <Route path="/modulo/:id" element={<PrivateRoute><Layout><Modulo /></Layout></PrivateRoute>} />
        <Route path="/examen" element={<PrivateRoute><Layout><Examen /></Layout></PrivateRoute>} />
        <Route path="/examen/:id/resultado" element={<PrivateRoute><Layout><ResultadoExamen /></Layout></PrivateRoute>} />
        <Route path="/certificado" element={<PrivateRoute><Layout><Certificado /></Layout></PrivateRoute>} />

        {/* Rutas admin */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/admin/dashboard" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
        <Route path="/admin/usuarios" element={<AdminLayout><AdminUsuarios /></AdminLayout>} />
        <Route path="/admin/modulos" element={<AdminLayout><AdminModulos /></AdminLayout>} />
        <Route path="/admin/preguntas" element={<AdminLayout><AdminPreguntas /></AdminLayout>} />

        {/* 404 */}
        <Route path="*" element={
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <h1 className="text-6xl font-bold text-primary-600">404</h1>
              <p className="mt-4 text-xl text-gray-600">Pagina no encontrada</p>
              <a href="/" className="mt-4 inline-block btn btn-primary">Volver al inicio</a>
            </div>
          </div>
        } />
      </Routes>
    </>
  );
}

export default App;
