"use client";
import { useState, useRef } from "react";
import { useAuthStore } from "@/stores/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, X, Send, Bot, Loader2 } from "lucide-react";

export function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<{role: "user" | "model", parts: [{text: string}]}[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuthStore();

  // --- STATE & REF UNTUK DRAG & DROP ---
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const dragStart = useRef({ x: 0, y: 0, initX: 0, initY: 0 });
  const isDraggingRef = useRef(false);

  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    dragStart.current = {
      x: e.clientX,
      y: e.clientY,
      initX: position.x,
      initY: position.y,
    };
    isDraggingRef.current = false;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!e.currentTarget.hasPointerCapture(e.pointerId)) return;

    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;

    // Jika digeser lebih dari 5 pixel, tandai sebagai 'dragging'
    if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
      isDraggingRef.current = true;
    }

    setPosition({
      x: dragStart.current.initX + dx,
      y: dragStart.current.initY + dy,
    });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLButtonElement>) => {
    e.currentTarget.releasePointerCapture(e.pointerId);
  };
  // -------------------------------------

  const handleSend = async () => {
    if (!message.trim() || !user || loading) return;

    const userMessage = message;
    setMessage("");
    setChatHistory(prev => [...prev, { role: "user", parts: [{ text: userMessage }] }]);
    setLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        body: JSON.stringify({
          userId: user.uid,
          message: userMessage,
          history: chatHistory
        }),
      });
      const data = await res.json();
      if (data.reply) {
        setChatHistory(prev => [...prev, { role: "model", parts: [{ text: data.reply }] }]);
      }
    } catch (error) {
      console.error("Chat error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="fixed bottom-6 right-6 z-50"
      style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
    >
      {isOpen ? (
        <div className="glass-panel w-[350px] sm:w-[400px] h-[500px] rounded-3xl flex flex-col shadow-2xl border-primary/20 animate-in zoom-in-95 duration-300">
          <div className="p-4 border-b flex justify-between items-center bg-primary/5 rounded-t-3xl">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold">Mentor Akademik</p>
                <p className="text-[10px] text-primary font-medium uppercase tracking-widest">AI Assistant</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="rounded-full">
              <X className="w-4 h-4" />
            </Button>
          </div>

          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {chatHistory.length === 0 && (
                <div className="text-center py-10">
                  <Bot className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Halo! Ada yang bisa saya bantu terkait kuliah atau manajemen waktu?</p>
                </div>
              )}
              {chatHistory.map((chat, i) => (
                <div key={i} className={`flex ${chat.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                    chat.role === "user" 
                      ? "bg-primary text-white rounded-tr-none" 
                      : "bg-muted rounded-tl-none"
                  }`}>
                    {chat.parts[0].text}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-muted p-3 rounded-2xl rounded-tl-none">
                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="p-4 border-t">
            <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2">
              <Input 
                value={message} 
                onChange={(e) => setMessage(e.target.value)} 
                placeholder="Tanya mentor..." 
                className="rounded-xl bg-muted/50 border-none h-11"
              />
              <Button type="submit" size="icon" className="rounded-xl h-11 w-11 shadow-lg shadow-primary/20" disabled={loading}>
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </div>
      ) : (
        <Button 
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onClick={(e) => {
            // Cegah panel terbuka jika user berniat menggeser tombol
            if (isDraggingRef.current) {
              e.preventDefault();
              return;
            }
            setIsOpen(true);
          }}
          className="w-14 h-14 rounded-full shadow-2xl shadow-primary/40 hover:scale-110 transition-transform cursor-grab active:cursor-grabbing touch-none"
          style={{ touchAction: 'none' }} // Mencegah layar scroll saat digeser di HP
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      )}
    </div>
  );
}