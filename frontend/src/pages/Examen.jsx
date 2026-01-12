import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { examenAPI } from '../services/api';
import toast from 'react-hot-toast';

export default function Examen() {
  const navigate = useNavigate();
  const [estado, setEstado] = useState(null);
  const [examen, setExamen] = useState(null);
  const [preguntas, setPreguntas] = useState([]);
  const [preguntaActual, setPreguntaActual] = useState(0);
  const [respuestas, setRespuestas] = useState({});
  const [tiempoRestante, setTiempoRestante] = useState(0);
  const [loading, setLoading] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    cargarEstado();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (examen && tiempoRestante > 0) {
      timerRef.current = setInterval(() => {
        setTiempoRestante(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            finalizarExamen();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [examen]);

  const cargarEstado = async () => {
    try {
      const response = await examenAPI.estado();
      setEstado(response.data);

      // Si hay examen en curso, cargarlo
      if (response.data.examenEnCurso) {
        await cargarExamen(response.data.examenEnCurso.id);
      }
    } catch (error) {
      toast.error('Error al cargar el estado del examen');
    } finally {
      setLoading(false);
    }
  };

  const cargarExamen = async (examenId) => {
    try {
      const response = await examenAPI.obtener(examenId);

      if (response.data.resultado) {
        // El examen ya finalizó
        navigate(`/examen/${examenId}/resultado`);
        return;
      }

      setExamen(response.data.examen);
      setPreguntas(response.data.preguntas);
      setRespuestas(response.data.examen.respuestas || {});
      setTiempoRestante(Math.floor(response.data.examen.tiempoRestante));
    } catch (error) {
      toast.error('Error al cargar el examen');
    }
  };

  const iniciarExamen = async () => {
    setLoading(true);
    try {
      const response = await examenAPI.iniciar();
      toast.success('¡Examen iniciado! Tienes 30 minutos.');
      await cargarExamen(response.data.examen.id);
    } catch (error) {
      const mensaje = error.response?.data?.message || 'Error al iniciar el examen';
      toast.error(mensaje);
    } finally {
      setLoading(false);
    }
  };

  const seleccionarRespuesta = async (preguntaId, respuesta) => {
    setRespuestas(prev => ({ ...prev, [preguntaId]: respuesta }));

    try {
      await examenAPI.guardarRespuesta(examen.id, preguntaId, respuesta);
    } catch (error) {
      console.error('Error guardando respuesta:', error);
    }
  };

  const finalizarExamen = async () => {
    if (timerRef.current) clearInterval(timerRef.current);

    setEnviando(true);
    try {
      await examenAPI.finalizar(examen.id);
      navigate(`/examen/${examen.id}/resultado`);
    } catch (error) {
      toast.error('Error al finalizar el examen');
    } finally {
      setEnviando(false);
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

  // Si ya aprobó
  if (estado?.examenAprobado) {
    return (
      <div className="max-w-2xl mx-auto animate-fadeIn">
        <div className="card text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Ya has aprobado!</h2>
          <p className="text-gray-600 mb-4">
            Obtuviste una calificación del {estado.examenAprobado.puntuacion?.toFixed(1)}%
          </p>
          <button
            onClick={() => navigate('/certificado')}
            className="btn btn-primary"
          >
            Obtener certificado
          </button>
        </div>
      </div>
    );
  }

  // Si no puede hacer examen
  if (!estado?.formacionCompletada) {
    return (
      <div className="max-w-2xl mx-auto animate-fadeIn">
        <div className="card text-center">
          <div className="text-6xl mb-4">📚</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Completa la formación primero</h2>
          <p className="text-gray-600 mb-4">
            Debes completar todos los módulos de formación antes de realizar el examen.
          </p>
          <p className="text-sm text-gray-500 mb-4">
            Progreso: {estado?.modulosCompletados}/{estado?.totalModulos} módulos
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="btn btn-primary"
          >
            Continuar formación
          </button>
        </div>
      </div>
    );
  }

  // Sin intentos
  if (estado?.intentos?.restantes <= 0 && !estado?.examenEnCurso) {
    return (
      <div className="max-w-2xl mx-auto animate-fadeIn">
        <div className="card text-center">
          <div className="text-6xl mb-4">😔</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Sin intentos disponibles</h2>
          <p className="text-gray-600">
            Has agotado los {estado?.configuracion?.maxIntentos} intentos permitidos.
          </p>
        </div>
      </div>
    );
  }

  // Pantalla de inicio del examen
  if (!examen) {
    return (
      <div className="max-w-2xl mx-auto animate-fadeIn">
        <div className="card">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">📝</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Examen de Gestión de Residuos</h2>
            <p className="text-gray-600">
              Demuestra tus conocimientos sobre la correcta gestión de residuos
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">Información del examen:</h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center">
                <span className="mr-2">📋</span>
                {estado?.configuracion?.numPreguntas} preguntas tipo test
              </li>
              <li className="flex items-center">
                <span className="mr-2">⏱️</span>
                {estado?.configuracion?.tiempoLimiteMin} minutos de tiempo límite
              </li>
              <li className="flex items-center">
                <span className="mr-2">✅</span>
                Nota mínima para aprobar: {estado?.configuracion?.notaMinAprobado}%
              </li>
              <li className="flex items-center">
                <span className="mr-2">🔄</span>
                Intentos disponibles: {estado?.intentos?.restantes}
              </li>
            </ul>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <p className="text-sm text-yellow-700">
              <strong>Importante:</strong> Una vez iniciado el examen, no podrás pausarlo.
              Las respuestas se guardan automáticamente.
            </p>
          </div>

          <button
            onClick={iniciarExamen}
            className="w-full btn btn-primary py-3 text-lg"
          >
            Comenzar examen
          </button>
        </div>
      </div>
    );
  }

  // Examen en curso
  const pregunta = preguntas[preguntaActual];
  const respuestasContestadas = Object.keys(respuestas).length;

  return (
    <div className="max-w-3xl mx-auto animate-fadeIn">
      {/* Header del examen */}
      <div className="card mb-6">
        <div className="flex justify-between items-center">
          <div>
            <span className="text-sm text-gray-500">Pregunta</span>
            <span className="ml-2 font-bold text-gray-900">
              {preguntaActual + 1} / {preguntas.length}
            </span>
          </div>
          <div className={`text-lg font-bold ${tiempoRestante < 300 ? 'text-red-600' : 'text-gray-900'}`}>
            ⏱️ {formatearTiempo(tiempoRestante)}
          </div>
        </div>

        {/* Indicadores de preguntas */}
        <div className="flex flex-wrap gap-2 mt-4">
          {preguntas.map((p, idx) => (
            <button
              key={p.id}
              onClick={() => setPreguntaActual(idx)}
              className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                idx === preguntaActual
                  ? 'bg-primary-600 text-white'
                  : respuestas[p.id] !== undefined
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Pregunta */}
      <div className="card mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          {pregunta.enunciado}
        </h3>

        <div className="space-y-3">
          {pregunta.opciones.map((opcion, idx) => (
            <button
              key={idx}
              onClick={() => seleccionarRespuesta(pregunta.id, idx)}
              className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                respuestas[pregunta.id] === idx
                  ? 'border-primary-600 bg-primary-50 text-primary-900'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full mr-3 text-sm font-medium ${
                respuestas[pregunta.id] === idx
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {String.fromCharCode(65 + idx)}
              </span>
              {opcion}
            </button>
          ))}
        </div>
      </div>

      {/* Navegación */}
      <div className="flex justify-between">
        <button
          onClick={() => setPreguntaActual(Math.max(0, preguntaActual - 1))}
          disabled={preguntaActual === 0}
          className="btn btn-secondary"
        >
          ← Anterior
        </button>

        {preguntaActual < preguntas.length - 1 ? (
          <button
            onClick={() => setPreguntaActual(preguntaActual + 1)}
            className="btn btn-primary"
          >
            Siguiente →
          </button>
        ) : (
          <button
            onClick={finalizarExamen}
            disabled={enviando}
            className="btn btn-success"
          >
            {enviando ? 'Enviando...' : `Finalizar (${respuestasContestadas}/${preguntas.length})`}
          </button>
        )}
      </div>
    </div>
  );
}
