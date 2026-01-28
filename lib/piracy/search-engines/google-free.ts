/**
 * Google Custom Search - Free Tier Implementation
 * Free tier: 100 queries/day
 * Strategy: Rotate through products, search 3-4 products per day
 */

interface GoogleSearchResult {
  url: string;
  title: string;
  snippet: string;
}

/**
 * Search Google using Custom Search API (free tier)
 * Free tier allows 100 queries/day
 */
export async function searchGoogleFree(
  searchTerms: string[],
  apiKey: string,
  searchEngineId: string
): Promise<Array<{ url: string; platform: string; title: string; snippet: string }>> {
  if (!apiKey || !searchEngineId) {
    console.warn('Google Search API not configured');
    return [];
  }

  const results: Array<{ url: string; platform: string; title: string; snippet: string }> = [];

  // Limit to 3-4 searches per day to stay within free tier
  // Search with most specific terms first
  const prioritizedTerms = searchTerms.slice(0, 3);

  for (const term of prioritizedTerms) {
    try {
      const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${searchEngineId}&q=${encodeURIComponent(term)}&num=10`;
      
      const response = await fetch(url);
      if (!response.ok) {
        if (response.status === 429) {
          console.warn('Google API rate limit reached (free tier: 100 queries/day)');
          break; // Stop if we hit rate limit
        }
        continue;
      }

      const data = await response.json();
      
      if (data.items) {
        for (const item of data.items) {
          results.push({
            url: item.link || '',
            title: item.title || '',
            snippet: item.snippet || '',
            platform: detectPlatform(item.link || ''),
          });
        }
      }

      // Rate limiting: wait 1 second between requests to be respectful
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('Error searching Google:', error);
      continue;
    }
  }

  return results;
}

/**
 * Detect platform from URL
 */
function detectPlatform(url: string): string {
  if (url.includes('github.com')) return 'github';
  if (url.includes('reddit.com')) return 'reddit';
  if (url.includes('drive.google.com')) return 'google-drive';
  if (url.includes('dropbox.com')) return 'dropbox';
  if (url.includes('mega.nz')) return 'mega';
  if (url.includes('pastebin.com')) return 'pastebin';
  if (url.includes('gumroad.com')) return 'gumroad';
  if (url.includes('ebay.com')) return 'ebay';
  if (url.includes('etsy.com')) return 'etsy';
  if (url.includes('discord.com') || url.includes('discord.gg')) return 'discord';
  if (url.includes('t.me') || url.includes('telegram.org')) return 'telegram';
  return 'other';
}

/**
 * Smart product rotation to stay within free tier
 * Rotates through products so each gets searched every few days
 */
export function getProductsToSearchToday(
  allProducts: Array<{ id: string; title: string | null; slug: string | null }>,
  dayOfYear: number
): Array<{ id: string; title: string | null; slug: string | null }> {
  if (allProducts.length === 0) return [];

  // Rotate through products: search 3-4 products per day
  // This ensures all products get searched regularly within free tier limits
  const productsPerDay = 3;
  const startIndex = (dayOfYear * productsPerDay) % allProducts.length;
  
  return allProducts.slice(startIndex, startIndex + productsPerDay).concat(
    allProducts.slice(0, Math.max(0, productsPerDay - (allProducts.length - startIndex)))
  );
}
