import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import toast from 'react-hot-toast';

export default function AdminModulos() {
  const [modulos, setModulos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [moduloEditando, setModuloEditando] = useState(null);
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    contenido: '',
    duracionMin: 10,
    orden: 1,
    activo: true,
    videoUrl: ''
  });

  useEffect(() => {
    cargarModulos();
  }, []);

  const cargarModulos = async () => {
    try {
      const response = await adminAPI.modulos.listar();
      setModulos(response.data.modulos);
    } catch (error) {
      toast.error('Error al cargar los modulos');
    } finally {
      setLoading(false);
    }
  };

  const abrirModal = (modulo = null) => {
    if (modulo) {
      setModuloEditando(modulo);
      setFormData({
        titulo: modulo.titulo,
        descripcion: modulo.descripcion,
        contenido: modulo.contenido,
        duracionMin: modulo.duracionMin,
        orden: modulo.orden,
        activo: modulo.activo,
        videoUrl: modulo.videoUrl || ''
      });
    } else {
      setModuloEditando(null);
      setFormData({
        titulo: '',
        descripcion: '',
        contenido: '',
        duracionMin: 10,
        orden: modulos.length + 1,
        activo: true,
        videoUrl: ''
      });
    }
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setModuloEditando(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const guardarModulo = async (e) => {
    e.preventDefault();

    try {
      if (moduloEditando) {
        await adminAPI.modulos.actualizar(moduloEditando.id, formData);
        toast.success('Modulo actualizado correctamente');
      } else {
        await adminAPI.modulos.crear(formData);
        toast.success('Modulo creado correctamente');
      }
      cerrarModal();
      cargarModulos();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al guardar el modulo');
    }
  };

  const eliminarModulo = async (id) => {
    if (!confirm('¿Estas seguro de eliminar este modulo?')) return;

    try {
      await adminAPI.modulos.eliminar(id);
      toast.success('Modulo eliminado correctamente');
      cargarModulos();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al eliminar el modulo');
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
          <h1 className="text-2xl font-bold text-gray-900">Modulos de Formacion</h1>
          <p className="text-gray-600">Administra el contenido de los modulos de formacion</p>
        </div>
        <button
          onClick={() => abrirModal()}
          className="btn btn-primary"
        >
          + Nuevo modulo
        </button>
      </div>

      {/* Lista de modulos */}
      <div className="space-y-4">
        {modulos.map((modulo) => (
          <div
            key={modulo.id}
            className={`bg-white rounded-lg shadow p-6 ${!modulo.activo && 'opacity-60'}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-bold text-sm">
                    {modulo.orden}
                  </span>
                  <h3 className="text-lg font-semibold text-gray-900">{modulo.titulo}</h3>
                  {!modulo.activo && (
                    <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                      Inactivo
                    </span>
                  )}
                </div>
                <p className="text-gray-600 text-sm mb-3">{modulo.descripcion}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>⏱️ {modulo.duracionMin} minutos</span>
                  <span>📝 {modulo._count?.preguntas || 0} preguntas asociadas</span>
                  <span>👥 {modulo._count?.progresos || 0} usuarios</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => abrirModal(modulo)}
                  className="px-3 py-1 text-sm text-primary-600 hover:bg-primary-50 rounded"
                >
                  Editar
                </button>
                <button
                  onClick={() => eliminarModulo(modulo.id)}
                  className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}

        {modulos.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500">No hay modulos creados aun</p>
            <button
              onClick={() => abrirModal()}
              className="mt-4 text-primary-600 hover:text-primary-700"
            >
              Crear el primer modulo
            </button>
          </div>
        )}
      </div>

      {/* Modal de edicion */}
      {modalAbierto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                {moduloEditando ? 'Editar modulo' : 'Nuevo modulo'}
              </h3>
              <button onClick={cerrarModal} className="text-gray-400 hover:text-gray-600">
                ✕
              </button>
            </div>
            <form onSubmit={guardarModulo} className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Titulo
                  </label>
                  <input
                    type="text"
                    name="titulo"
                    value={formData.titulo}
                    onChange={handleChange}
                    required
                    className="input-field"
                    placeholder="Titulo del modulo"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descripcion
                  </label>
                  <input
                    type="text"
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleChange}
                    required
                    className="input-field"
                    placeholder="Breve descripcion del modulo"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duracion (minutos)
                  </label>
                  <input
                    type="number"
                    name="duracionMin"
                    value={formData.duracionMin}
                    onChange={handleChange}
                    required
                    min="1"
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Orden
                  </label>
                  <input
                    type="number"
                    name="orden"
                    value={formData.orden}
                    onChange={handleChange}
                    required
                    min="1"
                    className="input-field"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    URL del video (opcional)
                  </label>
                  <input
                    type="url"
                    name="videoUrl"
                    value={formData.videoUrl}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="https://youtube.com/embed/..."
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contenido (HTML)
                  </label>
                  <textarea
                    name="contenido"
                    value={formData.contenido}
                    onChange={handleChange}
                    required
                    rows={10}
                    className="input-field font-mono text-sm"
                    placeholder="<h2>Titulo de seccion</h2><p>Contenido del modulo...</p>"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Puedes usar etiquetas HTML para dar formato al contenido
                  </p>
                </div>

                <div className="col-span-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="activo"
                      checked={formData.activo}
                      onChange={handleChange}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700">Modulo activo</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={cerrarModal}
                  className="btn btn-secondary"
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  {moduloEditando ? 'Guardar cambios' : 'Crear modulo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
