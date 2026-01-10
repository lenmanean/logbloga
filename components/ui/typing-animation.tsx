'use client';

import { useEffect, useState } from 'react';

interface TypingAnimationProps {
  text: string;
  duration?: number;
  className?: string;
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
      {displayedText}
      <span className="animate-pulse">|</span>
    </h1>
  );
}

