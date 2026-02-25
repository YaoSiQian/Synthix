import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import CssBaseline from '@mui/material/CssBaseline';
import { useTranslation } from 'react-i18next';
import { theme } from '@/theme';
import { ProtectedRoute } from '@/components/common';
import { LoadingSpinner } from '@/components/common';

// Lazy load pages
const LoginPage = lazy(() => import('@/pages/Login/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/Register/RegisterPage'));
const LabPage = lazy(() => import('@/pages/Lab/LabPage'));
const ChemicalsPage = lazy(() => import('@/pages/Chemicals/ChemicalsPage'));
const AwardsPage = lazy(() => import('@/pages/Awards/AwardsPage'));
const LeaderboardPage = lazy(() => import('@/pages/Leaderboard/LeaderboardPage'));
const DashboardPage = lazy(() => import('@/pages/Dashboard/DashboardPage'));
const ProfilePage = lazy(() => import('@/pages/Profile/ProfilePage'));
const NotFoundPage = lazy(() => import('@/pages/NotFound/NotFoundPage'));

// Create query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  const { t } = useTranslation();
  
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <Suspense fallback={<LoadingSpinner fullScreen message={t('common.loading')} />}>
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              
              {/* Protected routes */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Navigate to="/lab" replace />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/lab"
                element={
                  <ProtectedRoute>
                    <LabPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/chemicals"
                element={
                  <ProtectedRoute>
                    <ChemicalsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/chemicals/:id"
                element={
                  <ProtectedRoute>
                    <ChemicalsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/awards"
                element={
                  <ProtectedRoute>
                    <AwardsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/awards/available"
                element={
                  <ProtectedRoute>
                    <AwardsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/leaderboard"
                element={
                  <ProtectedRoute>
                    <LeaderboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
              
              {/* 404 */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
