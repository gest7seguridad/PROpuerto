import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import toast from 'react-hot-toast';

export default function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('todos');
  const [busqueda, setBusqueda] = useState('');
  const [paginacion, setPaginacion] = useState({ pagina: 1, total: 0, porPagina: 20 });
  const [usuarioDetalle, setUsuarioDetalle] = useState(null);

  useEffect(() => {
    cargarUsuarios();
  }, [filtro, paginacion.pagina]);

  const cargarUsuarios = async () => {
    setLoading(true);
    try {
      const response = await adminAPI.usuarios({
        pagina: paginacion.pagina,
        porPagina: paginacion.porPagina,
        filtro,
        busqueda
      });
      setUsuarios(response.data.usuarios);
      setPaginacion(prev => ({ ...prev, total: response.data.total }));
    } catch (error) {
      toast.error('Error al cargar los usuarios');
    } finally {
      setLoading(false);
    }
  };

  const buscarUsuarios = (e) => {
    e.preventDefault();
    setPaginacion(prev => ({ ...prev, pagina: 1 }));
    cargarUsuarios();
  };

  const verDetalle = async (id) => {
    try {
      const response = await adminAPI.usuario(id);
      setUsuarioDetalle(response.data);
    } catch (error) {
      toast.error('Error al cargar el detalle del usuario');
    }
  };

  const cerrarDetalle = () => {
    setUsuarioDetalle(null);
  };

  const totalPaginas = Math.ceil(paginacion.total / paginacion.porPagina);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Gestion de Usuarios</h1>
        <p className="text-gray-600">Administra los usuarios registrados en la plataforma</p>
      </div>

      {/* Filtros y busqueda */}
      <div className="bg-white rounded-lg shadow mb-6 p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex gap-2">
            {['todos', 'verificados', 'pendientes', 'conCertificado'].map((f) => (
              <button
                key={f}
                onClick={() => { setFiltro(f); setPaginacion(prev => ({ ...prev, pagina: 1 })); }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filtro === f
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {f === 'todos' && 'Todos'}
                {f === 'verificados' && 'Verificados'}
                {f === 'pendientes' && 'Pendientes'}
                {f === 'conCertificado' && 'Con certificado'}
              </button>
            ))}
          </div>

          <form onSubmit={buscarUsuarios} className="flex gap-2">
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por nombre, email o DNI..."
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
            >
              Buscar
            </button>
          </form>
        </div>
      </div>

      {/* Tabla de usuarios */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : usuarios.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No se encontraron usuarios</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Usuario
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      DNI
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Progreso
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Registro
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {usuarios.map((usuario) => (
                    <tr key={usuario.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                            <span className="text-gray-600 font-medium text-sm">
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
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {usuario.dni}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col gap-1">
                          <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                            usuario.emailVerificado
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {usuario.emailVerificado ? 'Email verificado' : 'Email pendiente'}
                          </span>
                          {usuario.certificado && (
                            <span className="inline-flex px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800">
                              Certificado
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm">
                          <p className="text-gray-900">
                            {usuario._count?.progresoModulos || 0} modulos
                          </p>
                          <p className="text-gray-500">
                            {usuario._count?.examenes || 0} examenes
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(usuario.fechaRegistro).toLocaleDateString('es-ES')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => verDetalle(usuario.id)}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          Ver detalle
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Paginacion */}
            {totalPaginas > 1 && (
              <div className="px-6 py-4 border-t flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  Mostrando {((paginacion.pagina - 1) * paginacion.porPagina) + 1} a{' '}
                  {Math.min(paginacion.pagina * paginacion.porPagina, paginacion.total)} de{' '}
                  {paginacion.total} usuarios
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPaginacion(prev => ({ ...prev, pagina: prev.pagina - 1 }))}
                    disabled={paginacion.pagina === 1}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                  >
                    Anterior
                  </button>
                  <button
                    onClick={() => setPaginacion(prev => ({ ...prev, pagina: prev.pagina + 1 }))}
                    disabled={paginacion.pagina >= totalPaginas}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                  >
                    Siguiente
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal de detalle */}
      {usuarioDetalle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Detalle del usuario</h3>
              <button
                onClick={cerrarDetalle}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <div className="p-6 space-y-6">
              {/* Info basica */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Informacion personal</h4>
                <dl className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <dt className="text-gray-500">Nombre completo</dt>
                    <dd className="font-medium">{usuarioDetalle.usuario.nombre} {usuarioDetalle.usuario.apellidos}</dd>
                  </div>
                  <div>
                    <dt className="text-gray-500">DNI/NIE</dt>
                    <dd className="font-medium">{usuarioDetalle.usuario.dni}</dd>
                  </div>
                  <div>
                    <dt className="text-gray-500">Email</dt>
                    <dd className="font-medium">{usuarioDetalle.usuario.email}</dd>
                  </div>
                  <div>
                    <dt className="text-gray-500">Telefono</dt>
                    <dd className="font-medium">{usuarioDetalle.usuario.telefono || '-'}</dd>
                  </div>
                  <div className="col-span-2">
                    <dt className="text-gray-500">Direccion</dt>
                    <dd className="font-medium">
                      {usuarioDetalle.usuario.direccion}, {usuarioDetalle.usuario.numero}
                      {usuarioDetalle.usuario.piso && `, ${usuarioDetalle.usuario.piso}`}
                      {usuarioDetalle.usuario.puerta && ` ${usuarioDetalle.usuario.puerta}`}
                      <br />
                      {usuarioDetalle.usuario.codigoPostal} {usuarioDetalle.usuario.localidad}
                    </dd>
                  </div>
                </dl>
              </div>

              {/* Progreso */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Progreso de formacion</h4>
                <div className="space-y-2">
                  {usuarioDetalle.progresos?.map((p) => (
                    <div key={p.modulo.id} className="flex items-center justify-between py-2 border-b">
                      <span className="text-sm">{p.modulo.titulo}</span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        p.completado ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {p.completado ? 'Completado' : `${p.porcentaje}%`}
                      </span>
                    </div>
                  ))}
                  {(!usuarioDetalle.progresos || usuarioDetalle.progresos.length === 0) && (
                    <p className="text-sm text-gray-500">Sin progreso registrado</p>
                  )}
                </div>
              </div>

              {/* Examenes */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Historial de examenes</h4>
                <div className="space-y-2">
                  {usuarioDetalle.examenes?.map((e) => (
                    <div key={e.id} className="flex items-center justify-between py-2 border-b">
                      <span className="text-sm">
                        {new Date(e.fechaInicio).toLocaleDateString('es-ES')}
                      </span>
                      <div className="flex items-center gap-2">
                        {e.puntuacion !== null && (
                          <span className="text-sm font-medium">{e.puntuacion?.toFixed(1)}%</span>
                        )}
                        <span className={`text-xs px-2 py-1 rounded ${
                          e.aprobado ? 'bg-green-100 text-green-800' :
                          e.estado === 'finalizado' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {e.aprobado ? 'Aprobado' : e.estado === 'finalizado' ? 'Suspenso' : 'En curso'}
                        </span>
                      </div>
                    </div>
                  ))}
                  {(!usuarioDetalle.examenes || usuarioDetalle.examenes.length === 0) && (
                    <p className="text-sm text-gray-500">Sin examenes realizados</p>
                  )}
                </div>
              </div>

              {/* Certificado */}
              {usuarioDetalle.certificado && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Certificado</h4>
                  <dl className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <dt className="text-gray-500">Codigo</dt>
                      <dd className="font-mono">{usuarioDetalle.certificado.codigoVerificacion}</dd>
                    </div>
                    <div>
                      <dt className="text-gray-500">Estado</dt>
                      <dd>
                        <span className={`text-xs px-2 py-1 rounded ${
                          usuarioDetalle.certificado.firmado
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {usuarioDetalle.certificado.firmado ? 'Firmado' : 'Pendiente firma'}
                        </span>
                      </dd>
                    </div>
                    {usuarioDetalle.certificado.fechaEmision && (
                      <div>
                        <dt className="text-gray-500">Fecha emision</dt>
                        <dd>{new Date(usuarioDetalle.certificado.fechaEmision).toLocaleDateString('es-ES')}</dd>
                      </div>
                    )}
                  </dl>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
