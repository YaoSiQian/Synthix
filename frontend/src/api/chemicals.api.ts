import apiClient from './client';
import type { ChemicalCreate, ChemicalRead, PaginatedChemicalRead } from '@/types';

export const chemicalsApi = {
  // Get all chemicals
  getAll: async (skip = 0, limit = 100): Promise<PaginatedChemicalRead> => {
    const response = await apiClient.get(`/chemicals/?skip=${skip}&limit=${limit}`);
    return response.data;
  },
  
  // Get single chemical
  getById: async (chemicalId: number): Promise<ChemicalRead> => {
    const response = await apiClient.get(`/chemicals/${chemicalId}`);
    return response.data;
  },
  
  // Create new chemical
  create: async (data: ChemicalCreate): Promise<ChemicalRead> => {
    const response = await apiClient.post('/chemicals/', data);
    return response.data;
  },
  
  // Delete chemical
  delete: async (chemicalId: number): Promise<void> => {
    await apiClient.delete(`/chemicals/${chemicalId}`);
  },
  
  // Search chemicals (client-side filtering)
  search: async (query: string, skip = 0, limit = 100): Promise<ChemicalRead[]> => {
    const response = await apiClient.get(`/chemicals/?skip=${skip}&limit=${limit}`);
    const data: PaginatedChemicalRead = response.data;
    
    if (!query) return data.results;
    
    const q = query.toLowerCase();
    return data.results.filter(
      (c) =>
        c.molecular_formula.toLowerCase().includes(q) ||
        c.common_name?.toLowerCase().includes(q)
    );
  },
};
