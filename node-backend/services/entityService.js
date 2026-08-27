const COMPANIES = ["Apple", "Google", "Microsoft", "Tesla", "Amazon"];
const LOCATIONS = ["India", "USA", "China", "Germany", "Japan"];

/**
 * Extracts entities (companies and locations) from text.
 * Mimics Java's CompanyExtractor, LocationExtractor, and EntityService.
 *
 * @param {string} text
 * @returns {{companies: string[], locations: string[]}} Extracted entity lists.
 */
export function extractEntities(text) {
  const extracted = {
    companies: [],
    locations: []
  };

  if (!text) {
    return extracted;
  }

  // Find matching companies (case-insensitive with word boundary)
  for (const company of COMPANIES) {
    const regex = new RegExp(`\\b${company}\\b`, 'i');
    if (regex.test(text)) {
      extracted.companies.push(company);
    }
  }

  // Find matching locations (case-insensitive with word boundary)
  for (const location of LOCATIONS) {
    const regex = new RegExp(`\\b${location}\\b`, 'i');
    if (regex.test(text)) {
      extracted.locations.push(location);
    }
  }

  return extracted;
}
