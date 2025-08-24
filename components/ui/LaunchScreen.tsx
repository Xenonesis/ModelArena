"use client";

interface LaunchScreenProps {
  backgroundClass: string;
  title?: string;
  subtitle?: string;
  logoSrc?: string;
  dismissed?: boolean;
}

export default function LaunchScreen({
  backgroundClass,
  title = "ModelArena",
  subtitle = "Warming things up…",
  logoSrc = "/brand.png",
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
                className={`w-full max-w-sm rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md shadow-2xl p-7 sm:p-8 text-center relative overflow-hidden transition-opacity duration-300 ease-out ${dismissed ? "opacity-0" : "opacity-100"}`}
              >
                {/* Ambient glow */}
                <div className={`pointer-events-none absolute -inset-12 bg-gradient-radial from-white/10 via-transparent to-transparent blur-3xl transition-opacity duration-300 ease-out ${dismissed ? "opacity-0" : "opacity-100"}`} />

                {/* Card content */}
                <div className="relative">
                  {/* Logo with soft ring */}
                  {logoSrc && (
                    <div
                      className="mx-auto inline-flex items-center justify-center rounded-2xl ring-1 ring-white/15 shadow-md p-2 bg-white/5"
                      style={{ boxShadow: "0 0 36px 2px var(--accent-primary)" }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={logoSrc} alt="Brand" className="h-16 w-16 rounded-xl" />
                    </div>
                  )}

                  {/* Title & subtitle */}
                  <h2 className="mt-3 text-base font-semibold tracking-wide text-white/95">{title}</h2>
                  <p className="mt-1 text-sm text-white/70">{subtitle}</p>

                  {/* Subtle accent progress with sheen */}
                  <div className="mt-6 relative h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                    {/* Base accent line */}
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(90deg, var(--accent-primary), var(--accent-secondary))",
                        opacity: 0.55,
                        boxShadow: "0 0 10px 0 var(--accent-primary)",
                      }}
                    />
                    {/* Sheen sweep */}
                    <div
                      className="absolute top-0 left-0 h-full w-1/3 motion-safe:animate-[sheen_1.4s_ease-in-out_infinite]"
                      style={{
                        background:
                          "linear-gradient(90deg, transparent, rgba(255,255,255,0.9), transparent)",
                        filter: "blur(2px)",
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
