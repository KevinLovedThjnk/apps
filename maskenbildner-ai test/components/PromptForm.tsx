import React, { useState } from 'react';
import { type GenerationParams } from '../types';

interface PromptFormProps {
  onGenerate: (params: GenerationParams) => void;
  isLoading: boolean;
}

const PromptForm: React.FC<PromptFormProps> = ({ onGenerate, isLoading }) => {
  const [age, setAge] = useState<string>('Erwachsen (ca. 20-50 Jahre)');
  const [skinTone, setSkinTone] = useState<string>('Mittel');
  const [gender, setGender] = useState<string>('Weiblich');
  const [prompt, setPrompt] = useState<string>('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (prompt.trim()) {
      onGenerate({ age, skinTone, gender, prompt: prompt.trim() });
    }
  };
  
  const placeholder = "ein mystisches Waldwesen mit biolumineszenten Mustern";

  return (
    <section className="mb-8">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div>
            <h3 className="text-lg font-semibold text-zinc-300 mb-3">1. Beschreibe den Protagonisten</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Age */}
              <div>
                <label htmlFor="age-select" className="block text-sm font-medium text-zinc-400 mb-1">Alter</label>
                <select id="age-select" value={age} onChange={e => setAge(e.target.value)} disabled={isLoading} className="w-full p-2 rounded-lg bg-zinc-800 border-2 border-zinc-700 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500/50 transition-colors duration-300 text-zinc-100">
                  <option>Kind (ca. 6-12 Jahre)</option>
                  <option>Jugendlich (ca. 13-19 Jahre)</option>
                  <option>Erwachsen (ca. 20-50 Jahre)</option>
                  <option>Senior (ca. 50+ Jahre)</option>
                </select>
              </div>
              {/* Skin Tone */}
              <div>
                <label htmlFor="skin-tone-select" className="block text-sm font-medium text-zinc-400 mb-1">Hautton</label>
                <select id="skin-tone-select" value={skinTone} onChange={e => setSkinTone(e.target.value)} disabled={isLoading} className="w-full p-2 rounded-lg bg-zinc-800 border-2 border-zinc-700 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500/50 transition-colors duration-300 text-zinc-100">
                  <option>Sehr hell</option>
                  <option>Hell</option>
                  <option>Mittel</option>
                  <option>Dunkel</option>
                  <option>Sehr dunkel</option>
                </select>
              </div>
              {/* Gender */}
              <div>
                <label htmlFor="gender-select" className="block text-sm font-medium text-zinc-400 mb-1">Geschlecht</label>
                <select id="gender-select" value={gender} onChange={e => setGender(e.target.value)} disabled={isLoading} className="w-full p-2 rounded-lg bg-zinc-800 border-2 border-zinc-700 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500/50 transition-colors duration-300 text-zinc-100">
                  <option>Weiblich</option>
                  <option>Männlich</option>
                  <option>Nicht-binär / Androgyn</option>
                </select>
              </div>
            </div>
        </div>
        
        <div>
            <label htmlFor="prompt-input" className="text-lg font-semibold text-zinc-300 mb-3 block">
              2. Beschreibe das Make-up-Konzept
            </label>
            <textarea
              id="prompt-input"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={`z.B., ${placeholder}`}
              className="w-full p-4 rounded-lg bg-zinc-800 border-2 border-zinc-700 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/50 transition-colors duration-300 text-zinc-100 placeholder-zinc-500 min-h-[100px]"
              rows={3}
              disabled={isLoading}
              required
            />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full sm:w-auto self-center px-8 py-3 font-bold text-lg rounded-full bg-yellow-500 text-zinc-900 hover:bg-yellow-400 focus:outline-none focus:ring-4 focus:ring-yellow-500/50 transition-all duration-300 ease-in-out disabled:bg-zinc-600 disabled:cursor-not-allowed disabled:text-zinc-400 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Wird generiert...
            </>
          ) : (
            'Meisterwerk erschaffen'
          )}
        </button>
      </form>
    </section>
  );
};

export default PromptForm;
