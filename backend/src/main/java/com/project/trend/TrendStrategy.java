package com.project.trend;

public interface TrendStrategy {
    /**
     * Detects whether a word is trending based on its previous and current count.
     *
     * @param oldCount The previous count of the word.
     * @param newCount The new/current count of the word.
     * @return true if the word is trending, false otherwise.
     */
    boolean isTrending(int oldCount, int newCount);
}
