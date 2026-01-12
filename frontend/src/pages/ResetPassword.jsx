import { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    password: '',
    confirmarPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [exito, setExito] = useState(false);

  const token = searchParams.get('token');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmarPassword) {
      toast.error('Las contrasenas no coinciden');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('La contrasena debe tener al menos 6 caracteres');
      return;
    }

    if (!token) {
      toast.error('Token no valido');
      return;
    }

    setLoading(true);
    try {
      await authAPI.resetPassword(token, formData.password);
      setExito(true);
      toast.success('Contrasena actualizada correctamente');

      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al restablecer la contrasena');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 text-center">
            <div className="text-6xl mb-4">❌</div>
            <h2 className="text-xl font-semibold text-red-800">Enlace no valido</h2>
            <p className="text-red-600 mt-2">
              El enlace de recuperacion no es valido o ha expirado.
            </p>
            <Link
              to="/recuperar-password"
              className="mt-6 inline-block btn btn-primary"
            >
              Solicitar nuevo enlace
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
            Nueva contrasena
          </h2>
          <p className="mt-2 text-gray-600">
            Introduce tu nueva contrasena
          </p>
        </div>

        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {exito ? (
            <div className="text-center">
              <div className="text-6xl mb-4">✅</div>
              <h3 className="text-lg font-semibold text-green-800 mb-2">
                Contrasena actualizada
              </h3>
              <p className="text-gray-600 mb-4">
                Tu contrasena ha sido restablecida correctamente.
              </p>
              <p className="text-sm text-gray-500">
                Redirigiendo al login...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Nueva contrasena
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="input-field mt-1"
                  placeholder="Minimo 6 caracteres"
                />
              </div>

              <div>
                <label htmlFor="confirmarPassword" className="block text-sm font-medium text-gray-700">
                  Confirmar contrasena
                </label>
                <input
                  id="confirmarPassword"
                  name="confirmarPassword"
                  type="password"
                  required
                  value={formData.confirmarPassword}
                  onChange={handleChange}
                  className="input-field mt-1"
                  placeholder="Repite la contrasena"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn btn-primary py-2"
              >
                {loading ? 'Guardando...' : 'Guardar nueva contrasena'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
