/**
 * GitHub Search - Free API
 * Free tier: 5,000 requests/hour (plenty for our needs)
 */

interface GitHubSearchResult {
  url: string;
  title: string;
  snippet: string;
}

/**
 * Search GitHub for code, gists, and repositories
 * Free API: 5,000 requests/hour (no authentication needed for public repos)
 */
export async function searchGitHubFree(
  searchTerms: string[]
): Promise<Array<{ url: string; platform: string; title: string; snippet: string }>> {
  const results: Array<{ url: string; platform: string; title: string; snippet: string }> = [];

  for (const term of searchTerms.slice(0, 5)) { // Limit to 5 searches
    try {
      // Search code
      const codeUrl = `https://api.github.com/search/code?q=${encodeURIComponent(term)}&per_page=10`;
      const codeResponse = await fetch(codeUrl, {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          // Optional: Add token for higher rate limits (60 requests/hour without, 5,000/hour with)
          // 'Authorization': `token ${process.env.GITHUB_TOKEN}`,
        },
      });

      if (codeResponse.ok) {
        const codeData = await codeResponse.json();
        if (codeData.items) {
          for (const item of codeData.items) {
            results.push({
              url: item.html_url || '',
              title: `${item.repository.full_name} - ${item.name}`,
              snippet: item.path || '',
              platform: 'github',
            });
          }
        }
      }

      // Search repositories
      const repoUrl = `https://api.github.com/search/repositories?q=${encodeURIComponent(term)}&per_page=5`;
      const repoResponse = await fetch(repoUrl, {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
        },
      });

      if (repoResponse.ok) {
        const repoData = await repoResponse.json();
        if (repoData.items) {
          for (const item of repoData.items) {
            results.push({
              url: item.html_url || '',
              title: item.full_name,
              snippet: item.description || '',
              platform: 'github',
            });
          }
        }
      }

      // Rate limiting: GitHub allows 60 requests/hour without auth, 5,000/hour with auth
      // Wait 1 second between requests to be safe
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('Error searching GitHub:', error);
      continue;
    }
  }

  return results;
}
