import { DemoAnimatedFooter } from "@/components/demo";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AnimatedFooterDemo() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Header with back button */}
      <div className="fixed top-4 left-4 z-50">
        <Link 
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 bg-black/50 backdrop-blur-sm rounded-full border border-white/20 text-white hover:bg-black/70 transition-all duration-200"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
      </div>
      
      {/* Demo content */}
      <DemoAnimatedFooter />
    </div>
  );
}