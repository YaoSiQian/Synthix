import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
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
          title: t('auth.loginSuccess'),
          message: t('auth.welcomeBack', { username: user.username }),
        });
        queryClient.invalidateQueries({ queryKey: ['user'] });
        navigate('/lab');
      } catch (error) {
        addNotification({
          type: 'error',
          title: t('auth.loginFailed'),
          message: t('auth.getUserFailed'),
        });
      }
    },
    onError: (error: { message?: string }) => {
      addNotification({
        type: 'error',
        title: t('auth.loginFailed'),
        message: error.message || t('auth.invalidCredentials'),
      });
    },
  });
};

export const useRegister = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { addNotification } = useAuth();
  
  return useMutation({
    mutationFn: (data: UserCreateSchema) => authApi.register(data),
    onSuccess: () => {
      addNotification({
        type: 'success',
        title: t('auth.registerSuccess'),
        message: t('auth.registerSuccessMessage'),
      });
      navigate('/login');
    },
    onError: (error: { message?: string }) => {
      addNotification({
        type: 'error',
        title: t('auth.registerFailed'),
        message: error.message || t('auth.registerError'),
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
