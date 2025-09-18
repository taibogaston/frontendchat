'use client';

import dynamic from "next/dynamic";

const ClientProviders = dynamic(() => import("./ClientProviders"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg animate-pulse">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <p className="text-gray-600">Cargando...</p>
      </div>
    </div>
  ),
});

interface DynamicProvidersProps {
  children: React.ReactNode;
}

export default function DynamicProviders({ children }: DynamicProvidersProps) {
  return <ClientProviders>{children}</ClientProviders>;
}
