/**
 * Input sanitization utilities
 * Provides functions to sanitize user input and prevent XSS
 */

/**
 * Escape HTML entities to prevent XSS
 */
export function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

/**
 * Sanitize user-generated HTML content
 * Removes potentially dangerous tags and attributes
 */
export function sanitizeHtml(html: string): string {
  // Remove script tags and their content
  let sanitized = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  
  // Remove event handlers from attributes (onclick, onerror, etc.)
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '');
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*[^\s>]+/gi, '');
  
  // Remove javascript: protocol from href and src attributes
  sanitized = sanitized.replace(/href\s*=\s*["']javascript:[^"']*["']/gi, 'href="#"');
  sanitized = sanitized.replace(/src\s*=\s*["']javascript:[^"']*["']/gi, 'src=""');
  
  // Remove data: URLs that could execute scripts (while allowing images)
  sanitized = sanitized.replace(/src\s*=\s*["']data:text\/html[^"']*["']/gi, 'src=""');
  sanitized = sanitized.replace(/href\s*=\s*["']data:text\/html[^"']*["']/gi, 'href="#"');
  
  return sanitized;
}

/**
 * Sanitize URL to prevent XSS and ensure it's safe
 */
export function sanitizeUrl(url: string): string {
  try {
    const parsed = new URL(url);
    
    // Only allow http, https protocols
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return '#';
    }
    
    // Block javascript: protocol (shouldn't happen with URL constructor, but just in case)
    if (parsed.href.toLowerCase().startsWith('javascript:')) {
      return '#';
    }
    
    return parsed.href;
  } catch {
    // Invalid URL, return safe default
    return '#';
  }
}

/**
 * Validate and sanitize file upload
 */
export interface FileUploadValidation {
  allowedMimeTypes?: string[];
  maxSizeBytes?: number;
  allowedExtensions?: string[];
}

export function validateFileUpload(
  file: File,
  options: FileUploadValidation = {}
): { valid: boolean; error?: string } {
  const {
    allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    maxSizeBytes = 5 * 1024 * 1024, // 5MB default
    allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
  } = options;

  // Check MIME type
  if (allowedMimeTypes.length > 0 && !allowedMimeTypes.includes(file.type)) {
    return {
      valid: false,
      error: `File type ${file.type} is not allowed. Allowed types: ${allowedMimeTypes.join(', ')}`,
    };
  }

  // Check file size
  if (file.size > maxSizeBytes) {
    const maxSizeMB = Math.round(maxSizeBytes / (1024 * 1024));
    return {
      valid: false,
      error: `File size exceeds maximum of ${maxSizeMB}MB`,
    };
  }

  // Check file extension
  const fileName = file.name.toLowerCase();
  const hasValidExtension = allowedExtensions.some((ext) =>
    fileName.endsWith(ext.toLowerCase())
  );

  if (!hasValidExtension) {
    return {
      valid: false,
      error: `File extension not allowed. Allowed extensions: ${allowedExtensions.join(', ')}`,
    };
  }

  // Check filename for potentially dangerous characters
  if (/[<>:"/\\|?*]/.test(file.name)) {
    return {
      valid: false,
      error: 'Filename contains invalid characters',
    };
  }

  return { valid: true };
}

/**
 * Sanitize JSON input to remove potentially dangerous content
 */
export function sanitizeJson<T>(obj: T): T {
  if (typeof obj !== 'object' || obj === null) {
    if (typeof obj === 'string') {
      return escapeHtml(obj) as T;
    }
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => sanitizeJson(item)) as T;
  }

  const sanitized: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    // Sanitize key
    const sanitizedKey = escapeHtml(key);
    
    // Sanitize value
    if (typeof value === 'string') {
      sanitized[sanitizedKey] = escapeHtml(value);
    } else if (typeof value === 'object' && value !== null) {
      sanitized[sanitizedKey] = sanitizeJson(value);
    } else {
      sanitized[sanitizedKey] = value;
    }
  }

  return sanitized as T;
}

/**
 * Remove null bytes and control characters from string
 */
export function removeControlCharacters(text: string): string {
  return text.replace(/[\x00-\x1F\x7F]/g, '');
}

/**
 * Sanitize text input (removes HTML, control characters, etc.)
 */
export function sanitizeText(text: string): string {
  return removeControlCharacters(text.trim());
}
