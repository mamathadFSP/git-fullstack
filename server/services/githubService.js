import { Octokit } from "@octokit/rest";

const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN || undefined,
});

/**
 * Fetch the user's profile.
 */
async function fetchProfile(username) {
    const { data } = await octokit.rest.users.getByUsername({ username });
    return data;
}

/**
 * Fetch all public repositories (paginated, up to 100).
 */
async function fetchRepos(username) {
    const { data } = await octokit.rest.repos.listForUser({
        username,
        per_page: 100,
        sort: "updated",
    });
    return data;
}

/**
 * Fetch README content for a specific repo. Returns null if not found.
 * Gracefully handles rate-limit errors.
 */
async function fetchReadme(owner, repo) {
    try {
        const { data } = await octokit.rest.repos.getReadme({ owner, repo });
        const content = Buffer.from(data.content, "base64").toString("utf-8");
        return { exists: true, length: content.length };
    } catch {
        return { exists: false, length: 0 };
    }
}

/**
 * Check root directory for .gitignore existence using the repo tree.
 * This avoids a separate API call per file.
 */
async function checkRootFiles(owner, repo) {
    try {
        const { data } = await octokit.rest.repos.getContent({ owner, repo, path: "" });
        const fileNames = data.map((f) => f.name.toLowerCase());
        return {
            hasGitignore: fileNames.includes(".gitignore"),
            hasReadme: fileNames.includes("readme.md") || fileNames.includes("readme"),
        };
    } catch {
        return { hasGitignore: false, hasReadme: false };
    }
}

/**
 * Fetch recent public events for a user.
 */
async function fetchEvents(username) {
    try {
        const { data } = await octokit.rest.activity.listPublicEventsForUser({
            username,
            per_page: 100,
        });
        return data;
    } catch {
        return [];
    }
}

/**
 * Master function: fetch all required data for a username.
 *
 * Strategy to minimise API calls:
 *  - 1 call for profile
 *  - 1 call for repos list
 *  - 1 call for events
 *  - For the top 6 repos: 1 call each to list the root directory (checks both
 *    README presence and .gitignore at once) + 1 call to get README content
 *    if it exists (for length check).
 *
 * Unauthenticated limit = 60 req/hr.  Worst case per analysis = 3 + 12 = 15.
 */
export async function fetchUserData(username) {
    // These 3 are always needed and independent
    const [profile, repos, events] = await Promise.all([
        fetchProfile(username),
        fetchRepos(username),
        fetchEvents(username),
    ]);

    // Detailed checks on up to 6 most-recent repos (to stay within rate limits)
    const topRepos = repos.slice(0, 6);

    const repoDetails = await Promise.all(
        topRepos.map(async (repo) => {
            // Single API call to list root directory — checks gitignore + readme presence
            const rootFiles = await checkRootFiles(username, repo.name);

            // Only fetch README content if we know it exists (saves a call on 404 repos)
            let readme = { exists: false, length: 0 };
            if (rootFiles.hasReadme) {
                readme = await fetchReadme(username, repo.name);
            }

            return {
                name: repo.name,
                description: repo.description,
                stargazers_count: repo.stargazers_count,
                forks_count: repo.forks_count,
                language: repo.language,
                html_url: repo.html_url,
                fork: repo.fork,
                readme,
                hasGitignore: rootFiles.hasGitignore,
            };
        })
    );

    // Aggregate language data from ALL repos
    const languages = {};
    for (const repo of repos) {
        if (repo.language) {
            languages[repo.language] = (languages[repo.language] || 0) + 1;
        }
    }

    return { profile, repos, repoDetails, events, languages };
}
