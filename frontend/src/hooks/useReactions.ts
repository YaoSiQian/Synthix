import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reactionsApi } from '@/api';
import { useLabStore, useUIStore } from '@/store';
import type { ReactionRequest } from '@/types';

export const useReactionStats = () => {
  return useQuery({
    queryKey: ['reactions', 'stats'],
    queryFn: () => reactionsApi.getStats(),
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

export const useReactionCache = () => {
  return useQuery({
    queryKey: ['reactions', 'cache'],
    queryFn: () => reactionsApi.getCache(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useRunReaction = () => {
  const queryClient = useQueryClient();
  const addNotification = useUIStore((s) => s.addNotification);
  const setLastReaction = useLabStore((s) => s.setLastReaction);
  const setIsReacting = useLabStore((s) => s.setIsReacting);
  const clearReactants = useLabStore((s) => s.clearReactants);
  
  return useMutation({
    mutationFn: (data: ReactionRequest) => reactionsApi.predict(data),
    onMutate: () => {
      setIsReacting(true);
    },
    onSuccess: (result) => {
      setLastReaction(result);
      setIsReacting(false);
      
      // Refresh related data
      queryClient.invalidateQueries({ queryKey: ['chemicals'] });
      queryClient.invalidateQueries({ queryKey: ['awards'] });
      queryClient.invalidateQueries({ queryKey: ['reactions', 'stats'] });
      
      // Clear reactants after successful reaction
      clearReactants();
      
      // Show notification
      if (result.is_world_first) {
        addNotification({
          type: 'success',
          title: '🎉 世界首次发现！',
          message: '你是第一个发现这个反应的人！',
        });
      } else {
        addNotification({
          type: 'success',
          title: '反应完成',
          message: `生成了 ${result.products.length} 种产物`,
        });
      }
    },
    onError: (error: { message?: string }) => {
      setIsReacting(false);
      addNotification({
        type: 'error',
        title: '反应失败',
        message: error.message || '无法进行反应',
      });
    },
  });
};
