"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface TypingAnimationProps {
  text: string;
  speed?: number; // Delay between characters in ms
  showCursor?: boolean;
  className?: string;
  onComplete?: () => void;
}

export function TypingAnimation({
  text,
  speed = 120,
  showCursor = true,
  className,
  onComplete,
}: TypingAnimationProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [showBlink, setShowBlink] = useState(true);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, speed);

      return () => clearTimeout(timeout);
    } else if (currentIndex === text.length && !isComplete) {
      setIsComplete(true);
      if (onComplete) {
        onComplete();
      }
    }
  }, [currentIndex, text, speed, isComplete, onComplete]);

  // Blinking cursor effect - continues indefinitely
  useEffect(() => {
    if (showCursor) {
      const blinkInterval = setInterval(() => {
        setShowBlink((prev) => !prev);
      }, 530);
      return () => clearInterval(blinkInterval);
    }
  }, [showCursor]);

  return (
    <span className={cn("inline-block", className)}>
      {displayedText}
      {showCursor && (
        <span className={cn(
          "inline-block w-0.5 h-[1em] bg-current ml-0.5 align-middle",
          showBlink ? "opacity-100" : "opacity-0"
        )}>
          |
        </span>
      )}
    </span>
  );
}

