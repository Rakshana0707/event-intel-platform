package com.project.trend;

public class SimpleTrendStrategy implements TrendStrategy {

    @Override
    public boolean isTrending(int oldCount, int newCount) {
        return newCount > (oldCount * 2);
    }
}
