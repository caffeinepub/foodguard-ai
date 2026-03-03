import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { UserProfile, FoodAnalysisResult, IngredientScanResult } from '../backend';

export function useAnalyzeFood(foodName: string | null) {
  const { actor, isFetching } = useActor();

  return useQuery<FoodAnalysisResult | null>({
    queryKey: ['analyzeFood', foodName],
    queryFn: async () => {
      if (!actor || !foodName) return null;
      return actor.analyzeFood(foodName);
    },
    enabled: !!actor && !isFetching && !!foodName,
  });
}

export function useGetAllFoods() {
  const { actor, isFetching } = useActor();

  return useQuery<FoodAnalysisResult[]>({
    queryKey: ['allFoods'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllFoods();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetUserProfile() {
  const { actor, isFetching } = useActor();

  return useQuery<UserProfile | null>({
    queryKey: ['userProfile'],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getUserProfile();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSaveUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.saveUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      queryClient.invalidateQueries({ queryKey: ['healthWarnings'] });
    },
  });
}

export function useScanIngredients() {
  const { actor } = useActor();

  return useMutation<IngredientScanResult, Error, string[]>({
    mutationFn: async (ingredients: string[]) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.scanIngredients(ingredients);
    },
  });
}

export function useGetHealthWarnings(foodName: string | null) {
  const { actor, isFetching } = useActor();

  return useQuery<{ status: string; warnings: string[] }>({
    queryKey: ['healthWarnings', foodName],
    queryFn: async () => {
      if (!actor || !foodName) return { status: 'Safe', warnings: [] };
      return actor.getHealthWarnings(foodName);
    },
    enabled: !!actor && !isFetching && !!foodName,
  });
}
