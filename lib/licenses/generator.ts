/**
 * License key generation utilities
 * Generates cryptographically secure, unique license keys
 */

/**
 * Generate a unique license key
 * Format: XXXX-XXXX-XXXX-XXXX (alphanumeric uppercase)
 * 
 * @returns License key string in format XXXX-XXXX-XXXX-XXXX
 */
export function generateUniqueLicenseKey(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const segments: string[] = [];
  
  // Generate 4 segments of 4 characters each
  for (let i = 0; i < 4; i++) {
    const segment: string[] = [];
    const randomBytes = crypto.getRandomValues(new Uint8Array(4));
    
    for (let j = 0; j < 4; j++) {
      const randomIndex = randomBytes[j] % chars.length;
      segment.push(chars[randomIndex]);
    }
    
    segments.push(segment.join(''));
  }
  
  return segments.join('-');
}

/**
 * Validate license key format
 * Checks if the license key matches the expected format: XXXX-XXXX-XXXX-XXXX
 * 
 * @param key License key to validate
 * @returns true if format is valid, false otherwise
 */
export function validateLicenseKeyFormat(key: string): boolean {
  // Format: XXXX-XXXX-XXXX-XXXX (alphanumeric uppercase)
  const licenseKeyPattern = /^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/;
  return licenseKeyPattern.test(key);
}

/**
 * Format license key for display
 * Normalizes the license key to uppercase and ensures correct formatting
 * 
 * @param key License key to format
 * @returns Formatted license key
 */
export function formatLicenseKey(key: string): string {
  // Remove any existing hyphens and convert to uppercase
  const normalized = key.replace(/-/g, '').toUpperCase();
  
  // Re-format with hyphens
  if (normalized.length === 16) {
    return `${normalized.slice(0, 4)}-${normalized.slice(4, 8)}-${normalized.slice(8, 12)}-${normalized.slice(12, 16)}`;
  }
  
  return key.toUpperCase();
}

/**
 * Mask license key for display
 * Shows only the last segment, masking the rest: XXXX-XXXX-XXXX-ABCD
 * 
 * @param key License key to mask
 * @returns Masked license key string
 */
export function maskLicenseKey(key: string): string {
  if (!validateLicenseKeyFormat(key)) {
    return key; // Return as-is if format is invalid
  }
  
  const segments = key.split('-');
  if (segments.length !== 4) {
    return key;
  }
  
  return `XXXX-XXXX-XXXX-${segments[3]}`;
}
