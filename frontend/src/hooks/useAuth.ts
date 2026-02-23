import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi } from '@/api';
import { useAuthStore } from '@/store';
import { useUIStore } from '@/store';
import type { UserCreateSchema, LoginCredentials } from '@/types';

export const useAuth = () => {
  const { token, user, isAuthenticated, setAuth, logout } = useAuthStore();
  const addNotification = useUIStore((s) => s.addNotification);
  
  return {
    token,
    user,
    isAuthenticated,
    setAuth,
    logout,
    addNotification,
  };
};

export const useLogin = () => {
  const navigate = useNavigate();
  const { setAuth, addNotification } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (credentials: LoginCredentials) =>
      authApi.login(credentials.username, credentials.password),
    onSuccess: async (token) => {
      try {
        const user = await authApi.getMe(token.access_token);
        setAuth(token.access_token, user);
        addNotification({
          type: 'success',
          title: '登录成功',
          message: `欢迎回来，${user.username}！`,
        });
        queryClient.invalidateQueries({ queryKey: ['user'] });
        navigate('/lab');
      } catch (error) {
        addNotification({
          type: 'error',
          title: '登录失败',
          message: '获取用户信息失败',
        });
      }
    },
    onError: (error: { message?: string }) => {
      addNotification({
        type: 'error',
        title: '登录失败',
        message: error.message || '用户名或密码错误',
      });
    },
  });
};

export const useRegister = () => {
  const navigate = useNavigate();
  const { addNotification } = useAuth();
  
  return useMutation({
    mutationFn: (data: UserCreateSchema) => authApi.register(data),
    onSuccess: () => {
      addNotification({
        type: 'success',
        title: '注册成功',
        message: '请使用新账号登录',
      });
      navigate('/login');
    },
    onError: (error: { message?: string }) => {
      addNotification({
        type: 'error',
        title: '注册失败',
        message: error.message || '注册过程中出现错误',
      });
    },
  });
};

export const useCurrentUser = () => {
  const { token } = useAuth();
  
  return useQuery({
    queryKey: ['user', 'me'],
    queryFn: () => authApi.getMe(),
    enabled: !!token,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useLogout = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const queryClient = useQueryClient();
  
  const handleLogout = () => {
    logout();
    queryClient.clear();
    navigate('/login');
  };
  
  return { handleLogout };
};
