import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const addNotification = useUIStore((s) => s.addNotification);
  
  return useMutation({
    mutationFn: (data: ChemicalCreate) => chemicalsApi.create(data),
    onSuccess: (newChemical) => {
      queryClient.invalidateQueries({ queryKey: ['chemicals'] });
      addNotification({
        type: 'success',
        title: t('chemicalsApi.addSuccess'),
        message: `${t('chemicalsApi.chemical')} ${newChemical.molecular_formula} ${t('chemicalsApi.addedToLibrary')}`,
      });
    },
    onError: (error: { message?: string }) => {
      addNotification({
        type: 'error',
        title: t('chemicalsApi.addFailed'),
        message: error.message || t('chemicalsApi.cannotAddChemical'),
      });
    },
  });
};

export const useDeleteChemical = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const addNotification = useUIStore((s) => s.addNotification);
  
  return useMutation({
    mutationFn: (chemicalId: number) => chemicalsApi.delete(chemicalId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chemicals'] });
      addNotification({
        type: 'success',
        title: t('chemicalsApi.deleteSuccess'),
        message: t('chemicalsApi.removedFromLibrary'),
      });
    },
    onError: (error: { message?: string }) => {
      addNotification({
        type: 'error',
        title: t('chemicalsApi.deleteFailed'),
        message: error.message || t('chemicalsApi.cannotDeleteChemical'),
      });
    },
  });
};
