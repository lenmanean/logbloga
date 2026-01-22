import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Get the application URL
 * Works in both client and server contexts
 * Uses NEXT_PUBLIC_APP_URL if set, otherwise falls back to window.location.origin (client) or localhost (server)
 */
export function getAppUrl(): string {
  // Server-side: use environment variable or fallback
  if (typeof window === 'undefined') {
    return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  }
  
  // Client-side: prefer env var, otherwise use current origin
  return process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
}



