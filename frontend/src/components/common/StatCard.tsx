import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { colors } from '@/theme';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  color?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  color = colors.primary,
  trend,
}) => {
  return (
    <Card
      sx={{
        borderRadius: '24px',
        backgroundColor: colors.surfaceContainer,
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        transition: 'all 300ms cubic-bezier(0.2, 0, 0, 1)',
        '&:hover': {
          boxShadow: '0 3px 6px rgba(0,0,0,0.1)',
          transform: 'translateY(-2px)',
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <Box>
            <Typography
              variant="body2"
              sx={{
                color: colors.onSurfaceVariant,
                fontWeight: 500,
                mb: 1,
              }}
            >
              {title}
            </Typography>
            <Typography
              variant="h4"
              sx={{
                color: colors.onSurface,
                fontWeight: 700,
                mb: 0.5,
              }}
            >
              {value}
            </Typography>
            {subtitle && (
              <Typography
                variant="caption"
                sx={{
                  color: colors.onSurfaceVariant,
                }}
              >
                {subtitle}
              </Typography>
            )}
            {trend && (
              <Typography
                variant="caption"
                sx={{
                  color: trend.isPositive ? colors.success : colors.error,
                  fontWeight: 600,
                  ml: 1,
                }}
              >
                {trend.isPositive ? '+' : ''}{trend.value}%
              </Typography>
            )}
          </Box>
          {icon && (
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: '16px',
                backgroundColor: `${color}15`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: color,
              }}
            >
              {icon}
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};
