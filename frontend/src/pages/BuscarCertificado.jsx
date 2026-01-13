import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function BuscarCertificado() {
  const [codigo, setCodigo] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const codigoLimpio = codigo.trim().toUpperCase();

    if (!codigoLimpio) {
      setError('Por favor, introduce un codigo de verificacion');
      return;
    }

    if (codigoLimpio.length < 6) {
      setError('El codigo debe tener al menos 6 caracteres');
      return;
    }

    navigate(`/verificar/${codigoLimpio}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <img
              src="/logo-ayuntamiento.svg"
              alt="Ayuntamiento de Puerto del Rosario"
              className="h-24 w-auto mx-auto"
            />
          </Link>
          <h1 className="mt-4 text-2xl font-bold text-gray-900">
            Verificar Certificado
          </h1>
          <p className="text-gray-600 mt-2">
            Comprueba la autenticidad de un certificado de formacion en gestion de residuos
          </p>
        </div>

        {/* Formulario */}
        <div className="bg-white shadow rounded-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="codigo" className="block text-sm font-medium text-gray-700 mb-1">
                Codigo de verificacion
              </label>
              <input
                type="text"
                id="codigo"
                value={codigo}
                onChange={(e) => {
                  setCodigo(e.target.value.toUpperCase());
                  setError('');
                }}
                placeholder="Ej: ABC123XYZ"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-center text-lg font-mono tracking-wider"
                autoComplete="off"
                autoFocus
              />
              {error && (
                <p className="mt-2 text-sm text-red-600">{error}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-700 transition-colors"
            >
              Verificar certificado
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              ¿Donde encuentro el codigo?
            </h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li className="flex items-start">
                <span className="text-primary-600 mr-2">1.</span>
                En la parte inferior del certificado PDF
              </li>
              <li className="flex items-start">
                <span className="text-primary-600 mr-2">2.</span>
                Escaneando el codigo QR del certificado
              </li>
            </ul>
          </div>
        </div>

        {/* Info adicional */}
        <div className="mt-6 bg-blue-50 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Nota:</strong> Este sistema permite verificar los certificados emitidos por
            el Ayuntamiento de Puerto del Rosario para la formacion en gestion de residuos.
          </p>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Ayuntamiento de Puerto del Rosario</p>
          <p>Fuerteventura, Las Palmas</p>
          <Link to="/" className="text-primary-600 hover:underline mt-2 inline-block">
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
