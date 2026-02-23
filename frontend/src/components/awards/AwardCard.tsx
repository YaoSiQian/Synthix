import React from 'react';
import { Card, CardContent, Box, Typography, Chip, LinearProgress } from '@mui/material';
import { Lock } from '@mui/icons-material';
import { colors, tierColors, tierLabels, awardCategoryLabels } from '@/theme';
import type { UserAwardSchema, AvailableAwardSchema, AwardCategory } from '@/types';

interface AwardCardProps {
  award: UserAwardSchema | AvailableAwardSchema;
  variant?: 'default' | 'compact' | 'progress';
}

const categoryColors: Record<AwardCategory, string> = {
  discovery: '#8b5cf6',
  database_contribution: '#3b82f6',
  community: '#22c55e',
  special: '#f59e0b',
  achievement: '#ef4444',
};

const categoryIcons: Record<AwardCategory, string> = {
  discovery: '🔬',
  database_contribution: '💾',
  community: '👥',
  special: '⭐',
  achievement: '🏆',
};

export const AwardCard: React.FC<AwardCardProps> = ({ award, variant = 'default' }) => {
  const isUserAward = 'granted_at' in award;
  const tier = isUserAward ? (award as UserAwardSchema).tier : 0;
  const category = isUserAward
    ? (award as UserAwardSchema).template.category
    : (award as AvailableAwardSchema).category;
  const name = isUserAward
    ? (award as UserAwardSchema).template.name
    : (award as AvailableAwardSchema).name;
  const description = isUserAward
    ? (award as UserAwardSchema).template.description
    : (award as AvailableAwardSchema).description;
  
  if (variant === 'compact') {
    return (
      <Card
        sx={{
          borderRadius: '16px',
          backgroundColor: colors.surfaceContainer,
          transition: 'all 300ms cubic-bezier(0.2, 0, 0, 1)',
          '&:hover': {
            boxShadow: '0 3px 6px rgba(0,0,0,0.1)',
            transform: 'translateY(-2px)',
          },
        }}
      >
        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '12px',
                backgroundColor: isUserAward ? `${tierColors[tier]}20` : `${colors.onSurfaceVariant}15`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.25rem',
              }}
            >
              {isUserAward ? categoryIcons[category] : <Lock sx={{ fontSize: 20, color: colors.onSurfaceVariant }} />}
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  color: colors.onSurface,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {name}
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: colors.onSurfaceVariant }}
              >
                {awardCategoryLabels[category]}
              </Typography>
            </Box>
            {isUserAward && (
              <Chip
                label={tierLabels[tier]}
                size="small"
                sx={{
                  borderRadius: '9999px',
                  backgroundColor: tierColors[tier],
                  color: '#fff',
                  fontSize: '0.625rem',
                  height: 20,
                }}
              />
            )}
          </Box>
        </CardContent>
      </Card>
    );
  }
  
  if (variant === 'progress' && !isUserAward) {
    const availableAward = award as AvailableAwardSchema;
    const progress = availableAward.progress || {};
    const percentage = progress.percentage || 0;
    const current = progress.current || 0;
    const target = progress.target || 1;
    
    return (
      <Card
        sx={{
          borderRadius: '24px',
          backgroundColor: colors.surfaceContainer,
          transition: 'all 300ms cubic-bezier(0.2, 0, 0, 1)',
          '&:hover': {
            boxShadow: '0 3px 6px rgba(0,0,0,0.1)',
            transform: 'translateY(-2px)',
          },
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: '16px',
                backgroundColor: `${categoryColors[category]}15`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
              }}
            >
              {categoryIcons[category]}
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: colors.onSurface, mb: 0.5 }}>
                {name}
              </Typography>
              <Chip
                label={awardCategoryLabels[category]}
                size="small"
                sx={{
                  borderRadius: '9999px',
                  backgroundColor: `${categoryColors[category]}15`,
                  color: categoryColors[category],
                  fontSize: '0.75rem',
                }}
              />
            </Box>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '12px',
                backgroundColor: `${colors.onSurfaceVariant}15`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Lock sx={{ fontSize: 20, color: colors.onSurfaceVariant }} />
            </Box>
          </Box>
          
          <Typography variant="body2" sx={{ color: colors.onSurfaceVariant, mb: 2 }}>
            {description}
          </Typography>
          
          <Box sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="caption" sx={{ color: colors.onSurfaceVariant, fontWeight: 500 }}>
                进度
              </Typography>
              <Typography variant="caption" sx={{ color: colors.primary, fontWeight: 600 }}>
                {current} / {target}
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={percentage}
              sx={{
                height: 8,
                borderRadius: '9999px',
                backgroundColor: colors.surfaceContainerLow,
                '& .MuiLinearProgress-bar': {
                  borderRadius: '9999px',
                  backgroundColor: categoryColors[category],
                },
              }}
            />
            <Typography variant="caption" sx={{ color: colors.onSurfaceVariant, mt: 0.5, display: 'block', textAlign: 'right' }}>
              {percentage.toFixed(0)}%
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card
      sx={{
        borderRadius: '24px',
        backgroundColor: colors.surfaceContainer,
        transition: 'all 300ms cubic-bezier(0.2, 0, 0, 1)',
        '&:hover': {
          boxShadow: '0 3px 6px rgba(0,0,0,0.1)',
          transform: 'translateY(-2px)',
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: '20px',
              background: `linear-gradient(135deg, ${tierColors[tier]} 0%, ${tierColors[tier]}80 100%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              boxShadow: `0 4px 12px ${tierColors[tier]}40`,
            }}
          >
            {categoryIcons[category]}
          </Box>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: colors.onSurface }}>
                {name}
              </Typography>
              <Chip
                label={tierLabels[tier]}
                size="small"
                sx={{
                  borderRadius: '9999px',
                  backgroundColor: tierColors[tier],
                  color: '#fff',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                }}
              />
            </Box>
            <Chip
              label={awardCategoryLabels[category]}
              size="small"
              sx={{
                borderRadius: '9999px',
                backgroundColor: `${categoryColors[category]}15`,
                color: categoryColors[category],
                fontSize: '0.75rem',
                mb: 1,
              }}
            />
            <Typography variant="body2" sx={{ color: colors.onSurfaceVariant, mb: 1 }}>
              {description}
            </Typography>
            {'granted_at' in award && (
              <Typography variant="caption" sx={{ color: colors.onSurfaceVariant }}>
                获得于 {new Date(award.granted_at).toLocaleDateString('zh-CN')}
              </Typography>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};
