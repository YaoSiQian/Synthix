import React from 'react';
import { Box, Container, Typography, Breadcrumbs, Link } from '@mui/material';
import { NavigateNext } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { NotificationContainer } from '../common/NotificationContainer';
import { colors } from '@/theme';

interface PageLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  breadcrumbs?: Array<{ label: string; path?: string }>;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
  fullWidth?: boolean;
  padding?: boolean;
}

export const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  title,
  subtitle,
  breadcrumbs,
  maxWidth = 'xl',
  fullWidth = false,
  padding = true,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  
  if (isAuthPage) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          backgroundColor: colors.background,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
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
            background: `radial-gradient(circle, ${colors.primary}30 0%, transparent 70%)`,
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
            background: `radial-gradient(circle, ${colors.tertiary}25 0%, transparent 70%)`,
            filter: 'blur(50px)',
            bottom: '-50px',
            left: '-50px',
            pointerEvents: 'none',
          }}
        />
        
        <NotificationContainer />
        {children}
      </Box>
    );
  }
  
  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: colors.background, display: 'flex', flexDirection: 'column' }}>
      <Header />
      <Sidebar />
      <NotificationContainer />
      
      <Box
        component="main"
        sx={{
          flex: 1,
          py: padding ? { xs: 2, md: 4 } : 0,
          px: padding ? { xs: 2, md: 4 } : 0,
        }}
      >
        {fullWidth ? (
          children
        ) : (
          <Container maxWidth={maxWidth}>
            {/* Breadcrumbs */}
            {breadcrumbs && breadcrumbs.length > 0 && (
              <Breadcrumbs
                separator={<NavigateNext fontSize="small" />}
                sx={{ mb: 2 }}
              >
                {breadcrumbs.map((crumb, index) =>
                  crumb.path ? (
                    <Link
                      key={index}
                      component="button"
                      onClick={() => navigate(crumb.path!)}
                      sx={{
                        color: colors.onSurfaceVariant,
                        textDecoration: 'none',
                        fontSize: '0.875rem',
                        '&:hover': { color: colors.primary },
                      }}
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <Typography
                      key={index}
                      color="text.primary"
                      sx={{ fontSize: '0.875rem', fontWeight: 500 }}
                    >
                      {crumb.label}
                    </Typography>
                  )
                )}
              </Breadcrumbs>
            )}
            
            {/* Page Title */}
            {title && (
              <Box sx={{ mb: subtitle ? 1 : 3 }}>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 600,
                    color: colors.onSurface,
                    fontSize: { xs: '1.75rem', md: '2.25rem' },
                  }}
                >
                  {title}
                </Typography>
                {subtitle && (
                  <Typography
                    variant="body1"
                    sx={{ color: colors.onSurfaceVariant, mt: 0.5 }}
                  >
                    {subtitle}
                  </Typography>
                )}
              </Box>
            )}
            
            {children}
          </Container>
        )}
      </Box>
    </Box>
  );
};
