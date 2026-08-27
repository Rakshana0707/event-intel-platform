/**
 * Cleans a raw text token by standardizing to lowercase and stripping 
 * leading/trailing punctuation, while preserving internal characters
 * and trailing tags for tech terms (e.g., node.js, react-native, c++, c#).
 *
 * @param {string} word
 * @returns {string} Cleaned word.
 */
export function cleanWord(word) {
  if (!word) return '';

  let cleaned = word.trim().toLowerCase();

  // Preserved special tags
  if (cleaned === 'c++' || cleaned === 'c#') {
    return cleaned;
  }
  if (cleaned === '.net') {
    return cleaned;
  }

  // Strip leading and trailing punctuation except + and # (which protect c++ and c#)
  cleaned = cleaned.replace(/^[^a-z0-9+#]+|[^a-z0-9+#]+$/g, '');

  // Validate that the remaining token is a valid word
  if (/[a-z0-9]/.test(cleaned)) {
    return cleaned;
  }

  return '';
}
