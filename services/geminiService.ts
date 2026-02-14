
import { GoogleGenAI, Type } from "@google/genai";
import { NewsItem, PersonDossier, GeneratedAsset } from "../types";

const VIDEO_SAMPLES = [
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
];

// Determine the intent of the user prompt to route to the correct AI workflow
export const determineIntent = async (prompt: string): Promise<'news' | 'intel' | 'image' | 'video'> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analyze the user prompt: "${prompt}". 
    Categorize it into one of: 'news' (tracking trends/events), 'intel' (searching for a person/handle/phone), 'image' (creating/generating/editing a picture), or 'video' (creating/generating a movie/clip).
    Return ONLY the category name.`,
  });
  const text = response.text?.toLowerCase() || 'news';
  if (text.includes('video')) return 'video';
  if (text.includes('image')) return 'image';
  if (text.includes('intel') || text.includes('person')) return 'intel';
  return 'news';
};

// Generate an image using the Gemini image model
export const generateAIImage = async (prompt: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: { parts: [{ text: prompt }] },
    config: { imageConfig: { aspectRatio: "1:1" } }
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
  }
  throw new Error("No image data returned");
};

// Generate a video using the Veo video model with polling and key selection check
export const generateAIVideo = async (prompt: string, onProgress: (msg: string) => void): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  onProgress("Initializing Veo 3.1 Neural Engine...");
  
  let operation = await ai.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt: prompt,
    config: { numberOfVideos: 1, resolution: '720p', aspectRatio: '16:9' }
  });

  while (!operation.done) {
    onProgress("Synthesizing temporal frames (approx 30-60s)...");
    await new Promise(resolve => setTimeout(resolve, 10000));
    operation = await ai.operations.getVideosOperation({ operation: operation });
  }

  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
  if (!downloadLink) throw new Error("Video generation failed");
  
  const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
  const blob = await response.blob();
  return URL.createObjectURL(blob);
};

// Fetch real-time news using Google Search grounding and extract sources
export const fetchRealtimeNews = async (topic: string): Promise<NewsItem[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Act as an ultra-fast OSINT agent. Intercept visual and text news for "${topic}". Format as JSON array.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              accountHandle: { type: Type.STRING },
              title: { type: Type.STRING },
              summary: { type: Type.STRING },
              detailedContent: { type: Type.STRING },
              sentiment: { type: Type.STRING, enum: ['positive', 'negative', 'neutral', 'breaking'] },
              category: { type: Type.STRING },
              platform: { type: Type.STRING },
              mediaType: { type: Type.STRING, enum: ['image', 'video', 'none'] }
            }
          }
        }
      },
    });

    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const searchSources = groundingChunks
      .filter((chunk: any) => chunk.web)
      .map((chunk: any) => ({
        title: chunk.web.title || 'Source',
        uri: chunk.web.uri || ''
      }))
      .filter((s: any) => s.uri);

    const rawItems = JSON.parse(response.text.trim());
    return rawItems.map((item: any, index: number) => ({
      ...item,
      id: `${Date.now()}-${index}`,
      timestamp: new Date().toLocaleTimeString(),
      sources: searchSources,
      mediaUrl: item.mediaType === 'video' ? VIDEO_SAMPLES[index % VIDEO_SAMPLES.length] : `https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80&w=800&q=${encodeURIComponent(item.title)}`,
      avatarUrl: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100&q=${encodeURIComponent(item.accountHandle)}`
    }));
  } catch (error) { throw error; }
};

// Fetch identity intelligence using Google Search grounding for deep OSINT dossiers
export const fetchIdentityIntelligence = async (query: string): Promise<PersonDossier> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `CRITICAL OSINT: Detailed dossier for "${query}". Format as JSON.`;
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          fullName: { type: Type.STRING },
          occupation: { type: Type.STRING },
          currentResidence: { type: Type.STRING },
          familyLinks: { type: Type.ARRAY, items: { type: Type.STRING } },
          publicIdentifiers: { type: Type.ARRAY, items: { type: Type.STRING } },
          recentActivity: { type: Type.STRING },
          digitalFootprintScore: { type: Type.NUMBER }
        }
      }
    },
  });
  const data = JSON.parse(response.text.trim());
  return { ...data, image: `https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=crop&q=80&w=400&q=${encodeURIComponent(data.fullName)}` };
};
