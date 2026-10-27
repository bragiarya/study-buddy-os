import { NextResponse } from 'next/server';
import { aiModel } from '@/lib/gemini/client';
import { SYSTEM_PROMPTS } from '@/lib/gemini/prompts';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, habitsData } = body;

    // Validasi sederhana user
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Gabungkan prompt sistem dengan data habit milik user
    const prompt = `${SYSTEM_PROMPTS.INSIGHT}\n\nData Habit Saya Saat Ini: ${JSON.stringify(habitsData)}`;
    
    // Panggil model Gemini (max 1000 tokens sesuai arsitektur)
    const result = await aiModel.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { maxOutputTokens: 1000 }
    });
    
    const responseText = result.response.text();
    
    return NextResponse.json({ insight: responseText });
  } catch (error) {
    console.error("API Error Insight:", error);
    return NextResponse.json({ error: "Gagal memproses insight AI" }, { status: 500 });
  }
}