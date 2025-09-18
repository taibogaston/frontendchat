'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface VerifyEmailPageProps {
  params: Promise<{
    token: string;
  }>;
}

export default function VerifyEmailPage({ params }: VerifyEmailPageProps) {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const resolvedParams = await params;
        const response = await fetch(`/api/auth/verify/${resolvedParams.token}`);
        const data = await response.json();

        if (response.ok) {
          setStatus('success');
          setMessage(data.message);
          
          // Guardar token y usuario
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
          
          // Redirigir según el estado del onboarding
          setTimeout(() => {
            if (data.user.onboardingCompleted) {
              router.push('/chats');
            } else {
              router.push('/onboarding');
            }
          }, 2000);
        } else {
          setStatus('error');
          setMessage(data.error || 'Error verificando email');
        }
      } catch {
        setStatus('error');
        setMessage('Error de conexión');
      }
    };

    verifyEmail();
  }, [params, router]);

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
