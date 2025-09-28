'use client';

import React, { useState, useEffect } from 'react';
import { Character } from '../lib/characterApi';
import CharacterAvatar from './CharacterAvatar';

interface CharacterModalProps {
  character: Character | null;
  isOpen: boolean;
  onClose: () => void;
  onChat?: (character: Character) => void;
}

const CharacterModal: React.FC<CharacterModalProps> = ({ character, isOpen, onClose, onChat }) => {
  const [isClosing, setIsClosing] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      // Pequeño delay para que la animación se vea
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 300);
  };

  if (!isOpen || !character) return null;

  return (
    <div 
      className={`fixed inset-0 backdrop-blur-md bg-gray-900/40 z-50 flex items-center justify-center p-4 transition-all duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'}`}
      onClick={handleClose}
    >
      <div 
        className={`backdrop-blur-md bg-gray-100/95 rounded-2xl max-w-4xl w-full max-h-[90vh] shadow-2xl border border-gray-300/30 transition-all duration-500 transform overflow-hidden ${
          isClosing 
            ? 'scale-95 opacity-0 translate-y-4' 
            : isAnimating 
              ? 'scale-95 opacity-0 translate-y-4 animate-modalSlideIn' 
              : 'scale-100 opacity-100 translate-y-0'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="overflow-y-auto max-h-[90vh]">
        {/* Header del Modal */}
        <div className="sticky top-0 backdrop-blur-md bg-gray-100/90 border-b border-gray-300/30 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <CharacterAvatar 
                character={character} 
                size="xl" 
                className="shadow-lg"
              />
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{character.nombre}</h2>
                <p className="text-gray-600">{character.personalidad.profesion}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-sm text-gray-500">{character.nacionalidad}</span>
                  <span className="text-sm bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">
                    {character.idioma_objetivo}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Contenido del Modal */}
        <div className="p-6 space-y-8">
          {/* Descripción Principal */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Sobre mí</h3>
            <p className="text-gray-700 leading-relaxed">{character.personalidad.descripcion}</p>
          </div>

          {/* Información Personal */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Información Personal</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Edad:</span>
                  <span className="font-medium">{character.personalidad.edad} años</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Estado Civil:</span>
                  <span className="font-medium">{character.personalidad.estado_civil}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Lugar de Nacimiento:</span>
                  <span className="font-medium">{character.personalidad.lugar_nacimiento}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Residencia:</span>
                  <span className="font-medium">{character.personalidad.residencia_actual}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Familia:</span>
                  <span className="font-medium">{character.personalidad.familia}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Rasgos de Personalidad</h3>
              <div className="flex flex-wrap gap-2">
                {character.personalidad.rasgos.map((rasgo, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                  >
                    {rasgo}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Historia Personal */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Mi Historia</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-800 mb-2">Infancia</h4>
                <p className="text-gray-700 text-sm leading-relaxed">{character.historia_personal.infancia}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-800 mb-2">Juventud</h4>
                <p className="text-gray-700 text-sm leading-relaxed">{character.historia_personal.juventud}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-800 mb-2">Vida Actual</h4>
                <p className="text-gray-700 text-sm leading-relaxed">{character.historia_personal.vida_actual}</p>
              </div>
            </div>
          </div>

          {/* Experiencias Clave */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Experiencias Clave</h3>
            <ul className="space-y-2">
              {character.historia_personal.experiencias_clave.map((experiencia, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <span className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span className="text-gray-700 text-sm">{experiencia}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Anécdotas */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Anécdotas Divertidas</h3>
            <ul className="space-y-2">
              {character.historia_personal.anecdotas.map((anecdota, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span className="text-gray-700 text-sm">{anecdota}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contexto Cultural */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Tradiciones</h3>
              <div className="flex flex-wrap gap-2">
                {character.contexto_cultural.tradiciones.map((tradicion, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                  >
                    {tradicion}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Comida Favorita</h3>
              <div className="flex flex-wrap gap-2">
                {character.contexto_cultural.comida_favorita.map((comida, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full"
                  >
                    {comida}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Música y Lugares */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Música Preferida</h3>
              <div className="flex flex-wrap gap-2">
                {character.contexto_cultural.musica_preferida.map((musica, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full"
                  >
                    {musica}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Lugares Importantes</h3>
              <div className="flex flex-wrap gap-2">
                {character.contexto_cultural.lugares_importantes.map((lugar, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
                  >
                    {lugar}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Hobbies y Motivaciones */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Hobbies</h3>
              <div className="flex flex-wrap gap-2">
                {character.personalidad.hobbies.map((hobby, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-pink-100 text-pink-800 text-xs rounded-full"
                  >
                    {hobby}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Motivaciones</h3>
              <ul className="space-y-1">
                {character.personalidad.motivaciones.map((motivacion, index) => (
                  <li key={index} className="text-gray-700 text-sm">
                    • {motivacion}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sueños y Miedos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Mis Sueños</h3>
              <ul className="space-y-1">
                {character.personalidad.sueños.map((sueño, index) => (
                  <li key={index} className="text-gray-700 text-sm">
                    ✨ {sueño}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Mis Miedos</h3>
              <ul className="space-y-1">
                {character.personalidad.miedos.map((miedo, index) => (
                  <li key={index} className="text-gray-700 text-sm">
                    😰 {miedo}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Estilo Conversacional */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Cómo Hablo</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-800 mb-2">Tono</h4>
                <p className="text-gray-700 text-sm">{character.estilo_conversacional.tono}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-800 mb-2">Nivel de Formalidad</h4>
                <p className="text-gray-700 text-sm capitalize">{character.estilo_conversacional.nivel_formalidad}</p>
              </div>
            </div>
            <div className="mt-4">
              <h4 className="font-medium text-gray-800 mb-2">Expresiones Típicas</h4>
              <div className="flex flex-wrap gap-2">
                {character.estilo_conversacional.expresiones_tipicas.map((expresion, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full"
                  >
                    &quot;{expresion}&quot;
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Restricciones */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Preferencias de Conversación</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-800 mb-2">Temas Favoritos</h4>
                <div className="flex flex-wrap gap-2">
                  {character.restricciones.temas_favoritos.map((tema, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
                    >
                      {tema}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-800 mb-2">Nivel de Enseñanza</h4>
                <span className="px-3 py-1 bg-indigo-100 text-indigo-800 text-sm rounded-full">
                  {character.restricciones.nivel_enseñanza}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer del Modal */}
        <div className="sticky bottom-0 backdrop-blur-md bg-gray-100/90 border-t border-gray-300/30 p-6 rounded-b-2xl">
          <div className="flex justify-end space-x-3">
            <button
              onClick={handleClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cerrar
            </button>
            <button
              onClick={() => {
                if (onChat) {
                  onChat(character);
                }
                handleClose();
              }}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Chatear con {character.nombre}
            </button>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterModal;
