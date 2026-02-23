// Reaction Types

export type Environment =
  | 'Earth (Normal)'
  | 'Vacuum'
  | 'Pure Oxygen'
  | 'Inert Gas'
  | 'Acidic Environment'
  | 'Basic Environment';

export interface ReactantInput {
  chemical_id: number;
  quantity: number;
}

export interface ReactionRequest {
  reactants: ReactantInput[];
  environment?: Environment; // 默认 'Earth (Normal)'
  catalyst_id?: number | null;
}

export interface ProductOutput {
  chemical_id?: number | null;
  molecular_formula: string;
  quantity: number;
  is_soluble: boolean;
}

// Effect Types
interface BaseEffect {
  effect_type: string;
}

export interface GasProductionEffect extends BaseEffect {
  effect_type: 'gas_production';
  gas_type: string; // 'bubbles', 'smoke', 'vapor'
  color: string;
  intensity: number; // 0.0 - 1.0
  duration: number; // 秒
}

export interface LightEmissionEffect extends BaseEffect {
  effect_type: 'light_emission';
  color: string;
  intensity: number; // 0.0 - 1.0
  radius: number; // 米
  duration: number; // 秒
}

export interface TemperatureChangeEffect extends BaseEffect {
  effect_type: 'temperature_change';
  delta_celsius: number;
}

export interface FoamProductionEffect extends BaseEffect {
  effect_type: 'foam_production';
  color: string;
  density: number;
  bubble_size: 'small' | 'medium' | 'large';
  stability: number; // 秒
}

export interface StateChangeEffect extends BaseEffect {
  effect_type: 'state_change';
  product_chemical_id: number;
  final_state: string;
}

export interface VolumeChangeEffect extends BaseEffect {
  effect_type: 'volume_change';
  factor: number; // 1.5 表示50%膨胀
}

export interface SpillEffect extends BaseEffect {
  effect_type: 'spill';
  amount_percentage: number; // 0.0 - 1.0
  spread_radius: number; // 米
}

export interface TextureChangeEffect extends BaseEffect {
  effect_type: 'texture_change';
  product_chemical_id: number;
  texture_type: string; // 'gooey', 'slimy', 'viscous'
  color: string;
  viscosity: number; // 0.0 - 1.0
}

export type Effect =
  | GasProductionEffect
  | LightEmissionEffect
  | TemperatureChangeEffect
  | FoamProductionEffect
  | StateChangeEffect
  | VolumeChangeEffect
  | SpillEffect
  | TextureChangeEffect;

export interface ReactionPrediction {
  products: ProductOutput[];
  effects: Effect[];
  explanation: string;
  is_world_first: boolean;
  state_of_product?: string | null;
}

export interface UserReactionStatsSchema {
  total_reactions: number;
  total_discoveries: number;
}

export const environments: Array<{
  name: Environment;
  icon: string;
  description: string;
  color: string;
}> = [
  { name: 'Earth (Normal)', icon: '🌍', description: '标准大气条件', color: '#3b82f6' },
  { name: 'Vacuum', icon: '🌌', description: '无大气压力', color: '#4f46e5' },
  { name: 'Pure Oxygen', icon: '💨', description: '100%氧气环境', color: '#0ea5e9' },
  { name: 'Inert Gas', icon: '🫧', description: '惰性气体环境', color: '#6b7280' },
  { name: 'Acidic Environment', icon: '🔴', description: '低pH环境', color: '#ef4444' },
  { name: 'Basic Environment', icon: '🟢', description: '高pH环境', color: '#22c55e' },
];
