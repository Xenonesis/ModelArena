"use client";
import { motion } from "framer-motion";
import { AiInput } from "@/components/chat/AIChatBox";

type Props = {
  onSubmit: (text: string, imageDataUrl?: string) => void;
  loading: boolean;
};

export default function FixedInputBar({ onSubmit, loading }: Props) {
  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed bottom-0 left-0 right-0 z-20 pt-3 pb-2 sm:pb-[env(safe-area-inset-bottom)] bg-gradient-to-t from-black/90 via-black/60 to-transparent pointer-events-none backdrop-blur-md"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="max-w-3xl mx-auto px-2 sm:px-3 pointer-events-auto"
      >
        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl border border-white/20 p-2 sm:p-3 shadow-2xl shadow-black/30 ring-1 ring-white/5">
          <AiInput onSubmit={(text, imageDataUrl) => onSubmit(text, imageDataUrl)} loading={loading} />
        </div>
      </motion.div>
    </motion.div>
  );
}
