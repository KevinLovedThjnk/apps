import React from 'react';
import { type InstructionsData } from '../types';
import Loader from './Loader';

interface ResultDisplayProps {
  isLoading: boolean;
  images: string[] | null;
  instructions: InstructionsData | null;
  prompt: string;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ isLoading, images, instructions, prompt }) => {
  const showInitialState = !isLoading && !images && !instructions;

  if (showInitialState) {
    return (
        <div className="text-center py-20">
            <h2 className="text-2xl font-semibold text-zinc-400">Bereit, Magie zu erschaffen?</h2>
            <p className="text-zinc-500 mt-2">Fülle das Formular oben aus, um zu beginnen.</p>
        </div>
    );
  }

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = `https://placehold.co/160x160/18181b/facc15/png?text=Bild\\nfehlt`;
    e.currentTarget.onerror = null; 
  };

  return (
    <div className="mt-10">
      { (isLoading || images || instructions) &&
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Column */}
          <div className="flex flex-col items-center">
            <h2 className="text-2xl font-bold text-yellow-400 mb-4">Visuelle Konzepte</h2>
            <div className="w-full bg-zinc-800 rounded-xl shadow-2xl flex items-center justify-center overflow-hidden border border-zinc-700">
               {isLoading && !images ? (
                <div className="w-full aspect-[3/2] flex items-center justify-center">
                  <Loader text="Konzepte werden erstellt..."/>
                </div>
              ) : images ? (
                <div className="grid grid-cols-2 w-full">
                  {images.map((imgSrc, index) => (
                    <div key={index} className="aspect-[3/4] relative bg-zinc-900">
                      <img 
                        src={imgSrc}
                        alt={`${prompt} - Konzept ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
            {isLoading && images && (
                <p className="mt-4 text-zinc-400 text-sm animate-pulse">Lade Anweisungen...</p>
            )}
          </div>

          {/* Instructions Column */}
          <div className="flex flex-col">
            <h2 className="text-2xl font-bold text-yellow-400 mb-4">Anleitung & Produkte</h2>
             <div className="w-full bg-zinc-800 rounded-xl shadow-2xl p-6 min-h-[300px] border border-zinc-700">
              {(isLoading && !instructions) ? (
                <div className="flex items-center justify-center h-full">
                  <Loader text={images ? "Anleitung wird vorbereitet..." : "Warte auf Konzepte..."} />
                </div>
              ) : (
                instructions && (
                  <div className="space-y-8 animate-fade-in">
                    <div>
                      <h3 className="text-xl font-semibold text-zinc-200 border-b border-zinc-600 pb-2 mb-4">Benötigte Produkte</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {instructions.products.map((product, index) => (
                          <a 
                            key={index} 
                            href={product.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="bg-zinc-900/50 rounded-lg p-3 flex items-center gap-3 hover:bg-zinc-700/70 transition-colors group border border-zinc-700"
                          >
                            <img 
                              src={product.imageUrl} 
                              alt={`Bild von ${product.name}`}
                              className="w-16 h-16 object-cover rounded-md flex-shrink-0 bg-zinc-800"
                              onError={handleImageError}
                            />
                            <div>
                              <p className="font-bold text-yellow-400 group-hover:text-yellow-300 text-sm">{product.name}</p>
                              <p className="text-xs text-zinc-300 mt-1">{product.description}</p>
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-zinc-200 border-b border-zinc-600 pb-2 mb-4">Schritt-für-Schritt-Anleitung</h3>
                      <ol className="space-y-3 text-zinc-300">
                        {instructions.instructions.map((step, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <span className="flex-shrink-0 font-bold text-yellow-400 bg-zinc-700 rounded-full w-6 h-6 text-center text-sm leading-6">{index + 1}</span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      }
    </div>
  );
};

const style = document.createElement('style');
style.innerHTML = `
  @keyframes fade-in {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in {
    animation: fade-in 0.5s ease-out forwards;
  }
`;
document.head.appendChild(style);

export default ResultDisplay;
