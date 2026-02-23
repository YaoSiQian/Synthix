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
  Person,
  Email,
  Lock,
  CheckCircle,
} from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useRegister } from '@/hooks';
import { colors } from '@/theme';

const registerSchema = z.object({
  username: z.string().min(3, '用户名至少3个字符').max(20, '用户名最多20个字符'),
  email: z.string().email('请输入有效的邮箱地址'),
  password: z.string().min(6, '密码至少6个字符'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: '两次输入的密码不一致',
  path: ['confirmPassword'],
});

type RegisterForm = z.infer<typeof registerSchema>;

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const registerMutation = useRegister();
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });
  
  const onSubmit = (data: RegisterForm) => {
    const { confirmPassword, ...registerData } = data;
    registerMutation.mutate(registerData);
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
            创建账号
          </Typography>
          <Typography variant="body2" sx={{ color: colors.onSurfaceVariant }}>
            加入 Chemezy 开始你的化学探索之旅
          </Typography>
        </Box>
        
        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <TextField
              fullWidth
              label="用户名"
              placeholder="选择一个用户名"
              {...register('username')}
              error={!!errors.username}
              helperText={errors.username?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person sx={{ color: colors.onSurfaceVariant }} />
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
              label="邮箱"
              type="email"
              placeholder="输入你的邮箱"
              {...register('email')}
              error={!!errors.email}
              helperText={errors.email?.message}
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
              label="密码"
              type={showPassword ? 'text' : 'password'}
              placeholder="设置密码"
              {...register('password')}
              error={!!errors.password}
              helperText={errors.password?.message}
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
            
            <TextField
              fullWidth
              label="确认密码"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="再次输入密码"
              {...register('confirmPassword')}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CheckCircle sx={{ color: colors.onSurfaceVariant }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
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
              disabled={registerMutation.isPending}
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
              {registerMutation.isPending ? '注册中...' : '创建账号'}
            </Button>
          </Box>
        </form>
        
        <Divider sx={{ my: 3 }}>
          <Typography variant="caption" sx={{ color: colors.onSurfaceVariant, px: 2 }}>
            或
          </Typography>
        </Divider>
        
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: colors.onSurfaceVariant }}>
            已有账号？{' '}
            <Link
              component="button"
              type="button"
              onClick={() => navigate('/login')}
              sx={{
                color: colors.primary,
                fontWeight: 600,
                textDecoration: 'none',
                '&:hover': { textDecoration: 'underline' },
              }}
            >
              立即登录
            </Link>
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default RegisterPage;
