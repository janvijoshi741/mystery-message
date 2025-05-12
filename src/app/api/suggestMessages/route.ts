import { NextResponse } from 'next/server';
import { GoogleGenAI } from "@google/genai";

export const maxDuration = 30;
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST() {
  try {
    // const prompt = `Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.`;
const prompt = `Generate a single string containing three unique, open-ended, and engaging questions suitable for an anonymous social messaging platform like Qooh.me. Each question should be separated by '||'. The questions must not repeat from previous outputs and should avoid personal, sensitive, or controversial topics. Focus on universal, positive themes that spark curiosity and friendly conversation. Ensure all three questions are freshly generated and distinct from one another and from any prior results. Example format: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?`
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      generationConfig: {
        temperature: 0.9,
        topK: 40,
        topP: 0.95,
      }
    });

    const generatedText = response?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response';
    return NextResponse.json({ result: generatedText });

  } catch (error: any) {
    if (error.name && error.status) {
      const { name, status, headers, message } = error;
      return NextResponse.json({ name, status, headers, message }, { status });
    } else {
      console.error("An unexpected error occurred", error);
      return NextResponse.json({ message: "Unexpected error occurred" }, { status: 500 });
    }
  }
}
