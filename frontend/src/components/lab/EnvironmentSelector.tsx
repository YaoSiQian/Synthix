import React from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { colors } from '@/theme';
import { environments, type Environment } from '@/types';

interface EnvironmentSelectorProps {
  value: Environment;
  onChange: (env: Environment) => void;
  disabled?: boolean;
}

export const EnvironmentSelector: React.FC<EnvironmentSelectorProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  const { t } = useTranslation();
  
  return (
    <Box>
      <Typography
        variant="subtitle1"
        sx={{
          fontWeight: 600,
          color: colors.onSurface,
          mb: 2,
        }}
      >
        {t('lab.environment')}
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)' },
          gap: 2,
        }}
      >
        {environments.map((env) => {
          const isSelected = value === env.name;
          return (
            <Card
              key={env.name}
              onClick={() => !disabled && onChange(env.name)}
              sx={{
                borderRadius: '20px',
                backgroundColor: isSelected ? `${env.color}15` : colors.surfaceContainer,
                border: isSelected ? `2px solid ${env.color}` : '2px solid transparent',
                cursor: disabled ? 'not-allowed' : 'pointer',
                opacity: disabled ? 0.5 : 1,
                transition: 'all 300ms cubic-bezier(0.2, 0, 0, 1)',
                '&:hover': !disabled ? {
                  backgroundColor: `${env.color}10`,
                  transform: 'translateY(-2px)',
                  boxShadow: '0 3px 6px rgba(0,0,0,0.1)',
                } : undefined,
              }}
            >
              <CardContent sx={{ p: 2, textAlign: 'center', '&:last-child': { pb: 2 } }}>
                <Typography
                  variant="h4"
                  sx={{
                    mb: 1,
                    filter: isSelected ? 'none' : 'grayscale(30%)',
                  }}
                >
                  {env.icon}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: isSelected ? 600 : 500,
                    color: isSelected ? env.color : colors.onSurface,
                    mb: 0.5,
                  }}
                >
                  {env.name}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: colors.onSurfaceVariant,
                    display: 'block',
                  }}
                >
                  {t(`environments.${env.name}`)}
                </Typography>
              </CardContent>
            </Card>
          );
        })}
      </Box>
    </Box>
  );
};
