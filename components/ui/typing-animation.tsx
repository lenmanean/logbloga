'use client';

import { useEffect, useState } from 'react';

interface TypingAnimationProps {
  text: string;
  duration?: number;
  className?: string;
}

// Helper function to get color class for a character at a given index
function getColorClass(text: string, index: number): string {
  const char = text[index];
  
  // Check if we're in a "log" segment
  // First "log": positions 0-2
  // Second "log": positions 6-8
  if ((index >= 0 && index <= 2) || (index >= 6 && index <= 8)) {
    return 'text-red-500';
  }
  
  // Parentheses are blue
  if (char === '(' || char === ')') {
    return 'text-blue-500';
  }
  
  // 'a' and 'b' are yellow
  if (char === 'a' || char === 'b') {
    return 'text-yellow-500';
  }
  
  return '';
}

export function TypingAnimation({ 
  text, 
  duration = 200, 
  className = '' 
}: TypingAnimationProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [i, setI] = useState(0);

  useEffect(() => {
    const typingEffect = setInterval(() => {
      if (i < text.length) {
        setDisplayedText((prev) => prev + text.charAt(i));
        setI(i + 1);
      } else {
        clearInterval(typingEffect);
      }
    }, duration);

    return () => {
      clearInterval(typingEffect);
    };
  }, [duration, i, text]);

  return (
    <h1 className={className}>
      {displayedText.split('').map((char, index) => {
        const colorClass = getColorClass(text, index);
        return (
          <span key={index} className={colorClass}>
            {char}
          </span>
        );
      })}
      <span className="animate-pulse">|</span>
    </h1>
  );
}

