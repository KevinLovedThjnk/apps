import { GoogleGenAI } from "@google/genai";
import { type InstructionsData, type GenerationParams } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates face art using the Imagen model based on detailed protagonist settings.
 * @param params - The user's prompt and protagonist characteristics.
 * @returns An array of two base64 encoded strings of the generated JPEG images.
 */
export const generateFaceArt = async (params: GenerationParams): Promise<string[]> => {
    const protagonistDescription = `Ein Protagonist, beschrieben als: Alter - ${params.age}, Geschlecht - ${params.gender}, Hautton - ${params.skinTone}.`;
    const prompt = `Erstelle ein Bild für das folgende Szenario: ${protagonistDescription} Der Look ist eine theatralische Gesichtsbemalung für eine Bühnenperformance, inspiriert von: '${params.prompt}'. Stil: detailliertes, kunstvolles, hochauflösendes Foto, Gesicht im Hauptfokus.`;

    const response = await ai.models.generateImages({
        model: 'imagen-3.0-generate-002',
        prompt: prompt,
        config: {
            numberOfImages: 2,
            outputMimeType: 'image/jpeg',
            aspectRatio: '3:4',
        },
    });

    if (!response.generatedImages || response.generatedImages.length < 2) {
        throw new Error("Die Bilderzeugung ist fehlgeschlagen, es wurden nicht genügend Bilder zurückgegeben.");
    }
    
    return response.generatedImages.map(img => img.image.imageBytes);
};

/**
 * Generates a product image using the Imagen model.
 * @param productName - The name of the product.
 * @param productDescription - The description of the product.
 * @returns A base64 encoded string of the generated JPEG image.
 */
export const generateProductImage = async (productName: string, productDescription: string): Promise<string> => {
    const prompt = `Erstelle ein sauberes, klares Produktfoto auf einem neutralen, hellen Hintergrund für das folgende Make-up-Produkt: "${productName}". Beschreibung: "${productDescription}". Stil: Kommerzielle Produktfotografie, realistisch, gut beleuchtet, im Studio-Stil. Das Produkt sollte im Mittelpunkt stehen.`;

    const response = await ai.models.generateImages({
        model: 'imagen-3.0-generate-002',
        prompt: prompt,
        config: {
            numberOfImages: 1,
            outputMimeType: 'image/jpeg',
            aspectRatio: '1:1',
        },
    });

    if (!response.generatedImages || response.generatedImages.length === 0) {
        throw new Error(`Die Bilderzeugung für das Produkt "${productName}" ist fehlgeschlagen.`);
    }
    
    return response.generatedImages[0].image.imageBytes;
};

/**
 * Generates a product list with real links/images and step-by-step instructions.
 * @param params - The user's prompt and protagonist characteristics.
 * @returns A structured object containing products and instructions.
 */
export const generateInstructions = async (params: GenerationParams): Promise<InstructionsData> => {
    const prompt = `Du bist ein professioneller Maskenbildner. Für einen Bühnen-Look für einen Protagonisten (Beschreibung: ${params.gender}, ${params.age}, ${params.skinTone}er Hautton), inspiriert von "${params.prompt}", erstelle eine Liste der benötigten Make-up-Produkte und eine detaillierte Schritt-für-Schritt-Anleitung.
Nutze deine Suchfunktion, um echte, kaufbare Produkte online zu finden.

Für jedes Produkt, gib an:
1.  "name": Der Produktname.
2.  "description": Eine kurze Beschreibung des Zwecks.
3.  "link": Ein direkter URL zur Produktseite.
4.  "imageUrl": Ein direkter URL zu einem Bild des Produkts. WICHTIG: Du musst einen direkten Link zu einer Bilddatei (.jpg, .png, .webp etc.) finden. Wenn du keinen solchen Link finden kannst, setze den Wert für "imageUrl" auf null.

Deine Antwort MUSS AUSSCHLIESSLICH ein JSON-Objekt im folgenden Format sein, ohne einleitenden oder nachfolgenden Text oder Markdown-Formatierung:
{
  "products": [
    {
      "name": "Produktname",
      "description": "Produktbeschreibung",
      "link": "https://beispielshop.de/produkt",
      "imageUrl": "https://beispielshop.de/bild.jpg"
    }
  ],
  "instructions": [
    "Schritt 1...",
    "Schritt 2..."
  ]
}
`;
    
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            tools: [{googleSearch: {}}],
        },
    });
    
    try {
        let jsonText = response.text.trim();
        if (jsonText.startsWith('```json')) {
            jsonText = jsonText.substring(7, jsonText.length - 3).trim();
        } else if (jsonText.startsWith('```')) {
             jsonText = jsonText.substring(3, jsonText.length - 3).trim();
        }

        const data = JSON.parse(jsonText);
        
        if (!data.products || !Array.isArray(data.products) || !data.instructions || !Array.isArray(data.instructions)) {
             throw new Error("Ungültige JSON-Struktur von der API erhalten.");
        }
        return data as InstructionsData;
    } catch (e) {
        console.error("Fehler beim Parsen der JSON-Antwort:", response.text, e);
        throw new Error("Die Anweisungen der KI konnten nicht verarbeitet werden. Die Antwort war kein gültiges JSON.");
    }
};