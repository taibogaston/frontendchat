"use client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/Header";
import { useEffect } from "react";

type Chat = {
  _id: string;
  userId: string;
  partner: { nombre: string; nacionalidad: string; genero: string; idioma_objetivo: string };
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
      console.log("ChatsPage - queryFn executing:", { userId: user?.id, hasToken: !!token });
      if (!token || !user?.id) throw new Error("No autenticado");
      
      const res = await fetch(`http://localhost:4000/api/chats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!res.ok) throw new Error("Error cargando chats");
      const result = await res.json();
      console.log("ChatsPage - queryFn result:", result);
      return result;
    },
    enabled: !!token && !!user?.id, // Solo ejecutar si hay token y user
  });

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-slate-50">
      <Header title="Mis Chats" />
      <div className="max-w-3xl mx-auto w-full px-4 py-6 space-y-4">
        {isLoading && <div className="text-gray-500">Cargando...</div>}
        {error && <div className="text-red-600">Error cargando chats</div>}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data?.map((c) => (
            <div
              key={c._id}
              className="group rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-lg hover:border-blue-300 transition-all duration-300 p-6 flex flex-col gap-4"
            >
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-md">
                  {c.partner.nombre.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-900 truncate">{c.partner.nombre}</div>
                  <div className="text-sm text-gray-600 flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                    {c.partner.idioma_objetivo}
                  </div>
                </div>
              </div>
              
              <div className="text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2">
                {new Date(c.createdAt).toLocaleDateString('es-ES', { 
                  day: 'numeric', 
                  month: 'short', 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </div>
              
              <Link
                className="group-hover:bg-blue-600 group-hover:text-white bg-blue-50 text-blue-600 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 text-center"
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


