/**
 * Authentication error handling utilities
 * Maps Supabase auth errors to user-friendly messages
 */

export interface AuthError {
  message: string;
  code?: string;
}

/**
 * Get user-friendly error message from Supabase error
 */
export function getAuthErrorMessage(error: Error | null): string {
  if (!error) {
    return 'An unexpected error occurred';
  }

  const errorMessage = error.message.toLowerCase();

  // Email validation errors
  if (errorMessage.includes('invalid email') || errorMessage.includes('email')) {
    return 'Please enter a valid email address';
  }

  // Password errors
  if (errorMessage.includes('password')) {
    if (errorMessage.includes('too short')) {
      return 'Password must be at least 8 characters long';
    }
    if (errorMessage.includes('weak')) {
      return 'Password is too weak. Please use a stronger password';
    }
    return 'Invalid password. Please check and try again';
  }

  // Sign in errors
  if (errorMessage.includes('invalid login credentials') || errorMessage.includes('invalid credentials')) {
    return 'Invalid email or password. Please try again';
  }

  // User not found
  if (errorMessage.includes('user not found')) {
    return 'No account found with this email address';
  }

  // Email already exists
  if (errorMessage.includes('already registered') || errorMessage.includes('already exists')) {
    return 'An account with this email already exists';
  }

  // Email not confirmed
  if (errorMessage.includes('email not confirmed') || errorMessage.includes('email_not_confirmed')) {
    return 'Please verify your email address before signing in';
  }

  // Rate limiting
  if (errorMessage.includes('too many requests') || errorMessage.includes('rate limit')) {
    return 'Too many attempts. Please wait a moment and try again';
  }

  // Network errors
  if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
    return 'Network error. Please check your connection and try again';
  }

  // Session errors
  if (errorMessage.includes('session') || errorMessage.includes('jwt')) {
    return 'Your session has expired. Please sign in again';
  }

  // OAuth errors
  if (errorMessage.includes('oauth') || errorMessage.includes('provider')) {
    return 'Authentication failed. Please try again or use a different method';
  }

  // Return the original error message if no match found
  return error.message || 'An error occurred. Please try again';
}

/**
 * Check if error is a network error
 */
export function isNetworkError(error: Error | null): boolean {
  if (!error) return false;
  const message = error.message.toLowerCase();
  return message.includes('network') || message.includes('fetch') || message.includes('connection');
}

/**
 * Check if error is a rate limit error
 */
export function isRateLimitError(error: Error | null): boolean {
  if (!error) return false;
  const message = error.message.toLowerCase();
  return message.includes('too many requests') || message.includes('rate limit');
}

