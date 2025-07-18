import React, { useState, useCallback } from 'react';
import { generateFaceArt, generateInstructions, generateProductImage } from './services/geminiService';
import { type InstructionsData, type GenerationParams, type Product } from './types';
import Header from './components/Header';
import PromptForm from './components/PromptForm';
import ResultDisplay from './components/ResultDisplay';

function App(): React.ReactNode {
  const [promptDetails, setPromptDetails] = useState<GenerationParams | null>(null);
  const [generatedImages, setGeneratedImages] = useState<string[] | null>(null);
  const [instructions, setInstructions] = useState<InstructionsData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async (params: GenerationParams) => {
    if (isLoading) return;

    setIsLoading(true);
    setError(null);
    setGeneratedImages(null);
    setInstructions(null);
    setPromptDetails(params);

    try {
      // Step 1: Generate the face art images
      const imageB64s = await generateFaceArt(params);
      const imageUrls = imageB64s.map(b64 => `data:image/jpeg;base64,${b64}`);
      setGeneratedImages(imageUrls);

      // Step 2: Generate the instructions and initial product list
      const initialInstructionData = await generateInstructions(params);

      // Step 3: Check for products without image URLs and generate images for them
      const processedProducts = await Promise.all(
        initialInstructionData.products.map(async (product): Promise<Product> => {
          // If imageUrl is missing, generate a new one.
          if (!product.imageUrl) {
            try {
              console.log(`Generating image for product: ${product.name}`);
              const productImageB64 = await generateProductImage(product.name, product.description);
              // Return a new product object with the generated image
              return { 
                ...product, 
                imageUrl: `data:image/jpeg;base64,${productImageB64}` 
              };
            } catch (genError) {
              console.error(`Failed to generate image for ${product.name}`, genError);
              // Fallback to a placeholder if generation also fails
              return { 
                ...product, 
                imageUrl: `https://placehold.co/160x160/18181b/facc15/png?text=Bild\\nfehlt` 
              };
            }
          }
          // If imageUrl already exists, return the product as is
          return product;
        })
      );

      // Create the final instructions object with the updated products
      const finalInstructionData: InstructionsData = {
          ...initialInstructionData,
          products: processedProducts,
      };

      setInstructions(finalInstructionData);

    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Ein unbekannter Fehler ist aufgetreten. Bitte überprüfen Sie die Konsole und stellen Sie sicher, dass Ihr API-Schlüssel konfiguriert ist.');
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-100 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <Header />
        <main>
          <PromptForm onGenerate={handleGenerate} isLoading={isLoading} />
          {error && (
            <div className="mt-6 bg-red-900/80 border border-red-700 text-red-200 px-4 py-3 rounded-lg text-center">
              <p className="font-bold">Ein Fehler ist aufgetreten</p>
              <p className="text-sm">{error}</p>
            </div>
          )}
          <ResultDisplay
            isLoading={isLoading}
            images={generatedImages}
            instructions={instructions}
            prompt={promptDetails?.prompt ?? ''}
          />
        </main>
      </div>
    </div>
  );
}

export default App;