/**
 * Takes a long string of text and splits it into an individual array of words.
 *
 * @param {string} articleContent The text to split.
 * @returns {string[]} An array of words.
 */
export function splitIntoWords(articleContent) {
  if (!articleContent || !articleContent.trim()) {
    return [];
  }
  
  // Clean up any trailing spaces and split by whitespace (spaces, tabs, newlines)
  return articleContent.trim().split(/\s+/);
}
