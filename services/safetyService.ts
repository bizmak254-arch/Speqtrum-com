
import { GoogleGenAI } from "@google/genai";

// Always use process.env.API_KEY directly for initialization
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export interface GroundingLink {
  uri: string;
  title: string;
}

export interface SafetyHubResponse {
  text: string;
  links: GroundingLink[];
}

export const findSafeSpaces = async (query: string, location: { lat: number; lng: number }): Promise<SafetyHubResponse> => {
  try {
    const response = await ai.models.generateContent({
      // Maps grounding is only supported in Gemini 2.5 series models.
      model: "gemini-2.5-flash",
      contents: `Find safe and inclusive ${query} near these coordinates. Focus on safety, community rating, and accessibility.`,
      config: {
        tools: [{ googleMaps: {} }, { googleSearch: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: {
              latitude: location.lat,
              longitude: location.lng
            }
          }
        }
      },
    });

    const links: GroundingLink[] = [];
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    
    if (chunks) {
      chunks.forEach((chunk: any) => {
        if (chunk.maps) {
          links.push({ uri: chunk.maps.uri, title: chunk.maps.title });
        } else if (chunk.web) {
          links.push({ uri: chunk.web.uri, title: chunk.web.title });
        }
      });
    }

    // Access .text directly as a property
    return {
      text: response.text || "Searching for safe spaces...",
      links: Array.from(new Set(links.map(l => l.uri))).map(uri => links.find(l => l.uri === uri)!)
    };
  } catch (error) {
    console.error("Safety Search failed:", error);
    return {
      text: "I'm having trouble accessing local maps right now. Please check official community resources.",
      links: []
    };
  }
};
