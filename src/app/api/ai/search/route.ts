import { NextResponse } from 'next/server';
import { aiModel } from '@/lib/gemini/client';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { query } = body;

    if (!query) {
      return NextResponse.json({ error: "Query pencarian tidak boleh kosong" }, { status: 400 });
    }

    const prompt = `Tolong cari informasi terbaru dan paling relevan mengenai: "${query}". 
    Rangkum hasilnya agar mudah dipahami oleh mahasiswa yang sedang belajar materi ini.`;

    // Memanggil model Gemini Flash dengan fitur Google Search Grounding
    const result = await aiModel.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      // googleSearch adalah nama alat yang didukung oleh Gemini 2.5 Flash
      // Kita cast ke 'any' karena typings library lokal belum diupdate ke versi terbaru
      tools: [{ googleSearch: {} }] as any, 
    });


    const responseText = result.response.text();

    return NextResponse.json({ result: responseText });
  } catch (error) {
    console.error("API Error Search:", error);
    return NextResponse.json({ error: "Gagal melakukan pencarian pintar" }, { status: 500 });
  }
}