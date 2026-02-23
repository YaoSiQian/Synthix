import { createTheme } from '@mui/material/styles';
import { colors, radius, typography, shadows } from './palette';

// Material You Theme Configuration
export const createMaterialYouTheme = (mode: 'light' | 'dark' = 'light') => {
  return createTheme({
    palette: {
      mode,
      background: {
        default: colors.background,
        paper: colors.surfaceContainer,
      },
      primary: {
        main: colors.primary,
        contrastText: colors.onPrimary,
        light: colors.primaryContainer,
        dark: colors.onPrimaryContainer,
      },
      secondary: {
        main: colors.secondary,
        contrastText: colors.onSecondary,
        light: colors.secondaryContainer,
        dark: colors.onSecondaryContainer,
      },
      error: {
        main: colors.error,
        contrastText: colors.onError,
        light: colors.errorContainer,
        dark: colors.onErrorContainer,
      },
      warning: {
        main: colors.warning,
        contrastText: colors.onWarning,
        light: colors.warningContainer,
        dark: colors.onWarningContainer,
      },
      success: {
        main: colors.success,
        contrastText: colors.onSuccess,
        light: colors.successContainer,
        dark: colors.onSuccessContainer,
      },
      text: {
        primary: colors.onSurface,
        secondary: colors.onSurfaceVariant,
      },
      divider: colors.outline,
    },
    typography: {
      fontFamily: '"Roboto", "Inter", "Helvetica", "Arial", sans-serif',
      h1: {
        fontSize: typography.displayLarge.fontSize,
        fontWeight: typography.displayLarge.fontWeight,
        lineHeight: typography.displayLarge.lineHeight,
        letterSpacing: typography.displayLarge.letterSpacing,
      },
      h2: {
        fontSize: typography.headlineLarge.fontSize,
        fontWeight: typography.headlineLarge.fontWeight,
        lineHeight: typography.headlineLarge.lineHeight,
        letterSpacing: typography.headlineLarge.letterSpacing,
      },
      h3: {
        fontSize: typography.headlineMedium.fontSize,
        fontWeight: typography.headlineMedium.fontWeight,
        lineHeight: typography.headlineMedium.lineHeight,
        letterSpacing: typography.headlineMedium.letterSpacing,
      },
      h4: {
        fontSize: typography.titleLarge.fontSize,
        fontWeight: typography.titleLarge.fontWeight,
        lineHeight: typography.titleLarge.lineHeight,
        letterSpacing: typography.titleLarge.letterSpacing,
      },
      h5: {
        fontSize: typography.titleMedium.fontSize,
        fontWeight: typography.titleMedium.fontWeight,
        lineHeight: typography.titleMedium.lineHeight,
        letterSpacing: typography.titleMedium.letterSpacing,
      },
      body1: {
        fontSize: typography.bodyLarge.fontSize,
        fontWeight: typography.bodyLarge.fontWeight,
        lineHeight: typography.bodyLarge.lineHeight,
        letterSpacing: typography.bodyLarge.letterSpacing,
      },
      body2: {
        fontSize: typography.bodyMedium.fontSize,
        fontWeight: typography.bodyMedium.fontWeight,
        lineHeight: typography.bodyMedium.lineHeight,
        letterSpacing: typography.bodyMedium.letterSpacing,
      },
      button: {
        fontSize: typography.labelMedium.fontSize,
        fontWeight: typography.labelMedium.fontWeight,
        lineHeight: typography.labelMedium.lineHeight,
        letterSpacing: typography.labelMedium.letterSpacing,
        textTransform: 'none',
      },
      caption: {
        fontSize: typography.labelSmall.fontSize,
        fontWeight: typography.labelSmall.fontWeight,
        lineHeight: typography.labelSmall.lineHeight,
        letterSpacing: typography.labelSmall.letterSpacing,
      },
    },
    shape: {
      borderRadius: parseInt(radius.md),
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: radius.full,
            textTransform: 'none',
            fontWeight: 500,
            padding: '10px 24px',
            boxShadow: 'none',
            '&:hover': {
              boxShadow: shadows.elevation2,
            },
            '&:active': {
              transform: 'scale(0.95)',
            },
            transition: 'all 300ms cubic-bezier(0.2, 0, 0, 1)',
          },
          contained: {
            '&:hover': {
              boxShadow: shadows.elevation3,
            },
          },
          outlined: {
            borderWidth: '1px',
            '&:hover': {
              borderWidth: '1px',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: radius.lg,
            boxShadow: shadows.elevation1,
            backgroundColor: colors.surfaceContainer,
            transition: 'all 300ms cubic-bezier(0.2, 0, 0, 1)',
            '&:hover': {
              boxShadow: shadows.elevation2,
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: radius.lg,
            backgroundColor: colors.surfaceContainer,
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: `${radius.sm} ${radius.sm} 0 0`,
              backgroundColor: colors.surfaceContainerLow,
              '& fieldset': {
                borderWidth: '0 0 2px 0',
                borderColor: colors.outline,
              },
              '&:hover fieldset': {
                borderColor: colors.onSurfaceVariant,
              },
              '&.Mui-focused fieldset': {
                borderColor: colors.primary,
                borderWidth: '0 0 2px 0',
              },
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: radius.full,
            height: '32px',
          },
        },
      },
      MuiAvatar: {
        styleOverrides: {
          root: {
            borderRadius: radius.full,
          },
        },
      },
      MuiFab: {
        styleOverrides: {
          root: {
            borderRadius: radius.xl,
            boxShadow: shadows.elevation3,
            '&:hover': {
              boxShadow: shadows.elevation4,
            },
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: radius.xl,
            boxShadow: shadows.elevation5,
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: colors.surface,
            color: colors.onSurface,
            boxShadow: shadows.elevation1,
          },
        },
      },
    },
  });
};

export const theme = createMaterialYouTheme('light');
