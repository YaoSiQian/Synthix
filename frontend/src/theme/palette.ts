// Material You Palette - Purple/Violet Seed Color (#6750A4)

export const colors = {
  // Core Palette
  background: '#FFFBFE', // Slightly warm off-white
  onBackground: '#1C1B1F', // Near-black with slight warmth
  
  primary: '#6750A4', // Rich purple (seed color)
  onPrimary: '#FFFFFF', // Pure white for text on primary
  primaryContainer: '#EADDFF', // Light purple tint
  onPrimaryContainer: '#21005D', // Dark purple text
  
  secondary: '#625B71',
  onSecondary: '#FFFFFF',
  secondaryContainer: '#E8DEF8', // Light lavender tint
  onSecondaryContainer: '#1D192B', // Dark text for secondary surfaces
  
  tertiary: '#7D5260', // Complementary mauve/dusty rose
  onTertiary: '#FFFFFF',
  tertiaryContainer: '#FFD8E4',
  onTertiaryContainer: '#31111D',
  
  surface: '#FFFBFE',
  onSurface: '#1C1B1F',
  surfaceVariant: '#E7E0EC',
  onSurfaceVariant: '#49454F',
  
  surfaceContainer: '#F3EDF7', // Subtle tinted surface
  surfaceContainerLow: '#F7F2FA', // For inputs and recessed surfaces
  surfaceContainerHigh: '#ECE6F0',
  
  outline: '#79747E', // Medium gray for borders
  outlineVariant: '#CAC4D0',
  
  error: '#B3261E',
  onError: '#FFFFFF',
  errorContainer: '#F9DEDC',
  onErrorContainer: '#410E0B',
  
  success: '#2E7D32',
  onSuccess: '#FFFFFF',
  successContainer: '#E8F5E9',
  onSuccessContainer: '#1B5E20',
  
  warning: '#ED6C02',
  onWarning: '#FFFFFF',
  warningContainer: '#FFF3E0',
  onWarningContainer: '#E65100',
  
  // Tier colors for awards
  bronze: '#cd7f32',
  silver: '#c0c0c0',
  gold: '#ffd700',
};

// Environment colors
export const environmentColors: Record<string, string> = {
  'Earth (Normal)': '#3b82f6',
  'Vacuum': '#4f46e5',
  'Pure Oxygen': '#0ea5e9',
  'Inert Gas': '#6b7280',
  'Acidic Environment': '#ef4444',
  'Basic Environment': '#22c55e',
};

// Opacity patterns for state layers
export const stateLayers = {
  hoverOnSolid: 0.9, // 90% of base color
  activeOnSolid: 0.8, // 80% of base color
  hoverOnTransparent: 0.1, // 10% of primary
  focusOnTransparent: 0.05, // 5% of primary
  subtleOverlay: 0.2, // 20% opacity with backdrop-blur
};

// Shadow elevation levels (using CSS shadows)
export const shadows = {
  elevation0: 'none',
  elevation1: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.12)',
  elevation2: '0 3px 6px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.08)',
  elevation3: '0 10px 20px rgba(0,0,0,0.1), 0 3px 6px rgba(0,0,0,0.08)',
  elevation4: '0 15px 25px rgba(0,0,0,0.12), 0 5px 10px rgba(0,0,0,0.08)',
  elevation5: '0 20px 40px rgba(0,0,0,0.15), 0 8px 16px rgba(0,0,0,0.1)',
};

// Border radius values
export const radius = {
  xs: '8px', // Minimal UI elements, chips
  sm: '12px', // Small cards, compact elements
  md: '16px', // Default card radius
  lg: '24px', // Prominent cards, containers
  xl: '28px', // Dialogs, sheets, large surfaces
  xxl: '32px', // Hero sections, major containers
  full: '9999px', // Pills
};

// Typography scale
export const typography = {
  displayLarge: {
    fontSize: '3.5rem', // 56px
    fontWeight: 500,
    lineHeight: 1.2,
    letterSpacing: '-0.01em',
  },
  headlineLarge: {
    fontSize: '3rem', // 48px
    fontWeight: 500,
    lineHeight: 1.2,
    letterSpacing: '-0.01em',
  },
  headlineMedium: {
    fontSize: '2rem', // 32px
    fontWeight: 500,
    lineHeight: 1.3,
    letterSpacing: '0',
  },
  titleLarge: {
    fontSize: '1.5rem', // 24px
    fontWeight: 500,
    lineHeight: 1.4,
    letterSpacing: '0',
  },
  titleMedium: {
    fontSize: '1.25rem', // 20px
    fontWeight: 500,
    lineHeight: 1.4,
    letterSpacing: '0.01em',
  },
  bodyLarge: {
    fontSize: '1.25rem', // 20px
    fontWeight: 400,
    lineHeight: 1.5,
    letterSpacing: '0',
  },
  bodyMedium: {
    fontSize: '1rem', // 16px
    fontWeight: 400,
    lineHeight: 1.5,
    letterSpacing: '0',
  },
  labelMedium: {
    fontSize: '0.875rem', // 14px
    fontWeight: 500,
    lineHeight: 1.4,
    letterSpacing: '0.01em',
  },
  labelSmall: {
    fontSize: '0.75rem', // 12px
    fontWeight: 500,
    lineHeight: 1.4,
    letterSpacing: '0.01em',
  },
};

// Animation easing
export const easing = {
  standard: 'cubic-bezier(0.2, 0, 0, 1)', // Material You's signature easing
  emphasized: 'cubic-bezier(0.2, 0, 0, 1)',
};

// Animation durations
export const duration = {
  fast: '200ms',
  standard: '300ms',
  slow: '400ms',
};

// Tier colors for awards
export const tierColors: Record<number, string> = {
  1: '#cd7f32', // Bronze
  2: '#c0c0c0', // Silver
  3: '#ffd700', // Gold
};

export const tierLabels: Record<number, string> = {
  1: '青铜',
  2: '白银',
  3: '黄金',
};

// Award category labels
export type AwardCategory = 'discovery' | 'database_contribution' | 'community' | 'special' | 'achievement';

export const awardCategoryLabels: Record<AwardCategory, string> = {
  discovery: '发现',
  database_contribution: '数据库贡献',
  community: '社区',
  special: '特殊',
  achievement: '成就',
};
