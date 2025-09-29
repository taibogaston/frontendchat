'use client';

import { AuthProvider } from '../hooks/useAuth';
import QueryProvider from './QueryProvider';
import { ThemeProvider } from '@/contexts/ThemeContext';

interface ClientProvidersProps {
  children: React.ReactNode;
}

export default function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <QueryProvider>{children}</QueryProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
