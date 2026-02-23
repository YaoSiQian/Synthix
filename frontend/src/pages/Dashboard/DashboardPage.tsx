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
import { PageLayout } from '@/components/layout';
import { StatCard, LoadingSpinner, EmptyState } from '@/components/common';
import { AwardCard } from '@/components/awards';
import { useDashboardStats, useRecentAwards, useMyRank, useReactionStats } from '@/hooks';
import { useAuth } from '@/hooks';
import { colors, tierColors, tierLabels } from '@/theme';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: recentAwards, isLoading: recentAwardsLoading } = useRecentAwards(7, 5);
  const { data: myRank, isLoading: myRankLoading } = useMyRank();
  const { data: reactionStats, isLoading: reactionStatsLoading } = useReactionStats();
  
  const isLoading = statsLoading || recentAwardsLoading || myRankLoading || reactionStatsLoading;
  
  if (isLoading) {
    return (
      <PageLayout title="仪表板">
        <LoadingSpinner message="加载统计数据..." />
      </PageLayout>
    );
  }
  
  const dashboardStats = stats?.dashboard_stats as Record<string, number> || {};
  
  return (
    <PageLayout
      title="仪表板"
      subtitle={`欢迎回来，${user?.username || '用户'}！`}
      breadcrumbs={[{ label: '仪表板' }]}
    >
      {/* Stats cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="总反应次数"
            value={reactionStats?.total_reactions || 0}
            subtitle="累计实验次数"
            icon={<Science sx={{ fontSize: 24 }} />}
            color={colors.primary}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="发现次数"
            value={reactionStats?.total_discoveries || 0}
            subtitle="世界首次发现"
            icon={<Whatshot sx={{ fontSize: 24 }} />}
            color={colors.tertiary}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="总奖励数"
            value={dashboardStats.total_awards || myRank?.award_count || 0}
            subtitle="已解锁奖励"
            icon={<EmojiEvents sx={{ fontSize: 24 }} />}
            color={colors.gold}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="总积分"
            value={myRank?.total_points?.toLocaleString() || 0}
            subtitle={`排名 #${myRank?.rank || '-'}`}
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
                  最近获得的奖励
                </Typography>
                <Chip
                  label="7天内"
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
                  title="暂无新奖励"
                  message="最近7天内没有获得新奖励"
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
                活动动态
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
                    primary="欢迎加入 Chemezy"
                    secondary="开始你的化学探索之旅"
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
                        primary={`已完成 ${reactionStats.total_reactions} 次实验`}
                        secondary={`发现 ${reactionStats.total_discoveries} 个新反应`}
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
                        primary={`当前排名 #${myRank.rank}`}
                        secondary={`拥有 ${myRank.award_count} 个奖励 · ${myRank.total_points.toLocaleString()} 积分`}
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
                      primary={`获得 ${tierLabels[recentAwards.recent_awards[0].tier]} 奖励`}
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
            快速操作
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
                    开始实验
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
                    浏览化学品
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
                    查看奖励
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
                    查看排行
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
