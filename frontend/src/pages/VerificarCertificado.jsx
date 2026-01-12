import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { certificadoAPI } from '../services/api';

export default function VerificarCertificado() {
  const { codigo } = useParams();
  const [certificado, setCertificado] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    verificarCertificado();
  }, [codigo]);

  const verificarCertificado = async () => {
    try {
      const response = await certificadoAPI.verificar(codigo);
      setCertificado(response.data.certificado);
    } catch (error) {
      setError(error.response?.data?.message || 'Certificado no encontrado');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
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
            Ayuntamiento de Puerto del Rosario
          </h1>
          <p className="text-gray-600">
            Verificacion de Certificado de Gestion de Residuos
          </p>
        </div>

        {/* Resultado */}
        {error ? (
          <div className="bg-white shadow rounded-lg p-8 text-center">
            <div className="text-6xl mb-4">❌</div>
            <h2 className="text-2xl font-bold text-red-800 mb-2">
              Certificado no valido
            </h2>
            <p className="text-red-600 mb-6">{error}</p>
            <p className="text-gray-500 text-sm">
              El codigo de verificacion <strong className="font-mono">{codigo}</strong> no corresponde
              a ningun certificado emitido por el Ayuntamiento de Puerto del Rosario.
            </p>
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            {/* Banner de verificacion */}
            <div className="bg-green-500 text-white p-6 text-center">
              <div className="text-5xl mb-2">✓</div>
              <h2 className="text-2xl font-bold">Certificado Valido</h2>
              <p className="text-green-100">
                Este certificado ha sido emitido oficialmente
              </p>
            </div>

            {/* Detalles */}
            <div className="p-6">
              <div className="grid gap-4">
                <div className="border-b pb-4">
                  <p className="text-sm text-gray-500">Titular del certificado</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {certificado.nombreCompleto}
                  </p>
                </div>

                <div className="border-b pb-4">
                  <p className="text-sm text-gray-500">DNI/NIE</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {certificado.dniCensurado}
                  </p>
                </div>

                <div className="border-b pb-4">
                  <p className="text-sm text-gray-500">Codigo de verificacion</p>
                  <p className="text-lg font-mono font-semibold text-primary-600">
                    {certificado.codigoVerificacion}
                  </p>
                </div>

                <div className="border-b pb-4">
                  <p className="text-sm text-gray-500">Fecha de emision</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {new Date(certificado.fechaEmision).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>

                <div className="border-b pb-4">
                  <p className="text-sm text-gray-500">Calificacion obtenida</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {certificado.notaExamen?.toFixed(1)}%
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Estado</p>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    Valido y vigente
                  </span>
                </div>
              </div>
            </div>

            {/* Nota legal */}
            <div className="bg-gray-50 p-4 border-t">
              <p className="text-xs text-gray-500 text-center">
                Este certificado acredita que el titular ha completado satisfactoriamente
                la formacion en gestion de residuos segun la Ordenanza Municipal de Puerto del Rosario.
                Para cualquier consulta, contacte con el Ayuntamiento.
              </p>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Ayuntamiento de Puerto del Rosario</p>
          <p>Calle Primero de Mayo, 39 - 35600 Puerto del Rosario</p>
          <p>Fuerteventura, Las Palmas</p>
        </div>
      </div>
    </div>
  );
}
