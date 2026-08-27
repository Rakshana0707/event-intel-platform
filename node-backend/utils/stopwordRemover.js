import { cleanWord } from './wordCleaner.js';

// Expanded list of "stop words" and generic filler verbs/nouns to ensure only meaningful keywords spike
const STOP_WORDS = new Set([
  // Basic prepositions, pronouns, articles, conjunctions
  "is", "the", "a", "and", "of", "to", "in", "for", "on", "with", "it", "at",
  "this", "that", "these", "those", "from", "by", "an", "as", "i", "me", "my",
  "myself", "we", "our", "ours", "ourselves", "you", "your", "yours", "yourself",
  "yourselves", "he", "him", "his", "himself", "she", "her", "hers", "herself",
  "its", "itself", "they", "them", "their", "theirs", "themselves", "what",
  "which", "who", "whom", "am", "is", "are", "was", "were", "be", "been", "being",
  "have", "has", "had", "having", "do", "does", "did", "doing", "but", "if",
  "or", "because", "as", "until", "while", "against", "between", "into", "through",
  "during", "before", "after", "above", "below", "up", "down", "out", "off",
  "over", "under", "again", "further", "then", "once", "here", "there", "when",
  "where", "why", "how", "all", "any", "both", "each", "few", "more", "most",
  "other", "some", "such", "no", "nor", "not", "only", "own", "same", "so",
  "than", "too", "very", "s", "t", "can", "will", "just", "don", "should", "now",
  "d", "ll", "m", "o", "re", "ve", "y", "ain", "aren", "couldn", "didn", "doesn",
  "hadn", "hasn", "haven", "isn", "ma", "mightn", "mustn", "needn", "shan",
  "shouldn", "wasn", "weren", "won", "wouldn",
  
  // Generic English filler words common in blogs
  "get", "use", "make", "new", "using", "used", "build", "create", "creating",
  "like", "project", "code", "learn", "best", "simple", "easy", "one", "two",
  "good", "great", "well", "work", "need", "want", "way", "write", "writing",
  "read", "reading", "about", "some", "many", "also", "just", "here", "them",
  "us", "go", "going", "take", "taking", "look", "looking", "find", "finding",
  "give", "giving", "share", "sharing", "post", "article", "blog", "developer",
  "development", "how-to", "guide", "tutorial"
]);

/**
 * Takes an array of string tokens and returns a new array with stop words filtered out.
 *
 * @param {string[]} rawTokens
 * @returns {string[]}
 */
export function removeStopWords(rawTokens) {
  if (!rawTokens || !Array.isArray(rawTokens)) {
    return [];
  }

  return rawTokens.filter(word => {
    const cleaned = cleanWord(word);
    return cleaned !== '' && !STOP_WORDS.has(cleaned);
  });
}
