import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { colors } from '@/theme';

interface LoadingSpinnerProps {
  message?: string;
  size?: number;
  fullScreen?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = '加载中...',
  size = 48,
  fullScreen = false,
}) => {
  const content = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
      }}
    >
      <CircularProgress
        size={size}
        sx={{
          color: colors.primary,
        }}
      />
      {message && (
        <Typography
          variant="body2"
          sx={{ color: colors.onSurfaceVariant, fontWeight: 500 }}
        >
          {message}
        </Typography>
      )}
    </Box>
  );
  
  if (fullScreen) {
    return (
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(255, 251, 254, 0.9)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
        }}
      >
        {content}
      </Box>
    );
  }
  
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 8,
      }}
    >
      {content}
    </Box>
  );
};
