"use client";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function FirstVisitNote({ open, onClose }: Props) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative mx-3 w-full max-w-md sm:max-w-lg rounded-2xl border border-white/10 bg-zinc-900/90 p-5 shadow-2xl">
        <div className="flex items-start gap-3 mb-2">
          <h3 className="text-base font-semibold tracking-wide">
            Some models need API keys
          </h3>
        </div>
        <div className="text-sm text-zinc-300 space-y-2">
          <p>You can generate API keys for free.</p>
          <ul className="list-disc list-inside space-y-1">
            <li>One OpenRouter key works across many models.</li>
            <li>Gemini requires its own key.</li>
          </ul>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 justify-end mt-4">
          <button
            onClick={() => {
              window.dispatchEvent(new Event("open-settings"));
              onClose();
            }}
            className="text-sm px-3 py-2 rounded text-white border border-white/10 accent-action-fill"
          >
            Get API key for free
          </button>
          <button
            onClick={onClose}
            className="text-sm px-3 py-2 rounded bg-white/10 border border-white/10 hover:bg-white/15"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}
