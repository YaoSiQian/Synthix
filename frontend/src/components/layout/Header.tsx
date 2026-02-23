import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Box,
  Tooltip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  AccountCircle,
  Logout,
  Science,
  EmojiEvents,
  Dashboard,
  Settings,
} from '@mui/icons-material';

import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth, useLogout } from '@/hooks';
import { useUIStore } from '@/store';
import { colors } from '@/theme';

const navItems = [
  { path: '/lab', label: '实验室', icon: <Science /> },
  { path: '/chemicals', label: '化学品库', icon: <Science /> },
  { path: '/awards', label: '奖励', icon: <EmojiEvents /> },
  { path: '/leaderboard', label: '排行榜', icon: <EmojiEvents /> },
  { path: '/dashboard', label: '仪表板', icon: <Dashboard /> },
];

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();
  const { handleLogout } = useLogout();
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);
  
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  const handleNavigate = (path: string) => {
    navigate(path);
    handleMenuClose();
  };
  
  const isActive = (path: string) => location.pathname.startsWith(path);
  
  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: colors.surface,
        borderBottom: `1px solid ${colors.outlineVariant}`,
        backdropFilter: 'blur(10px)',
      }}
    >
      <Toolbar sx={{ px: { xs: 2, md: 4 } }}>
        {/* Mobile menu button */}
        <IconButton
          edge="start"
          onClick={toggleSidebar}
          sx={{ mr: 2, display: { md: 'none' }, color: colors.onSurface }}
        >
          <MenuIcon />
        </IconButton>
        
        {/* Logo */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
          }}
          onClick={() => navigate('/lab')}
        >
          <Avatar
            sx={{
              bgcolor: colors.primary,
              mr: 1.5,
              width: 36,
              height: 36,
            }}
          >
            <Science sx={{ fontSize: 20 }} />
          </Avatar>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: colors.onSurface,
              display: { xs: 'none', sm: 'block' },
            }}
          >
            Chemezy
          </Typography>
        </Box>
        
        {/* Desktop Navigation */}
        <Box
          sx={{
            flexGrow: 1,
            display: { xs: 'none', md: 'flex' },
            ml: 4,
            gap: 1,
          }}
        >
          {navItems.map((item) => (
            <Box
              key={item.path}
              onClick={() => navigate(item.path)}
              sx={{
                px: 2,
                py: 1,
                borderRadius: '9999px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                color: isActive(item.path) ? colors.onPrimaryContainer : colors.onSurfaceVariant,
                backgroundColor: isActive(item.path) ? colors.primaryContainer : 'transparent',
                transition: 'all 300ms cubic-bezier(0.2, 0, 0, 1)',
                '&:hover': {
                  backgroundColor: isActive(item.path)
                    ? colors.primaryContainer
                    : `${colors.primary}10`,
                },
              }}
            >
              <Box component="span" sx={{ fontSize: 18, display: 'flex', alignItems: 'center' }}>
                {item.icon}
              </Box>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {item.label}
              </Typography>
            </Box>
          ))}
        </Box>
        
        {/* User menu */}
        {isAuthenticated ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Tooltip title="账户设置">
              <IconButton onClick={handleMenuOpen}>
                <Avatar
                  sx={{
                    width: 36,
                    height: 36,
                    bgcolor: colors.tertiary,
                    fontSize: '0.875rem',
                  }}
                >
                  {user?.username?.charAt(0).toUpperCase() || <AccountCircle />}
                </Avatar>
              </IconButton>
            </Tooltip>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              PaperProps={{
                sx: {
                  mt: 1.5,
                  borderRadius: '16px',
                  minWidth: 200,
                  boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
                },
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <MenuItem disabled>
                <Typography variant="body2" color="text.secondary">
                  {user?.username}
                </Typography>
              </MenuItem>
              <MenuItem onClick={() => handleNavigate('/profile')}>
                <Settings sx={{ mr: 1.5, fontSize: 20 }} />
                个人资料
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <Logout sx={{ mr: 1.5, fontSize: 20 }} />
                退出登录
              </MenuItem>
            </Menu>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Box
              onClick={() => navigate('/login')}
              sx={{
                px: 3,
                py: 1,
                borderRadius: '9999px',
                cursor: 'pointer',
                color: colors.primary,
                transition: 'all 300ms cubic-bezier(0.2, 0, 0, 1)',
                '&:hover': {
                  backgroundColor: `${colors.primary}10`,
                },
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                登录
              </Typography>
            </Box>
            <Box
              onClick={() => navigate('/register')}
              sx={{
                px: 3,
                py: 1,
                borderRadius: '9999px',
                cursor: 'pointer',
                color: colors.onPrimary,
                backgroundColor: colors.primary,
                transition: 'all 300ms cubic-bezier(0.2, 0, 0, 1)',
                '&:hover': {
                  backgroundColor: `${colors.primary}E6`,
                  boxShadow: '0 3px 6px rgba(0,0,0,0.1)',
                },
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                注册
              </Typography>
            </Box>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};
