import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Divider,
} from '@mui/material';
import {
  Science,
  EmojiEvents,
  Dashboard,
  Settings,
  Close,
} from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUIStore } from '@/store';
import { colors } from '@/theme';

const sidebarItems = [
  { path: '/lab', label: '实验室', icon: <Science /> },
  { path: '/chemicals', label: '化学品库', icon: <Science /> },
  { path: '/awards', label: '我的奖励', icon: <EmojiEvents /> },
  { path: '/leaderboard', label: '排行榜', icon: <EmojiEvents /> },
  { path: '/dashboard', label: '仪表板', icon: <Dashboard /> },
  { path: '/profile', label: '个人资料', icon: <Settings /> },
];

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const sidebarOpen = useUIStore((s) => s.sidebarOpen);
  const setSidebarOpen = useUIStore((s) => s.setSidebarOpen);
  
  const isActive = (path: string) => location.pathname.startsWith(path);
  
  const handleNavigate = (path: string) => {
    navigate(path);
    setSidebarOpen(false);
  };
  
  const drawerContent = (
    <Box sx={{ width: 280, height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600, color: colors.onSurface }}>
          Chemezy
        </Typography>
        <IconButton onClick={() => setSidebarOpen(false)}>
          <Close />
        </IconButton>
      </Box>
      
      <Divider sx={{ mx: 2 }} />
      
      {/* Navigation */}
      <List sx={{ flex: 1, px: 2, py: 2 }}>
        {sidebarItems.map((item) => (
          <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              onClick={() => handleNavigate(item.path)}
              sx={{
                borderRadius: '16px',
                py: 1.5,
                backgroundColor: isActive(item.path) ? colors.primaryContainer : 'transparent',
                color: isActive(item.path) ? colors.onPrimaryContainer : colors.onSurfaceVariant,
                '&:hover': {
                  backgroundColor: isActive(item.path)
                    ? colors.primaryContainer
                    : `${colors.primary}10`,
                },
                transition: 'all 300ms cubic-bezier(0.2, 0, 0, 1)',
              }}
            >
              <ListItemIcon
                sx={{
                  color: isActive(item.path) ? colors.onPrimaryContainer : colors.onSurfaceVariant,
                  minWidth: 40,
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontWeight: isActive(item.path) ? 600 : 500,
                  fontSize: '0.9375rem',
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      
      {/* Footer */}
      <Box sx={{ p: 2, borderTop: `1px solid ${colors.outlineVariant}` }}>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center' }}>
          Chemezy v1.0
        </Typography>
      </Box>
    </Box>
  );
  
  return (
    <Drawer
      anchor="left"
      open={sidebarOpen}
      onClose={() => setSidebarOpen(false)}
      PaperProps={{
        sx: {
          borderRadius: '0 24px 24px 0',
          backgroundColor: colors.surface,
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
};
