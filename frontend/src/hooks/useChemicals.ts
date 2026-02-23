import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { chemicalsApi } from '@/api';
import { useUIStore } from '@/store';
import type { ChemicalCreate } from '@/types';

export const useChemicals = (skip = 0, limit = 100) => {
  return useQuery({
    queryKey: ['chemicals', skip, limit],
    queryFn: () => chemicalsApi.getAll(skip, limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useChemical = (chemicalId: number) => {
  return useQuery({
    queryKey: ['chemicals', chemicalId],
    queryFn: () => chemicalsApi.getById(chemicalId),
    enabled: !!chemicalId,
  });
};

export const useChemicalSearch = (query: string, skip = 0, limit = 100) => {
  return useQuery({
    queryKey: ['chemicals', 'search', query, skip, limit],
    queryFn: () => chemicalsApi.search(query, skip, limit),
    enabled: query.length > 0,
  });
};

export const useCreateChemical = () => {
  const queryClient = useQueryClient();
  const addNotification = useUIStore((s) => s.addNotification);
  
  return useMutation({
    mutationFn: (data: ChemicalCreate) => chemicalsApi.create(data),
    onSuccess: (newChemical) => {
      queryClient.invalidateQueries({ queryKey: ['chemicals'] });
      addNotification({
        type: 'success',
        title: '添加成功',
        message: `化学品 ${newChemical.molecular_formula} 已添加到库中`,
      });
    },
    onError: (error: { message?: string }) => {
      addNotification({
        type: 'error',
        title: '添加失败',
        message: error.message || '无法添加化学品',
      });
    },
  });
};

export const useDeleteChemical = () => {
  const queryClient = useQueryClient();
  const addNotification = useUIStore((s) => s.addNotification);
  
  return useMutation({
    mutationFn: (chemicalId: number) => chemicalsApi.delete(chemicalId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chemicals'] });
      addNotification({
        type: 'success',
        title: '删除成功',
        message: '化学品已从库中移除',
      });
    },
    onError: (error: { message?: string }) => {
      addNotification({
        type: 'error',
        title: '删除失败',
        message: error.message || '无法删除化学品',
      });
    },
  });
};
