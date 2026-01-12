import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';

export default function VerificarEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [estado, setEstado] = useState('verificando'); // verificando, exito, error
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    verificarEmail();
  }, []);

  const verificarEmail = async () => {
    const token = searchParams.get('token');

    if (!token) {
      setEstado('error');
      setMensaje('Token de verificacion no proporcionado');
      return;
    }

    try {
      await authAPI.verificarEmail(token);
      setEstado('exito');
      setMensaje('Tu email ha sido verificado correctamente');

      // Redirigir al login despues de 3 segundos
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      setEstado('error');
      setMensaje(error.response?.data?.message || 'Error al verificar el email');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <img
              src="/logo-ayuntamiento.svg"
              alt="Ayuntamiento de Puerto del Rosario"
              className="h-20 w-auto mx-auto"
            />
          </Link>
        </div>

        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {estado === 'verificando' && (
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <h2 className="text-xl font-semibold text-gray-900">Verificando email...</h2>
              <p className="text-gray-600 mt-2">Por favor, espera un momento</p>
            </div>
          )}

          {estado === 'exito' && (
            <div className="text-center">
              <div className="text-6xl mb-4">✅</div>
              <h2 className="text-xl font-semibold text-green-800">Email verificado</h2>
              <p className="text-green-600 mt-2">{mensaje}</p>
              <p className="text-gray-500 mt-4 text-sm">Redirigiendo al login...</p>
            </div>
          )}

          {estado === 'error' && (
            <div className="text-center">
              <div className="text-6xl mb-4">❌</div>
              <h2 className="text-xl font-semibold text-red-800">Error de verificacion</h2>
              <p className="text-red-600 mt-2">{mensaje}</p>
              <div className="mt-6 space-y-3">
                <Link
                  to="/login"
                  className="block w-full btn btn-primary py-2"
                >
                  Ir al login
                </Link>
                <Link
                  to="/"
                  className="block w-full btn btn-secondary py-2"
                >
                  Volver al inicio
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
