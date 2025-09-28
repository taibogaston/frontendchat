'use client';

import React, { useState, useEffect } from 'react';
import { Character, CharacterApi } from '../../lib/characterApi';

export default function TestCharactersPage() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [chatId, setChatId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Array<{sender: string, content: string}>>([]);
  const [sending, setSending] = useState(false);

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
      setSelectedCharacter(character);
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
            setChatId(existingChat._id);
            
            // Cargar mensajes existentes
            try {
              const messagesResponse = await fetch(`http://localhost:4000/api/messages/${existingChat._id}`, {
                headers: {
                  'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
              });
              
              if (messagesResponse.ok) {
                const messagesData = await messagesResponse.json();
                const formattedMessages = messagesData.map((msg: any) => ({
                  sender: msg.sender,
                  content: msg.content
                }));
                setMessages(formattedMessages);
                console.log('Mensajes cargados:', formattedMessages);
              } else {
                setMessages([]);
              }
            } catch (err) {
              console.log('Error cargando mensajes:', err);
              setMessages([]);
            }
            return;
          }
        }
      } catch (err) {
        console.log('No se pudieron obtener chats existentes, creando nuevo chat');
      }
      
      // Si no existe, crear chat con el personaje
      const result = await CharacterApi.createChatWithCharacter(character._id);
      if (result) {
        setChatId(result.chatId);
        setMessages([]);
        console.log('Chat creado:', result);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error creando chat');
      console.error('Error:', err);
    }
  };

  const sendMessage = async () => {
    if (!message.trim() || !chatId || sending) return;

    try {
      setSending(true);
      
      // Agregar mensaje del usuario
      const userMessage = { sender: 'user', content: message };
      setMessages(prev => [...prev, userMessage]);
      
      // Enviar mensaje al backend usando la API
      const response = await fetch(`http://localhost:4000/api/messages/${chatId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          sender: 'user',
          content: message
        })
      });

      if (!response.ok) {
        throw new Error('Error enviando mensaje');
      }

      const data = await response.json();
      console.log('Respuesta del backend:', data);

      // Agregar respuesta de la IA
      if (data.aiMsg) {
        setMessages(prev => [...prev, { sender: 'ia', content: data.aiMsg.content }]);
      }

      setMessage('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error enviando mensaje');
      console.error('Error:', err);
    } finally {
      setSending(false);
    }
  };

  const resetChat = () => {
    setSelectedCharacter(null);
    setChatId(null);
    setMessages([]);
    setMessage('');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando personajes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          🎭 Prueba de Personajes
        </h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <strong>Error:</strong> {error}
          </div>
        )}

        {!selectedCharacter ? (
          // Selección de personajes
          <div className="space-y-6">
            <div className="text-center mb-8">
              <p className="text-gray-600 mb-4">
                Selecciona un personaje para comenzar a chatear y probar su personalidad
              </p>
              <button
                onClick={loadCharacters}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Recargar Personajes
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {characters.map((character) => (
                <div
                  key={character._id}
                  onClick={() => selectCharacter(character)}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-blue-500"
                >
                  <div className="text-center mb-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-3">
                      {character.nombre.charAt(0)}
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">
                      {character.nombre}
                    </h3>
                    <p className="text-gray-600">
                      {character.nacionalidad} • {character.idioma_objetivo}
                    </p>
                  </div>

                  <div className="space-y-2 mb-4">
                    <p className="text-sm text-gray-700">
                      <strong>Profesión:</strong> {character.personalidad.profesion}
                    </p>
                    <p className="text-sm text-gray-700">
                      <strong>Edad:</strong> {character.personalidad.edad} años
                    </p>
                    <p className="text-sm text-gray-700">
                      <strong>Nivel:</strong> {character.restricciones.nivel_enseñanza}
                    </p>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {character.personalidad.descripcion}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {character.personalidad.rasgos.slice(0, 3).map((rasgo, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                      >
                        {rasgo}
                      </span>
                    ))}
                  </div>

                  <div className="text-center">
                    <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-full">
                      Chatear con {character.nombre}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          // Chat con personaje seleccionado
          <div className="bg-white rounded-lg shadow-lg h-[600px] flex flex-col">
            {/* Header del chat */}
            <div className="bg-blue-500 text-white p-4 rounded-t-lg flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-white font-bold">
                  {selectedCharacter.nombre.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold">{selectedCharacter.nombre}</h3>
                  <p className="text-sm opacity-90">
                    {selectedCharacter.nacionalidad} • {selectedCharacter.idioma_objetivo}
                  </p>
                </div>
              </div>
              <button
                onClick={resetChat}

                className="bg-green-500 bg-opacity-20 hover:bg-opacity-30 px-3 py-1 rounded text-sm text-white font-medium"
              >
                Cambiar Personaje
              </button>
            </div>

            {/* Mensajes */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  <p>¡Hola! Soy {selectedCharacter.nombre} de {selectedCharacter.nacionalidad}.</p>
                  <p className="mt-2">Estoy aquí para ayudarte a practicar {selectedCharacter.idioma_objetivo}.</p>
                  <p className="mt-2 text-sm">¡Escribe algo para comenzar!</p>
                </div>
              )}
              
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      msg.sender === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-800'
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                  </div>
                </div>
              ))}
              
              {sending && (
                <div className="flex justify-start">
                  <div className="bg-gray-200 text-gray-800 max-w-xs lg:max-w-md px-4 py-2 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="animate-pulse">...</div>
                      <span className="text-sm">Escribiendo...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input de mensaje */}
            <div className="border-t p-4">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder={`Escribe en ${selectedCharacter.idioma_objetivo}...`}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={sending}
                />
                <button
                  onClick={sendMessage}
                  disabled={!message.trim() || sending}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Enviar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
