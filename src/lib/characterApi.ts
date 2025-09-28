import { useState } from 'react';
import { apiClient } from './api';

export interface Character {
  _id: string;
  nombre: string;
  nacionalidad: string;
  genero: "M" | "F";
  idioma_objetivo: string;
  personalidad: {
    descripcion: string;
    rasgos: string[];
    motivaciones: string[];
    miedos: string[];
    sueños: string[];
    hobbies: string[];
    profesion: string;
    edad: number;
    estado_civil: string;
    familia: string;
    lugar_nacimiento: string;
    residencia_actual: string;
  };
  historia_personal: {
    infancia: string;
    juventud: string;
    vida_actual: string;
    experiencias_clave: string[];
    anecdotas: string[];
  };
  contexto_cultural: {
    tradiciones: string[];
    comida_favorita: string[];
    musica_preferida: string[];
    lugares_importantes: string[];
    festividades: string[];
    costumbres: string[];
  };
  estilo_conversacional: {
    tono: string;
    expresiones_tipicas: string[];
    palabras_clave: string[];
    nivel_formalidad: "formal" | "informal" | "mixto";
    velocidad_habla: "lenta" | "normal" | "rapida";
  };
  restricciones: {
    idiomas_permitidos: string[];
    temas_evitar: string[];
    temas_favoritos: string[];
    nivel_enseñanza: "principiante" | "intermedio" | "avanzado";
  };
  activo: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CharacterStats {
  total: number;
  por_idioma: Record<string, number>;
  por_nacionalidad: Record<string, number>;
  por_genero: { M: number; F: number };
  por_nivel_enseñanza: Record<string, number>;
}

export interface ValidationResult {
  isValid: boolean;
  violations: string[];
  character: {
    nombre: string;
    nacionalidad: string;
    idioma_objetivo: string;
  };
}

export class CharacterApi {
  // Obtener todos los personajes
  static async getAllCharacters(): Promise<Character[]> {
    return await apiClient.getCharacters();
  }

  // Obtener personaje por ID
  static async getCharacterById(id: string): Promise<Character> {
    return await apiClient.getCharacterById(id);
  }

  // Obtener personajes por idioma
  static async getCharactersByLanguage(idioma: string): Promise<Character[]> {
    return await apiClient.getCharactersByLanguage(idioma);
  }

  // Obtener personajes por nacionalidad
  static async getCharactersByNationality(nacionalidad: string): Promise<Character[]> {
    return await apiClient.getCharactersByNationality(nacionalidad);
  }

  // Buscar personajes con criterios específicos
  static async searchCharacters(criteria: {
    idioma?: string;
    nacionalidad?: string;
    genero?: "M" | "F";
    nivel_enseñanza?: string;
    edad_min?: number;
    edad_max?: number;
  }): Promise<Character[]> {
    return await apiClient.searchCharacters(criteria);
  }

  // Obtener personajes recomendados
  static async getRecommendedCharacters(
    idioma_objetivo?: string,
    nacionalidad?: string,
    genero?: "M" | "F"
  ): Promise<Character[]> {
    return await apiClient.getRecommendedCharacters(idioma_objetivo, nacionalidad, genero);
  }

  // Crear chat con personaje específico
  static async createChatWithCharacter(characterId: string): Promise<{
    success: boolean;
    chatId: string;
    character: Character;
  }> {
    return await apiClient.createChatWithCharacter(characterId);
  }

  // Obtener personaje aleatorio por idioma
  static async getRandomCharacterByLanguage(idioma: string): Promise<Character> {
    return await apiClient.getRandomCharacterByLanguage(idioma);
  }

  // Validar consistencia de mensaje con personaje
  static async validateMessage(characterId: string, message: string): Promise<ValidationResult> {
    return await apiClient.validateMessage(characterId, message);
  }

  // Obtener estadísticas de personajes
  static async getCharacterStats(): Promise<CharacterStats> {
    return await apiClient.getCharacterStats();
  }

  // Inicializar personajes (solo para desarrollo)
  static async seedCharacters(): Promise<{ message: string }> {
    return await apiClient.seedCharacters();
  }
}

// Hook personalizado para usar personajes
export function useCharacters() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCharacters = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await CharacterApi.getAllCharacters();
      setCharacters(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error cargando personajes');
    } finally {
      setLoading(false);
    }
  };

  const loadCharactersByLanguage = async (idioma: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await CharacterApi.getCharactersByLanguage(idioma);
      setCharacters(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error cargando personajes');
    } finally {
      setLoading(false);
    }
  };

  const searchCharacters = async (criteria: Record<string, unknown>) => {
    try {
      setLoading(true);
      setError(null);
      const data = await CharacterApi.searchCharacters(criteria);
      setCharacters(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error buscando personajes');
    } finally {
      setLoading(false);
    }
  };

  return {
    characters,
    loading,
    error,
    loadCharacters,
    loadCharactersByLanguage,
    searchCharacters
  };
}

// Hook para crear chat con personaje
export function useCreateChatWithCharacter() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createChat = async (characterId: string) => {
    try {
      setLoading(true);
      setError(null);
      const result = await CharacterApi.createChatWithCharacter(characterId);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error creando chat');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    createChat,
    loading,
    error
  };
}
