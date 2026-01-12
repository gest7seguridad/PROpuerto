import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { modulosAPI, examenAPI, certificadoAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const { usuario } = useAuth();
  const [modulos, setModulos] = useState([]);
  const [estadisticas, setEstadisticas] = useState(null);
  const [estadoExamen, setEstadoExamen] = useState(null);
  const [estadoCertificado, setEstadoCertificado] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const [modulosRes, examenRes, certificadoRes] = await Promise.all([
        modulosAPI.listar(),
        examenAPI.estado(),
        certificadoAPI.estado()
      ]);

      setModulos(modulosRes.data.modulos);
      setEstadisticas(modulosRes.data.estadisticas);
      setEstadoExamen(examenRes.data);
      setEstadoCertificado(certificadoRes.data);
    } catch (error) {
      toast.error('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn">
      {/* Bienvenida */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          ¡Hola, {usuario?.nombre}!
        </h1>
        <p className="text-gray-600">
          Continúa con tu formación en gestión de residuos
        </p>
      </div>

      {/* Progreso general */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Formación</p>
              <p className="text-2xl font-bold text-gray-900">
                {estadisticas?.modulosCompletados}/{estadisticas?.totalModulos}
              </p>
              <p className="text-sm text-gray-500">módulos completados</p>
            </div>
            <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center">
              <span className="text-2xl">📚</span>
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary-600 h-2 rounded-full transition-all"
                style={{ width: `${estadisticas?.progresoTotal || 0}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-500 mt-1">{estadisticas?.progresoTotal}% completado</p>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Examen</p>
              <p className="text-2xl font-bold text-gray-900">
                {estadoExamen?.examenAprobado ? 'Aprobado' :
                 estadoExamen?.intentos?.realizados > 0 ? `${estadoExamen?.intentos?.restantes} intentos` : 'Pendiente'}
              </p>
              <p className="text-sm text-gray-500">
                {estadoExamen?.examenAprobado
                  ? `${estadoExamen.examenAprobado.puntuacion?.toFixed(1)}%`
                  : estadoExamen?.formacionCompletada ? 'Listo para examen' : 'Completa la formación'}
              </p>
            </div>
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
              estadoExamen?.examenAprobado ? 'bg-green-100' : 'bg-yellow-100'
            }`}>
              <span className="text-2xl">{estadoExamen?.examenAprobado ? '✅' : '📝'}</span>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Certificado</p>
              <p className="text-2xl font-bold text-gray-900">
                {estadoCertificado?.certificado?.firmado ? 'Disponible' :
                 estadoCertificado?.puedeObtenerCertificado ? 'Pendiente firma' : 'Bloqueado'}
              </p>
              <p className="text-sm text-gray-500">
                {estadoCertificado?.certificado?.firmado ? 'Descarga disponible' : 'Aprueba el examen primero'}
              </p>
            </div>
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
              estadoCertificado?.certificado?.firmado ? 'bg-green-100' : 'bg-gray-100'
            }`}>
              <span className="text-2xl">🎓</span>
            </div>
          </div>
        </div>
      </div>

      {/* Módulos */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Módulos de formación</h2>
        <div className="space-y-4">
          {modulos.map((modulo, index) => {
            const anteriorCompletado = index === 0 || modulos[index - 1]?.progreso?.completado;
            const bloqueado = !anteriorCompletado;

            return (
              <div
                key={modulo.id}
                className={`card-hover ${bloqueado ? 'opacity-60' : ''}`}
              >
                <div className="flex items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${
                    modulo.progreso?.completado ? 'bg-green-100 text-green-600' :
                    bloqueado ? 'bg-gray-100 text-gray-400' : 'bg-primary-100 text-primary-600'
                  }`}>
                    {modulo.progreso?.completado ? '✓' : modulo.orden}
                  </div>

                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{modulo.titulo}</h3>
                    <p className="text-sm text-gray-500">{modulo.descripcion}</p>
                    <div className="flex items-center mt-2 text-sm text-gray-500">
                      <span className="mr-4">⏱️ {modulo.duracionMin} min</span>
                      {modulo.progreso?.completado && (
                        <span className="text-green-600">✓ Completado</span>
                      )}
                      {!modulo.progreso?.completado && !bloqueado && modulo.progreso?.porcentaje > 0 && (
                        <span>{modulo.progreso.porcentaje}% completado</span>
                      )}
                    </div>
                  </div>

                  {bloqueado ? (
                    <div className="text-gray-400 text-2xl">🔒</div>
                  ) : (
                    <Link
                      to={`/modulo/${modulo.id}`}
                      className="btn btn-primary"
                    >
                      {modulo.progreso?.completado ? 'Repasar' :
                       modulo.progreso?.porcentaje > 0 ? 'Continuar' : 'Comenzar'}
                    </Link>
                  )}
                </div>

                {!bloqueado && !modulo.progreso?.completado && (
                  <div className="mt-4">
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className="bg-primary-600 h-1.5 rounded-full transition-all"
                        style={{ width: `${modulo.progreso?.porcentaje || 0}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Acciones siguientes */}
      {estadisticas?.puedeHacerExamen && !estadoExamen?.examenAprobado && (
        <div className="mt-8 card bg-gradient-to-r from-primary-500 to-primary-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold">¡Formación completada!</h3>
              <p className="text-primary-100">Ya puedes realizar el examen para obtener tu certificado</p>
            </div>
            <Link to="/examen" className="btn bg-white text-primary-600 hover:bg-primary-50">
              Ir al examen
            </Link>
          </div>
        </div>
      )}

      {estadoExamen?.examenAprobado && !estadoCertificado?.certificado?.firmado && (
        <div className="mt-8 card bg-gradient-to-r from-green-500 to-green-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold">¡Has aprobado el examen!</h3>
              <p className="text-green-100">Firma y descarga tu certificado oficial</p>
            </div>
            <Link to="/certificado" className="btn bg-white text-green-600 hover:bg-green-50">
              Obtener certificado
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
