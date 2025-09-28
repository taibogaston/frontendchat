'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Character, CharacterApi } from '../../lib/characterApi';
import DarkHeader from '../../components/DarkHeader';
import CharacterAvatar from '../../components/CharacterAvatar';
import CharacterModal from '../../components/CharacterModal';

// Los 10 idiomas más hablados del mundo
const IDIOMAS_POPULARES = [
  { codigo: 'español', nombre: 'Español', bandera: '🇪🇸', color: 'from-red-500 to-yellow-500' },
  { codigo: 'inglés', nombre: 'Inglés', bandera: '🇺🇸', color: 'from-blue-500 to-red-500' },
  { codigo: 'japonés', nombre: 'Japonés', bandera: '🇯🇵', color: 'from-red-500 to-white' },
  { codigo: 'francés', nombre: 'Francés', bandera: '🇫🇷', color: 'from-blue-500 to-white' },
  { codigo: 'chino', nombre: 'Chino Mandarín', bandera: '🇨🇳', color: 'from-red-500 to-yellow-500' },
  { codigo: 'hindi', nombre: 'Hindi', bandera: '🇮🇳', color: 'from-orange-500 to-green-500' },
  { codigo: 'árabe', nombre: 'Árabe', bandera: '🇸🇦', color: 'from-green-500 to-white' },
  { codigo: 'portugués', nombre: 'Portugués', bandera: '🇧🇷', color: 'from-green-500 to-yellow-500' },
  { codigo: 'bengalí', nombre: 'Bengalí', bandera: '🇧🇩', color: 'from-green-500 to-red-500' },
  { codigo: 'ruso', nombre: 'Ruso', bandera: '🇷🇺', color: 'from-blue-500 to-red-500' }
];

export default function TestCharactersPage() {
  const router = useRouter();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [charactersByLanguage, setCharactersByLanguage] = useState<{[key: string]: Character[]}>({});
  const [selectedLanguage, setSelectedLanguage] = useState<string>('español');
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const CHARACTERS_PER_PAGE = 4;

  // Cargar personajes al montar el componente
  useEffect(() => {
    loadCharacters();
  }, []);

  const loadCharacters = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await CharacterApi.getAllCharacters();
      setCharacters(data);
      console.log('Personajes cargados:', data);
      
      // Organizar personajes por idioma
      const groupedByLanguage: {[key: string]: Character[]} = {};
      
      // Inicializar todos los idiomas con arrays vacíos
      IDIOMAS_POPULARES.forEach(idioma => {
        groupedByLanguage[idioma.codigo] = [];
      });
      
      // Agrupar personajes existentes por idioma
      data.forEach(character => {
        const idiomaKey = character.idioma_objetivo.toLowerCase();
        // Buscar el idioma correspondiente en la lista
        const idiomaEncontrado = IDIOMAS_POPULARES.find(idioma => 
          idioma.codigo.toLowerCase() === idiomaKey
        );
        
        if (idiomaEncontrado) {
          groupedByLanguage[idiomaEncontrado.codigo].push(character);
        }
      });
      
      setCharactersByLanguage(groupedByLanguage);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error cargando personajes');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Funciones para el carrusel
  const getCurrentLanguageCharacters = () => {
    return charactersByLanguage[selectedLanguage] || [];
  };

  const getTotalPages = () => {
    const characters = getCurrentLanguageCharacters();
    return Math.ceil(characters.length / CHARACTERS_PER_PAGE);
  };

  const getCurrentPageCharacters = () => {
    const characters = getCurrentLanguageCharacters();
    const startIndex = currentPage * CHARACTERS_PER_PAGE;
    const endIndex = startIndex + CHARACTERS_PER_PAGE;
    return characters.slice(startIndex, endIndex);
  };

  const nextPage = () => {
    const totalPages = getTotalPages();
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const changeLanguage = (languageCode: string) => {
    setSelectedLanguage(languageCode);
    setCurrentPage(0); // Resetear a la primera página
  };

  const openCharacterModal = (character: Character) => {
    setSelectedCharacter(character);
    setIsModalOpen(true);
  };

  const closeCharacterModal = () => {
    setSelectedCharacter(null);
    setIsModalOpen(false);
  };

  const [isCreatingChat, setIsCreatingChat] = useState(false);

  const selectCharacter = async (character: Character) => {
    // Prevenir múltiples clics simultáneos
    if (isCreatingChat) {
      return;
    }

    try {
      setIsCreatingChat(true);
      setError(null);
      
      // Solo llamar a la API del backend, que ya maneja la verificación de duplicados
      const result = await CharacterApi.createChatWithCharacter(character._id);
      if (result) {
        // Redirigir al chat
        router.push(`/chats/${result.chatId}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error creando chat');
    } finally {
      setIsCreatingChat(false);
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent)] mx-auto"></div>
          <p className="mt-4 text-[var(--muted-foreground)]">Cargando personajes...</p>
        </div>
      </div>
    );
  }

  const currentLanguage = IDIOMAS_POPULARES.find(idioma => idioma.codigo === selectedLanguage);
  const currentCharacters = getCurrentPageCharacters();
  const totalPages = getTotalPages();

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <DarkHeader title="Inicio" />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--foreground)] mb-4">
            Elige tu Personaje
          </h1>
          <p className="text-lg text-[var(--muted-foreground)] max-w-2xl mx-auto">
            Conecta con personajes auténticos de diferentes países y practica idiomas de forma natural
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            <strong>Error:</strong> {error}
          </div>
        )}

        <div className="space-y-8">
          {/* Selector de Idiomas */}
          <div className="mb-8">
            <div className="flex flex-wrap justify-center gap-2">
              {IDIOMAS_POPULARES.map((idioma) => (
                <button
                  key={idioma.codigo}
                  onClick={() => changeLanguage(idioma.codigo)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    selectedLanguage === idioma.codigo
                      ? 'bg-[var(--accent)] text-white shadow-md'
                      : 'bg-[var(--muted)] text-[var(--muted-foreground)] hover:bg-[var(--hover)] hover:text-[var(--foreground)]'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{idioma.bandera}</span>
                    <span>{idioma.nombre}</span>
                    {charactersByLanguage[idioma.codigo]?.length > 0 && (
                      <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">
                        {charactersByLanguage[idioma.codigo]?.length}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Carrusel de Personajes */}
          {currentLanguage && (
            <div className="space-y-6">

              {currentCharacters.length > 0 ? (
                <div className="relative">
                  {/* Grid de Personajes */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {currentCharacters.map((character) => (
                      <div
                        key={character._id}
                        onClick={() => selectCharacter(character)}
                        className="group bg-[var(--card)] rounded-xl border border-[var(--border)] p-4 cursor-pointer card-hover"
                      >
                        <div className="text-center mb-4">
                          <CharacterAvatar 
                            character={character} 
                            size="lg" 
                            className="mx-auto mb-3"
                          />
                          <h3 className="text-lg font-semibold text-[var(--foreground)] mb-1">
                            {character.nombre}
                          </h3>
                          <p className="text-sm text-[var(--muted-foreground)] mb-3">
                            {character.personalidad.profesion}
                          </p>
                        </div>

                        <div className="mb-4">
                          <p className="text-sm text-[var(--muted-foreground)] line-clamp-3 text-center leading-relaxed">
                            {character.personalidad.descripcion}
                          </p>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openCharacterModal(character);
                            }}
                            className="text-xs text-[var(--accent)] hover:text-[var(--primary)] mt-1 font-medium cursor-pointer transition-colors duration-200 hover:underline"
                          >
                            Ver más...
                          </button>
                        </div>

                        <div className="flex flex-wrap gap-1 mb-4 justify-center">
                          {character.personalidad.rasgos.slice(0, 3).map((rasgo, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-[var(--muted)] text-[var(--muted-foreground)] text-xs rounded-full"
                            >
                              {rasgo}
                            </span>
                          ))}
                        </div>

                        <div className="text-center space-y-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openCharacterModal(character);
                            }}
                            className="w-full text-[var(--muted-foreground)] hover:text-[var(--foreground)] text-sm font-medium py-1 transition-all duration-200 cursor-pointer hover:bg-[var(--hover)] rounded-lg hover:scale-105"
                          >
                            Ver perfil completo
                          </button>
                          <div 
                            onClick={() => selectCharacter(character)}
                            className="w-full bg-[var(--accent)] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[var(--primary)] transition-all duration-200 cursor-pointer hover:scale-105 hover:shadow-lg"
                          >
                            Chatear
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Controles del Carrusel */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center space-x-4 mt-6">
                      <button
                        onClick={prevPage}
                        disabled={currentPage === 0}
                        className="p-2 rounded-lg bg-[var(--muted)] text-[var(--muted-foreground)] hover:bg-[var(--hover)] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-[var(--muted-foreground)]">
                          {currentPage + 1} de {totalPages}
                        </span>
                      </div>
                      
                      <button
                        onClick={nextPage}
                        disabled={currentPage >= totalPages - 1}
                        className="p-2 rounded-lg bg-[var(--muted)] text-[var(--muted-foreground)] hover:bg-[var(--hover)] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="text-4xl mb-4">{currentLanguage.bandera}</div>
                  <h3 className="text-xl font-semibold text-[var(--foreground)] mb-2">
                    No hay personajes disponibles
                  </h3>
                  <p className="text-[var(--muted-foreground)] mb-6">
                    Próximamente agregaremos personajes para {currentLanguage.nombre}
                  </p>
                  <button
                    onClick={loadCharacters}
                    className="bg-[var(--accent)] text-white px-4 py-2 rounded-lg hover:bg-[var(--primary)] transition-colors text-sm font-medium"
                  >
                    Recargar
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal de Personaje */}
      <CharacterModal
        character={selectedCharacter}
        isOpen={isModalOpen}
        onClose={closeCharacterModal}
        onChat={selectCharacter}
      />
    </div>
  );
}
