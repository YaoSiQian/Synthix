import apiClient from './client';
import type {
  AwardCategory,
  UserAwardSchema,
  AvailableAwardSchema,
  LeaderboardEntrySchema,
  UserRankSchema,
  DashboardStatsSchema,
  RecentAwardsSchema,
  RecentAchievementsSchema,
  CommunityStatisticsSchema,
} from '@/types';

interface GetAwardsParams {
  category?: AwardCategory;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  skip?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    page_size: number;
    total: number;
    total_pages: number;
  };
}

interface GetLeaderboardParams {
  page?: number;
  page_size?: number;
}

export const awardsApi = {
  // Get my awards
  getMyAwards: async (params?: GetAwardsParams): Promise<UserAwardSchema[]> => {
    const queryParams = new URLSearchParams();
    if (params?.category) queryParams.append('category', params.category);
    if (params?.sort_by) queryParams.append('sort_by', params.sort_by);
    if (params?.sort_order) queryParams.append('sort_order', params.sort_order);
    if (params?.skip !== undefined) queryParams.append('skip', params.skip.toString());
    if (params?.limit !== undefined) queryParams.append('limit', params.limit.toString());
    
    const response = await apiClient.get(`/awards/me?${queryParams.toString()}`);
    return response.data;
  },
  
  // Get available awards with progress
  getAvailableAwards: async (category?: AwardCategory): Promise<AvailableAwardSchema[]> => {
    const queryParams = new URLSearchParams();
    if (category) queryParams.append('category', category);
    
    const response = await apiClient.get(`/awards/available?${queryParams.toString()}`);
    return response.data;
  },
  
  // Get leaderboard by category (paginated)
  getLeaderboard: async (
    category: AwardCategory,
    params?: GetLeaderboardParams
  ): Promise<PaginatedResponse<LeaderboardEntrySchema>> => {
    const queryParams = new URLSearchParams();
    if (params?.page !== undefined) queryParams.append('page', params.page.toString());
    if (params?.page_size !== undefined) queryParams.append('page_size', params.page_size.toString());
    
    const response = await apiClient.get(`/awards/leaderboard/${category}?${queryParams.toString()}`);
    return response.data;
  },
  
  // Get overall leaderboard (paginated)
  getOverallLeaderboard: async (params?: GetLeaderboardParams): Promise<PaginatedResponse<LeaderboardEntrySchema>> => {
    const queryParams = new URLSearchParams();
    if (params?.page !== undefined) queryParams.append('page', params.page.toString());
    if (params?.page_size !== undefined) queryParams.append('page_size', params.page_size.toString());
    
    const response = await apiClient.get(`/awards/leaderboard/overall?${queryParams.toString()}`);
    return response.data;
  },
  
  // Get my rank
  getMyRank: async (params?: { category?: AwardCategory }): Promise<UserRankSchema> => {
    const queryParams = new URLSearchParams();
    if (params?.category) queryParams.append('category', params.category);
    
    const response = await apiClient.get(`/awards/leaderboard/my-rank?${queryParams.toString()}`);
    return response.data;
  },
  
  // Get user awards
  getUserAwards: async (userId: number, params?: GetAwardsParams): Promise<UserAwardSchema[]> => {
    const queryParams = new URLSearchParams();
    if (params?.category) queryParams.append('category', params.category);
    if (params?.sort_by) queryParams.append('sort_by', params.sort_by);
    if (params?.sort_order) queryParams.append('sort_order', params.sort_order);
    if (params?.skip !== undefined) queryParams.append('skip', params.skip.toString());
    if (params?.limit !== undefined) queryParams.append('limit', params.limit.toString());
    
    const response = await apiClient.get(`/awards/user/${userId}?${queryParams.toString()}`);
    return response.data;
  },
  
  // Get dashboard stats
  getDashboardStats: async (): Promise<DashboardStatsSchema> => {
    const response = await apiClient.get('/awards/dashboard/stats');
    return response.data;
  },
  
  // Get recent awards
  getRecentAwards: async (params?: { days_back?: number; limit?: number }): Promise<RecentAwardsSchema> => {
    const queryParams = new URLSearchParams();
    if (params?.days_back !== undefined) queryParams.append('days_back', params.days_back.toString());
    if (params?.limit !== undefined) queryParams.append('limit', params.limit.toString());
    
    const response = await apiClient.get(`/awards/dashboard/recent?${queryParams.toString()}`);
    return response.data;
  },
  
  // Get community recent achievements
  getCommunityAchievements: async (params?: { limit?: number; category?: AwardCategory }): Promise<RecentAchievementsSchema> => {
    const queryParams = new URLSearchParams();
    if (params?.limit !== undefined) queryParams.append('limit', params.limit.toString());
    if (params?.category) queryParams.append('category', params.category);
    
    const response = await apiClient.get(`/awards/community/recent-achievements?${queryParams.toString()}`);
    return response.data;
  },
  
  // Get community statistics
  getCommunityStatistics: async (): Promise<CommunityStatisticsSchema> => {
    const response = await apiClient.get('/awards/community/statistics');
    return response.data;
  },
};
