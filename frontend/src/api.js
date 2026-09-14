// Use relative path in production (same server), and localhost in development
const API_BASE_URL = import.meta.env.PROD ? '/api' : 'http://localhost:8080/api';

export async function fetchArticles() {
  const response = await fetch(`${API_BASE_URL}/all`);
  if (!response.ok) {
    throw new Error('Failed to fetch articles');
  }
  return response.json();
}

export async function addArticle(article) {
  const response = await fetch(`${API_BASE_URL}/add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(article),
  });
  if (!response.ok) {
    throw new Error('Failed to create article');
  }
  return response.json();
}

export async function ingestArticles() {
  const response = await fetch(`${API_BASE_URL}/fetch-news`);
  if (!response.ok) {
    throw new Error('Failed to run ingestion pipeline');
  }
  return response.json();
}

export async function fetchTrends() {
  const response = await fetch(`${API_BASE_URL}/trends`);
  if (!response.ok) {
    throw new Error('Failed to fetch trend frequencies');
  }
  return response.json();
}

export async function extractEntitiesFromText(text) {
  const response = await fetch(`${API_BASE_URL}/entities?text=${encodeURIComponent(text)}`);
  if (!response.ok) {
    throw new Error('Failed to extract entities');
  }
  return response.json();
}

export async function clearDatabase() {
  const response = await fetch(`${API_BASE_URL}/clear`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to wipe database articles');
  }
  return response.json();
}

export async function fetchSentimentAnalytics() {
  const response = await fetch(`${API_BASE_URL}/sentiment-analytics`);
  if (!response.ok) {
    throw new Error('Failed to fetch sentiment metrics');
  }
  return response.json();
}
