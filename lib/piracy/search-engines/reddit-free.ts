/**
 * Reddit Search - Free API
 * Free tier: 60 requests/minute (plenty for our needs)
 */

interface RedditSearchResult {
  url: string;
  title: string;
  snippet: string;
}

/**
 * Search Reddit posts and comments
 * Free API: 60 requests/minute (no authentication needed)
 */
export async function searchRedditFree(
  searchTerms: string[]
): Promise<Array<{ url: string; platform: string; title: string; snippet: string }>> {
  const results: Array<{ url: string; platform: string; title: string; snippet: string }> = [];

  for (const term of searchTerms.slice(0, 5)) { // Limit to 5 searches
    try {
      // Reddit search API (JSON endpoint)
      const url = `https://www.reddit.com/search.json?q=${encodeURIComponent(term)}&limit=10&sort=relevance`;
      
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Logbloga-Piracy-Monitor/1.0',
        },
      });

      if (!response.ok) {
        if (response.status === 429) {
          console.warn('Reddit rate limit reached');
          break;
        }
        continue;
      }

      const data = await response.json();
      
      if (data.data?.children) {
        for (const child of data.data.children) {
          const post = child.data;
          results.push({
            url: `https://reddit.com${post.permalink}`,
            title: post.title || '',
            snippet: post.selftext?.substring(0, 200) || '',
            platform: 'reddit',
          });
        }
      }

      // Rate limiting: Reddit allows 60 requests/minute
      // Wait 1 second between requests
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('Error searching Reddit:', error);
      continue;
    }
  }

  return results;
}
