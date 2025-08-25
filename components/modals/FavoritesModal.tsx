"use client";
import { useEffect, useState } from "react";
import { X, Star, GripVertical, Trash2, Plus, ArrowLeft, Search, Sparkles, TrendingUp, Heart, Crown } from "lucide-react";
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
  const [searchQuery, setSearchQuery] = useState("");
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Prevent hydration mismatches
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Lock background scroll while modal is open
  useEffect(() => {
    if (!isMounted) return;
    
    if (open) {
      document.body.classList.add("modal-open");
      return () => {
        document.body.classList.remove("modal-open");
      };
    } else {
      document.body.classList.remove("modal-open");
    }
  }, [open, isMounted]);

  if (!isMounted || !open) return null;

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

  const filteredAvailableModels = availableModels.filter(model =>
    model.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    model.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const AddModelsModal = () => (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-8">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        onClick={() => setShowAddModal(false)}
      />
      <div className="relative w-full max-w-4xl max-h-[80vh] rounded-2xl border border-white/20 bg-gradient-to-br from-zinc-900/95 via-zinc-800/90 to-zinc-900/95 backdrop-blur-xl shadow-2xl overflow-hidden flex flex-col mx-auto my-auto">
        {/* Header with Gradient Border */}
        <div className="flex items-center justify-between p-6 pb-4 border-b border-gradient-to-r from-transparent via-white/20 to-transparent shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowAddModal(false)}
              className="group flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-white/10 to-white/5 hover:from-white/20 hover:to-white/10 text-white transition-all duration-300 border border-white/10 hover:border-white/20 shadow-lg hover:shadow-xl"
              title="Go back"
            >
              <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-0.5" />
              <span className="text-sm font-medium">Back</span>
            </button>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-400/30">
                <Sparkles size={20} className="text-blue-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">Discover Models</h3>
                <p className="text-sm text-white/60">Add new AI models to your favorites</p>
              </div>
            </div>
          </div>
          <button
            onClick={() => setShowAddModal(false)}
            className="h-10 w-10 inline-flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 hover:border-white/20 transition-all duration-200 hover:scale-105"
            title="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Search Bar */}
        <div className="px-6 pt-4 pb-2 shrink-0">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search size={18} className="text-white/40" />
            </div>
            <input
              type="text"
              placeholder="Search models by name or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/10 focus:border-blue-400/50 focus:bg-white/10 text-white placeholder-white/40 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400/20"
            />
          </div>
        </div>

        {/* Models Grid */}
        <div className="flex-1 overflow-y-auto px-6 pb-6 min-h-0">
          {filteredAvailableModels.length === 0 ? (
            <div className="text-center py-12">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 inline-flex mb-4">
                <Search size={32} className="text-white/40" />
              </div>
              <p className="text-white/60 text-lg">No models found</p>
              <p className="text-white/40 text-sm mt-1">Try adjusting your search query</p>
            </div>
          ) : (
            <div className="grid gap-3">
              {filteredAvailableModels.map((model, index) => (
                <button
                  key={model.id}
                  onClick={() => {
                    addFavorite(model.id);
                    setIsAnimating(true);
                    setTimeout(() => setIsAnimating(false), 300);
                  }}
                  className="group w-full flex items-center gap-4 p-4 rounded-xl border border-white/10 bg-gradient-to-r from-white/5 to-transparent hover:from-white/10 hover:to-white/5 text-left transition-all duration-300 hover:border-white/20 hover:scale-[1.02] hover:shadow-lg"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="p-2 rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-400/30 group-hover:from-green-500/30 group-hover:to-emerald-500/30 transition-all duration-300">
                    <Plus size={16} className="text-green-400 transition-transform group-hover:scale-110" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-white group-hover:text-white/90 transition-colors">{model.label}</div>
                    <div className="flex items-center gap-2 mt-1">
                      {model.good && (
                        <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-400/30">
                          <Crown size={10} className="text-yellow-400" />
                          <span className="text-xs text-yellow-300 font-medium">Pro</span>
                        </div>
                      )}
                      <span className="text-xs text-white/50 font-mono">{model.id}</span>
                    </div>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Heart size={16} className="text-pink-400" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-8">
        <div
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
          onClick={onClose}
        />
        <div className="relative w-full max-w-4xl rounded-2xl border border-white/20 bg-gradient-to-br from-zinc-900/95 via-zinc-800/90 to-zinc-900/95 backdrop-blur-xl p-8 shadow-2xl max-h-[80vh] overflow-hidden flex flex-col mx-auto my-auto">
          {/* Enhanced Header */}
          <div className="flex items-center justify-between mb-8 pb-6 border-b border-gradient-to-r from-transparent via-white/20 to-transparent">
            <div className="flex items-center gap-4">
              <button
                onClick={onClose}
                className="group flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-white/10 to-white/5 hover:from-white/20 hover:to-white/10 text-white transition-all duration-300 border border-white/10 hover:border-white/20 shadow-lg hover:shadow-xl"
                title="Go back"
              >
                <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-0.5" />
                <span className="text-sm font-medium">Back</span>
              </button>
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-400/30">
                  <Star className="text-yellow-400" size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">Favorite Models</h2>
                  <p className="text-white/60 text-sm">Organize your preferred AI models • {favoriteModels.length} favorites</p>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="h-10 w-10 inline-flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 hover:border-white/20 transition-all duration-200 hover:scale-105"
              title="Close"
            >
              <X size={18} />
            </button>
          </div>

          {/* Stats Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-400/20">
              <div className="flex items-center gap-3">
                <TrendingUp size={20} className="text-blue-400" />
                <div>
                  <p className="text-white/90 font-semibold">{favoriteModels.length}</p>
                  <p className="text-white/60 text-sm">Total Favorites</p>
                </div>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-400/20">
              <div className="flex items-center gap-3">
                <Crown size={20} className="text-purple-400" />
                <div>
                  <p className="text-white/90 font-semibold">{favoriteModels.filter(m => m.good).length}</p>
                  <p className="text-white/60 text-sm">Pro Models</p>
                </div>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-400/20">
              <div className="flex items-center gap-3">
                <Heart size={20} className="text-green-400" />
                <div>
                  <p className="text-white/90 font-semibold">{availableModels.length}</p>
                  <p className="text-white/60 text-sm">Available</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mb-6">
            <button
              onClick={() => setShowAddModal(true)}
              className="group flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white text-sm font-medium transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 border border-green-500/30"
            >
              <Plus size={16} className="transition-transform group-hover:scale-110" />
              Add Model
            </button>
            {favoriteModels.length > 0 && (
              <button
                onClick={clearFavorites}
                className="group flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white text-sm font-medium transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 border border-red-500/30"
              >
                <Trash2 size={16} className="transition-transform group-hover:scale-110" />
                Clear All
              </button>
            )}
          </div>

          <div className="text-sm text-white/60 mb-4 px-1">
            💡 <strong>Pro tip:</strong> Drag and drop to reorder your favorites. They&apos;ll appear at the top of the models list.
          </div>

          {/* Favorites List */}
          <div className="flex-1 overflow-y-auto">
            {favoriteModels.length === 0 ? (
              <div className="text-center py-16">
                <div className="relative">
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-yellow-500/10 to-orange-500/5 border border-yellow-400/20 inline-flex mb-6">
                    <Star size={48} className="text-yellow-400/60" />
                  </div>
                  <div className="absolute top-2 right-2 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                </div>
                <h3 className="text-xl font-semibold text-white/90 mb-2">No favorites yet</h3>
                <p className="text-white/60 mb-6">Discover and add your preferred AI models to get started!</p>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-medium transition-all duration-300 hover:scale-105 shadow-lg"
                >
                  <Sparkles size={16} />
                  Explore Models
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {favoriteModels.map((model, index) => (
                  <div
                    key={model.id}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragOverIndex(index);
                      handleDragOver(e, index);
                    }}
                    onDragLeave={() => setDragOverIndex(null)}
                    onDragEnd={() => {
                      handleDragEnd();
                      setDragOverIndex(null);
                    }}
                    className={`group flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 cursor-move ${
                      draggedIndex === index 
                        ? "opacity-30 scale-95 border-white/30 bg-white/5" 
                        : dragOverIndex === index 
                          ? "border-blue-400/50 bg-gradient-to-r from-blue-500/10 to-purple-500/10 scale-105" 
                          : "border-white/10 bg-gradient-to-r from-white/5 to-transparent hover:from-white/10 hover:to-white/5 hover:border-white/20 hover:scale-[1.02]"
                    } hover:shadow-lg`}
                  >
                    {/* Drag Handle */}
                    <div className="p-2 rounded-lg bg-white/10 group-hover:bg-white/20 transition-colors">
                      <GripVertical size={16} className="text-white/60 group-hover:text-white/80" />
                    </div>
                    
                    {/* Model Info */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className="font-semibold text-white group-hover:text-white/90 transition-colors">{model.label}</h4>
                        {model.good && (
                          <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-400/30">
                            <Crown size={10} className="text-yellow-400" />
                            <span className="text-xs text-yellow-300 font-medium">Pro</span>
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-white/50 font-mono">{model.id}</p>
                      <div className="text-xs text-white/40 mt-1">Position #{index + 1}</div>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeFavorite(model.id)}
                      className="group/btn p-2.5 rounded-xl bg-gradient-to-r from-red-500/20 to-pink-500/20 hover:from-red-500/30 hover:to-pink-500/30 border border-red-400/30 hover:border-red-400/50 text-red-400 hover:text-red-300 transition-all duration-300 hover:scale-110 shadow-lg"
                      title="Remove from favorites"
                    >
                      <Trash2 size={16} className="transition-transform group-hover/btn:scale-110" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {showAddModal && <AddModelsModal />}
    </>
  );
}