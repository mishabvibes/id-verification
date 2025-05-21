import { FormCategory } from '@/types';

/**
 * Generate a unique ID for a submission
 * @param {FormCategory} category - The category of the form (ECC or TCC)
 * @returns {string} - Unique ID
 */
export function generateUniqueId(category: FormCategory): string {
  const prefix = category === 'ECC' ? 'ECC' : 'TCC';
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 900) + 100; // 3-digit random number
  
  return `${prefix}${timestamp}${random}`;
}

/**
 * Format date to readable string
 * @param {Date | string} date - The date to format
 * @returns {string} - Formatted date string
 */
export function formatDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Validate file type is allowed
 * @param {string} fileType - MIME type of the file
 * @param {Array<string>} allowedTypes - List of allowed MIME types
 * @returns {boolean} - Whether the file type is allowed
 */
export function isValidFileType(fileType: string, allowedTypes: string[]): boolean {
  return allowedTypes.includes(fileType);
}

/**
 * Validate file size is within limit
 * @param {number} fileSize - Size of the file in bytes
 * @param {number} maxSize - Maximum allowed size in bytes
 * @returns {boolean} - Whether the file size is within limit
 */
export function isValidFileSize(fileSize: number, maxSize: number): boolean {
  return fileSize <= maxSize;
}

/**
 * Sanitize a string for use in file names or IDs
 * @param {string} str - The string to sanitize
 * @returns {string} - Sanitized string
 */
export function sanitize(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/**
 * Get file extension from MIME type
 * @param {string} mimeType - MIME type of the file
 * @returns {string} - File extension
 */
export function getFileExtFromMimeType(mimeType: string): string {
  const mimeToExt: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/png': 'png',
    'application/pdf': 'pdf',
  };
  
  return mimeToExt[mimeType] || 'bin';
}