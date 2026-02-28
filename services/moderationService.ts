import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface ModerationResult {
  isSafe: boolean;
  reason?: string;
  suggestedAction?: 'block' | 'warn' | 'allow';
}

export const checkMessageSafety = async (text: string): Promise<ModerationResult> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze this social media message for safety violations (harassment, hate speech, explicit content, or severe toxicity). 
      Message: "${text}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isSafe: { type: Type.BOOLEAN },
            reason: { type: Type.STRING },
            suggestedAction: { 
              type: Type.STRING,
              description: "One of: block, warn, allow"
            }
          },
          required: ["isSafe", "suggestedAction"]
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    return {
      isSafe: result.isSafe ?? true,
      reason: result.reason,
      suggestedAction: result.suggestedAction || 'allow'
    };
  } catch (error) {
    console.error("Moderation error:", error);
    // Fail safe: allow if AI check fails
    return { isSafe: true, suggestedAction: 'allow' };
  }
};
