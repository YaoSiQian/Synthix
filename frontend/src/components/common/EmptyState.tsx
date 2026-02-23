import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { SentimentDissatisfied, Add } from '@mui/icons-material';
import { colors } from '@/theme';

interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  compact?: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = '暂无数据',
  message = '这里还没有任何内容',
  icon = <SentimentDissatisfied sx={{ fontSize: 64, color: colors.onSurfaceVariant }} />,
  actionLabel,
  onAction,
  compact = false,
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: compact ? 4 : 8,
        px: compact ? 2 : 4,
        textAlign: 'center',
      }}
    >
      <Box sx={{ mb: compact ? 2 : 3 }}>{icon}</Box>
      <Typography
        variant="h6"
        sx={{
          color: colors.onSurface,
          fontWeight: 600,
          mb: compact ? 0.5 : 1,
          fontSize: compact ? '1.125rem' : '1.25rem',
        }}
      >
        {title}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          color: colors.onSurfaceVariant,
          mb: actionLabel ? (compact ? 2 : 3) : 0,
          maxWidth: 400,
          fontSize: compact ? '0.875rem' : '1rem',
        }}
      >
        {message}
      </Typography>
      {actionLabel && onAction && (
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={onAction}
          sx={{
            borderRadius: '9999px',
            textTransform: 'none',
            fontWeight: 500,
          }}
        >
          {actionLabel}
        </Button>
      )}
    </Box>
  );
};
