import { GoogleGenAI, Type, Schema } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Helper to ensure we don't proceed without a key (though in this env we assume it exists)
const checkKey = () => {
    if (!apiKey) throw new Error("API Key missing");
};

export const generateText = async (prompt: string, systemInstruction: string, modelId: string = "gemini-2.5-flash"): Promise<string | null> => {
    checkKey();
    try {
        const response = await ai.models.generateContent({
            model: modelId,
            contents: prompt,
            config: {
                systemInstruction: systemInstruction,
            }
        });
        return response.text || null;
    } catch (error) {
        console.error("Gemini Text Gen Error:", error);
        return null;
    }
};

export const generateStructuredData = async (
    prompt: string, 
    systemInstruction: string, 
    responseSchema: Schema
): Promise<any | null> => {
    checkKey();
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                systemInstruction: systemInstruction,
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            }
        });
        
        const text = response.text;
        if (!text) return null;
        return JSON.parse(text);
    } catch (error) {
        console.error("Gemini Structured Gen Error:", error);
        return null;
    }
};

export const generateImageContent = async (prompt: string): Promise<string | null> => {
    checkKey();
    try {
        // Using generateContent with gemini-2.5-flash-image for visual generation
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [{ text: prompt }]
            },
            config: {
                // Not using Imagen specific config here as we are using the flash-image endpoint
            }
        });

        // Iterate through parts to find image
        if (response.candidates?.[0]?.content?.parts) {
            for (const part of response.candidates[0].content.parts) {
                if (part.inlineData && part.inlineData.data) {
                    return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
                }
            }
        }
        return null;
    } catch (error) {
        console.error("Gemini Image Gen Error:", error);
        return null;
    }
};