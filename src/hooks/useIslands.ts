import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';

export function useIslands() {
  const islands = useQuery(api.islands.getIslands, {});
  return islands ?? [];
}

export function useWinesByIsland(islandId: string | null) {
  // Pass undefined to skip query when islandId is null
  const wines = useQuery(api.islands.getWinesByIsland, islandId ? { islandId } : undefined);
  return wines ?? [];
}