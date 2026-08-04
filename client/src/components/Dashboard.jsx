import {
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar,
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Cell,
} from "recharts";
import {
    CheckCircle2,
    AlertTriangle,
    Lightbulb,
    Code2,
    GitCommitHorizontal,
    FolderGit2,
    Flame,
    ExternalLink,
    Trophy,
    TrendingUp,
    ArrowUpRight,
} from "lucide-react";

/* ─── Color helpers ──────────────────────────────────── */
function scoreColor(score) {
    if (score >= 75) return "var(--clr-green)";
    if (score >= 50) return "var(--clr-yellow)";
    return "var(--clr-red)";
}

function scoreLabel(score) {
    if (score >= 75) return "Recruiter-Ready 🎯";
    if (score >= 50) return "Getting There ⚡";
    return "Needs Work 🔧";
}

function scoreGlow(score) {
    if (score >= 75) return "glow-green";
    if (score >= 50) return "glow-yellow";
    return "glow-red";
}

function impactBadge(impact) {
    const map = {
        high: "bg-[var(--clr-red)]/15 text-[var(--clr-red)]",
        medium: "bg-[var(--clr-yellow)]/15 text-[var(--clr-yellow)]",
        low: "bg-[var(--clr-cyan)]/15 text-[var(--clr-cyan)]",
    };
    return map[impact] || map.low;
}

/* ─── Language bar colors ────────────────────────────── */
const LANG_COLORS = [
    "#7c5cfc", "#22d3ee", "#34d399", "#fbbf24",
    "#f87171", "#a78bfa", "#fb923c", "#38bdf8",
];

/* ─── Sub-components ─────────────────────────────────── */

function ScoreRing({ score }) {
    const radius = 70;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;
    const color = scoreColor(score);

    return (
        <div className="flex flex-col items-center gap-4">
            <div className="relative w-44 h-44 flex items-center justify-center">
                {/* Pulse */}
                <div
                    className="absolute inset-0 rounded-full score-pulse"
                    style={{ border: `2px solid ${color}` }}
                />
                <svg width="176" height="176" className="transform -rotate-90">
                    <circle cx="88" cy="88" r={radius} fill="none" stroke="var(--clr-border)" strokeWidth="8" />
                    <circle
                        cx="88"
                        cy="88"
                        r={radius}
                        fill="none"
                        stroke={color}
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        style={{ transition: "stroke-dashoffset 1.2s ease-out" }}
                    />
                </svg>
                <div className="absolute flex flex-col items-center">
                    <span className="text-4xl font-extrabold" style={{ color }}>{score}</span>
                    <span className="text-xs text-[var(--clr-text-muted)]">/ 100</span>
                </div>
            </div>
            <span className="text-sm font-semibold" style={{ color }}>
                {scoreLabel(score)}
            </span>
        </div>
    );
}

function DimensionChart({ dimensions }) {
    const data = [
        { subject: "Documentation", value: dimensions.documentation.score, fullMark: 100 },
        { subject: "Consistency", value: dimensions.consistency.score, fullMark: 100 },
        { subject: "Impact", value: dimensions.impact.score, fullMark: 100 },
        { subject: "Best Practices", value: dimensions.bestPractices.score, fullMark: 100 },
    ];

    return (
        <ResponsiveContainer width="100%" height={240}>
            <RadarChart data={data}>
                <PolarGrid stroke="var(--clr-border)" />
                <PolarAngleAxis
                    dataKey="subject"
                    tick={{ fill: "var(--clr-text-muted)", fontSize: 11 }}
                />
                <PolarRadiusAxis
                    angle={30}
                    domain={[0, 100]}
                    tick={{ fill: "var(--clr-text-muted)", fontSize: 10 }}
                />
                <Radar
                    dataKey="value"
                    stroke="var(--clr-accent)"
                    fill="var(--clr-accent)"
                    fillOpacity={0.25}
                    strokeWidth={2}
                />
            </RadarChart>
        </ResponsiveContainer>
    );
}

function LanguageChart({ languages }) {
    return (
        <ResponsiveContainer width="100%" height={200}>
            <BarChart data={languages} layout="vertical" margin={{ left: 0, right: 16 }}>
                <XAxis type="number" hide />
                <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fill: "var(--clr-text-muted)", fontSize: 11 }}
                    width={80}
                />
                <Tooltip
                    contentStyle={{
                        background: "var(--clr-surface)",
                        border: "1px solid var(--clr-border)",
                        borderRadius: 8,
                        fontSize: 12,
                    }}
                    cursor={{ fill: "rgba(124,92,252,0.08)" }}
                />
                <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={18}>
                    {languages.map((_, i) => (
                        <Cell key={i} fill={LANG_COLORS[i % LANG_COLORS.length]} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
}

function MetricCard({ icon: Icon, label, value, color }) {
    return (
        <div className="glass-sm p-5 flex items-center gap-4 hover:border-[var(--clr-accent)] transition-colors">
            <div
                className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: `${color}15` }}
            >
                <Icon className="w-5 h-5" style={{ color }} />
            </div>
            <div>
                <p className="text-[var(--clr-text-muted)] text-xs">{label}</p>
                <p className="text-lg font-bold">{value}</p>
            </div>
        </div>
    );
}

/* ─── Main Dashboard ─────────────────────────────────── */

export default function Dashboard({ user, analysis }) {
    const { totalScore, dimensions, topLanguages, longestStreak, totalRepos, strengths, redFlags, recommendations } = analysis;

    return (
        <div className="max-w-6xl mx-auto px-6 pb-16 pt-4 space-y-8">

            {/* User Header */}
            <div className="glass p-6 flex flex-col sm:flex-row items-center gap-6 animate-fade-up">
                <img
                    src={user.avatar_url}
                    alt={user.login}
                    className="w-20 h-20 rounded-full ring-2 ring-[var(--clr-accent)]/40"
                />
                <div className="text-center sm:text-left flex-1">
                    <h1 className="text-2xl font-bold">{user.name || user.login}</h1>
                    {user.bio && <p className="text-sm text-[var(--clr-text-muted)] mt-1">{user.bio}</p>}
                    <div className="flex flex-wrap justify-center sm:justify-start gap-4 mt-3 text-xs text-[var(--clr-text-muted)]">
                        <span>{user.followers} followers</span>
                        <span>{user.following} following</span>
                        <span>{user.public_repos} repos</span>
                    </div>
                </div>
                <a
                    href={user.html_url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-[var(--clr-surface-2)] hover:bg-[var(--clr-accent)]/20 transition-colors"
                >
                    View Profile <ExternalLink className="w-3.5 h-3.5" />
                </a>
            </div>

            {/* Score + Radar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 animate-fade-up delay-100">
                <div className={`glass p-8 flex items-center justify-center ${scoreGlow(totalScore)}`}>
                    <ScoreRing score={totalScore} />
                </div>
                <div className="glass p-6 md:col-span-2">
                    <h2 className="text-sm font-semibold text-[var(--clr-text-muted)] mb-2 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" /> Dimension Breakdown
                    </h2>
                    <DimensionChart dimensions={dimensions} />
                </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 animate-fade-up delay-200">
                <MetricCard
                    icon={Code2}
                    label="Top Language"
                    value={topLanguages[0]?.name || "N/A"}
                    color="var(--clr-accent-light)"
                />
                <MetricCard
                    icon={Flame}
                    label="Longest Streak"
                    value={`${longestStreak} day${longestStreak !== 1 ? "s" : ""}`}
                    color="var(--clr-yellow)"
                />
                <MetricCard
                    icon={FolderGit2}
                    label="Public Repos"
                    value={totalRepos}
                    color="var(--clr-cyan)"
                />
                <MetricCard
                    icon={GitCommitHorizontal}
                    label="Active Days (30d)"
                    value={dimensions.consistency.details.activeDays}
                    color="var(--clr-green)"
                />
            </div>

            {/* Languages Chart */}
            {topLanguages.length > 0 && (
                <div className="glass p-6 animate-fade-up delay-200">
                    <h2 className="text-sm font-semibold text-[var(--clr-text-muted)] mb-4 flex items-center gap-2">
                        <Code2 className="w-4 h-4" /> Tech Stack
                    </h2>
                    <LanguageChart languages={topLanguages} />
                </div>
            )}

            {/* Strengths & Red Flags */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-fade-up delay-300">
                {/* Strengths */}
                <div className="glass p-6">
                    <h2 className="text-sm font-semibold text-[var(--clr-green)] mb-4 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" /> Strengths
                    </h2>
                    <ul className="space-y-3">
                        {strengths.map((s, i) => (
                            <li key={i} className="flex gap-3 text-sm">
                                <Trophy className="w-4 h-4 mt-0.5 shrink-0 text-[var(--clr-green)]" />
                                <span>{s}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Red Flags */}
                <div className="glass p-6">
                    <h2 className="text-sm font-semibold text-[var(--clr-red)] mb-4 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" /> Red Flags
                    </h2>
                    {redFlags.length === 0 ? (
                        <p className="text-sm text-[var(--clr-text-muted)]">No red flags detected — great job! 🎉</p>
                    ) : (
                        <ul className="space-y-3">
                            {redFlags.map((f, i) => (
                                <li key={i} className="flex gap-3 text-sm">
                                    <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0 text-[var(--clr-red)]" />
                                    <span>{f}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            {/* Recommendations */}
            <div className="animate-fade-up delay-400">
                <h2 className="text-sm font-semibold text-[var(--clr-text-muted)] mb-4 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-[var(--clr-yellow)]" /> Actionable Recommendations
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {recommendations.map((rec, i) => (
                        <div key={i} className="glass p-6 flex flex-col gap-3 hover:border-[var(--clr-accent)] transition-colors group">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-[var(--clr-accent-light)] flex items-center gap-1.5">
                                    <ArrowUpRight className="w-3.5 h-3.5" /> Fix #{i + 1}
                                </span>
                                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${impactBadge(rec.impact)}`}>
                                    {rec.impact} impact
                                </span>
                            </div>
                            <h3 className="font-semibold text-sm group-hover:text-[var(--clr-accent-light)] transition-colors">
                                {rec.title}
                            </h3>
                            <p className="text-xs text-[var(--clr-text-muted)] leading-relaxed">{rec.description}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Dimension Details */}
            <div className="glass p-6 animate-fade-up delay-400">
                <h2 className="text-sm font-semibold text-[var(--clr-text-muted)] mb-4">Score Breakdown</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { name: "Documentation", score: dimensions.documentation.score, weight: "30%" },
                        { name: "Consistency", score: dimensions.consistency.score, weight: "25%" },
                        { name: "Impact", score: dimensions.impact.score, weight: "25%" },
                        { name: "Best Practices", score: dimensions.bestPractices.score, weight: "20%" },
                    ].map((d) => (
                        <div key={d.name} className="bg-[var(--clr-surface-2)] rounded-xl p-4 space-y-2">
                            <div className="flex justify-between text-xs">
                                <span className="text-[var(--clr-text-muted)]">{d.name}</span>
                                <span className="font-bold" style={{ color: scoreColor(d.score) }}>{d.score}</span>
                            </div>
                            <div className="h-1.5 rounded-full bg-[var(--clr-border)] overflow-hidden">
                                <div
                                    className="h-full rounded-full transition-all duration-1000"
                                    style={{ width: `${d.score}%`, background: scoreColor(d.score) }}
                                />
                            </div>
                            <p className="text-[10px] text-[var(--clr-text-muted)]">Weight: {d.weight}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
