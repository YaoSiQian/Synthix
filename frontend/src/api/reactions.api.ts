import apiClient from './client';
import type { ReactionRequest, ReactionPrediction, UserReactionStatsSchema } from '@/types';

export const reactionsApi = {
  // Predict reaction
  predict: async (data: ReactionRequest): Promise<ReactionPrediction> => {
    const response = await apiClient.post('/reactions/react', data);
    return response.data;
  },
  
  // Get user reaction cache
  getCache: async (): Promise<ReactionPrediction[]> => {
    const response = await apiClient.get('/reactions/cache');
    return response.data;
  },
  
  // Get user reaction stats
  getStats: async (): Promise<UserReactionStatsSchema> => {
    const response = await apiClient.get('/reactions/stats');
    return response.data;
  },
};
