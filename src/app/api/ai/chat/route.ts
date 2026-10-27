import { NextResponse } from 'next/server';
import { aiModel } from '@/lib/gemini/client';
import { SYSTEM_PROMPTS } from '@/lib/gemini/prompts';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, message, history } = body;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Bangun percakapan dengan menyisipkan instruksi sistem di awal
    const chat = aiModel.startChat({
      history: [
        { role: "user", parts: [{ text: SYSTEM_PROMPTS.CHAT }] },
        { role: "model", parts: [{ text: "Baik, saya mengerti. Saya akan menjadi mentor akademik yang ramah dan suportif." }] },
        ...(history || [])
      ],
      generationConfig: { maxOutputTokens: 500 } // Batas token sesuai arsitektur
    });

    const result = await chat.sendMessage(message);
    
    return NextResponse.json({ reply: result.response.text() });
  } catch (error) {
    console.error("API Error Chat:", error);
    return NextResponse.json({ error: "Gagal memproses chat AI" }, { status: 500 });
  }
}