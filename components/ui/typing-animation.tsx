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
  const onCompleteRef = useRef(onComplete);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Update the ref when onComplete changes, but don't trigger re-run
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    // Reset state
    setDisplayedText('');
    let currentIndex = 0;
    let hasCompleted = false;

    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayedText(text.substring(0, currentIndex + 1));
        currentIndex++;
      } else {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        if (!hasCompleted && onCompleteRef.current) {
          hasCompleted = true;
          onCompleteRef.current();
        }
      }
    }, duration);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [duration, text]);

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

