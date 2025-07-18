
import React from 'react';

interface IconProps {
    className?: string;
}

export const MaskIcon: React.FC<IconProps> = ({ className }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        className={className}
    >
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z"/>
        <path d="M12 14c-1.657 0-3-1.79-3-4s1.343-4 3-4 3 1.79 3 4-1.343 4-3 4Z"/>
        <path d="M6.6 15.2c1 .9 2.2 1.8 3.4 1.8s2.4-.9 3.4-1.8"/>
        <path d="M19.4 15.2c-1 .9-2.2 1.8-3.4 1.8s-2.4-.9-3.4-1.8"/>
        <path d="M15 9h.01"/>
        <path d="M9 9h.01"/>
    </svg>
);
