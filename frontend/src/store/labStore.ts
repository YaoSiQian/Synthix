import { create } from 'zustand';
import type { ChemicalRead, ProductOutput, ReactionPrediction, Environment } from '@/types';

interface LabState {
  // Reactants
  reactants: ChemicalRead[];
  addReactant: (chemical: ChemicalRead) => void;
  removeReactant: (id: number) => void;
  clearReactants: () => void;
  
  // Environment
  selectedEnvironment: Environment;
  setEnvironment: (env: Environment) => void;
  
  // Catalyst
  selectedCatalyst: number | null;
  setCatalyst: (id: number | null) => void;
  
  // Bench products
  benchProducts: ProductOutput[];
  addBenchProduct: (product: ProductOutput) => void;
  removeBenchProduct: (chemicalId: number | null) => void;
  clearBench: () => void;
  
  // Last reaction result
  lastReaction: ReactionPrediction | null;
  setLastReaction: (result: ReactionPrediction | null) => void;
  
  // Reaction state
  isReacting: boolean;
  setIsReacting: (value: boolean) => void;
}

export const useLabStore = create<LabState>((set) => ({
  // Initial state
  reactants: [],
  selectedEnvironment: 'Earth (Normal)',
  selectedCatalyst: null,
  benchProducts: [],
  lastReaction: null,
  isReacting: false,
  
  // Reactants actions
  addReactant: (chemical) => {
    set((state) => ({
      reactants: state.reactants.some((r) => r.id === chemical.id)
        ? state.reactants
        : [...state.reactants, chemical],
    }));
  },
  
  removeReactant: (id) => {
    set((state) => ({
      reactants: state.reactants.filter((r) => r.id !== id),
    }));
  },
  
  clearReactants: () => {
    set({ reactants: [] });
  },
  
  // Environment actions
  setEnvironment: (env) => {
    set({ selectedEnvironment: env });
  },
  
  // Catalyst actions
  setCatalyst: (id) => {
    set({ selectedCatalyst: id });
  },
  
  // Bench products actions
  addBenchProduct: (product) => {
    set((state) => {
      const existing = state.benchProducts.find(
        (p) => p.chemical_id === product.chemical_id
      );
      if (existing) {
        return {
          benchProducts: state.benchProducts.map((p) =>
            p.chemical_id === product.chemical_id
              ? { ...p, quantity: p.quantity + product.quantity }
              : p
          ),
        };
      }
      return { benchProducts: [...state.benchProducts, product] };
    });
  },
  
  removeBenchProduct: (chemicalId) => {
    set((state) => ({
      benchProducts: state.benchProducts.filter((p) => p.chemical_id !== chemicalId),
    }));
  },
  
  clearBench: () => {
    set({ benchProducts: [] });
  },
  
  // Last reaction actions
  setLastReaction: (result) => {
    set({ lastReaction: result });
  },
  
  // Reaction state actions
  setIsReacting: (value) => {
    set({ isReacting: value });
  },
}));
