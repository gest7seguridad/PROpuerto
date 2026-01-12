import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { examenAPI } from '../services/api';
import toast from 'react-hot-toast';

export default function ResultadoExamen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [resultado, setResultado] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mostrarDetalle, setMostrarDetalle] = useState(false);

  useEffect(() => {
    cargarResultado();
  }, [id]);

  const cargarResultado = async () => {
    try {
      const response = await examenAPI.resultado(id);
      setResultado(response.data);
    } catch (error) {
      toast.error('Error al cargar el resultado');
      navigate('/examen');
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

  if (!resultado) return null;

  const { examen, resultado: res, detalle } = resultado;
  const aprobado = res.aprobado;

  return (
    <div className="max-w-3xl mx-auto animate-fadeIn">
      {/* Resultado principal */}
      <div className={`card text-center mb-6 ${aprobado ? 'bg-green-50' : 'bg-red-50'}`}>
        <div className="text-6xl mb-4">
          {aprobado ? '🎉' : '😔'}
        </div>
        <h2 className={`text-2xl font-bold mb-2 ${aprobado ? 'text-green-800' : 'text-red-800'}`}>
          {aprobado ? '¡Felicidades! Has aprobado' : 'No has superado el examen'}
        </h2>
        <p className={`text-lg ${aprobado ? 'text-green-600' : 'text-red-600'}`}>
          Tu calificación: <span className="font-bold">{res.puntuacion?.toFixed(1)}%</span>
        </p>
        <p className="text-gray-500 mt-2">
          Nota mínima: {res.notaMinAprobado}% | Respuestas correctas: {res.correctas}/{res.totalPreguntas}
        </p>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="card text-center">
          <p className="text-3xl font-bold text-green-600">{res.correctas}</p>
          <p className="text-sm text-gray-500">Correctas</p>
        </div>
        <div className="card text-center">
          <p className="text-3xl font-bold text-red-600">{res.totalPreguntas - res.correctas}</p>
          <p className="text-sm text-gray-500">Incorrectas</p>
        </div>
        <div className="card text-center">
          <p className="text-3xl font-bold text-primary-600">{res.puntuacion?.toFixed(0)}%</p>
          <p className="text-sm text-gray-500">Puntuación</p>
        </div>
      </div>

      {/* Acciones */}
      <div className="card mb-6">
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          {aprobado ? (
            <button
              onClick={() => navigate('/certificado')}
              className="btn btn-primary px-8 py-3"
            >
              Obtener certificado 🎓
            </button>
          ) : (
            <button
              onClick={() => navigate('/examen')}
              className="btn btn-primary px-8 py-3"
            >
              Intentar de nuevo
            </button>
          )}
          <button
            onClick={() => setMostrarDetalle(!mostrarDetalle)}
            className="btn btn-secondary px-8 py-3"
          >
            {mostrarDetalle ? 'Ocultar respuestas' : 'Ver respuestas'}
          </button>
        </div>
      </div>

      {/* Detalle de respuestas */}
      {mostrarDetalle && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Revisión de respuestas</h3>
          {detalle.map((pregunta, idx) => (
            <div
              key={pregunta.preguntaId}
              className={`card border-l-4 ${
                pregunta.esCorrecta ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <span className="text-sm text-gray-500">Pregunta {idx + 1}</span>
                  <h4 className="font-medium text-gray-900">{pregunta.enunciado}</h4>
                </div>
                <span className="text-2xl ml-4">
                  {pregunta.esCorrecta ? '✅' : '❌'}
                </span>
              </div>

              <div className="space-y-2">
                {pregunta.opciones.map((opcion, opIdx) => {
                  const esCorrecta = opIdx === pregunta.respuestaCorrecta;
                  const esSeleccionada = opIdx === pregunta.respuestaUsuario;

                  return (
                    <div
                      key={opIdx}
                      className={`p-3 rounded-lg text-sm ${
                        esCorrecta
                          ? 'bg-green-100 text-green-800 border border-green-300'
                          : esSeleccionada && !esCorrecta
                            ? 'bg-red-100 text-red-800 border border-red-300'
                            : 'bg-white text-gray-600'
                      }`}
                    >
                      <span className="font-medium mr-2">{String.fromCharCode(65 + opIdx)}.</span>
                      {opcion}
                      {esCorrecta && <span className="ml-2 text-green-600">✓ Correcta</span>}
                      {esSeleccionada && !esCorrecta && <span className="ml-2 text-red-600">✗ Tu respuesta</span>}
                    </div>
                  );
                })}
              </div>

              {pregunta.explicacion && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Explicación:</strong> {pregunta.explicacion}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
