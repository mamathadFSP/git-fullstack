import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Github,
    ArrowRight,
    BarChart3,
    FileText,
    Shield,
    Sparkles,
} from "lucide-react";
import axios from "axios";

const FEATURES = [
    {
        icon: BarChart3,
        title: "Recruiter-Readiness Score",
        desc: "Objective 0-100 score based on how recruiters evaluate your GitHub.",
    },
    {
        icon: FileText,
        title: "Documentation Audit",
        desc: "Checks every repo for README quality, descriptions, and best practices.",
    },
    {
        icon: Shield,
        title: "Red Flag Detection",
        desc: "Surfaces gaps that make your profile look unprofessional.",
    },
    {
        icon: Sparkles,
        title: "Actionable Fixes",
        desc: "Get 3 specific recommendations to boost your score immediately.",
    },
];

export default function LandingPage() {
    const [input, setInput] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const extractUsername = (raw) => {
        const trimmed = raw.trim().replace(/\/+$/, "");
        // Handle full URL: https://github.com/username
        const match = trimmed.match(/github\.com\/([A-Za-z0-9_-]+)/);
        if (match) return match[1];
        // Handle plain username (no spaces, no slashes)
        if (/^[A-Za-z0-9_-]+$/.test(trimmed)) return trimmed;
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        const username = extractUsername(input);
        if (!username) {
            setError("Please enter a valid GitHub username or profile URL.");
            return;
        }

        setLoading(true);
        try {
            // Validate user exists by hitting our API
            await axios.post("/api/analyze", { username });
            navigate(`/analyze/${username}`);
        } catch (err) {
            if (err.response?.status === 404) {
                setError(`GitHub user "${username}" not found. Check the spelling.`);
            } else if (err.response?.status === 429) {
                setError("GitHub API rate limit reached. Please try again in a minute.");
            } else {
                setError("Something went wrong. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen flex flex-col">
            {/* Animated BG */}
            <div className="hero-bg" />

            {/* Nav */}
            <nav className="relative z-10 flex items-center justify-between px-6 md:px-12 py-5">
                <a href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight">
                    <Github className="w-6 h-6 text-[var(--clr-accent-light)]" />
                    <span>GitAnalyzer</span>
                </a>
                <a
                    href="https://github.com"
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-[var(--clr-text-muted)] hover:text-white transition-colors"
                >
                    GitHub ↗
                </a>
            </nav>

            {/* Hero */}
            <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-16 md:py-24 text-center">
                {/* Badge */}
                <div
                    className="glass-sm px-4 py-1.5 text-xs font-medium tracking-wide text-[var(--clr-accent-light)] mb-8 animate-fade-up"
                >
                    🚀 Powered by the GitHub REST API
                </div>

                {/* Headline */}
                <h1
                    className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight max-w-4xl animate-fade-up delay-100"
                    style={{
                        background: "linear-gradient(135deg, #e4e4ef 30%, var(--clr-accent-light) 70%, var(--clr-cyan))",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                    }}
                >
                    Unfold Success from Untold Experiences
                </h1>

                <p className="mt-6 text-base md:text-lg text-[var(--clr-text-muted)] max-w-xl animate-fade-up delay-200">
                    Turn your repositories into recruiter-ready proof.
                    Get an objective score, discover red flags, and receive
                    actionable fixes — in seconds.
                </p>

                {/* Input */}
                <form
                    onSubmit={handleSubmit}
                    className="mt-10 w-full max-w-lg animate-fade-up delay-300"
                >
                    <div className="glass glow-accent flex items-center p-2 gap-2">
                        <Github className="w-5 h-5 ml-3 text-[var(--clr-text-muted)] shrink-0" />
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => { setInput(e.target.value); setError(""); }}
                            placeholder="Enter GitHub username or profile URL"
                            className="flex-1 bg-transparent outline-none text-sm md:text-base py-3 px-2 text-white placeholder-[var(--clr-text-muted)]"
                        />
                        <button
                            type="submit"
                            disabled={loading || !input.trim()}
                            className="shrink-0 flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold
                         bg-[var(--clr-accent)] hover:bg-[var(--clr-accent-light)] text-white
                         transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    Analyze <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </div>
                    {error && (
                        <p className="mt-3 text-sm text-[var(--clr-red)] text-left px-2">{error}</p>
                    )}
                </form>

                {/* Feature Cards */}
                <div className="mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl w-full animate-fade-up delay-400">
                    {FEATURES.map((f) => (
                        <div
                            key={f.title}
                            className="glass-sm p-6 flex flex-col gap-3 hover:border-[var(--clr-accent)] transition-colors duration-300 group"
                        >
                            <f.icon className="w-8 h-8 text-[var(--clr-accent-light)] group-hover:scale-110 transition-transform" />
                            <h3 className="font-semibold text-sm">{f.title}</h3>
                            <p className="text-xs text-[var(--clr-text-muted)] leading-relaxed">{f.desc}</p>
                        </div>
                    ))}
                </div>
            </main>

            {/* Footer */}
            <footer className="relative z-10 text-center text-xs text-[var(--clr-text-muted)] py-6">
                Built with ♥ — Not affiliated with GitHub, Inc.
            </footer>
        </div>
    );
}
