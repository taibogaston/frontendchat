'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';

interface VerifyEmailPageProps {
  params: Promise<{
    token: string;
  }>;
}

export default function VerifyEmailPage({ params }: VerifyEmailPageProps) {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const router = useRouter();
  const { setAuthData } = useAuth();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const resolvedParams = await params;
        console.log('🔍 Verificando email con token:', resolvedParams.token);
        
        const data = await apiClient.verifyEmail(resolvedParams.token);
        
        setStatus('success');
        setMessage(data.message || 'Email verificado exitosamente');
        
        // Guardar token y usuario usando el contexto de autenticación
        if (data.token && data.user) {
          setAuthData(data.token, data.user);
          
          // Redirigir según el estado del onboarding
          setTimeout(() => {
            if (data.user?.onboardingCompleted) {
              router.push('/inicio');
            } else {
              router.push('/onboarding');
            }
          }, 2000);
        } else {
          // Si no hay token en la respuesta, redirigir al login
          setTimeout(() => {
            router.push('/auth');
          }, 2000);
        }
      } catch (error) {
        console.error('❌ Error verificando email:', error);
        setStatus('error');
        setMessage(error instanceof Error ? error.message : 'Error de conexión');
      }
    };

    verifyEmail();
  }, [params, router, setAuthData]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6 text-center">
        {status === 'loading' && (
          <>
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Verificando email...
            </h2>
            <p className="text-gray-600">
              Por favor espera mientras verificamos tu cuenta.
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              ¡Email verificado!
            </h2>
            <p className="text-gray-600 mb-4">
              {message}
            </p>
            <p className="text-sm text-gray-500">
              Redirigiendo automáticamente...
            </p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Error de verificación
            </h2>
            <p className="text-gray-600 mb-4">
              {message}
            </p>
            <button
              onClick={() => router.push('/auth')}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Volver al login
            </button>
          </>
        )}
      </div>
    </div>
  );
}
