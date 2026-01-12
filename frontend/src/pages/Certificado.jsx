import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { certificadoAPI } from '../services/api';
import toast from 'react-hot-toast';

export default function Certificado() {
  const navigate = useNavigate();
  const [estado, setEstado] = useState(null);
  const [loading, setLoading] = useState(true);
  const [firmando, setFirmando] = useState(false);
  const [descargando, setDescargando] = useState(false);

  useEffect(() => {
    cargarEstado();
  }, []);

  const cargarEstado = async () => {
    try {
      const response = await certificadoAPI.estado();
      setEstado(response.data);
    } catch (error) {
      toast.error('Error al cargar el estado del certificado');
    } finally {
      setLoading(false);
    }
  };

  const solicitarFirma = async () => {
    setFirmando(true);
    try {
      // Simulamos la firma
      await certificadoAPI.simularFirma();
      toast.success('¡Certificado generado correctamente!');
      await cargarEstado();
    } catch (error) {
      const mensaje = error.response?.data?.message || 'Error al procesar la firma';
      toast.error(mensaje);
    } finally {
      setFirmando(false);
    }
  };

  const descargarCertificado = async () => {
    setDescargando(true);
    try {
      const response = await certificadoAPI.descargar();
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `certificado-residuos-${estado.certificado.codigoVerificacion}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success('Certificado descargado');
    } catch (error) {
      toast.error('Error al descargar el certificado');
    } finally {
      setDescargando(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Si no puede obtener certificado
  if (!estado?.puedeObtenerCertificado) {
    return (
      <div className="max-w-2xl mx-auto animate-fadeIn">
        <div className="card text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Certificado no disponible</h2>
          <p className="text-gray-600 mb-4">
            Debes completar la formación y aprobar el examen para obtener tu certificado.
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="btn btn-primary"
          >
            Ir a la formación
          </button>
        </div>
      </div>
    );
  }

  // Si tiene certificado firmado
  if (estado?.certificado?.firmado) {
    return (
      <div className="max-w-2xl mx-auto animate-fadeIn">
        <div className="card text-center bg-green-50">
          <div className="text-6xl mb-4">🎓</div>
          <h2 className="text-2xl font-bold text-green-800 mb-2">¡Tu certificado está listo!</h2>
          <p className="text-green-600 mb-4">
            Ya puedes descargar tu certificado oficial de formación en gestión de residuos.
          </p>
        </div>

        <div className="card mt-6">
          <h3 className="font-semibold text-gray-900 mb-4">Detalles del certificado</h3>
          <dl className="space-y-3">
            <div className="flex justify-between">
              <dt className="text-gray-500">Código de verificación</dt>
              <dd className="font-mono text-primary-600">{estado.certificado.codigoVerificacion}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Fecha de emisión</dt>
              <dd className="text-gray-900">
                {new Date(estado.certificado.fechaEmision).toLocaleDateString('es-ES')}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Nota obtenida</dt>
              <dd className="text-gray-900">{estado.examenAprobado?.puntuacion?.toFixed(1)}%</dd>
            </div>
          </dl>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-4">
          <button
            onClick={descargarCertificado}
            disabled={descargando}
            className="flex-1 btn btn-primary py-3"
          >
            {descargando ? 'Descargando...' : '📥 Descargar PDF'}
          </button>
          <button
            onClick={() => window.open(`/verificar/${estado.certificado.codigoVerificacion}`, '_blank')}
            className="flex-1 btn btn-secondary py-3"
          >
            🔍 Ver página de verificación
          </button>
        </div>

        <div className="mt-6 card bg-gray-50">
          <h4 className="font-medium text-gray-900 mb-2">Verificación del certificado</h4>
          <p className="text-sm text-gray-600">
            Cualquier persona puede verificar la autenticidad de tu certificado escaneando el código QR
            o visitando la siguiente URL:
          </p>
          <p className="mt-2 text-sm font-mono text-primary-600 break-all">
            {window.location.origin}/verificar/{estado.certificado.codigoVerificacion}
          </p>
        </div>
      </div>
    );
  }

  // Pendiente de firma
  return (
    <div className="max-w-2xl mx-auto animate-fadeIn">
      <div className="card text-center">
        <div className="text-6xl mb-4">✍️</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Firma tu certificado</h2>
        <p className="text-gray-600 mb-6">
          Has completado la formación y aprobado el examen.
          Ahora solo falta firmar digitalmente tu certificado para obtenerlo.
        </p>

        <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
          <h3 className="font-semibold text-gray-900 mb-3">Resumen de tu formación:</h3>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              Formación completada
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              Examen aprobado ({estado.examenAprobado?.puntuacion?.toFixed(1)}%)
            </li>
            <li className="flex items-center">
              <span className="text-yellow-500 mr-2">○</span>
              Firma digital pendiente
            </li>
          </ul>
        </div>

        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6 text-left">
          <p className="text-sm text-blue-700">
            Al firmar, confirmas que has realizado la formación personalmente y que los datos
            proporcionados son correctos.
          </p>
        </div>

        <button
          onClick={solicitarFirma}
          disabled={firmando}
          className="w-full btn btn-primary py-3 text-lg"
        >
          {firmando ? (
            <span className="flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Procesando firma...
            </span>
          ) : (
            'Firmar y obtener certificado'
          )}
        </button>
      </div>
    </div>
  );
}
