import { SUMMARY_SYSTEM_PROMPT } from "@/utils/prompts";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export default async function generateSummaryFromGemini(pdfText: string) {
  try {
    if (!pdfText || pdfText.trim() === "") {
      return "PDF text is empty or invalid";
    }
    const model = "gemini-2.0-flash";
    const pr = {
      role: "user",
      parts: [
        { text: SUMMARY_SYSTEM_PROMPT },
        {
          text: `\nTransform this document into an engaging easy-to-read summary with contextually relevant emojis and proper markdown formatting:\n\n${pdfText}`,
        },
      ],
    };
    const prompt = `${SUMMARY_SYSTEM_PROMPT}\n\nTransform this document into an engaging easy-to-read summary with contextually relevant emojis and proper markdown formatting:\n\n${pdfText}`;

    const result = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        maxOutputTokens: 1500,
        temperature: 0.7,
      },
    });

    if (!result.text || result.text.trim() === "") {
      console.error("Gemini returned an empty response:", result);
      throw new Error(
        "Gemini returned an empty response. Please try again later."
      );
    }

    return result.text;
  } catch (error: any) {
    if (error?.status === 429) {
      throw new Error("RATE_LIMIT_EXCEEDED");
    }
    console.error("Gemini API Error: :", error);
    throw error;
  }
}
