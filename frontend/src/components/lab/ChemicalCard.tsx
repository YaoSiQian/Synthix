import React from 'react';
import { Card, CardContent, Typography, Box, Chip, IconButton } from '@mui/material';
import { Add, Delete, DragIndicator } from '@mui/icons-material';
import { colors } from '@/theme';
import type { ChemicalRead } from '@/types';

interface ChemicalCardProps {
  chemical: ChemicalRead;
  draggable?: boolean;
  onDragStart?: (chemical: ChemicalRead) => void;
  onAdd?: (chemical: ChemicalRead) => void;
  onRemove?: (id: number) => void;
  showActions?: boolean;
  compact?: boolean;
}

const stateIcons: Record<string, string> = {
  solid: '⬛',
  liquid: '💧',
  gas: '💨',
  plasma: '⚡',
};

const stateLabels: Record<string, string> = {
  solid: '固体',
  liquid: '液体',
  gas: '气体',
  plasma: '等离子体',
};

export const ChemicalCard: React.FC<ChemicalCardProps> = ({
  chemical,
  draggable = false,
  onDragStart,
  onAdd,
  onRemove,
  showActions = true,
  compact = false,
}) => {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('chemical', JSON.stringify(chemical));
    onDragStart?.(chemical);
  };
  
  if (compact) {
    return (
      <Card
        draggable={draggable}
        onDragStart={handleDragStart}
        sx={{
          borderRadius: '16px',
          backgroundColor: colors.surfaceContainer,
          cursor: draggable ? 'grab' : 'default',
          transition: 'all 200ms cubic-bezier(0.2, 0, 0, 1)',
          '&:hover': {
            boxShadow: '0 3px 6px rgba(0,0,0,0.1)',
            transform: 'translateY(-1px)',
          },
          '&:active': draggable ? { cursor: 'grabbing' } : {},
        }}
      >
        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            {draggable && (
              <DragIndicator sx={{ fontSize: 18, color: colors.onSurfaceVariant }} />
            )}
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: '8px',
                backgroundColor: chemical.color || colors.surfaceVariant,
                flexShrink: 0,
              }}
            />
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
                {chemical.molecular_formula}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: colors.onSurfaceVariant,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {chemical.common_name || '未知化合物'}
              </Typography>
            </Box>
            {showActions && onAdd && (
              <IconButton
                size="small"
                onClick={() => onAdd(chemical)}
                sx={{
                  color: colors.primary,
                  '&:hover': { backgroundColor: `${colors.primary}15` },
                }}
              >
                <Add fontSize="small" />
              </IconButton>
            )}
            {showActions && onRemove && (
              <IconButton
                size="small"
                onClick={() => onRemove(chemical.id)}
                sx={{
                  color: colors.error,
                  '&:hover': { backgroundColor: `${colors.error}15` },
                }}
              >
                <Delete fontSize="small" />
              </IconButton>
            )}
          </Box>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card
      draggable={draggable}
      onDragStart={handleDragStart}
      sx={{
        borderRadius: '24px',
        backgroundColor: colors.surfaceContainer,
        cursor: draggable ? 'grab' : 'default',
        transition: 'all 300ms cubic-bezier(0.2, 0, 0, 1)',
        '&:hover': {
          boxShadow: '0 3px 6px rgba(0,0,0,0.1)',
          transform: 'translateY(-2px)',
        },
        '&:active': draggable ? { cursor: 'grabbing' } : {},
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
          {/* Color indicator */}
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: '16px',
              backgroundColor: chemical.color || colors.surfaceVariant,
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
            }}
          >
            {stateIcons[chemical.state_of_matter] || '⚗️'}
          </Box>
          
          {/* Content */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: colors.onSurface,
                }}
              >
                {chemical.molecular_formula}
              </Typography>
              <Chip
                label={stateLabels[chemical.state_of_matter] || chemical.state_of_matter}
                size="small"
                sx={{
                  borderRadius: '9999px',
                  backgroundColor: colors.secondaryContainer,
                  color: colors.onSecondaryContainer,
                  fontSize: '0.75rem',
                  height: 24,
                }}
              />
            </Box>
            <Typography
              variant="body2"
              sx={{
                color: colors.onSurfaceVariant,
                mb: 1,
              }}
            >
              {chemical.common_name || '未知化合物'}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: colors.onSurfaceVariant,
              }}
            >
              密度: {chemical.density.toFixed(3)} g/cm³
            </Typography>
          </Box>
          
          {/* Actions */}
          {showActions && (
            <Box sx={{ display: 'flex', gap: 1 }}>
              {onAdd && (
                <IconButton
                  onClick={() => onAdd(chemical)}
                  sx={{
                    color: colors.primary,
                    backgroundColor: `${colors.primary}10`,
                    '&:hover': { backgroundColor: `${colors.primary}20` },
                  }}
                >
                  <Add />
                </IconButton>
              )}
              {onRemove && (
                <IconButton
                  onClick={() => onRemove(chemical.id)}
                  sx={{
                    color: colors.error,
                    backgroundColor: `${colors.error}10`,
                    '&:hover': { backgroundColor: `${colors.error}20` },
                  }}
                >
                  <Delete />
                </IconButton>
              )}
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};
