import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import toast from 'react-hot-toast';

export default function AdminPreguntas() {
  const [preguntas, setPreguntas] = useState([]);
  const [modulos, setModulos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroModulo, setFiltroModulo] = useState('');
  const [modalAbierto, setModalAbierto] = useState(false);
  const [preguntaEditando, setPreguntaEditando] = useState(null);
  const [formData, setFormData] = useState({
    enunciado: '',
    opciones: ['', '', '', ''],
    respuestaCorrecta: 0,
    explicacion: '',
    moduloId: '',
    activa: true
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  useEffect(() => {
    cargarPreguntas();
  }, [filtroModulo]);

  const cargarDatos = async () => {
    try {
      const [preguntasRes, modulosRes] = await Promise.all([
        adminAPI.preguntas.listar(),
        adminAPI.modulos.listar()
      ]);
      setPreguntas(preguntasRes.data.preguntas);
      setModulos(modulosRes.data.modulos);
    } catch (error) {
      toast.error('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const cargarPreguntas = async () => {
    try {
      const response = await adminAPI.preguntas.listar({ moduloId: filtroModulo || undefined });
      setPreguntas(response.data.preguntas);
    } catch (error) {
      toast.error('Error al cargar las preguntas');
    }
  };

  const abrirModal = (pregunta = null) => {
    if (pregunta) {
      setPreguntaEditando(pregunta);
      setFormData({
        enunciado: pregunta.enunciado,
        opciones: pregunta.opciones,
        respuestaCorrecta: pregunta.respuestaCorrecta,
        explicacion: pregunta.explicacion || '',
        moduloId: pregunta.moduloId,
        activa: pregunta.activa
      });
    } else {
      setPreguntaEditando(null);
      setFormData({
        enunciado: '',
        opciones: ['', '', '', ''],
        respuestaCorrecta: 0,
        explicacion: '',
        moduloId: modulos[0]?.id || '',
        activa: true
      });
    }
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setPreguntaEditando(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleOpcionChange = (index, value) => {
    const nuevasOpciones = [...formData.opciones];
    nuevasOpciones[index] = value;
    setFormData(prev => ({ ...prev, opciones: nuevasOpciones }));
  };

  const guardarPregunta = async (e) => {
    e.preventDefault();

    // Validar que todas las opciones esten llenas
    if (formData.opciones.some(op => !op.trim())) {
      toast.error('Todas las opciones deben estar completas');
      return;
    }

    try {
      const datos = {
        ...formData,
        respuestaCorrecta: parseInt(formData.respuestaCorrecta)
      };

      if (preguntaEditando) {
        await adminAPI.preguntas.actualizar(preguntaEditando.id, datos);
        toast.success('Pregunta actualizada correctamente');
      } else {
        await adminAPI.preguntas.crear(datos);
        toast.success('Pregunta creada correctamente');
      }
      cerrarModal();
      cargarPreguntas();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al guardar la pregunta');
    }
  };

  const eliminarPregunta = async (id) => {
    if (!confirm('¿Estas seguro de eliminar esta pregunta?')) return;

    try {
      await adminAPI.preguntas.eliminar(id);
      toast.success('Pregunta eliminada correctamente');
      cargarPreguntas();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al eliminar la pregunta');
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
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Banco de Preguntas</h1>
          <p className="text-gray-600">Gestiona las preguntas del examen de certificacion</p>
        </div>
        <button onClick={() => abrirModal()} className="btn btn-primary">
          + Nueva pregunta
        </button>
      </div>

      {/* Filtro por modulo */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">Filtrar por modulo:</span>
          <select
            value={filtroModulo}
            onChange={(e) => setFiltroModulo(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          >
            <option value="">Todos los modulos</option>
            {modulos.map((modulo) => (
              <option key={modulo.id} value={modulo.id}>
                {modulo.orden}. {modulo.titulo}
              </option>
            ))}
          </select>
          <span className="text-sm text-gray-500 ml-auto">
            {preguntas.length} preguntas
          </span>
        </div>
      </div>

      {/* Lista de preguntas */}
      <div className="space-y-4">
        {preguntas.map((pregunta, idx) => (
          <div
            key={pregunta.id}
            className={`bg-white rounded-lg shadow p-6 ${!pregunta.activa && 'opacity-60'}`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                    Modulo {pregunta.modulo?.orden}
                  </span>
                  {!pregunta.activa && (
                    <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded">
                      Inactiva
                    </span>
                  )}
                </div>
                <p className="font-medium text-gray-900 mb-3">{pregunta.enunciado}</p>
                <div className="grid grid-cols-2 gap-2">
                  {pregunta.opciones.map((opcion, opIdx) => (
                    <div
                      key={opIdx}
                      className={`text-sm p-2 rounded ${
                        opIdx === pregunta.respuestaCorrecta
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-50 text-gray-600'
                      }`}
                    >
                      <span className="font-medium mr-1">{String.fromCharCode(65 + opIdx)}.</span>
                      {opcion}
                      {opIdx === pregunta.respuestaCorrecta && (
                        <span className="ml-2 text-green-600">✓</span>
                      )}
                    </div>
                  ))}
                </div>
                {pregunta.explicacion && (
                  <p className="mt-3 text-sm text-gray-500 italic">
                    Explicacion: {pregunta.explicacion}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => abrirModal(pregunta)}
                  className="px-3 py-1 text-sm text-primary-600 hover:bg-primary-50 rounded"
                >
                  Editar
                </button>
                <button
                  onClick={() => eliminarPregunta(pregunta.id)}
                  className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}

        {preguntas.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500">No hay preguntas en este modulo</p>
            <button
              onClick={() => abrirModal()}
              className="mt-4 text-primary-600 hover:text-primary-700"
            >
              Crear la primera pregunta
            </button>
          </div>
        )}
      </div>

      {/* Modal de edicion */}
      {modalAbierto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                {preguntaEditando ? 'Editar pregunta' : 'Nueva pregunta'}
              </h3>
              <button onClick={cerrarModal} className="text-gray-400 hover:text-gray-600">
                ✕
              </button>
            </div>
            <form onSubmit={guardarPregunta} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Modulo
                </label>
                <select
                  name="moduloId"
                  value={formData.moduloId}
                  onChange={handleChange}
                  required
                  className="input-field"
                >
                  <option value="">Selecciona un modulo</option>
                  {modulos.map((modulo) => (
                    <option key={modulo.id} value={modulo.id}>
                      {modulo.orden}. {modulo.titulo}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Enunciado de la pregunta
                </label>
                <textarea
                  name="enunciado"
                  value={formData.enunciado}
                  onChange={handleChange}
                  required
                  rows={3}
                  className="input-field"
                  placeholder="Escribe el enunciado de la pregunta..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Opciones de respuesta
                </label>
                <div className="space-y-3">
                  {formData.opciones.map((opcion, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="respuestaCorrecta"
                        value={idx}
                        checked={parseInt(formData.respuestaCorrecta) === idx}
                        onChange={handleChange}
                        className="text-primary-600 focus:ring-primary-500"
                      />
                      <span className="font-medium text-gray-700 w-6">
                        {String.fromCharCode(65 + idx)}.
                      </span>
                      <input
                        type="text"
                        value={opcion}
                        onChange={(e) => handleOpcionChange(idx, e.target.value)}
                        required
                        className="input-field flex-1"
                        placeholder={`Opcion ${String.fromCharCode(65 + idx)}`}
                      />
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Selecciona el circulo de la opcion correcta
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Explicacion (opcional)
                </label>
                <textarea
                  name="explicacion"
                  value={formData.explicacion}
                  onChange={handleChange}
                  rows={2}
                  className="input-field"
                  placeholder="Explicacion que se mostrara al usuario despues del examen..."
                />
              </div>

              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="activa"
                    checked={formData.activa}
                    onChange={handleChange}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700">Pregunta activa</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button type="button" onClick={cerrarModal} className="btn btn-secondary">
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  {preguntaEditando ? 'Guardar cambios' : 'Crear pregunta'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
