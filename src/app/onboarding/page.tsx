'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import OnboardingForm from '@/components/Onboarding/OnboardingForm';

export default function OnboardingPage() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Verificar autenticación
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth');
      return;
    }

    // Verificar si ya completó el onboarding
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.onboardingCompleted) {
      router.push('/chats');
      return;
    }

    setLoading(false);
  }, [router]);

  const handleOnboardingComplete = (data: { user: { onboardingCompleted: boolean } }) => {
    // Actualizar usuario en localStorage con los datos del servidor
    const updatedUser = { ...data.user, onboardingCompleted: true };
    localStorage.setItem('user', JSON.stringify(updatedUser));

    // Redirigir a la lista de chats
    router.push('/chats');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <OnboardingForm onComplete={handleOnboardingComplete} />
    </div>
  );
}
