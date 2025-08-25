"use client";
import { useEffect, useState } from "react";
import { X, Star, GripVertical, Trash2, Plus } from "lucide-react";
import { useFavorites } from "@/lib/useFavorites";
import { mergeModels, useCustomModels } from "@/lib/customModels";
import type { AiModel } from "@/lib/types";

export type FavoritesModalProps = {
  open: boolean;
  onClose: () => void;
};

export default function FavoritesModal({
  open,
  onClose,
}: FavoritesModalProps) {
  const { favoriteIds, reorderFavorites, removeFavorite, addFavorite, clearFavorites } = useFavorites();
  const [customModels] = useCustomModels();
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Lock background scroll while modal is open
  useEffect(() => {
    if (open) {
      document.body.classList.add("modal-open");
      return () => {
        document.body.classList.remove("modal-open");
      };
    } else {
      document.body.classList.remove("modal-open");
    }
  }, [open]);

  if (!open) return null;

  const allModels = mergeModels(customModels);
  const favoriteModels = favoriteIds
    .map(id => allModels.find(m => m.id === id))
    .filter((m): m is AiModel => m !== undefined);

  const availableModels = allModels.filter(m => !favoriteIds.includes(m.id));

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null) return;

    const newOrder = [...favoriteIds];
    const draggedItem = newOrder[draggedIndex];
    newOrder.splice(draggedIndex, 1);
    newOrder.splice(index, 0, draggedItem);
    
    reorderFavorites(newOrder);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const AddModelsModal = () => (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={() => setShowAddModal(false)}
      />
      <div className="relative w-full max-w-2xl mx-3 rounded-xl border border-white/10 bg-zinc-900/95 p-6 shadow-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Add Models to Favorites</h3>
          <button
            onClick={() => setShowAddModal(false)}
            className="h-8 w-8 inline-flex items-center justify-center rounded-md bg-white/10 hover:bg-white/20"
          >
            <X size={16} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto space-y-2">
          {availableModels.map((model) => (
            <button
              key={model.id}
              onClick={() => {
                addFavorite(model.id);
                setShowAddModal(false);
              }}
              className="w-full flex items-center gap-3 p-3 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-left transition-colors"
            >
              <Plus size={16} className="text-green-400 shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="font-medium">{model.label}</div>
                {model.good && (
                  <div className="text-xs text-yellow-400 flex items-center gap-1 mt-1">
                    <Star size={10} />
                    Pro Model
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          onClick={onClose}
        />
        <div className="relative w-full max-w-2xl mx-3 rounded-xl border border-white/10 bg-zinc-900/95 p-6 shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Star className="text-yellow-400" size={20} />
              Manage Favorites
            </h2>
            <button
              onClick={onClose}
              className="h-8 w-8 inline-flex items-center justify-center rounded-md bg-white/10 hover:bg-white/20"
            >
              <X size={16} />
            </button>
          </div>

          <div className="text-sm text-zinc-400 mb-4">
            Drag and drop to reorder your favorite models. These will appear at the top of the models list.
          </div>

          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm transition-colors"
            >
              <Plus size={14} />
              Add Model
            </button>
            <button
              onClick={clearFavorites}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm transition-colors"
            >
              <Trash2 size={14} />
              Clear All
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2">
            {favoriteModels.length === 0 ? (
              <div className="text-center py-8 text-zinc-400">
                <Star size={48} className="mx-auto mb-3 opacity-50" />
                <p>No favorite models yet.</p>
                <p className="text-sm mt-1">Click &quot;Add Model&quot; to get started!</p>
              </div>
            ) : (
              favoriteModels.map((model, index) => (
                <div
                  key={model.id}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  className={`flex items-center gap-3 p-3 rounded-lg border bg-white/5 hover:bg-white/10 transition-colors cursor-move ${
                    draggedIndex === index ? "opacity-50 border-white/30" : "border-white/10"
                  }`}
                >
                  <GripVertical size={16} className="text-zinc-400 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="font-medium">{model.label}</div>
                    {model.good && (
                      <div className="text-xs text-yellow-400 flex items-center gap-1 mt-1">
                        <Star size={10} />
                        Pro Model
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => removeFavorite(model.id)}
                    className="p-1 rounded-md text-red-400 hover:text-red-300 hover:bg-red-500/20 transition-colors"
                    title="Remove from favorites"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {showAddModal && <AddModelsModal />}
    </>
  );
}