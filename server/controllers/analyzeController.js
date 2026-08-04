import { fetchUserData } from "../services/githubService.js";
import { calculateScore } from "../services/scoringService.js";

export async function analyzeProfile(req, res) {
    const { username } = req.body;

    if (!username || typeof username !== "string" || username.trim().length === 0) {
        return res.status(400).json({ error: "A valid GitHub username is required." });
    }

    try {
        const data = await fetchUserData(username.trim());
        const analysis = calculateScore(data);

        return res.json({
            user: {
                login: data.profile.login,
                name: data.profile.name,
                avatar_url: data.profile.avatar_url,
                bio: data.profile.bio,
                public_repos: data.profile.public_repos,
                followers: data.profile.followers,
                following: data.profile.following,
                created_at: data.profile.created_at,
                html_url: data.profile.html_url,
            },
            analysis,
        });
    } catch (err) {
        const msg = (err.message || "").toLowerCase();
        const isRateLimit = err.status === 403 || err.status === 429 || msg.includes("rate limit") || msg.includes("quota exhausted");
        const isNotFound = err.status === 404 || msg.includes("not found");

        if (isRateLimit) {
            const retryAfter = err.response?.headers?.["retry-after"] || 60;
            return res.status(429).json({
                error: "GitHub API rate limit exceeded. Please try again later, or add a GITHUB_TOKEN to your server/.env file for 5,000 requests/hour.",
                retryAfter: Number(retryAfter),
            });
        }
        if (isNotFound) {
            return res.status(404).json({ error: `GitHub user "${username}" not found.` });
        }
        console.error("Analysis error:", err.message || err);
        return res.status(500).json({ error: "Internal server error during analysis." });
    }
}
