'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AuthModal from '@/components/Auth/AuthModal';
import { User } from '@/types/api';
import { useAuth } from '@/hooks/useAuth';

export default function AuthPage() {
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  const { setAuthData } = useAuth();

  useEffect(() => {
    // Verificar si ya está autenticado
    const token = localStorage.getItem('token');
    if (token) {
      router.push('/chats');
    } else {
      setShowModal(true);
    }
  }, [router]);

  const handleLoginSuccess = (token: string, user: User) => {
    console.log("🔐 AuthPage - handleLoginSuccess called:", { 
      userId: user.id, 
      email: user.email,
      tokenPreview: token.substring(0, 20) + '...'
    });
    
    // Usar setAuthData para actualizar el contexto correctamente
    setAuthData(token, user);
    
    console.log("🔐 AuthPage - Auth data set, redirecting...");
    
    if (user.onboardingCompleted) {
      router.push('/chats');
    } else {
      router.push('/onboarding');
    }
  };

  const handleCloseModal = () => {
    router.push('/');
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-slate-50 flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        {/* Header con logo y título */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Bienvenido a ChatBot
          </h1>
          <p className="text-gray-600 leading-relaxed">
            Aprende idiomas conversando con personajes auténticos de diferentes países
          </p>
        </div>
        
        <AuthModal
          isOpen={showModal}
          onClose={handleCloseModal}
          onLoginSuccess={handleLoginSuccess}
        />
      </div>
    </main>
  );
}
