import { useQuery } from '@tanstack/react-query';
import { awardsApi } from '@/api';
import type { AwardCategory } from '@/types';

export const useMyAwards = (category?: AwardCategory) => {
  return useQuery({
    queryKey: ['awards', 'me', category],
    queryFn: () => awardsApi.getMyAwards({ category }),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useAvailableAwards = (category?: AwardCategory) => {
  return useQuery({
    queryKey: ['awards', 'available', category],
    queryFn: () => awardsApi.getAvailableAwards(category),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useLeaderboard = (category: AwardCategory | 'overall') => {
  return useQuery({
    queryKey: ['leaderboard', category],
    queryFn: () =>
      category === 'overall'
        ? awardsApi.getOverallLeaderboard()
        : awardsApi.getLeaderboard(category),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useMyRank = (category?: AwardCategory) => {
  return useQuery({
    queryKey: ['rank', 'me', category],
    queryFn: () => awardsApi.getMyRank({ category }),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: () => awardsApi.getDashboardStats(),
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

export const useRecentAwards = (daysBack = 7, limit = 5) => {
  return useQuery({
    queryKey: ['awards', 'recent', daysBack, limit],
    queryFn: () => awardsApi.getRecentAwards({ days_back: daysBack, limit }),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useCommunityAchievements = (limit = 10) => {
  return useQuery({
    queryKey: ['community', 'achievements', limit],
    queryFn: () => awardsApi.getCommunityAchievements({ limit }),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCommunityStatistics = () => {
  return useQuery({
    queryKey: ['community', 'statistics'],
    queryFn: () => awardsApi.getCommunityStatistics(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};
