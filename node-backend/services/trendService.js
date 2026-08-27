/**
 * Core business rules for calculating trending keywords.
 * Mimics Java's SimpleTrendStrategy and TrendService.
 */

/**
 * Returns mock baseline historical word frequency data.
 * @returns {Record<string, number>}
 */
export function getMockOldData() {
  return {
    ai: 5,
    market: 3,
    war: 2
  };
}

/**
 * Trend strategy: True if the current frequency is more than double the old frequency.
 * Matches: newCount > (oldCount * 2)
 *
 * @param {number} oldCount
 * @param {number} newCount
 * @returns {boolean}
 */
export function isTrending(oldCount, newCount) {
  return newCount > (oldCount * 2);
}

/**
 * Filter new word frequencies to only include trending words.
 *
 * @param {Record<string, number>} oldData Historical frequencies.
 * @param {Record<string, number>} newData Current frequencies.
 * @returns {Record<string, number>} Trending frequencies.
 */
export function getTrendingWordFrequencies(oldData = {}, newData = {}) {
  const trendingFrequencies = {};

  for (const [word, newCount] of Object.entries(newData)) {
    const oldCount = oldData[word] || 0;

    if (isTrending(oldCount, newCount)) {
      trendingFrequencies[word] = newCount;
    }
  }

  return trendingFrequencies;
}
