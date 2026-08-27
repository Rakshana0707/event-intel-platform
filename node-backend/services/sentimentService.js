const POSITIVE_WORDS = new Set([
  "great", "awesome", "excellent", "success", "love", "good", "perfect", "fast",
  "powerful", "improvement", "easy", "help", "helps", "clean", "efficient", "stable",
  "smooth", "recommend", "best", "cool", "beautiful", "innovative", "smart", "growth",
  "boost", "solve", "solved", "amazing", "simple", "optimized", "secure", "free",
  "popular", "strong", "advancement", "breakthrough", "happy", "win", "winning"
]);

const NEGATIVE_WORDS = new Set([
  "bad", "slow", "worst", "fail", "failure", "hate", "hard", "difficult", "error",
  "bug", "issue", "problem", "crash", "broke", "broken", "defect", "complex", "heavy",
  "security", "vulnerability", "leak", "leaked", "threat", "attack", "hack", "hacked",
  "warn", "warning", "pain", "unstable", "deprecated", "slowdown", "risk", "risky",
  "exploit", "delay", "declining", "drop", "dropped", "flaw", "flaws", "expensive"
]);

/**
 * Performs a fast lexicon sentiment score on text content.
 *
 * @param {string} title
 * @param {string} content
 * @returns {'positive' | 'negative' | 'neutral'}
 */
export function analyzeSentiment(title = '', content = '') {
  const text = `${title} ${content}`.toLowerCase();
  
  // Regex to split on spaces/punctuation, preserving + and # for tech words (c++, c#)
  const words = text.split(/[^a-z0-9+#]+/);
  
  let posCount = 0;
  let negCount = 0;

  for (const word of words) {
    if (!word) continue;
    if (POSITIVE_WORDS.has(word)) posCount++;
    if (NEGATIVE_WORDS.has(word)) negCount++;
  }

  const score = posCount - negCount;
  
  if (score > 0) return 'positive';
  if (score < 0) return 'negative';
  return 'neutral';
}
