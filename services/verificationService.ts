
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface VerificationResult {
  isMatch: boolean;
  confidence: number;
  reasoning: string;
}

export const verificationService = {
  /**
   * Compares a live selfie with a profile picture using Gemini AI.
   * @param selfieBase64 The base64 encoded selfie image.
   * @param profilePicUrl The URL of the user's profile picture.
   */
  verifySelfie: async (selfieBase64: string, profilePicUrl: string): Promise<VerificationResult> => {
    try {
      // Fetch profile picture and convert to base64
      const profilePicResponse = await fetch(profilePicUrl);
      const profilePicBlob = await profilePicResponse.blob();
      const profilePicBase64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
        reader.readAsDataURL(profilePicBlob);
      });

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-image",
        contents: {
          parts: [
            {
              text: `Compare these two images. Image 1 is a live selfie for verification. Image 2 is a profile picture. 
              Determine if they are the same person. 
              Return a JSON object with:
              - "isMatch": boolean
              - "confidence": number (0-1)
              - "reasoning": string (brief explanation)
              
              Be strict. If they are clearly different people, isMatch should be false. 
              If the selfie is too blurry or dark, isMatch should be false.`
            },
            {
              inlineData: {
                mimeType: "image/jpeg",
                data: selfieBase64
              }
            },
            {
              inlineData: {
                mimeType: "image/jpeg",
                data: profilePicBase64
              }
            }
          ]
        },
        config: {
          responseMimeType: "application/json"
        }
      });

      const result = JSON.parse(response.text || "{}");
      return {
        isMatch: result.isMatch ?? false,
        confidence: result.confidence ?? 0,
        reasoning: result.reasoning ?? "Unknown error"
      };
    } catch (error) {
      console.error("Verification Error:", error);
      return {
        isMatch: false,
        confidence: 0,
        reasoning: "AI verification failed due to a technical error."
      };
    }
  }
};
