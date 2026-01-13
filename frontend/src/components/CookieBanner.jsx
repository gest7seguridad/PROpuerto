import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const COOKIE_CONSENT_KEY = 'cookieConsent';

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true, // Siempre activas
    preferences: false,
  });

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      setShowBanner(true);
    } else {
      try {
        const savedPrefs = JSON.parse(consent);
        setPreferences(savedPrefs);
      } catch (e) {
        setShowBanner(true);
      }
    }
  }, []);

  const saveConsent = (prefs) => {
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(prefs));
    setShowBanner(false);
    setShowConfig(false);
  };

  const acceptAll = () => {
    const allAccepted = {
      necessary: true,
      preferences: true,
      timestamp: new Date().toISOString(),
    };
    setPreferences(allAccepted);
    saveConsent(allAccepted);
  };

  const acceptNecessary = () => {
    const onlyNecessary = {
      necessary: true,
      preferences: false,
      timestamp: new Date().toISOString(),
    };
    setPreferences(onlyNecessary);
    saveConsent(onlyNecessary);
  };

  const savePreferences = () => {
    const updatedPrefs = {
      ...preferences,
      timestamp: new Date().toISOString(),
    };
    saveConsent(updatedPrefs);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50" />

      {/* Banner */}
      <div className="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {showConfig ? (
          // Panel de configuracion
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Configurar Cookies</h2>
              <button
                onClick={() => setShowConfig(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <p className="text-gray-600 text-sm mb-6">
              Seleccione las categorias de cookies que desea permitir. Las cookies necesarias son imprescindibles para el funcionamiento del sitio.
            </p>

            <div className="space-y-4">
              {/* Cookies necesarias */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-800">Cookies Necesarias</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Imprescindibles para el funcionamiento basico del sitio web.
                    </p>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 mr-2">Siempre activas</span>
                    <div className="w-12 h-6 bg-primary-600 rounded-full relative cursor-not-allowed">
                      <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Cookies de preferencias */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-800">Cookies de Preferencias</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Permiten recordar sus preferencias para personalizar su experiencia.
                    </p>
                  </div>
                  <button
                    onClick={() => setPreferences(p => ({ ...p, preferences: !p.preferences }))}
                    className={`w-12 h-6 rounded-full relative transition-colors ${
                      preferences.preferences ? 'bg-primary-600' : 'bg-gray-300'
                    }`}
                  >
                    <div
                      className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                        preferences.preferences ? 'right-1' : 'left-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                onClick={acceptNecessary}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Rechazar opcionales
              </button>
              <button
                onClick={savePreferences}
                className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Guardar preferencias
              </button>
            </div>

            <p className="text-xs text-gray-500 mt-4 text-center">
              Mas informacion en nuestra{' '}
              <Link to="/politica-cookies" className="text-primary-600 hover:underline">
                Politica de Cookies
              </Link>
            </p>
          </div>
        ) : (
          // Banner principal
          <div className="p-6">
            <div className="flex items-start gap-4">
              <div className="text-4xl">🍪</div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  Utilizamos cookies
                </h2>
                <p className="text-gray-600 text-sm">
                  Este sitio web utiliza cookies propias para garantizar su correcto funcionamiento
                  y mejorar su experiencia de navegacion. Puede aceptar todas las cookies,
                  configurar sus preferencias o aceptar solo las necesarias.
                </p>
                <p className="text-gray-500 text-xs mt-2">
                  Consulte nuestra{' '}
                  <Link to="/politica-cookies" className="text-primary-600 hover:underline">
                    Politica de Cookies
                  </Link>{' '}
                  y{' '}
                  <Link to="/politica-privacidad" className="text-primary-600 hover:underline">
                    Politica de Privacidad
                  </Link>
                  .
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setShowConfig(true)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm"
              >
                Configurar
              </button>
              <button
                onClick={acceptNecessary}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm"
              >
                Solo necesarias
              </button>
              <button
                onClick={acceptAll}
                className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
              >
                Aceptar todas
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Hook para verificar el consentimiento de cookies
export function useCookieConsent() {
  const [consent, setConsent] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (saved) {
      try {
        setConsent(JSON.parse(saved));
      } catch (e) {
        setConsent(null);
      }
    }
  }, []);

  return consent;
}

// Funcion para resetear el consentimiento (para el footer)
export function resetCookieConsent() {
  localStorage.removeItem(COOKIE_CONSENT_KEY);
  window.location.reload();
}
