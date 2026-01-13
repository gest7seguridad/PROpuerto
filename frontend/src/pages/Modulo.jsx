import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { modulosAPI, examenAPI } from '../services/api';
import toast from 'react-hot-toast';

const TIEMPO_MINIMO_NAVEGACION = 180; // 3 minutos para poder pasar al siguiente

export default function Modulo() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [modulo, setModulo] = useState(null);
  const [progreso, setProgreso] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completando, setCompletando] = useState(false);
  const [examenRealizado, setExamenRealizado] = useState(false);
  const [tiempoActual, setTiempoActual] = useState(0);
  const timerRef = useRef(null);
  const tiempoInicioRef = useRef(Date.now());

  useEffect(() => {
    cargarModulo();
    verificarExamen();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [id]);

  useEffect(() => {
    if (modulo && progreso && !progreso.completado) {
      // Actualizar tiempo cada segundo para UI y progreso cada 30 segundos al servidor
      timerRef.current = setInterval(() => {
        const tiempoTranscurrido = Math.floor((Date.now() - tiempoInicioRef.current) / 1000);
        setTiempoActual(progreso.tiempoAcumulado + tiempoTranscurrido);

        // Guardar en servidor cada 30 segundos
        if (tiempoTranscurrido > 0 && tiempoTranscurrido % 30 === 0) {
          const nuevoTiempo = progreso.tiempoAcumulado + tiempoTranscurrido;
          actualizarProgreso(nuevoTiempo);
        }
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [modulo, progreso]);

  const verificarExamen = async () => {
    try {
      const response = await examenAPI.estado();
      // Si tiene intentos o ha aprobado, el examen ya fue realizado
      setExamenRealizado(response.data.intentosRealizados > 0 || response.data.aprobado);
    } catch (error) {
      console.error('Error verificando estado del examen:', error);
    }
  };

  const cargarModulo = async () => {
    try {
      const response = await modulosAPI.obtener(id);
      setModulo(response.data.modulo);
      setProgreso(response.data.progreso);
      setTiempoActual(response.data.progreso.tiempoAcumulado || 0);
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

  const irAlSiguienteModulo = async () => {
    // Guardar progreso y completar módulo actual antes de ir al siguiente
    const tiempoTranscurrido = Math.floor((Date.now() - tiempoInicioRef.current) / 1000);
    const tiempoTotal = progreso.tiempoAcumulado + tiempoTranscurrido;

    setCompletando(true);
    try {
      await modulosAPI.actualizarProgreso(id, tiempoTotal);
      await modulosAPI.completar(id);

      const siguienteId = parseInt(id) + 1;
      navigate(`/modulo/${siguienteId}`);
    } catch (error) {
      const mensaje = error.response?.data?.message || 'Error al avanzar';
      toast.error(mensaje);
    } finally {
      setCompletando(false);
    }
  };

  const irAlModuloAnterior = () => {
    const anteriorId = parseInt(id) - 1;
    if (anteriorId >= 1) {
      navigate(`/modulo/${anteriorId}`);
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

  const tiempoRequerido = modulo.duracionMin * 60;
  const puedeNavegar = tiempoActual >= TIEMPO_MINIMO_NAVEGACION || progreso.completado;
  const puedeCompletar = tiempoActual >= tiempoRequerido || progreso.completado;
  const tiempoRestanteNavegar = Math.max(0, TIEMPO_MINIMO_NAVEGACION - tiempoActual);
  const esUltimoModulo = modulo.orden === 5; // Total de 5 módulos
  const esPrimerModulo = modulo.orden === 1;

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
              <p className="text-sm text-gray-500">
                {puedeNavegar ? 'Tiempo en módulo' : 'Tiempo para avanzar'}
              </p>
              <p className="text-lg font-semibold text-gray-900">
                {puedeNavegar
                  ? formatearTiempo(tiempoActual)
                  : formatearTiempo(tiempoRestanteNavegar)}
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
            Debes visualizar el contenido durante al menos 3 minutos para poder avanzar al siguiente módulo
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

      {/* Botones de navegación */}
      <div className="flex justify-between items-center">
        {/* Botón Anterior */}
        <div>
          {!esPrimerModulo && !examenRealizado && (
            <button
              onClick={irAlModuloAnterior}
              className="btn bg-gray-200 text-gray-700 hover:bg-gray-300 px-6 py-3"
            >
              ← Anterior
            </button>
          )}
        </div>

        {/* Botón Siguiente/Completar */}
        <div>
          {progreso.completado ? (
            <div className="flex items-center gap-4">
              <span className="flex items-center text-green-600">
                <span className="text-2xl mr-2">✓</span>
                <span className="font-medium">Módulo completado</span>
              </span>
              {!esUltimoModulo && (
                <button
                  onClick={() => navigate(`/modulo/${parseInt(id) + 1}`)}
                  className="btn btn-primary px-6 py-3"
                >
                  Siguiente →
                </button>
              )}
              {esUltimoModulo && (
                <button
                  onClick={() => navigate('/examen')}
                  className="btn btn-primary px-6 py-3"
                >
                  Ir al examen →
                </button>
              )}
            </div>
          ) : esUltimoModulo ? (
            <button
              onClick={completarModulo}
              disabled={!puedeNavegar || completando}
              className="btn btn-primary px-8 py-3"
            >
              {completando ? 'Completando...' :
               puedeNavegar ? 'Completar formación' : `Espera ${formatearTiempo(tiempoRestanteNavegar)}`}
            </button>
          ) : (
            <button
              onClick={irAlSiguienteModulo}
              disabled={!puedeNavegar || completando}
              className="btn btn-primary px-8 py-3"
            >
              {completando ? 'Avanzando...' :
               puedeNavegar ? 'Siguiente →' : `Espera ${formatearTiempo(tiempoRestanteNavegar)}`}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
