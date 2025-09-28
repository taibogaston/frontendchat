"use client";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import DarkHeader from "@/components/DarkHeader";
import CharacterAvatar from "@/components/CharacterAvatar";

type Message = { _id: string; sender: "user" | "ia"; content: string; createdAt: string };
type Chat = { 
  _id?: string;  // Para chats existentes
  id?: string;   // Para nuevos chats
  partner: { nombre: string; nacionalidad: string; genero: string; idioma_objetivo: string }; 
  activo: boolean; 
  createdAt: string 
};

export default function ChatDetailPage() {
  const params = useParams<{ chatId: string }>();
  const router = useRouter();
  const chatId = params.chatId;
  const qc = useQueryClient();
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const { token } = useAuth();
  const [newChat, setNewChat] = useState<Chat | null>(null);

  // Query para obtener información del chat
  const { data: chatInfo } = useQuery<Chat>({
    queryKey: ["chat", chatId],
    queryFn: async () => {
      if (!token) throw new Error("No autenticado");
      
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'}/chats/${chatId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!res.ok) throw new Error("Error cargando chat");
      return res.json();
    },
    enabled: !!token && !!chatId,
  });

  const { data: messages, isLoading, error: messagesError } = useQuery<Message[]>({
    queryKey: ["messages", chatId],
    queryFn: async () => {
      if (!token) throw new Error("No autenticado");
      
      console.log("🔍 Cargando mensajes para chatId:", chatId);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'}/messages/${chatId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error("❌ Error cargando mensajes:", errorData);
        throw new Error(errorData.error || `Error ${res.status}: ${res.statusText}`);
      }
      
      const data = await res.json();
      console.log("📨 Mensajes cargados:", data);
      return data;
    },
    enabled: !!token && !!chatId,
    retry: (failureCount, error) => {
      // No reintentar si es error de autenticación
      if (error.message.includes('Token inválido') || error.message.includes('401')) {
        return false;
      }
      return failureCount < 3;
    },
  });

  useEffect(() => {
    if (scrollerRef.current) {
      scrollerRef.current.scrollTo({ top: scrollerRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [messages]);

  const [text, setText] = useState("");
  const sendMutation = useMutation({
    mutationFn: async (content: string) => {
      if (!token) throw new Error("No autenticado");
      
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'}/messages/${chatId}`, {
        method: "POST",
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json" 
        },
        body: JSON.stringify({ sender: "user", content }),
      });
      if (!res.ok) throw new Error("Error enviando");
      return res.json();
    },
    onSuccess: (data) => {
      setText("");
      qc.invalidateQueries({ queryKey: ["messages", chatId] });
      
      // Si se detectó un nuevo chat, mostrarlo y actualizar la lista de chats
      if (data.newChat) {
        console.log('🆕 Nuevo chat recibido:', data.newChat);
        console.log('🆕 ID del nuevo chat:', data.newChat.id || data.newChat._id);
        setNewChat(data.newChat);
        qc.invalidateQueries({ queryKey: ["chats"] });
      }
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent)] mx-auto"></div>
          <p className="mt-4 text-[var(--muted-foreground)]">Cargando chat...</p>
        </div>
      </div>
    );
  }

  if (messagesError) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-[var(--foreground)] mb-2">
            Error de Autenticación
          </h2>
          <p className="text-[var(--muted-foreground)] mb-4">
            {messagesError.message.includes('Token inválido') 
              ? 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.'
              : messagesError.message
            }
          </p>
          <button
            onClick={() => {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              router.push('/auth');
            }}
            className="px-4 py-2 bg-[var(--accent)] text-white rounded-lg hover:bg-[var(--primary)] transition-colors"
          >
            Iniciar Sesión
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen flex flex-col bg-[var(--background)]">
      <DarkHeader title={chatInfo?.partner?.nombre || "Conversación"} />
      
      {/* Botón de volver atrás */}
      <div className="bg-[var(--card)] border-b border-[var(--border)] px-4 py-3">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={() => router.push('/inicio')}
            className="flex items-center space-x-2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm font-medium">Volver al Inicio</span>
          </button>
        </div>
      </div>

      <div ref={scrollerRef} className="flex-1 overflow-y-auto bg-[var(--background)]">
        <div className="max-w-3xl mx-auto w-full px-4 py-6 space-y-3">
          {isLoading ? (
            <div className="text-[var(--muted-foreground)]">Cargando...</div>
          ) : (
            messages?.map((m) => (
              <MessageBubble key={m._id} message={m} />
            ))
          )}
          
          {/* Notificación de nuevo chat */}
          {newChat && (
            <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 mb-6 shadow-lg">
              <div className="flex items-center gap-4">
                <CharacterAvatar 
                  character={newChat.partner} 
                  size="lg" 
                  className="shadow-md"
                />
                <div className="flex-1">
                  <h3 className="font-bold text-[var(--foreground)] text-lg mb-1">
                    ¡Nuevo amigo disponible!
                  </h3>
                  <p className="text-[var(--muted-foreground)]">
                    <span className="font-semibold text-[var(--accent)]">{newChat.partner.nombre}</span> de <span className="font-medium">{newChat.partner.nacionalidad}</span> quiere hablar contigo
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <a
                    href={`/chats/${newChat.id || newChat._id}`}
                    className="flex items-center gap-2 px-6 py-3 bg-[var(--accent)] text-white text-sm font-semibold rounded-xl hover:bg-[var(--primary)] transition-all duration-200 shadow-lg"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    Ir al chat
                  </a>
                  <button
                    onClick={() => setNewChat(null)}
                    className="p-3 text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)] rounded-lg transition-all duration-200"
                    title="Cerrar notificación"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <form
        className="sticky bottom-0 border-t border-[var(--border)] bg-[var(--card)]/95 backdrop-blur-md shadow-lg"
        onSubmit={(e) => {
          e.preventDefault();
          if (!text.trim()) return;
          sendMutation.mutate(text.trim());
        }}
      >
        <div className="max-w-3xl mx-auto w-full px-4 py-3 flex gap-2">
          <input
            className="flex-1 rounded-2xl border border-[var(--border)] bg-[var(--input)] text-[var(--foreground)] px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--ring)] focus:border-[var(--ring)] placeholder-[var(--muted-foreground)]"
            placeholder="Escribe un mensaje..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button
            className="px-6 py-3 rounded-2xl bg-[var(--accent)] text-white font-medium shadow-lg hover:bg-[var(--primary)] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            type="submit"
            disabled={sendMutation.isPending}
          >
            {sendMutation.isPending ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Enviando...
              </div>
            ) : (
              'Enviar'
            )}
          </button>
        </div>
      </form>
    </main>
  );
}

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.sender === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      <div
        className={
          `max-w-[80%] rounded-2xl px-4 py-3 text-[15px] leading-relaxed shadow-sm ` +
          (isUser
            ? "bg-[var(--accent)] text-white"
            : "bg-[var(--muted)] text-[var(--foreground)] border border-[var(--border)]")
        }
      >
        <div className="whitespace-pre-wrap">{message.content}</div>
        <div className={`mt-2 text-[11px] font-medium ${isUser ? "text-blue-100" : "text-[var(--muted-foreground)]"}`}>
          {new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </div>
      </div>
    </div>
  );
}


