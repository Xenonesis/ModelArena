import { useLocalStorage } from '@/lib/useLocalStorage';

const FAVORITES_STORAGE_KEY = 'ai-fiesta:favorite-models';

export function useFavorites() {
  const [favoriteIds, setFavoriteIds] = useLocalStorage<string[]>(FAVORITES_STORAGE_KEY, [
    // Default favorites to get users started
    'llama-3.3-70b-instruct',
    'gemini-2.5-pro',
    'openai-gpt-oss-20b-free',
    'glm-4.5-air',
    'moonshot-kimi-k2'
  ]);

  const isFavorite = (modelId: string): boolean => {
    return favoriteIds.includes(modelId);
  };

  const toggleFavorite = (modelId: string): void => {
    setFavoriteIds(prev => {
      if (prev.includes(modelId)) {
        return prev.filter(id => id !== modelId);
      } else {
        return [...prev, modelId];
      }
    });
  };

  const addFavorite = (modelId: string): void => {
    setFavoriteIds(prev => {
      if (!prev.includes(modelId)) {
        return [...prev, modelId];
      }
      return prev;
    });
  };

  const removeFavorite = (modelId: string): void => {
    setFavoriteIds(prev => prev.filter(id => id !== modelId));
  };

  const reorderFavorites = (newOrder: string[]): void => {
    setFavoriteIds(newOrder);
  };

  const clearFavorites = (): void => {
    setFavoriteIds([]);
  };

  return {
    favoriteIds,
    isFavorite,
    toggleFavorite,
    addFavorite,
    removeFavorite,
    reorderFavorites,
    clearFavorites,
  };
}