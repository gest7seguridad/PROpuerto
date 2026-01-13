import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para añadir token (usuario o admin)
api.interceptors.request.use(
  (config) => {
    // Primero buscar token de admin, luego de usuario
    const token = localStorage.getItem('adminToken') || localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar errores y refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Si es 401 y no es un retry, intentar refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_URL}/auth/refresh-token`, {
            refreshToken
          });

          const { accessToken, refreshToken: newRefreshToken } = response.data;

          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', newRefreshToken);

          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          // Refresh falló, limpiar tokens
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('usuario');
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }
    }

    return Promise.reject(error);
  }
);

// Auth
export const authAPI = {
  registro: (datos) => api.post('/auth/registro', datos),
  login: (datos) => api.post('/auth/login', datos),
  verificarEmail: (token) => api.get(`/auth/verificar-email/${token}`),
  recuperarPassword: (email) => api.post('/auth/recuperar-password', { email }),
  resetPassword: (token, password) => api.post(`/auth/reset-password/${token}`, { password }),
  me: () => api.get('/auth/me'),
  logout: (refreshToken) => api.post('/auth/logout', { refreshToken })
};

// Módulos
export const modulosAPI = {
  listar: () => api.get('/modulos'),
  obtener: (id) => api.get(`/modulos/${id}`),
  actualizarProgreso: (id, tiempoAcumulado) => api.post(`/modulos/${id}/progreso`, { tiempoAcumulado }),
  completar: (id) => api.post(`/modulos/${id}/completar`)
};

// Examen
export const examenAPI = {
  estado: () => api.get('/examen/estado'),
  iniciar: () => api.post('/examen/iniciar'),
  obtener: (id) => api.get(`/examen/${id}`),
  guardarRespuesta: (id, preguntaId, respuesta) => api.patch(`/examen/${id}/respuesta`, { preguntaId, respuesta }),
  finalizar: (id) => api.post(`/examen/${id}/finalizar`),
  resultado: (id) => api.get(`/examen/${id}/resultado`)
};

// Certificado
export const certificadoAPI = {
  estado: () => api.get('/certificado/estado'),
  solicitarFirma: () => api.post('/certificado/solicitar-firma'),
  simularFirma: () => api.post('/certificado/simular-firma'),
  descargar: () => api.get('/certificado/descargar', { responseType: 'blob' }),
  verificar: (codigo) => api.get(`/certificado/verificar/${codigo}`)
};

// Admin
export const adminAPI = {
  login: (datos) => api.post('/admin/login', datos),
  estadisticas: () => api.get('/admin/estadisticas'),
  usuarios: (params) => api.get('/admin/usuarios', { params }),
  exportarUsuarios: () => api.get('/admin/usuarios/exportar', { responseType: 'blob' }),
  modulos: {
    listar: () => api.get('/admin/modulos'),
    crear: (datos) => api.post('/admin/modulos', datos),
    actualizar: (id, datos) => api.put(`/admin/modulos/${id}`, datos),
    eliminar: (id) => api.delete(`/admin/modulos/${id}`)
  },
  preguntas: {
    listar: (params) => api.get('/admin/preguntas', { params }),
    crear: (datos) => api.post('/admin/preguntas', datos),
    actualizar: (id, datos) => api.put(`/admin/preguntas/${id}`, datos),
    eliminar: (id) => api.delete(`/admin/preguntas/${id}`)
  },
  certificados: (params) => api.get('/admin/certificados', { params })
};

export default api;
