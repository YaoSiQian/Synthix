import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Link,
  Divider,
  InputAdornment,
  IconButton,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Science,
  Email,
  Lock,
} from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLogin } from '@/hooks';
import { colors } from '@/theme';

const loginSchema = z.object({
  username: z.string().min(1, 'validation.usernameRequired'),
  password: z.string().min(1, 'validation.passwordRequired'),
});

type LoginForm = z.infer<typeof loginSchema>;

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const loginMutation = useLogin();
  const [showPassword, setShowPassword] = React.useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });
  
  const onSubmit = (data: LoginForm) => {
    loginMutation.mutate(data);
  };
  
  return (
    <Card
      sx={{
        width: '100%',
        maxWidth: 420,
        mx: 2,
        borderRadius: '32px',
        backgroundColor: colors.surface,
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        position: 'relative',
        zIndex: 1,
      }}
    >
      <CardContent sx={{ p: 4 }}>
        {/* Logo */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box
            sx={{
              width: 72,
              height: 72,
              borderRadius: '24px',
              backgroundColor: colors.primary,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto',
              mb: 2,
            }}
          >
            <Science sx={{ fontSize: 36, color: colors.onPrimary }} />
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: colors.onSurface, mb: 1 }}>
            {t('auth.loginTitle')}
          </Typography>
          <Typography variant="body2" sx={{ color: colors.onSurfaceVariant }}>
            {t('auth.loginSubtitle')}
          </Typography>
        </Box>
        
        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <TextField
              fullWidth
              label={t('auth.username')}
              placeholder={t('auth.enterUsername')}
              {...register('username')}
              error={!!errors.username}
              helperText={errors.username?.message as string}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email sx={{ color: colors.onSurfaceVariant }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '16px',
                  backgroundColor: colors.surfaceContainerLow,
                },
              }}
            />
            
            <TextField
              fullWidth
              label={t('auth.password')}
              type={showPassword ? 'text' : 'password'}
              placeholder={t('auth.enterPassword')}
              {...register('password')}
              error={!!errors.password}
              helperText={errors.password?.message as string}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx={{ color: colors.onSurfaceVariant }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '16px',
                  backgroundColor: colors.surfaceContainerLow,
                },
              }}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loginMutation.isPending}
              sx={{
                mt: 1,
                py: 1.5,
                borderRadius: '9999px',
                fontSize: '1rem',
                fontWeight: 600,
                textTransform: 'none',
                backgroundColor: colors.primary,
                '&:hover': {
                  backgroundColor: `${colors.primary}E6`,
                  boxShadow: '0 4px 12px rgba(103, 80, 164, 0.4)',
                },
              }}
            >
              {loginMutation.isPending ? t('auth.loggingIn') : t('auth.login')}
            </Button>
          </Box>
        </form>
        
        <Divider sx={{ my: 3 }}>
          <Typography variant="caption" sx={{ color: colors.onSurfaceVariant, px: 2 }}>
            {t('auth.or')}
          </Typography>
        </Divider>
        
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: colors.onSurfaceVariant }}>
            {t('auth.noAccount')}{' '}
            <Link
              component="button"
              type="button"
              onClick={() => navigate('/register')}
              sx={{
                color: colors.primary,
                fontWeight: 600,
                textDecoration: 'none',
                '&:hover': { textDecoration: 'underline' },
              }}
            >
              {t('auth.signUpNow')}
            </Link>
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default LoginPage;
