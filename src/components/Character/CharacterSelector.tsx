'use client';

import React, { useState, useEffect } from 'react';
import { Character, useCharacters } from '../../lib/characterApi';

interface CharacterSelectorProps {
  onCharacterSelect: (character: Character) => void;
  selectedLanguage?: string;
  selectedNationality?: string;
  selectedGender?: "M" | "F";
}

export default function CharacterSelector({
  onCharacterSelect,
  selectedLanguage,
  selectedNationality,
  selectedGender
}: CharacterSelectorProps) {
  const { characters, loading, error, loadCharacters, loadCharactersByLanguage, searchCharacters } = useCharacters();
  const [searchCriteria, setSearchCriteria] = useState({
    idioma: selectedLanguage || '',
    nacionalidad: selectedNationality || '',
    genero: selectedGender || undefined as "M" | "F" | undefined,
    nivel_enseñanza: '' as string | undefined
  });

  useEffect(() => {
    if (selectedLanguage) {
      loadCharactersByLanguage(selectedLanguage);
    } else {
      loadCharacters();
    }
  }, [selectedLanguage, loadCharacters, loadCharactersByLanguage]);

  const handleSearch = () => {
    const criteria = Object.fromEntries(
      Object.entries(searchCriteria).filter(([, value]) => value !== '')
    );
    searchCharacters(criteria);
  };

  const handleCharacterClick = (character: Character) => {
    onCharacterSelect(character);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-2">Cargando personajes...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filtros de búsqueda */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Filtrar personajes</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Idioma
            </label>
            <select
              value={searchCriteria.idioma}
              onChange={(e) => setSearchCriteria({ ...searchCriteria, idioma: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos los idiomas</option>
              <option value="español">Español</option>
              <option value="inglés">Inglés</option>
              <option value="francés">Francés</option>
              <option value="japonés">Japonés</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nacionalidad
            </label>
            <select
              value={searchCriteria.nacionalidad}
              onChange={(e) => setSearchCriteria({ ...searchCriteria, nacionalidad: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todas las nacionalidades</option>
              <option value="España">España</option>
              <option value="Estados Unidos">Estados Unidos</option>
              <option value="Francia">Francia</option>
              <option value="Japón">Japón</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Género
            </label>
            <select
              value={searchCriteria.genero || ''}
              onChange={(e) => setSearchCriteria({ 
                ...searchCriteria, 
                genero: e.target.value as "M" | "F" | undefined 
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Cualquier género</option>
              <option value="M">Masculino</option>
              <option value="F">Femenino</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nivel de enseñanza
            </label>
            <select
              value={searchCriteria.nivel_enseñanza || ''}
              onChange={(e) => setSearchCriteria({ 
                ...searchCriteria, 
                nivel_enseñanza: e.target.value || undefined 
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Cualquier nivel</option>
              <option value="principiante">Principiante</option>
              <option value="intermedio">Intermedio</option>
              <option value="avanzado">Avanzado</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleSearch}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Buscar personajes
        </button>
      </div>

      {/* Lista de personajes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {characters.map((character) => (
          <div
            key={character._id}
            onClick={() => handleCharacterClick(character)}
            className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer"
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                {character.nombre.charAt(0)}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {character.nombre}
                </h3>
                <p className="text-gray-600">
                  {character.nacionalidad} • {character.idioma_objetivo}
                </p>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <p className="text-sm text-gray-700">
                <span className="font-medium">Profesión:</span> {character.personalidad.profesion}
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-medium">Edad:</span> {character.personalidad.edad} años
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-medium">Nivel:</span> {character.restricciones.nivel_enseñanza}
              </p>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 line-clamp-3">
                {character.personalidad.descripcion}
              </p>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {character.personalidad.rasgos.slice(0, 3).map((rasgo, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                >
                  {rasgo}
                </span>
              ))}
              {character.personalidad.rasgos.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                  +{character.personalidad.rasgos.length - 3} más
                </span>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex space-x-2">
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                  {character.estilo_conversacional.nivel_formalidad}
                </span>
                <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                  {character.estilo_conversacional.velocidad_habla}
                </span>
              </div>
              <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
                Chatear
              </button>
            </div>
          </div>
        ))}
      </div>

      {characters.length === 0 && !loading && (
        <div className="text-center py-8">
          <p className="text-gray-500">No se encontraron personajes con los criterios seleccionados.</p>
        </div>
      )}
    </div>
  );
}
