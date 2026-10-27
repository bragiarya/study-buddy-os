import { NextResponse } from 'next/server';
import { aiModel } from '@/lib/gemini/client';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { imageBase64, mimeType } = body;

    if (!imageBase64) {
      return NextResponse.json({ error: "Data gambar tidak ditemukan" }, { status: 400 });
    }

    const prompt = "Kamu adalah asisten belajar mahasiswa. Analisa gambar catatan atau materi kuliah ini. Ekstrak informasi pentingnya dan buatkan rangkuman yang sangat rapi, terstruktur, dan mudah dipahami menggunakan poin-poin.";

    // Memanggil model Gemini Flash dengan input teks dan gambar sekaligus
    const result = await aiModel.generateContent([
      prompt,
      {
        inlineData: {
          data: imageBase64,
          mimeType: mimeType || "image/jpeg",
        },
      },
    ]);

    const responseText = result.response.text();

    return NextResponse.json({ summary: responseText });
  } catch (error) {
    console.error("API Error Analyze Image:", error);
    return NextResponse.json({ error: "Gagal menganalisa gambar" }, { status: 500 });
  }
}