
import { GoogleGenAI } from "@google/genai";

export const generateVideo = async (prompt: string, config: { resolution: '720p' | '1080p', aspectRatio: '16:9' | '9:16' }) => {
  // Always create a fresh instance with process.env.API_KEY directly for Veo models
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  let operation = await ai.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt: prompt,
    config: {
      numberOfVideos: 1,
      resolution: config.resolution,
      aspectRatio: config.aspectRatio
    }
  });

  while (!operation.done) {
    // Wait for 10 seconds before polling again
    await new Promise(resolve => setTimeout(resolve, 10000));
    operation = await ai.operations.getVideosOperation({ operation: operation });
  }

  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
  if (!downloadLink) throw new Error("Video generation failed - no URI returned");

  const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
  if (!response.ok) throw new Error("Failed to fetch generated video bytes");
  
  const blob = await response.blob();
  return URL.createObjectURL(blob);
};
