import React from 'react';
import { MaskIcon } from './icons/MaskIcon';

const Header: React.FC = () => {
  return (
    <header className="text-center mb-8 py-4 border-b-2 border-yellow-500/30">
        <div className="flex items-center justify-center gap-4">
            <MaskIcon className="w-12 h-12 text-yellow-400" />
            <div>
                <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500">
                    Maskenbildner AI
                </h1>
                <p className="mt-1 text-lg text-zinc-400">Dein KI-Assistent für theatralische Maskenbildnerei</p>
            </div>
        </div>
    </header>
  );
};

export default Header;
