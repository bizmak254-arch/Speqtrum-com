
import { GoogleGenAI, Type } from "@google/genai";

// Use process.env.API_KEY directly as per GenAI initialization guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export interface ModerationResult {
  isSafe: boolean;
  score: number;
  reason?: string;
}

export const analyzeContent = async (text: string): Promise<ModerationResult> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze the following message for harassment, hate speech, or non-consensual threats in a social dating and companionship context. Be permissive of adult flirting but strict on abuse: "${text}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isSafe: { type: Type.BOOLEAN },
            score: { type: Type.NUMBER, description: "Safety score from 0 to 100" },
            reason: { type: Type.STRING }
          },
          required: ["isSafe", "score"]
        }
      }
    });

    // Access .text directly as a property
    return JSON.parse(response.text || '{"isSafe": true, "score": 100}');
  } catch (error) {
    console.error("Moderation check failed:", error);
    return { isSafe: true, score: 100 }; // Default to safe if service is down
  }
};
