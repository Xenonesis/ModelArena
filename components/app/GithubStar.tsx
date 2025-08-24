"use client";
import { useEffect, useRef, useState } from "react";
import { Github, Star } from "lucide-react";

type Props = {
  owner: string;
  repo: string;
  className?: string;
};

export default function GithubStar({ owner, repo, className }: Props) {
  const [targetCount, setTargetCount] = useState<number | null>(null);
  const [displayCount, setDisplayCount] = useState<number>(0);
  const animRef = useRef<number | null>(null);
  const didAnimateRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch(`/api/github/stars?owner=${owner}&repo=${repo}`, { cache: 'no-store' });
        const data = await res.json();
        if (cancelled) return;
        if (data?.ok && typeof data.stars === 'number') {
          setTargetCount(data.stars);
        } else {
          setTargetCount(null);
        }
      } catch {
        if (!cancelled) setTargetCount(null);
      }
    };
    load();
    const id = setInterval(load, 300000);
    return () => { cancelled = true; clearInterval(id); };
  }, [owner, repo]);

  useEffect(() => {
    if (targetCount == null) return;

    // Animate only once per page load (first fetch)
    if (didAnimateRef.current) {
      setDisplayCount(targetCount);
      return;
    }

    didAnimateRef.current = true;
    setDisplayCount(0);
    const duration = 900; // ms
    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
      const value = Math.floor(eased * targetCount);
      setDisplayCount(value);
      if (t < 1) {
        animRef.current = requestAnimationFrame(tick);
      } else {
        setDisplayCount(targetCount);
      }
    };

    animRef.current = requestAnimationFrame(tick);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [targetCount]);

  const countText = targetCount == null ? '—' : displayCount.toLocaleString();

  return (
    <a
      href={`https://github.com/${owner}/${repo}`}
      target="_blank"
      rel="noopener noreferrer"
      className={[
        "group inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/[0.15]",
        "bg-white/[0.05] hover:bg-white/[0.12] hover:border-white/[0.25]",
        "text-xs md:text-sm transition-all duration-200 ease-out",
        "shadow-sm hover:shadow-md",
        className || "",
      ].join(" ")}
      title="Star on GitHub"
    >
      {/* Left: circular chip with GitHub icon */}
      <span className="h-6 w-6 rounded-full border border-white/[0.15] bg-white/[0.08] group-hover:bg-white/[0.15] inline-flex items-center justify-center transition-all duration-200">
        <Github size={14} className="text-white/90 group-hover:text-white transition-colors duration-200" />
      </span>
      {/* Middle: transparent label */}
      <span className="inline-flex items-center gap-1.5 text-white/90 group-hover:text-white transition-colors duration-200">
        <Star size={14} className="text-yellow-400 group-hover:text-yellow-300 transition-colors duration-200" />
        <span className="font-medium">Star</span>
      </span>
      {/* Right: count chip */}
      <span className="h-6 rounded-full border border-white/[0.15] bg-white/[0.08] group-hover:bg-white/[0.15] inline-flex items-center justify-center px-2.5 tabular-nums text-white/90 group-hover:text-white min-w-[2.5rem] text-center font-semibold transition-all duration-200">
        {countText}
      </span>
    </a>
  );
}
