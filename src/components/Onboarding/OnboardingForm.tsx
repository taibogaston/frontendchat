'use client';

import { useState } from 'react';

interface OnboardingFormProps {
  onComplete: (data: { user: { onboardingCompleted: boolean }; defaultChat?: unknown }) => void;
}

export default function OnboardingForm({ onComplete }: OnboardingFormProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    idioma_principal: '',
    idioma_objetivo: '',
    preferencia_genero: 'A',
    nivel_idioma: 'principiante',
    intereses: [] as string[],
    pais: '',
    edad: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const idiomas = [
    'español', 'inglés', 'francés', 'portugués', 'alemán', 'italiano', 'japonés', 'chino', 'coreano', 'ruso'
  ];

  const interesesDisponibles = [
    'viajes', 'cultura', 'deportes', 'música', 'cine', 'literatura', 'tecnología', 
    'cocina', 'arte', 'historia', 'ciencia', 'negocios', 'moda', 'naturaleza'
  ];

  const paises = [
    'España', 'México', 'Argentina', 'Colombia', 'Chile', 'Perú', 'Venezuela', 
    'Estados Unidos', 'Reino Unido', 'Canadá', 'Francia', 'Alemania', 'Italia', 
    'Brasil', 'Japón', 'China', 'Corea del Sur', 'Rusia', 'Otro'
  ];

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleInterestToggle = (interes: string) => {
    setFormData(prev => ({
      ...prev,
      intereses: prev.intereses.includes(interes)
        ? prev.intereses.filter(i => i !== interes)
        : [...prev.intereses, interes]
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/onboarding/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Pasar tanto el usuario como el chat por defecto
        onComplete({
          user: data.user,
          defaultChat: data.defaultChat
        });
      } else {
        setError(data.error || 'Error completando onboarding');
      }
    } catch {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Información Básica</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          ¿Cuál es tu idioma principal?
        </label>
        <select
          value={formData.idioma_principal}
          onChange={(e) => setFormData({ ...formData, idioma_principal: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
        >
          <option value="">Selecciona tu idioma</option>
          {idiomas.map(idioma => (
            <option key={idioma} value={idioma}>{idioma}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          ¿Qué idioma quieres aprender?
        </label>
        <select
          value={formData.idioma_objetivo}
          onChange={(e) => setFormData({ ...formData, idioma_objetivo: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
        >
          <option value="">Selecciona el idioma objetivo</option>
          {idiomas.map(idioma => (
            <option key={idioma} value={idioma}>{idioma}</option>
          ))}
        </select>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Preferencias</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          ¿Cuál es tu nivel actual?
        </label>
        <div className="space-y-2">
          {['principiante', 'intermedio', 'avanzado'].map(nivel => (
            <label key={nivel} className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-blue-50 hover:border-blue-300 cursor-pointer transition-all duration-200">
              <input
                type="radio"
                name="nivel_idioma"
                value={nivel}
                checked={formData.nivel_idioma === nivel}
                onChange={(e) => setFormData({ ...formData, nivel_idioma: e.target.value })}
                className="mr-3 w-4 h-4 text-blue-600 focus:ring-blue-500"
              />
              <span className="font-medium text-gray-900">{nivel.charAt(0).toUpperCase() + nivel.slice(1)}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Preferencia de género del personaje
        </label>
        <div className="space-y-2">
          {[
            { value: 'A', label: 'Sin preferencia' },
            { value: 'F', label: 'Femenino' },
            { value: 'M', label: 'Masculino' }
          ].map(opcion => (
            <label key={opcion.value} className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-blue-50 hover:border-blue-300 cursor-pointer transition-all duration-200">
              <input
                type="radio"
                name="preferencia_genero"
                value={opcion.value}
                checked={formData.preferencia_genero === opcion.value}
                onChange={(e) => setFormData({ ...formData, preferencia_genero: e.target.value })}
                className="mr-3 w-4 h-4 text-blue-600 focus:ring-blue-500"
              />
              <span className="font-medium text-gray-900">{opcion.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Intereses</h3>
      <p className="text-sm text-gray-600">Selecciona los temas que más te interesan</p>
      
      <div className="grid grid-cols-2 gap-2">
        {interesesDisponibles.map(interes => (
          <label key={interes} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 cursor-pointer transition-all duration-200">
            <input
              type="checkbox"
              checked={formData.intereses.includes(interes)}
              onChange={() => handleInterestToggle(interes)}
              className="mr-3 w-4 h-4 text-blue-600 focus:ring-blue-500 rounded"
            />
            <span className="font-medium text-gray-900">{interes.charAt(0).toUpperCase() + interes.slice(1)}</span>
          </label>
        ))}
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Información Personal</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          País
        </label>
        <select
          value={formData.pais}
          onChange={(e) => setFormData({ ...formData, pais: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
        >
          <option value="">Selecciona tu país</option>
          {paises.map(pais => (
            <option key={pais} value={pais}>{pais}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Edad
        </label>
        <input
          type="number"
          min="13"
          max="100"
          value={formData.edad || ''}
          onChange={(e) => setFormData({ ...formData, edad: parseInt(e.target.value) || 0 })}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
        />
      </div>
    </div>
  );

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.idioma_principal && formData.idioma_objetivo;
      case 2:
        return formData.nivel_idioma && formData.preferencia_genero;
      case 3:
        return true; // Los intereses son opcionales
      case 4:
        return formData.pais && formData.edad >= 13;
      default:
        return false;
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-center mb-2 text-gray-900">Configura tu perfil</h2>
        <p className="text-center text-gray-600 mb-6">Cuéntanos sobre ti para personalizar tu experiencia</p>
        <div className="flex justify-center space-x-3">
          {[1, 2, 3, 4].map((stepNum) => (
            <div
              key={stepNum}
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                stepNum <= step
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {stepNum}
            </div>
          ))}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-xl mb-6 flex items-center gap-2">
          <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
      )}

      <div className="mb-6">
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
        {step === 4 && renderStep4()}
      </div>

      <div className="flex justify-between gap-4">
        <button
          onClick={handleBack}
          disabled={step === 1}
          className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Anterior
        </button>

        {step < 4 ? (
          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg"
          >
            Siguiente
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!canProceed() || loading}
            className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Completando...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Completar
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
