import React from 'react';
import {
  Box,
  Grid,
  Typography,
  Tabs,
  Tab,
  Card,
  CardContent,
  Avatar,
  Chip,
} from '@mui/material';
import { MilitaryTech, TrendingUp } from '@mui/icons-material';
import { PageLayout } from '@/components/layout';
import { LeaderboardTable } from '@/components/awards';
import { LoadingSpinner, EmptyState } from '@/components/common';
import { useLeaderboard, useMyRank } from '@/hooks';
import { useAuth } from '@/hooks';
import { colors, tierColors, awardCategoryLabels } from '@/theme';
import type { AwardCategory } from '@/types';

const categories: Array<{ value: AwardCategory | 'overall'; label: string }> = [
  { value: 'overall', label: '总排行' },
  { value: 'discovery', label: '发现' },
  { value: 'database_contribution', label: '数据库贡献' },
  { value: 'community', label: '社区' },
  { value: 'special', label: '特殊' },
  { value: 'achievement', label: '成就' },
];

const LeaderboardPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = React.useState<AwardCategory | 'overall'>('overall');
  const { user } = useAuth();
  
  const { data: leaderboard, isLoading: leaderboardLoading } = useLeaderboard(activeCategory);
  const { data: myRank } = useMyRank(
    activeCategory === 'overall' ? undefined : activeCategory
  );
  
  const handleCategoryChange = (_: React.SyntheticEvent, newValue: AwardCategory | 'overall') => {
    setActiveCategory(newValue);
  };
  
  return (
    <PageLayout
      title="排行榜"
      subtitle="看看你在社区中的排名"
      breadcrumbs={[{ label: '排行榜' }]}
    >
      {/* Category tabs */}
      <Box sx={{ mb: 3 }}>
        <Tabs
          value={activeCategory}
          onChange={handleCategoryChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            '& .MuiTabs-flexContainer': {
              gap: 1,
            },
            '& .MuiTabs-indicator': {
              display: 'none',
            },
          }}
        >
          {categories.map((cat) => (
            <Tab
              key={cat.value}
              value={cat.value}
              label={cat.label}
              sx={{
                textTransform: 'none',
                borderRadius: '9999px',
                minHeight: '40px',
                px: 3,
                color: colors.onSurfaceVariant,
                fontWeight: 500,
                '&.Mui-selected': {
                  color: colors.onPrimaryContainer,
                  backgroundColor: colors.primaryContainer,
                  fontWeight: 600,
                },
              }}
            />
          ))}
        </Tabs>
      </Box>
      
      {/* My rank card */}
      {myRank && myRank.rank !== null && (
        <Card
          sx={{
            borderRadius: '24px',
            background: `linear-gradient(135deg, ${colors.primary}15 0%, ${colors.primary}05 100%)`,
            border: `2px solid ${colors.primary}30`,
            mb: 3,
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: '20px',
                  backgroundColor: colors.primary,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: colors.onPrimary,
                }}
              >
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  #{myRank.rank}
                </Typography>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: colors.onSurface, mb: 0.5 }}>
                  你的排名
                </Typography>
                <Typography variant="body2" sx={{ color: colors.onSurfaceVariant }}>
                  {awardCategoryLabels[activeCategory as AwardCategory] || '总排行'} · {myRank.award_count} 个奖励 · {myRank.total_points.toLocaleString()} 积分
                </Typography>
              </Box>
              <Chip
                label={`Top ${((myRank.rank / (leaderboard?.length || 1)) * 100).toFixed(1)}%`}
                sx={{
                  borderRadius: '9999px',
                  backgroundColor: colors.primary,
                  color: colors.onPrimary,
                  fontWeight: 600,
                }}
              />
            </Box>
          </CardContent>
        </Card>
      )}
      
      {/* Top 3 podium */}
      {leaderboard && leaderboard.length >= 3 && (
        <Box sx={{ mb: 4 }}>
          <Grid container spacing={2} alignItems="flex-end">
            {/* 2nd place */}
            <Grid size={{ xs: 4 }}>
              <Card
                sx={{
                  borderRadius: '24px',
                  backgroundColor: `${tierColors[2]}15`,
                  border: `2px solid ${tierColors[2]}40`,
                  textAlign: 'center',
                  py: 2,
                }}
              >
                <CardContent>
                  <MilitaryTech sx={{ fontSize: 40, color: tierColors[2], mb: 1 }} />
                  <Avatar
                    sx={{
                      width: 56,
                      height: 56,
                      margin: '0 auto',
                      mb: 1,
                      backgroundColor: tierColors[2],
                      fontWeight: 600,
                    }}
                  >
                    {leaderboard[1].username.charAt(0).toUpperCase()}
                  </Avatar>
                  <Typography variant="body1" sx={{ fontWeight: 600, color: colors.onSurface }}>
                    {leaderboard[1].username}
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: tierColors[2] }}>
                    {leaderboard[1].total_points.toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            {/* 1st place */}
            <Grid size={{ xs: 4 }}>
              <Card
                sx={{
                  borderRadius: '24px',
                  backgroundColor: `${tierColors[3]}15`,
                  border: `2px solid ${tierColors[3]}40`,
                  textAlign: 'center',
                  py: 3,
                  transform: 'translateY(-8px)',
                }}
              >
                <CardContent>
                  <MilitaryTech sx={{ fontSize: 48, color: tierColors[3], mb: 1 }} />
                  <Avatar
                    sx={{
                      width: 72,
                      height: 72,
                      margin: '0 auto',
                      mb: 1,
                      backgroundColor: tierColors[3],
                      fontWeight: 600,
                      fontSize: '1.5rem',
                    }}
                  >
                    {leaderboard[0].username.charAt(0).toUpperCase()}
                  </Avatar>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: colors.onSurface }}>
                    {leaderboard[0].username}
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: tierColors[3] }}>
                    {leaderboard[0].total_points.toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            {/* 3rd place */}
            <Grid size={{ xs: 4 }}>
              <Card
                sx={{
                  borderRadius: '24px',
                  backgroundColor: `${tierColors[1]}15`,
                  border: `2px solid ${tierColors[1]}40`,
                  textAlign: 'center',
                  py: 2,
                }}
              >
                <CardContent>
                  <MilitaryTech sx={{ fontSize: 40, color: tierColors[1], mb: 1 }} />
                  <Avatar
                    sx={{
                      width: 56,
                      height: 56,
                      margin: '0 auto',
                      mb: 1,
                      backgroundColor: tierColors[1],
                      fontWeight: 600,
                    }}
                  >
                    {leaderboard[2].username.charAt(0).toUpperCase()}
                  </Avatar>
                  <Typography variant="body1" sx={{ fontWeight: 600, color: colors.onSurface }}>
                    {leaderboard[2].username}
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: tierColors[1] }}>
                    {leaderboard[2].total_points.toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}
      
      {/* Full leaderboard table */}
      {leaderboardLoading ? (
        <LoadingSpinner message="加载排行榜..." />
      ) : !leaderboard || leaderboard.length === 0 ? (
        <EmptyState
          title="暂无数据"
          message="排行榜数据为空"
          icon={<TrendingUp sx={{ fontSize: 64, color: colors.onSurfaceVariant }} />}
        />
      ) : (
        <LeaderboardTable
          entries={leaderboard}
          highlightUserId={user?.id}
        />
      )}
    </PageLayout>
  );
};

export default LeaderboardPage;
