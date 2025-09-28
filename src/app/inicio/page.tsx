'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Character, CharacterApi } from '../../lib/characterApi';
import DarkHeader from '../../components/DarkHeader';
import CharacterAvatar from '../../components/CharacterAvatar';

export default function TestCharactersPage() {
  const router = useRouter();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error cargando personajes');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const selectCharacter = async (character: Character) => {
    try {
      setError(null);
      
      // Primero verificar si ya existe un chat con este personaje
      try {
        const existingChats = await fetch('http://localhost:4000/api/chats', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (existingChats.ok) {
          const chats = await existingChats.json();
          const existingChat = chats.find((chat: any) => 
            chat.partner.nombre === character.nombre && 
            chat.partner.nacionalidad === character.nacionalidad
          );
          
          if (existingChat) {
            console.log('Usando chat existente:', existingChat);
            // Redirigir al chat existente
            router.push(`/chats/${existingChat._id}`);
            return;
          }
        }
      } catch (err) {
        console.log('No se pudieron obtener chats existentes, creando nuevo chat');
      }
      
      // Si no existe, crear chat con el personaje
      const result = await CharacterApi.createChatWithCharacter(character._id);
      if (result) {
        console.log('Chat creado:', result);
        // Redirigir al nuevo chat
        router.push(`/chats/${result.chatId}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error creando chat');
      console.error('Error:', err);
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

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <DarkHeader title="Inicio" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--foreground)] mb-4">
            🎭 Elige tu Personaje
          </h1>
          <p className="text-xl text-[var(--muted-foreground)] max-w-2xl mx-auto">
            Conecta con personajes auténticos de diferentes países y practica idiomas de forma natural
          </p>
        </div>

        {error && (
          <div className="bg-red-600 bg-opacity-20 border border-red-500 text-red-300 px-4 py-3 rounded-lg mb-6">
            <strong>Error:</strong> {error}
          </div>
        )}

        <div className="space-y-6">
          <div className="text-center mb-8">
            <p className="text-[var(--muted-foreground)] mb-4">
              Selecciona un personaje para comenzar a chatear y probar su personalidad
            </p>
            <button
              onClick={loadCharacters}
              className="bg-[var(--accent)] text-[var(--accent-foreground)] px-6 py-3 rounded-lg hover:bg-[var(--primary)] transition-colors font-medium"
            >
              Recargar Personajes
            </button>
          </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {characters.map((character) => (
                <div
                  key={character._id}
                  onClick={() => selectCharacter(character)}
                  className="group bg-[var(--card)] rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 cursor-pointer border border-[var(--border)] hover:border-[var(--accent)] hover:scale-105 hover:-translate-y-1"
                >
                  <div className="text-center mb-4">
                    <CharacterAvatar 
                      character={character} 
                      size="xl" 
                      className="mx-auto mb-4 group-hover:scale-110 transition-transform duration-300"
                    />
                    <h3 className="text-xl font-bold text-[var(--foreground)] mb-2">
                      {character.nombre}
                    </h3>
                    <div className="flex items-center justify-center space-x-2 mb-3">
                      <span className="text-sm text-[var(--muted-foreground)] bg-[var(--muted)] px-3 py-1 rounded-full">
                        {character.nacionalidad}
                      </span>
                      <span className="text-sm text-white bg-[var(--accent)] px-3 py-1 rounded-full font-medium">
                        {character.idioma_objetivo}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-[var(--muted-foreground)]">Profesión</span>
                      <span className="text-sm font-medium text-[var(--foreground)]">{character.personalidad.profesion}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-[var(--muted-foreground)]">Edad</span>
                      <span className="text-sm font-medium text-[var(--foreground)]">{character.personalidad.edad} años</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-[var(--muted-foreground)]">Nivel</span>
                      <span className="text-sm font-medium text-[var(--foreground)]">{character.restricciones.nivel_enseñanza}</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-[var(--muted-foreground)] line-clamp-2 text-center">
                      {character.personalidad.descripcion}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-6 justify-center">
                    {character.personalidad.rasgos.slice(0, 2).map((rasgo, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-[var(--accent)] text-white text-xs rounded-full font-medium"
                      >
                        {rasgo}
                      </span>
                    ))}
                  </div>

                  <div className="text-center">
                    <div className="bg-gradient-to-r from-[var(--accent)] to-[var(--primary)] text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300 font-medium group-hover:scale-105">
                      Chatear con {character.nombre}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
      </div>
    </div>
  );
}
