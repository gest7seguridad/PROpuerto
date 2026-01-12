import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { modulosAPI } from '../services/api';
import toast from 'react-hot-toast';

export default function Modulo() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [modulo, setModulo] = useState(null);
  const [progreso, setProgreso] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completando, setCompletando] = useState(false);
  const timerRef = useRef(null);
  const tiempoInicioRef = useRef(Date.now());

  useEffect(() => {
    cargarModulo();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [id]);

  useEffect(() => {
    if (modulo && progreso && !progreso.completado) {
      // Actualizar progreso cada 30 segundos
      timerRef.current = setInterval(() => {
        const tiempoTranscurrido = Math.floor((Date.now() - tiempoInicioRef.current) / 1000);
        const nuevoTiempo = progreso.tiempoAcumulado + tiempoTranscurrido;
        actualizarProgreso(nuevoTiempo);
      }, 30000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [modulo, progreso]);

  const cargarModulo = async () => {
    try {
      const response = await modulosAPI.obtener(id);
      setModulo(response.data.modulo);
      setProgreso(response.data.progreso);
      tiempoInicioRef.current = Date.now();
    } catch (error) {
      const mensaje = error.response?.data?.message || 'Error al cargar el módulo';
      toast.error(mensaje);
      if (error.response?.status === 403) {
        navigate('/dashboard');
      }
    } finally {
      setLoading(false);
    }
  };

  const actualizarProgreso = async (tiempo) => {
    try {
      const response = await modulosAPI.actualizarProgreso(id, tiempo);
      setProgreso(prev => ({
        ...prev,
        tiempoAcumulado: tiempo,
        tiempoRestante: response.data.progreso.tiempoRestante,
        porcentaje: response.data.progreso.porcentaje,
        puedeCompletar: response.data.progreso.puedeCompletar
      }));
    } catch (error) {
      console.error('Error actualizando progreso:', error);
    }
  };

  const completarModulo = async () => {
    // Guardar progreso antes de completar
    const tiempoTranscurrido = Math.floor((Date.now() - tiempoInicioRef.current) / 1000);
    const tiempoTotal = progreso.tiempoAcumulado + tiempoTranscurrido;

    setCompletando(true);
    try {
      await modulosAPI.actualizarProgreso(id, tiempoTotal);
      const response = await modulosAPI.completar(id);
      toast.success('¡Módulo completado!');

      if (response.data.estadisticas?.puedeHacerExamen) {
        toast.success('Has completado todos los módulos. ¡Ya puedes hacer el examen!');
      }

      navigate('/dashboard');
    } catch (error) {
      const mensaje = error.response?.data?.message || 'Error al completar el módulo';
      toast.error(mensaje);
    } finally {
      setCompletando(false);
    }
  };

  const formatearTiempo = (segundos) => {
    const mins = Math.floor(segundos / 60);
    const secs = segundos % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!modulo) return null;

  const tiempoTranscurridoActual = Math.floor((Date.now() - tiempoInicioRef.current) / 1000);
  const tiempoTotalAcumulado = progreso.tiempoAcumulado + tiempoTranscurridoActual;
  const tiempoRequerido = modulo.duracionMin * 60;
  const puedeCompletar = tiempoTotalAcumulado >= tiempoRequerido || progreso.completado;

  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/dashboard')}
          className="text-gray-500 hover:text-gray-700 mb-4 inline-flex items-center"
        >
          ← Volver al dashboard
        </button>
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-primary-600 font-medium mb-1">Módulo {modulo.orden}</p>
            <h1 className="text-2xl font-bold text-gray-900">{modulo.titulo}</h1>
          </div>
          {!progreso.completado && (
            <div className="text-right">
              <p className="text-sm text-gray-500">Tiempo restante</p>
              <p className="text-lg font-semibold text-gray-900">
                {formatearTiempo(Math.max(0, progreso.tiempoRestante))}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Barra de progreso */}
      {!progreso.completado && (
        <div className="card mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">Progreso del módulo</span>
            <span className="text-sm font-medium text-gray-900">{progreso.porcentaje}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary-600 h-2 rounded-full transition-all"
              style={{ width: `${Math.min(100, progreso.porcentaje)}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Debes visualizar el contenido durante al menos {modulo.duracionMin} minutos para completar el módulo
          </p>
        </div>
      )}

      {/* Video si existe */}
      {modulo.videoUrl && (
        <div className="card mb-6">
          <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden">
            <iframe
              src={modulo.videoUrl}
              className="w-full h-full"
              allowFullScreen
              title={modulo.titulo}
            ></iframe>
          </div>
        </div>
      )}

      {/* Contenido */}
      <div className="card mb-6">
        <div
          className="modulo-contenido"
          dangerouslySetInnerHTML={{ __html: modulo.contenido }}
        />
      </div>

      {/* Botón completar */}
      <div className="flex justify-end">
        {progreso.completado ? (
          <div className="flex items-center text-green-600">
            <span className="text-2xl mr-2">✓</span>
            <span className="font-medium">Módulo completado</span>
          </div>
        ) : (
          <button
            onClick={completarModulo}
            disabled={!puedeCompletar || completando}
            className="btn btn-primary px-8 py-3"
            title={!puedeCompletar ? 'Debes visualizar el contenido durante el tiempo mínimo requerido' : ''}
          >
            {completando ? 'Completando...' :
             puedeCompletar ? 'Completar módulo' : `Espera ${formatearTiempo(tiempoRequerido - tiempoTotalAcumulado)}`}
          </button>
        )}
      </div>
    </div>
  );
}
