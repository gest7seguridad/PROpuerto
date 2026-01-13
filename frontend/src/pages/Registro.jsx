import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Registro() {
  const [form, setForm] = useState({
    dni: '',
    nombre: '',
    apellidos: '',
    email: '',
    telefono: '',
    password: '',
    confirmPassword: '',
    direccion: '',
    numero: '',
    piso: '',
    puerta: '',
    codigoPostal: '',
    localidad: 'Puerto del Rosario',
    aceptaPrivacidad: false,
    aceptaComunicaciones: false
  });
  const [loading, setLoading] = useState(false);
  const [errores, setErrores] = useState({});
  const { registro } = useAuth();
  const navigate = useNavigate();

  const validar = () => {
    const nuevosErrores = {};

    if (!/^[0-9]{8}[A-Za-z]$/.test(form.dni) && !/^[XYZ][0-9]{7}[A-Za-z]$/i.test(form.dni)) {
      nuevosErrores.dni = 'DNI/NIE inválido';
    }

    if (form.password.length < 8) {
      nuevosErrores.password = 'Mínimo 8 caracteres';
    }

    if (form.password !== form.confirmPassword) {
      nuevosErrores.confirmPassword = 'Las contraseñas no coinciden';
    }

    if (!/^\d{5}$/.test(form.codigoPostal)) {
      nuevosErrores.codigoPostal = 'Codigo postal invalido';
    }

    if (!form.aceptaPrivacidad) {
      nuevosErrores.aceptaPrivacidad = 'Debe aceptar la politica de privacidad para continuar';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validar()) return;

    setLoading(true);

    try {
      await registro(form);
      toast.success('¡Registro completado! Revisa tu email para verificar tu cuenta.');
      navigate('/login');
    } catch (error) {
      const mensaje = error.response?.data?.message || 'Error al registrar';
      const erroresAPI = error.response?.data?.errores;

      if (erroresAPI) {
        const nuevosErrores = {};
        erroresAPI.forEach(e => {
          nuevosErrores[e.campo] = e.mensaje;
        });
        setErrores(nuevosErrores);
      }

      toast.error(mensaje);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    setForm({ ...form, [name]: newValue });
    if (errores[name]) {
      setErrores({ ...errores, [name]: null });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex justify-center">
            <img
              src="/logo-ayuntamiento.svg"
              alt="Ayuntamiento de Puerto del Rosario"
              className="h-20 w-auto"
            />
          </Link>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Crear cuenta</h2>
          <p className="mt-2 text-gray-600">
            Regístrate para acceder a la formación en gestión de residuos
          </p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Datos personales */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Datos personales</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="dni" className="label">DNI/NIE *</label>
                  <input
                    id="dni"
                    name="dni"
                    type="text"
                    required
                    value={form.dni}
                    onChange={handleChange}
                    className={`input ${errores.dni ? 'input-error' : ''}`}
                    placeholder="12345678A"
                  />
                  {errores.dni && <p className="text-red-500 text-sm mt-1">{errores.dni}</p>}
                </div>

                <div>
                  <label htmlFor="email" className="label">Email *</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    className={`input ${errores.email ? 'input-error' : ''}`}
                    placeholder="tu@email.com"
                  />
                  {errores.email && <p className="text-red-500 text-sm mt-1">{errores.email}</p>}
                </div>

                <div>
                  <label htmlFor="nombre" className="label">Nombre *</label>
                  <input
                    id="nombre"
                    name="nombre"
                    type="text"
                    required
                    value={form.nombre}
                    onChange={handleChange}
                    className="input"
                    placeholder="Tu nombre"
                  />
                </div>

                <div>
                  <label htmlFor="apellidos" className="label">Apellidos *</label>
                  <input
                    id="apellidos"
                    name="apellidos"
                    type="text"
                    required
                    value={form.apellidos}
                    onChange={handleChange}
                    className="input"
                    placeholder="Tus apellidos"
                  />
                </div>

                <div>
                  <label htmlFor="telefono" className="label">Teléfono</label>
                  <input
                    id="telefono"
                    name="telefono"
                    type="tel"
                    value={form.telefono}
                    onChange={handleChange}
                    className="input"
                    placeholder="612345678"
                  />
                </div>
              </div>
            </div>

            {/* Dirección */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Dirección</h3>
              <p className="text-sm text-gray-500 mb-4">Solo se permite un registro por vivienda</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label htmlFor="direccion" className="label">Calle/Avenida *</label>
                  <input
                    id="direccion"
                    name="direccion"
                    type="text"
                    required
                    value={form.direccion}
                    onChange={handleChange}
                    className="input"
                    placeholder="Calle Principal"
                  />
                </div>

                <div>
                  <label htmlFor="numero" className="label">Número *</label>
                  <input
                    id="numero"
                    name="numero"
                    type="text"
                    required
                    value={form.numero}
                    onChange={handleChange}
                    className="input"
                    placeholder="123"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="piso" className="label">Piso</label>
                    <input
                      id="piso"
                      name="piso"
                      type="text"
                      value={form.piso}
                      onChange={handleChange}
                      className="input"
                      placeholder="2º"
                    />
                  </div>

                  <div>
                    <label htmlFor="puerta" className="label">Puerta</label>
                    <input
                      id="puerta"
                      name="puerta"
                      type="text"
                      value={form.puerta}
                      onChange={handleChange}
                      className="input"
                      placeholder="A"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="codigoPostal" className="label">Código Postal *</label>
                  <input
                    id="codigoPostal"
                    name="codigoPostal"
                    type="text"
                    required
                    value={form.codigoPostal}
                    onChange={handleChange}
                    className={`input ${errores.codigoPostal ? 'input-error' : ''}`}
                    placeholder="35600"
                  />
                  {errores.codigoPostal && <p className="text-red-500 text-sm mt-1">{errores.codigoPostal}</p>}
                </div>

                <div>
                  <label htmlFor="localidad" className="label">Localidad</label>
                  <input
                    id="localidad"
                    name="localidad"
                    type="text"
                    value={form.localidad}
                    onChange={handleChange}
                    className="input"
                  />
                </div>
              </div>
            </div>

            {/* Contraseña */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Contraseña</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="password" className="label">Contraseña *</label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={form.password}
                    onChange={handleChange}
                    className={`input ${errores.password ? 'input-error' : ''}`}
                    placeholder="Mínimo 8 caracteres"
                  />
                  {errores.password && <p className="text-red-500 text-sm mt-1">{errores.password}</p>}
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="label">Confirmar contraseña *</label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    value={form.confirmPassword}
                    onChange={handleChange}
                    className={`input ${errores.confirmPassword ? 'input-error' : ''}`}
                    placeholder="Repite la contraseña"
                  />
                  {errores.confirmPassword && <p className="text-red-500 text-sm mt-1">{errores.confirmPassword}</p>}
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                La contrasena debe tener al menos 8 caracteres, una mayuscula, una minuscula y un numero.
              </p>
            </div>

            {/* Consentimientos LOPD */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Proteccion de Datos</h3>

              <div className="space-y-4">
                {/* Aceptacion obligatoria de politica de privacidad */}
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="aceptaPrivacidad"
                      name="aceptaPrivacidad"
                      type="checkbox"
                      checked={form.aceptaPrivacidad}
                      onChange={handleChange}
                      className={`h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 ${
                        errores.aceptaPrivacidad ? 'border-red-500' : ''
                      }`}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="aceptaPrivacidad" className="text-gray-700">
                      He leido y acepto la{' '}
                      <Link to="/politica-privacidad" target="_blank" className="text-primary-600 hover:underline">
                        Politica de Privacidad
                      </Link>{' '}
                      y el{' '}
                      <Link to="/aviso-legal" target="_blank" className="text-primary-600 hover:underline">
                        Aviso Legal
                      </Link>
                      . <span className="text-red-500">*</span>
                    </label>
                    {errores.aceptaPrivacidad && (
                      <p className="text-red-500 text-sm mt-1">{errores.aceptaPrivacidad}</p>
                    )}
                  </div>
                </div>

                {/* Consentimiento opcional para comunicaciones */}
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="aceptaComunicaciones"
                      name="aceptaComunicaciones"
                      type="checkbox"
                      checked={form.aceptaComunicaciones}
                      onChange={handleChange}
                      className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="aceptaComunicaciones" className="text-gray-700">
                      Deseo recibir comunicaciones informativas del Ayuntamiento de Puerto del Rosario
                      relacionadas con la gestion de residuos y medio ambiente.
                    </label>
                    <p className="text-gray-500 text-xs mt-1">
                      Este consentimiento es opcional y puede revocarlo en cualquier momento.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-xs text-blue-800">
                  <strong>Informacion basica sobre Proteccion de Datos:</strong><br />
                  Responsable: Ayuntamiento de Puerto del Rosario.
                  Finalidad: Gestion de la formacion en residuos y emision de certificados.
                  Legitimacion: Consentimiento del interesado y ejecucion del servicio.
                  Destinatarios: No se cederan datos a terceros salvo obligacion legal.
                  Derechos: Acceso, rectificacion, supresion, limitacion, portabilidad y oposicion.
                  Mas informacion en la{' '}
                  <Link to="/politica-privacidad" target="_blank" className="text-blue-600 hover:underline">
                    Politica de Privacidad
                  </Link>.
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn btn-primary py-3"
            >
              {loading ? 'Registrando...' : 'Crear cuenta'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
