import React from 'react';
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Science,
  EmojiEvents,
  TrendingUp,
  Whatshot,
  CheckCircle,
  Person,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { PageLayout } from '@/components/layout';
import { StatCard, LoadingSpinner, EmptyState } from '@/components/common';
import { AwardCard } from '@/components/awards';
import { useDashboardStats, useRecentAwards, useMyRank, useReactionStats } from '@/hooks';
import { useAuth } from '@/hooks';
import { colors, tierColors } from '@/theme';

const DashboardPage: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: recentAwards, isLoading: recentAwardsLoading } = useRecentAwards(7, 5);
  const { data: myRank, isLoading: myRankLoading } = useMyRank();
  const { data: reactionStats, isLoading: reactionStatsLoading } = useReactionStats();
  
  const isLoading = statsLoading || recentAwardsLoading || myRankLoading || reactionStatsLoading;
  
  if (isLoading) {
    return (
      <PageLayout title={t('dashboard.title')}>
        <LoadingSpinner message={t('common.loading')} />
      </PageLayout>
    );
  }
  
  const dashboardStats = stats?.dashboard_stats as Record<string, number> || {};
  
  return (
    <PageLayout
      title={t('dashboard.title')}
      subtitle={t('dashboard.welcome', { username: user?.username || 'User' })}
      breadcrumbs={[{ label: t('dashboard.title') }]}
    >
      {/* Stats cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title={t('dashboard.totalReactions')}
            value={reactionStats?.total_reactions || 0}
            subtitle={t('dashboard.reactionSubtitle')}
            icon={<Science sx={{ fontSize: 24 }} />}
            color={colors.primary}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title={t('dashboard.discoveries')}
            value={reactionStats?.total_discoveries || 0}
            subtitle={t('dashboard.discoverySubtitle')}
            icon={<Whatshot sx={{ fontSize: 24 }} />}
            color={colors.tertiary}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title={t('dashboard.totalAwards')}
            value={dashboardStats.total_awards || myRank?.award_count || 0}
            subtitle={t('dashboard.awardsSubtitle')}
            icon={<EmojiEvents sx={{ fontSize: 24 }} />}
            color={colors.gold}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title={t('dashboard.totalPoints')}
            value={myRank?.total_points?.toLocaleString() || 0}
            subtitle={t('dashboard.rank', { rank: myRank?.rank || '-' })}
            icon={<TrendingUp sx={{ fontSize: 24 }} />}
            color={colors.success}
          />
        </Grid>
      </Grid>
      
      {/* Main content */}
      <Grid container spacing={3}>
        {/* Recent awards */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <Card
            sx={{
              borderRadius: '24px',
              backgroundColor: colors.surfaceContainer,
              height: '100%',
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: colors.onSurface }}>
                  {t('dashboard.recentAwards')}
                </Typography>
                <Chip
                  label={t('dashboard.last7Days')}
                  size="small"
                  sx={{
                    borderRadius: '9999px',
                    backgroundColor: colors.primaryContainer,
                    color: colors.onPrimaryContainer,
                  }}
                />
              </Box>
              
              {!recentAwards?.recent_awards || recentAwards.recent_awards.length === 0 ? (
                <EmptyState
                  title={t('dashboard.noRecentAwards')}
                  message={t('dashboard.noRecentAwardsMessage')}
                  icon={<EmojiEvents sx={{ fontSize: 48, color: colors.onSurfaceVariant }} />}
                  compact
                />
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {recentAwards.recent_awards.slice(0, 3).map((award) => (
                    <AwardCard key={award.id} award={award} variant="compact" />
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
        
        {/* Activity feed */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <Card
            sx={{
              borderRadius: '24px',
              backgroundColor: colors.surfaceContainer,
              height: '100%',
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: colors.onSurface, mb: 2 }}>
                {t('dashboard.activityFeed')}
              </Typography>
              
              <List sx={{ p: 0 }}>
                {/* Welcome message */}
                <ListItem sx={{ px: 0, py: 1.5 }}>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: colors.primaryContainer, color: colors.primary }}>
                      <Person />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={t('dashboard.welcomeMessage')}
                    secondary={t('dashboard.welcomeSubtitle')}
                    primaryTypographyProps={{ fontWeight: 600, color: colors.onSurface }}
                    secondaryTypographyProps={{ color: colors.onSurfaceVariant }}
                  />
                </ListItem>
                <Divider component="li" sx={{ borderColor: colors.outlineVariant }} />
                
                {/* Reaction stat */}
                {reactionStats && reactionStats.total_reactions > 0 && (
                  <>
                    <ListItem sx={{ px: 0, py: 1.5 }}>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: colors.successContainer, color: colors.success }}>
                          <CheckCircle />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={t('dashboard.experimentsCompleted', { count: reactionStats.total_reactions })}
                        secondary={t('dashboard.discoveriesMade', { count: reactionStats.total_discoveries })}
                        primaryTypographyProps={{ fontWeight: 600, color: colors.onSurface }}
                        secondaryTypographyProps={{ color: colors.onSurfaceVariant }}
                      />
                    </ListItem>
                    <Divider component="li" sx={{ borderColor: colors.outlineVariant }} />
                  </>
                )}
                
                {/* Rank info */}
                {myRank && myRank.rank && (
                  <>
                    <ListItem sx={{ px: 0, py: 1.5 }}>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: colors.gold + '20', color: colors.gold }}>
                          <EmojiEvents />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={t('dashboard.currentRank', { rank: myRank.rank })}
                        secondary={t('dashboard.pointsAndAwards', { awards: myRank.award_count, points: myRank.total_points.toLocaleString() })}
                        primaryTypographyProps={{ fontWeight: 600, color: colors.onSurface }}
                        secondaryTypographyProps={{ color: colors.onSurfaceVariant }}
                      />
                    </ListItem>
                    <Divider component="li" sx={{ borderColor: colors.outlineVariant }} />
                  </>
                )}
                
                {/* Recent award */}
                {recentAwards?.recent_awards && recentAwards.recent_awards.length > 0 && (
                  <ListItem sx={{ px: 0, py: 1.5 }}>
                    <ListItemAvatar>
                      <Avatar
                        sx={{
                          bgcolor: tierColors[recentAwards.recent_awards[0].tier] + '20',
                          color: tierColors[recentAwards.recent_awards[0].tier],
                        }}
                      >
                        <EmojiEvents />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={t('dashboard.earnedAward', { tier: t(`awards.${recentAwards.recent_awards[0].tier}`) })}
                      secondary={recentAwards.recent_awards[0].template.name}
                      primaryTypographyProps={{ fontWeight: 600, color: colors.onSurface }}
                      secondaryTypographyProps={{ color: colors.onSurfaceVariant }}
                    />
                  </ListItem>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Quick actions */}
      <Card
        sx={{
          borderRadius: '24px',
          backgroundColor: colors.surfaceContainer,
          mt: 3,
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: colors.onSurface, mb: 2 }}>
            {t('dashboard.quickActions')}
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card
                component="a"
                href="/lab"
                sx={{
                  borderRadius: '20px',
                  backgroundColor: colors.primaryContainer,
                  textDecoration: 'none',
                  cursor: 'pointer',
                  transition: 'all 300ms cubic-bezier(0.2, 0, 0, 1)',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  },
                }}
              >
                <CardContent sx={{ p: 2, textAlign: 'center' }}>
                  <Science sx={{ fontSize: 32, color: colors.primary, mb: 1 }} />
                  <Typography variant="body1" sx={{ fontWeight: 600, color: colors.onPrimaryContainer }}>
                    {t('dashboard.startExperiment')}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card
                component="a"
                href="/chemicals"
                sx={{
                  borderRadius: '20px',
                  backgroundColor: colors.secondaryContainer,
                  textDecoration: 'none',
                  cursor: 'pointer',
                  transition: 'all 300ms cubic-bezier(0.2, 0, 0, 1)',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  },
                }}
              >
                <CardContent sx={{ p: 2, textAlign: 'center' }}>
                  <Science sx={{ fontSize: 32, color: colors.secondary, mb: 1 }} />
                  <Typography variant="body1" sx={{ fontWeight: 600, color: colors.onSecondaryContainer }}>
                    {t('dashboard.browseChemicals')}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card
                component="a"
                href="/awards"
                sx={{
                  borderRadius: '20px',
                  backgroundColor: colors.tertiaryContainer,
                  textDecoration: 'none',
                  cursor: 'pointer',
                  transition: 'all 300ms cubic-bezier(0.2, 0, 0, 1)',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  },
                }}
              >
                <CardContent sx={{ p: 2, textAlign: 'center' }}>
                  <EmojiEvents sx={{ fontSize: 32, color: colors.tertiary, mb: 1 }} />
                  <Typography variant="body1" sx={{ fontWeight: 600, color: colors.onTertiaryContainer }}>
                    {t('dashboard.viewAwards')}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card
                component="a"
                href="/leaderboard"
                sx={{
                  borderRadius: '20px',
                  backgroundColor: colors.successContainer,
                  textDecoration: 'none',
                  cursor: 'pointer',
                  transition: 'all 300ms cubic-bezier(0.2, 0, 0, 1)',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  },
                }}
              >
                <CardContent sx={{ p: 2, textAlign: 'center' }}>
                  <TrendingUp sx={{ fontSize: 32, color: colors.success, mb: 1 }} />
                  <Typography variant="body1" sx={{ fontWeight: 600, color: colors.onSuccessContainer }}>
                    {t('dashboard.viewLeaderboard')}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </PageLayout>
  );
};

export default DashboardPage;
