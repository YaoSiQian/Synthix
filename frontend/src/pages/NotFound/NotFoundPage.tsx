import React from 'react';
import {
  Box,
  Typography,
  Button,
} from '@mui/material';
import { Home, Science } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { colors } from '@/theme';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: colors.background,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        px: 3,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative blur shapes */}
      <Box
        sx={{
          position: 'absolute',
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${colors.primary}20 0%, transparent 70%)`,
          filter: 'blur(60px)',
          top: '-100px',
          right: '-100px',
          pointerEvents: 'none',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${colors.tertiary}15 0%, transparent 70%)`,
          filter: 'blur(50px)',
          bottom: '-50px',
          left: '-50px',
          pointerEvents: 'none',
        }}
      />
      
      {/* Content */}
      <Box
        sx={{
          width: 120,
          height: 120,
          borderRadius: '32px',
          backgroundColor: colors.primaryContainer,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 3,
        }}
      >
        <Science sx={{ fontSize: 60, color: colors.primary }} />
      </Box>
      
      <Typography
        variant="h1"
        sx={{
          fontSize: { xs: '4rem', md: '6rem' },
          fontWeight: 700,
          color: colors.primary,
          mb: 1,
        }}
      >
        404
      </Typography>
      
      <Typography
        variant="h4"
        sx={{
          fontWeight: 600,
          color: colors.onSurface,
          mb: 2,
          textAlign: 'center',
        }}
      >
        页面未找到
      </Typography>
      
      <Typography
        variant="body1"
        sx={{
          color: colors.onSurfaceVariant,
          mb: 4,
          textAlign: 'center',
          maxWidth: 400,
        }}
      >
        抱歉，你访问的页面不存在。可能已被移动或删除。
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button
          variant="contained"
          startIcon={<Home />}
          onClick={() => navigate('/lab')}
          sx={{
            borderRadius: '9999px',
            px: 4,
            py: 1.5,
            textTransform: 'none',
            fontWeight: 600,
            backgroundColor: colors.primary,
            '&:hover': {
              backgroundColor: `${colors.primary}E6`,
              boxShadow: '0 4px 12px rgba(103, 80, 164, 0.4)',
            },
          }}
        >
          返回实验室
        </Button>
        <Button
          variant="outlined"
          onClick={() => navigate(-1)}
          sx={{
            borderRadius: '9999px',
            px: 4,
            py: 1.5,
            textTransform: 'none',
            fontWeight: 600,
            borderColor: colors.outline,
            color: colors.onSurface,
            '&:hover': {
              borderColor: colors.primary,
              color: colors.primary,
              backgroundColor: `${colors.primary}10`,
            },
          }}
        >
          返回上一页
        </Button>
      </Box>
    </Box>
  );
};

export default NotFoundPage;
