import { cleanWord } from './wordCleaner.js';

/**
 * Takes an array of words and counts how many times each word appears (lowercased).
 *
 * @param {string[]} words
 * @returns {Record<string, number>} A map of word to frequency.
 */
export function countWordFrequencies(words) {
  const frequencyMap = {};

  if (!words || !Array.isArray(words)) {
    return frequencyMap;
  }

  for (const word of words) {
    const cleaned = cleanWord(word);
    
    if (cleaned) {
      if (frequencyMap[cleaned]) {
        frequencyMap[cleaned] += 1;
      } else {
        frequencyMap[cleaned] = 1;
      }
    }
  }

  return frequencyMap;
}
