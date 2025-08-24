"use client";

import Logo from "@/components/ui/Logo";

interface LaunchScreenProps {
  backgroundClass: string;
  title?: string;
  subtitle?: string;
  dismissed?: boolean;
}

export default function LaunchScreen({
  backgroundClass,
  title = "ModelArena",
  subtitle = "Warming things up…",
  dismissed = false,
}: LaunchScreenProps) {

  return (
    <div
      className={`min-h-screen w-full ${backgroundClass} relative text-white transition-opacity duration-300 ease-out ${dismissed ? "opacity-0 pointer-events-none" : "opacity-100"}`}
    >
      <div className={`absolute inset-0 z-0 pointer-events-none opacity-95 transition-opacity duration-300 ease-out ${dismissed ? "opacity-0" : "opacity-95"}`} />
      <div className="relative z-10 px-3 lg:px-4 py-4 lg:py-6">
        <div className="flex gap-3 lg:gap-4">
          <div className="flex-1 min-w-0 flex flex-col h-[calc(100vh-2rem)] lg:h-[calc(100vh-3rem)] overflow-hidden">
            <div className="flex items-center justify-center h-full">
              <div
                role="status"
                aria-live="polite"
                className={`w-full max-w-sm rounded-2xl border border-white/20 bg-gray-950/20 backdrop-blur-xl shadow-2xl p-7 sm:p-8 text-center relative overflow-hidden transition-all duration-300 ease-out ${dismissed ? "opacity-0 scale-95" : "opacity-100 scale-100"}`}
                style={{
                  boxShadow: "0 0 40px rgba(19, 255, 170, 0.15), 0 0 80px rgba(30, 103, 198, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)"
                }}
              >
                {/* Aurora ambient glow */}
                <div className={`pointer-events-none absolute -inset-12 bg-gradient-radial from-[#13FFAA]/10 via-[#1E67C6]/5 to-transparent blur-3xl transition-opacity duration-300 ease-out ${dismissed ? "opacity-0" : "opacity-100"}`} />

                {/* Card content */}
                <div className="relative">
                {/* Logo with enhanced styling */}
                <div className="mx-auto flex justify-center">
                  <Logo size="lg" showText={false} animated={true} />
                </div>

                  {/* Title & subtitle */}
                  <h2 className="mt-3 text-base font-semibold tracking-wide text-white/95">{title}</h2>
                  <p className="mt-1 text-sm text-white/70">{subtitle}</p>

                  {/* Enhanced progress bar with aurora colors */}
                  <div className="mt-6 relative h-2 w-full overflow-hidden rounded-full bg-white/10">
                    {/* Aurora gradient progress */}
                    <div
                      className="absolute inset-0 bg-gradient-to-r from-[#13FFAA] via-[#1E67C6] to-[#CE84CF] opacity-60"
                      style={{
                        boxShadow: "0 0 20px rgba(19, 255, 170, 0.4), 0 0 40px rgba(30, 103, 198, 0.3), 0 0 60px rgba(206, 132, 207, 0.2)",
                      }}
                    />
                    {/* Animated sheen effect */}
                    <div
                      className="absolute top-0 left-0 h-full w-1/3 motion-safe:animate-[sheen_1.4s_ease-in-out_infinite]"
                      style={{
                        background:
                          "linear-gradient(90deg, transparent, rgba(255,255,255,0.9), transparent)",
                        filter: "blur(1px)",
                      }}
                    />
                  </div>

                  {/* Keyframes via inline style tag to avoid global CSS touch */}
                  <style jsx>{`
                    @keyframes sheen {
                      0% { transform: translateX(-120%); }
                      60% { transform: translateX(60%); }
                      100% { transform: translateX(220%); }
                    }
                  `}</style>

                  <span className="sr-only">Loading</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
