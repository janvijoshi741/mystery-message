import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export const maxDuration = 30;
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST() {
  try {
    const prompt = `Generate a single string containing three unique, open-ended, and engaging questions suitable for an anonymous social messaging platform like Qooh.me. Each question should be separated by '||'. The questions must not repeat from previous outputs and should avoid personal, sensitive, or controversial topics. Focus on universal, positive themes that spark curiosity and friendly conversation. Ensure all three questions are freshly generated and distinct from one another and from any prior results. Example format: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?`;
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      // generationConfig: {
      //   temperature: 0.9,
      //   topK: 40,
      //   topP: 0.95,
      // },
    });

    const generatedText =
      response?.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
    return NextResponse.json({ result: generatedText });
  } catch (error: unknown) {
    if (error instanceof Error) {
      const { name, message } = error;
      const status = (error as any).status || 500;
      const headers = (error as any).headers || {};
      return NextResponse.json({ name, status, headers, message }, { status });
    } else {
      console.error("An unexpected error occurred", error);
      return NextResponse.json(
        { message: "Unexpected error occurred" },
        { status: 500 }
      );
    }
  }
}
