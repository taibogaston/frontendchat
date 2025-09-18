"use client";
import { useAuth } from "@/hooks/useAuth";

interface HeaderProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  backHref?: string;
  backText?: string;
}

export default function Header({ 
  title, 
  subtitle, 
  showBackButton = false, 
  backHref, 
  backText = "Volver" 
}: HeaderProps) {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-10 backdrop-blur-md bg-white/80 border-b border-gray-200 shadow-sm">
      <div className="max-w-3xl mx-auto w-full px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            {subtitle && (
              <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
            )}
            {user && !subtitle && (
              <p className="text-sm text-gray-600 mt-1">Hola, <span className="font-medium text-gray-900">{user.nombre}</span></p>
            )}
          </div>
          <div className="flex items-center gap-3">
            {showBackButton && backHref && (
              <a 
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200" 
                href={backHref}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                {backText}
              </a>
            )}
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 hover:border-red-300 transition-all duration-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
