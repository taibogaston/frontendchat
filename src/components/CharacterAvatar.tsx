'use client';

import React from 'react';

interface CharacterAvatarProps {
  character: {
    nombre: string;
    nacionalidad: string;
    genero: "M" | "F";
    idioma_objetivo: string;
  };
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export default function CharacterAvatar({ character, size = 'md', className = '' }: CharacterAvatarProps) {
  // Generar colores únicos basados en el nombre del personaje
  const getCharacterColors = (name: string) => {
    const colors = [
      'from-blue-500 to-purple-600',
      'from-green-500 to-teal-600',
      'from-pink-500 to-rose-600',
      'from-orange-500 to-red-600',
      'from-indigo-500 to-blue-600',
      'from-emerald-500 to-green-600',
      'from-violet-500 to-purple-600',
      'from-cyan-500 to-blue-600',
      'from-amber-500 to-orange-600',
      'from-lime-500 to-green-600',
    ];
    
    const hash = name.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    return colors[Math.abs(hash) % colors.length];
  };

  // Generar emoji basado en nacionalidad
  const getCountryEmoji = (nacionalidad: string) => {
    const countryEmojis: { [key: string]: string } = {
      'España': '🇪🇸',
      'Estados Unidos': '🇺🇸',
      'Francia': '🇫🇷',
      'Japón': '🇯🇵',
      'Alemania': '🇩🇪',
      'Italia': '🇮🇹',
      'Reino Unido': '🇬🇧',
      'Canadá': '🇨🇦',
      'Australia': '🇦🇺',
      'Brasil': '🇧🇷',
      'México': '🇲🇽',
      'Argentina': '🇦🇷',
      'Colombia': '🇨🇴',
      'Chile': '🇨🇱',
      'Perú': '🇵🇪',
      'Venezuela': '🇻🇪',
      'Ecuador': '🇪🇨',
      'Uruguay': '🇺🇾',
      'Paraguay': '🇵🇾',
      'Bolivia': '🇧🇴',
    };
    
    return countryEmojis[nacionalidad] || '🌍';
  };

  // Generar emoji de género
  const getGenderEmoji = (genero: "M" | "F") => {
    return genero === "M" ? '👨' : '👩';
  };

  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-12 h-12 text-lg',
    lg: 'w-16 h-16 text-2xl',
    xl: 'w-20 h-20 text-3xl',
  };

  const colors = getCharacterColors(character.nombre);
  const countryEmoji = getCountryEmoji(character.nacionalidad);
  const genderEmoji = getGenderEmoji(character.genero);

  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      {/* Avatar principal con gradiente */}
      <div className={`w-full h-full bg-gradient-to-br ${colors} rounded-2xl flex items-center justify-center text-white font-bold shadow-lg relative overflow-hidden`}>
        {/* Patrón de fondo sutil */}
        <div className="absolute inset-0 bg-white bg-opacity-10"></div>
        
        {/* Contenido principal */}
        <div className="relative z-10 flex flex-col items-center justify-center">
          <span className="text-lg leading-none">{countryEmoji}</span>
          <span className="text-xs leading-none mt-1">{genderEmoji}</span>
        </div>
        
        {/* Borde decorativo */}
        <div className="absolute inset-0 rounded-2xl border-2 border-white border-opacity-20"></div>
      </div>
      
      {/* Indicador de idioma */}
      <div className="absolute -bottom-1 -right-1 bg-[var(--accent)] text-white text-xs px-2 py-1 rounded-full font-medium shadow-lg">
        {character.idioma_objetivo.charAt(0).toUpperCase()}
      </div>
    </div>
  );
}
