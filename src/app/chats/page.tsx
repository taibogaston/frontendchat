"use client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import DarkHeader from "@/components/DarkHeader";
import CharacterAvatar from "@/components/CharacterAvatar";
import { useEffect } from "react";

type Chat = {
  _id: string;
  userId: string;
  partner: { nombre: string; nacionalidad: string; genero: "M" | "F"; idioma_objetivo: string };
  activo: boolean;
  createdAt: string;
};

export default function ChatsPage() {
  const { user, token } = useAuth();
  const queryClient = useQueryClient();
  
  // Invalidar query cuando cambie el usuario o token
  useEffect(() => {
    console.log("ChatsPage - useEffect triggered:", { user: user?.id, token: !!token });
    if (user && token) {
      console.log("ChatsPage - Invalidating queries");
      queryClient.invalidateQueries({ queryKey: ["chats"] });
    }
  }, [user, token, queryClient]);
  
  const { data, isLoading, error } = useQuery<Chat[]>({
    queryKey: ["chats", user?.id, token],
    queryFn: async () => {
      console.log("🔍 ChatsPage - queryFn executing:", { 
        userId: user?.id, 
        userIdType: typeof user?.id,
        hasToken: !!token,
        tokenPreview: token ? token.substring(0, 20) + '...' : 'none',
        userObject: user
      });
      
      if (!token || !user?.id) {
        console.log("❌ ChatsPage - No token or user ID");
        throw new Error("No autenticado");
      }
      
      const url = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'}/chats`;
      console.log("🌐 ChatsPage - Fetching from:", url);
      
      const res = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      console.log("📡 ChatsPage - Response status:", res.status);
      console.log("📡 ChatsPage - Response headers:", Object.fromEntries(res.headers.entries()));
      
      if (!res.ok) {
        const errorText = await res.text();
        console.log("❌ ChatsPage - Error response:", errorText);
        throw new Error(`Error ${res.status}: ${errorText}`);
      }
      
      const result = await res.json();
      console.log("✅ ChatsPage - Success result:", result);
      console.log("📊 ChatsPage - Number of chats:", result.length);
      
      return result;
    },
    enabled: !!token && !!user?.id, // Solo ejecutar si hay token y user
    retry: (failureCount, error) => {
      console.log("🔄 ChatsPage - Retry attempt:", failureCount, error.message);
      if (error.message.includes('Token inválido') || error.message.includes('401')) {
        return false;
      }
      return failureCount < 3;
    },
  });

  return (
    <main className="min-h-screen bg-[var(--background)]">
      <DarkHeader title="Mis Chats" />
      <div className="max-w-3xl mx-auto w-full px-4 py-6 space-y-4">
        {/* Botón para ir a personajes */}
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-lg text-[var(--foreground)]">🎭 Seleccionar Personaje</h3>
              <p className="text-sm text-[var(--muted-foreground)]">Chatea con personajes únicos y consistentes</p>
            </div>
            <Link
              href="/inicio"
              className="bg-[var(--accent)] text-[var(--accent-foreground)] px-4 py-2 rounded-lg hover:bg-[var(--primary)] transition-colors text-sm font-medium"
            >
              Ir a Inicio
            </Link>
          </div>
        </div>

        {isLoading && <div className="text-[var(--muted-foreground)]">Cargando...</div>}
        {error && <div className="text-red-400">Error cargando chats</div>}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data?.map((c) => (
            <div
              key={c._id}
              className="group rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-sm hover:shadow-lg hover:border-[var(--accent)] transition-all duration-300 p-6 flex flex-col gap-4"
            >
              <div className="flex items-center gap-4">
                <CharacterAvatar 
                  character={c.partner} 
                  size="md" 
                  className="shadow-md"
                />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-[var(--foreground)] truncate">{c.partner.nombre}</div>
                  <div className="text-sm text-[var(--muted-foreground)] flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                    {c.partner.idioma_objetivo}
                  </div>
                </div>
              </div>
              
              <div className="text-xs text-[var(--muted-foreground)] bg-[var(--muted)] rounded-lg px-3 py-2">
                {new Date(c.createdAt).toLocaleDateString('es-ES', { 
                  day: 'numeric', 
                  month: 'short', 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </div>
              
              <Link
                className="group-hover:bg-[var(--accent)] group-hover:text-white bg-[var(--muted)] text-[var(--foreground)] px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 text-center"
                href={`/chats/${c._id}`}
              >
                Abrir conversación
              </Link>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}


