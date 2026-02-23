// Chemical Types

export type StateOfMatter = 'solid' | 'liquid' | 'gas' | 'plasma';

export interface ChemicalCreate {
  molecular_formula: string;
  context?: string; // 可选，帮助识别化合物
}

export interface ChemicalRead {
  id: number;
  molecular_formula: string;
  common_name: string;
  state_of_matter: StateOfMatter;
  color: string;
  density: number;
  properties: Record<string, unknown>;
}

export interface PaginatedChemicalRead {
  count: number;
  results: ChemicalRead[];
}
