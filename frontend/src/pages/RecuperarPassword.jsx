import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

export default function RecuperarPassword() {
  const [email, setEmail] = useState('');
  const [enviado, setEnviado] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await authAPI.recuperarPassword(email);
      setEnviado(true);
    } catch (error) {
      // No mostramos error especifico por seguridad
      setEnviado(true);
    } finally {
      setLoading(false);
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
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Recuperar contrasena
          </h2>
          <p className="mt-2 text-gray-600">
            Te enviaremos un enlace para restablecer tu contrasena
          </p>
        </div>

        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {enviado ? (
            <div className="text-center">
              <div className="text-6xl mb-4">📧</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Revisa tu correo
              </h3>
              <p className="text-gray-600 mb-6">
                Si existe una cuenta con el email <strong>{email}</strong>,
                recibiras un enlace para restablecer tu contrasena.
              </p>
              <p className="text-sm text-gray-500 mb-6">
                Si no recibes el email en unos minutos, revisa tu carpeta de spam.
              </p>
              <Link
                to="/login"
                className="btn btn-primary w-full py-2"
              >
                Volver al login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field mt-1"
                  placeholder="tu@email.com"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn btn-primary py-2"
              >
                {loading ? 'Enviando...' : 'Enviar enlace de recuperacion'}
              </button>

              <div className="text-center">
                <Link
                  to="/login"
                  className="text-sm text-primary-600 hover:text-primary-500"
                >
                  Volver al login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
