import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import axios from "axios";
import Dashboard from "../components/Dashboard.jsx";

function SkeletonBlock({ className = "" }) {
    return <div className={`skeleton ${className}`} />;
}

function LoadingSkeleton() {
    return (
        <div className="max-w-6xl mx-auto px-6 py-12 space-y-8 animate-fade-up">
            {/* Header skeleton */}
            <div className="flex items-center gap-5">
                <SkeletonBlock className="w-20 h-20 rounded-full" />
                <div className="space-y-3 flex-1">
                    <SkeletonBlock className="h-7 w-48" />
                    <SkeletonBlock className="h-4 w-72" />
                </div>
            </div>
            {/* Score skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <SkeletonBlock className="h-56 col-span-1" />
                <SkeletonBlock className="h-56 col-span-2" />
            </div>
            {/* Cards skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {[...Array(4)].map((_, i) => (
                    <SkeletonBlock key={i} className="h-28" />
                ))}
            </div>
            {/* Lists skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <SkeletonBlock className="h-40" />
                <SkeletonBlock className="h-40" />
            </div>
        </div>
    );
}

export default function AnalyzePage() {
    const { username } = useParams();
    const [data, setData] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        async function fetchAnalysis() {
            try {
                const res = await axios.post("/api/analyze", { username });
                if (!cancelled) setData(res.data);
            } catch (err) {
                if (!cancelled) {
                    if (err.response?.status === 404) {
                        setError(`User "${username}" not found on GitHub.`);
                    } else if (err.response?.status === 429) {
                        setError("Rate limit exceeded. Please wait a moment and try again.");
                    } else {
                        setError("Failed to analyze profile. Please try again later.");
                    }
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        fetchAnalysis();
        return () => { cancelled = true; };
    }, [username]);

    return (
        <div className="relative min-h-screen">
            <div className="hero-bg" />

            {/* Top bar */}
            <nav className="relative z-10 flex items-center gap-4 px-6 md:px-12 py-5">
                <Link
                    to="/"
                    className="flex items-center gap-2 text-sm text-[var(--clr-text-muted)] hover:text-white transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" /> Back
                </Link>
                <span className="text-sm text-[var(--clr-text-muted)]">/ Analyzing <strong className="text-white">@{username}</strong></span>
            </nav>

            <div className="relative z-10">
                {loading && <LoadingSkeleton />}
                {error && (
                    <div className="max-w-xl mx-auto mt-20 px-6 text-center animate-fade-up">
                        <div className="glass p-8 space-y-4">
                            <p className="text-lg text-[var(--clr-red)]">⚠ {error}</p>
                            <Link to="/" className="inline-block text-sm text-[var(--clr-accent-light)] hover:underline">
                                ← Try another username
                            </Link>
                        </div>
                    </div>
                )}
                {data && <Dashboard user={data.user} analysis={data.analysis} />}
            </div>
        </div>
    );
}
