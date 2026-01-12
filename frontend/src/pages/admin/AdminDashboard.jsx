import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../../services/api';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const [estadisticas, setEstadisticas] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarEstadisticas();
  }, []);

  const cargarEstadisticas = async () => {
    try {
      const response = await adminAPI.estadisticas();
      setEstadisticas(response.data);
    } catch (error) {
      toast.error('Error al cargar las estadisticas');
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

  const { usuarios, examenes, certificados } = estadisticas || {};

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Resumen del sistema de gestion de residuos</p>
      </div>

      {/* Estadisticas principales */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">👥</span>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Total usuarios</p>
              <p className="text-2xl font-bold text-gray-900">{usuarios?.total || 0}</p>
            </div>
          </div>
          <div className="mt-4 text-sm">
            <span className="text-green-600">{usuarios?.verificados || 0} verificados</span>
            <span className="text-gray-400 mx-2">|</span>
            <span className="text-yellow-600">{usuarios?.pendientes || 0} pendientes</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">📝</span>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Examenes realizados</p>
              <p className="text-2xl font-bold text-gray-900">{examenes?.total || 0}</p>
            </div>
          </div>
          <div className="mt-4 text-sm">
            <span className="text-green-600">{examenes?.aprobados || 0} aprobados</span>
            <span className="text-gray-400 mx-2">|</span>
            <span className="text-red-600">{examenes?.suspensos || 0} suspensos</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">🎓</span>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Certificados</p>
              <p className="text-2xl font-bold text-gray-900">{certificados?.total || 0}</p>
            </div>
          </div>
          <div className="mt-4 text-sm">
            <span className="text-green-600">{certificados?.firmados || 0} firmados</span>
            <span className="text-gray-400 mx-2">|</span>
            <span className="text-yellow-600">{certificados?.pendientes || 0} pendientes</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">📊</span>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Tasa de aprobados</p>
              <p className="text-2xl font-bold text-gray-900">
                {examenes?.total > 0
                  ? Math.round((examenes?.aprobados / examenes?.total) * 100)
                  : 0}%
              </p>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-500">
            De todos los examenes finalizados
          </div>
        </div>
      </div>

      {/* Accesos rapidos */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Link
          to="/admin/usuarios"
          className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Gestion de Usuarios</h3>
          <p className="text-gray-600 text-sm mb-4">
            Ver y gestionar los usuarios registrados en la plataforma
          </p>
          <span className="text-primary-600 text-sm font-medium">
            Ver usuarios →
          </span>
        </Link>

        <Link
          to="/admin/modulos"
          className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Modulos de Formacion</h3>
          <p className="text-gray-600 text-sm mb-4">
            Administrar los modulos y contenidos de formacion
          </p>
          <span className="text-primary-600 text-sm font-medium">
            Ver modulos →
          </span>
        </Link>

        <Link
          to="/admin/preguntas"
          className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Banco de Preguntas</h3>
          <p className="text-gray-600 text-sm mb-4">
            Gestionar las preguntas del examen de certificacion
          </p>
          <span className="text-primary-600 text-sm font-medium">
            Ver preguntas →
          </span>
        </Link>
      </div>

      {/* Actividad reciente */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Usuarios recientes</h2>
        </div>
        <div className="p-6">
          {usuarios?.recientes?.length > 0 ? (
            <div className="space-y-4">
              {usuarios.recientes.map((usuario) => (
                <div
                  key={usuario.id}
                  className="flex items-center justify-between py-3 border-b last:border-0"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-gray-600 font-medium">
                        {usuario.nombre?.charAt(0)}{usuario.apellidos?.charAt(0)}
                      </span>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">
                        {usuario.nombre} {usuario.apellidos}
                      </p>
                      <p className="text-sm text-gray-500">{usuario.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                      usuario.emailVerificado
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {usuario.emailVerificado ? 'Verificado' : 'Pendiente'}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(usuario.fechaRegistro).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              No hay usuarios registrados aun
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
