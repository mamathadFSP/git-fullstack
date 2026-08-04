/**
 * Scoring Algorithm for the GitHub Portfolio Analyzer.
 *
 * Dimensions:
 *   Documentation Quality  — 30%
 *   Code Consistency        — 25%
 *   Project Impact          — 25%
 *   Best Practices          — 20%
 */

// ─── Helpers ────────────────────────────────────────────────

function clamp(val, min = 0, max = 100) {
    return Math.max(min, Math.min(max, val));
}

// ─── Dimension Scorers ──────────────────────────────────────

function scoreDocumentation(repoDetails) {
    if (repoDetails.length === 0) return { score: 0, details: {} };

    const withReadme = repoDetails.filter((r) => r.readme.exists);
    const withDetailedReadme = repoDetails.filter((r) => r.readme.length > 500);

    const readmeRatio = withReadme.length / repoDetails.length;
    const detailedRatio = withDetailedReadme.length / repoDetails.length;

    // 70% weight on having a README, 30% on it being detailed
    const raw = readmeRatio * 70 + detailedRatio * 30;

    return {
        score: clamp(Math.round(raw)),
        details: {
            reposChecked: repoDetails.length,
            withReadme: withReadme.length,
            withDetailedReadme: withDetailedReadme.length,
        },
    };
}

function scoreConsistency(events) {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const pushEvents = events.filter(
        (e) => e.type === "PushEvent" && new Date(e.created_at) >= thirtyDaysAgo
    );

    // Collect unique active days
    const activeDays = new Set(
        pushEvents.map((e) => new Date(e.created_at).toISOString().slice(0, 10))
    );

    // 15+ active days = perfect score
    const raw = (activeDays.size / 15) * 100;

    return {
        score: clamp(Math.round(raw)),
        details: {
            pushEventsLast30Days: pushEvents.length,
            activeDays: activeDays.size,
        },
    };
}

function scoreImpact(repos) {
    const totalStars = repos.reduce((s, r) => s + r.stargazers_count, 0);
    const totalForks = repos.reduce((s, r) => s + r.forks_count, 0);
    const repoCount = repos.length;

    // Logarithmic scaling — diminishing returns
    const starScore = Math.min(40, Math.log2(totalStars + 1) * 5);
    const forkScore = Math.min(30, Math.log2(totalForks + 1) * 5);
    const repoScore = Math.min(30, Math.log2(repoCount + 1) * 6);

    const raw = starScore + forkScore + repoScore;

    return {
        score: clamp(Math.round(raw)),
        details: {
            totalStars,
            totalForks,
            totalRepos: repoCount,
        },
    };
}

function scoreBestPractices(repoDetails) {
    if (repoDetails.length === 0) return { score: 0, details: {} };

    const withGitignore = repoDetails.filter((r) => r.hasGitignore);
    const withDescription = repoDetails.filter(
        (r) => r.description && r.description.trim().length > 0
    );

    const gitignoreRatio = withGitignore.length / repoDetails.length;
    const descriptionRatio = withDescription.length / repoDetails.length;

    // 50/50 weight
    const raw = (gitignoreRatio * 50 + descriptionRatio * 50);

    return {
        score: clamp(Math.round(raw)),
        details: {
            reposChecked: repoDetails.length,
            withGitignore: withGitignore.length,
            withDescription: withDescription.length,
        },
    };
}

// ─── Strengths & Red Flags ──────────────────────────────────

function generateStrengths(dimensions, data) {
    const strengths = [];

    if (dimensions.documentation.score >= 70)
        strengths.push("Strong README documentation across repositories.");
    if (dimensions.consistency.score >= 70)
        strengths.push("Consistent coding activity over the past 30 days.");
    if (dimensions.impact.details.totalStars >= 10)
        strengths.push(`Projects have earned ${dimensions.impact.details.totalStars} stars — visible community interest.`);
    if (Object.keys(data.languages).length >= 3)
        strengths.push(`Great language diversity — ${Object.keys(data.languages).length} languages used.`);
    if (dimensions.bestPractices.score >= 70)
        strengths.push("Good use of .gitignore and repo descriptions.");
    if (data.repos.length >= 10)
        strengths.push(`Solid portfolio size with ${data.repos.length} public repositories.`);

    return strengths.length > 0
        ? strengths
        : ["Keep building! Every new project strengthens your portfolio."];
}

function generateRedFlags(dimensions, data) {
    const flags = [];
    const { repoDetails } = data;

    const missingReadmes = repoDetails.filter((r) => !r.readme.exists);
    if (missingReadmes.length > 0)
        flags.push(`${missingReadmes.length} repo(s) missing README files: ${missingReadmes.map((r) => r.name).join(", ")}.`);

    const missingDesc = repoDetails.filter((r) => !r.description || r.description.trim().length === 0);
    if (missingDesc.length > 0)
        flags.push(`${missingDesc.length} repo(s) missing descriptions: ${missingDesc.map((r) => r.name).join(", ")}.`);

    if (dimensions.consistency.details.activeDays < 5)
        flags.push("Low commit activity in the last 30 days — recruiters look for consistency.");

    const missingGitignore = repoDetails.filter((r) => !r.hasGitignore);
    if (missingGitignore.length > 0)
        flags.push(`${missingGitignore.length} repo(s) missing .gitignore files.`);

    if (Object.keys(data.languages).length < 2)
        flags.push("Limited language diversity — consider exploring new technologies.");

    return flags;
}

// ─── Recommendations ────────────────────────────────────────

function generateRecommendations(dimensions, data) {
    const recs = [];
    const { repoDetails } = data;

    // 1. README recommendations
    const missingReadmes = repoDetails.filter((r) => !r.readme.exists);
    if (missingReadmes.length > 0) {
        recs.push({
            title: "Add README documentation",
            description: `Add a detailed README to "${missingReadmes[0].name}" to boost your documentation score. Include project purpose, setup instructions, and screenshots.`,
            impact: "high",
        });
    }

    // 2. Consistency
    if (dimensions.consistency.details.activeDays < 10) {
        recs.push({
            title: "Increase commit frequency",
            description: "Try to commit code at least 3-4 days per week. Even small updates signal active development to recruiters.",
            impact: "high",
        });
    }

    // 3. Descriptions
    const missingDesc = repoDetails.filter((r) => !r.description || !r.description.trim());
    if (missingDesc.length > 0) {
        recs.push({
            title: "Add repository descriptions",
            description: `Add a clear, concise description to "${missingDesc[0].name}" — recruiters scan descriptions to quickly understand your work.`,
            impact: "medium",
        });
    }

    // 4. Gitignore
    const noGitignore = repoDetails.filter((r) => !r.hasGitignore);
    if (noGitignore.length > 0) {
        recs.push({
            title: "Add .gitignore files",
            description: `Add a .gitignore to "${noGitignore[0].name}" to show you follow professional development practices.`,
            impact: "medium",
        });
    }

    // 5. Pin best repos
    if (dimensions.impact.details.totalStars > 0) {
        recs.push({
            title: "Pin your top projects",
            description: "Pin your 2-3 best repositories to your GitHub profile so recruiters see your strongest work first.",
            impact: "medium",
        });
    }

    // 6. Fallback generic
    if (recs.length < 3) {
        recs.push({
            title: "Diversify your tech stack",
            description: "Start a small project in a new language or framework to signal adaptability and curiosity to employers.",
            impact: "low",
        });
    }

    return recs.slice(0, 3);
}

// ─── Main Scorer ────────────────────────────────────────────

export function calculateScore(data) {
    const documentation = scoreDocumentation(data.repoDetails);
    const consistency = scoreConsistency(data.events);
    const impact = scoreImpact(data.repos);
    const bestPractices = scoreBestPractices(data.repoDetails);

    const dimensions = { documentation, consistency, impact, bestPractices };

    const totalScore = Math.round(
        documentation.score * 0.3 +
        consistency.score * 0.25 +
        impact.score * 0.25 +
        bestPractices.score * 0.2
    );

    // Top languages sorted by repo count
    const topLanguages = Object.entries(data.languages)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6)
        .map(([name, count]) => ({ name, count }));

    // Longest streak from events
    const pushDates = data.events
        .filter((e) => e.type === "PushEvent")
        .map((e) => new Date(e.created_at).toISOString().slice(0, 10))
        .filter((v, i, a) => a.indexOf(v) === i)
        .sort();

    let longestStreak = 0;
    let currentStreak = 1;
    for (let i = 1; i < pushDates.length; i++) {
        const prev = new Date(pushDates[i - 1]);
        const curr = new Date(pushDates[i]);
        const diff = (curr - prev) / (24 * 60 * 60 * 1000);
        if (diff === 1) {
            currentStreak++;
        } else {
            longestStreak = Math.max(longestStreak, currentStreak);
            currentStreak = 1;
        }
    }
    longestStreak = Math.max(longestStreak, currentStreak);
    if (pushDates.length === 0) longestStreak = 0;

    return {
        totalScore,
        dimensions,
        topLanguages,
        longestStreak,
        totalRepos: data.repos.length,
        strengths: generateStrengths(dimensions, data),
        redFlags: generateRedFlags(dimensions, data),
        recommendations: generateRecommendations(dimensions, data),
    };
}
