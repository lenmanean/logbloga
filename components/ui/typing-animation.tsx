'use client';

import { useEffect, useState, useRef } from 'react';

interface TypingAnimationProps {
  text: string;
  duration?: number;
  className?: string;
  onComplete?: () => void;
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
  className = '',
  onComplete
}: TypingAnimationProps) {
  const [displayedText, setDisplayedText] = useState('');
  const currentIndexRef = useRef(0);
  const hasCalledOnCompleteRef = useRef(false);

  useEffect(() => {
    currentIndexRef.current = 0;
    setDisplayedText('');
    hasCalledOnCompleteRef.current = false;

    const typingEffect = setInterval(() => {
      if (currentIndexRef.current < text.length) {
        setDisplayedText((prev) => prev + text.charAt(currentIndexRef.current));
        currentIndexRef.current++;
      } else {
        clearInterval(typingEffect);
        if (!hasCalledOnCompleteRef.current && onComplete) {
          hasCalledOnCompleteRef.current = true;
          onComplete();
        }
      }
    }, duration);

    return () => {
      clearInterval(typingEffect);
    };
  }, [duration, text, onComplete]);

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

