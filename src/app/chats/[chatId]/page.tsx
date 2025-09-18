"use client";
import { useParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/Header";

type Message = { _id: string; sender: "user" | "ia"; content: string; createdAt: string };
type Chat = { 
  _id: string; 
  partner: { nombre: string; nacionalidad: string; genero: string; idioma_objetivo: string }; 
  activo: boolean; 
  createdAt: string 
};

export default function ChatDetailPage() {
  const params = useParams<{ chatId: string }>();
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

  const { data: messages, isLoading } = useQuery<Message[]>({
    queryKey: ["messages", chatId],
    queryFn: async () => {
      if (!token) throw new Error("No autenticado");
      
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'}/messages/${chatId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!res.ok) throw new Error("Error cargando mensajes");
      return res.json();
    },
    enabled: !!token,
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
        setNewChat(data.newChat);
        qc.invalidateQueries({ queryKey: ["chats"] });
      }
    },
  });

  return (
    <main className="min-h-screen flex flex-col">
      <Header 
        title={chatInfo?.partner?.nombre || "Conversación"} 
        subtitle={chatInfo?.partner ? `${chatInfo.partner.nacionalidad} · ${chatInfo.partner.idioma_objetivo}` : undefined}
        showBackButton={true} 
        backHref="/chats" 
        backText="Volver a chats" 
      />

      <div ref={scrollerRef} className="flex-1 overflow-y-auto bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-3xl mx-auto w-full px-4 py-6 space-y-3">
          {isLoading ? (
            <div className="text-gray-500">Cargando...</div>
          ) : (
            messages?.map((m) => (
              <MessageBubble key={m._id} message={m} />
            ))
          )}
          
          {/* Notificación de nuevo chat */}
          {newChat && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6 mb-6 shadow-lg">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-md">
                  <span className="text-white font-bold text-xl">👋</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 text-lg mb-1">
                    ¡Nuevo amigo disponible!
                  </h3>
                  <p className="text-gray-700">
                    <span className="font-semibold text-green-700">{newChat.partner.nombre}</span> de <span className="font-medium">{newChat.partner.nacionalidad}</span> quiere hablar contigo
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <a
                    href={`/chats/${newChat._id}`}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-sm font-semibold rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    Ir al chat
                  </a>
                  <button
                    onClick={() => setNewChat(null)}
                    className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
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
        className="sticky bottom-0 border-t border-gray-200 bg-white/95 backdrop-blur-md shadow-lg"
        onSubmit={(e) => {
          e.preventDefault();
          if (!text.trim()) return;
          sendMutation.mutate(text.trim());
        }}
      >
        <div className="max-w-3xl mx-auto w-full px-4 py-3 flex gap-2">
          <input
            className="flex-1 rounded-2xl border border-gray-300 bg-white text-gray-900 px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-500"
            placeholder="Escribe un mensaje..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button
            className="px-6 py-3 rounded-2xl bg-blue-600 text-white font-medium shadow-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
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
            ? "bg-gradient-to-br from-blue-600 to-indigo-600 text-white"
            : "bg-white text-gray-900 border border-gray-200")
        }
      >
        <div className="whitespace-pre-wrap">{message.content}</div>
        <div className={`mt-2 text-[11px] font-medium ${isUser ? "text-blue-100" : "text-gray-500"}`}>
          {new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </div>
      </div>
    </div>
  );
}


