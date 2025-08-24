import { AuroraHero } from "@/components/ui/futurastic-hero-section";
import MultiOrbitSemiCircle from "@/components/ui/multi-orbit-semi-circle";
import AnimatedFooter from "@/components/ui/animated-footer";

const Main = () => {
  return (
    <div className="w-full">
      <AuroraHero />
    </div>
  );
};

// Demo for the Animated Footer Component
const DemoAnimatedFooter = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black">
      {/* Some content to demonstrate scroll behavior */}
      <div className="p-8 text-white">
        <h1 className="text-4xl font-bold mb-4">Demo Page</h1>
        <p className="text-lg mb-8">Scroll down to see the animated footer with wave effects.</p>
        <div className="space-y-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <p key={i} className="text-gray-300">
              This is demo content to create scrollable space. The footer will appear below with animated wave effects.
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          ))}
        </div>
      </div>
      
      {/* Animated Footer */}
      <AnimatedFooter
        leftLinks={[
          { href: "/terms", label: "Terms & Policies" },
          { href: "/privacy", label: "Privacy Policy" },
          { href: "/support", label: "Support" },
        ]}
        rightLinks={[
          { href: "/about", label: "About" },
          { href: "/blog", label: "Blog" },
          { href: "https://github.com/Xenonesis/Open-Fiesta-Clone", label: "GitHub" },
          { href: "https://github.com/Xenonesis", label: "Creator" },
        ]}
        copyrightText="ModelArena 2025. All Rights Reserved"
        barCount={25}
      />
    </div>
  );
};

export default function DemoOne() {
  return <MultiOrbitSemiCircle />;
}

export { Main, DemoAnimatedFooter };
