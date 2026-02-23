import React from 'react';
import {
  Box,
  Grid,
  Tabs,
  Tab,
  Chip,
} from '@mui/material';
import { EmojiEvents, Lock, TrendingUp } from '@mui/icons-material';
import { PageLayout } from '@/components/layout';
import { AwardCard } from '@/components/awards';
import { LoadingSpinner, EmptyState } from '@/components/common';
import { useMyAwards, useAvailableAwards } from '@/hooks';
import { colors } from '@/theme';
import type { AwardCategory } from '@/types';

const categories: Array<{ value: AwardCategory | 'all'; label: string }> = [
  { value: 'all', label: '全部' },
  { value: 'discovery', label: '发现' },
  { value: 'database_contribution', label: '数据库贡献' },
  { value: 'community', label: '社区' },
  { value: 'special', label: '特殊' },
  { value: 'achievement', label: '成就' },
];

const AwardsPage: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState(0);
  const [categoryFilter, setCategoryFilter] = React.useState<AwardCategory | 'all'>('all');
  
  const { data: myAwards, isLoading: myAwardsLoading } = useMyAwards(
    categoryFilter === 'all' ? undefined : categoryFilter
  );
  const { data: availableAwards, isLoading: availableAwardsLoading } = useAvailableAwards(
    categoryFilter === 'all' ? undefined : categoryFilter
  );
  
  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };
  
  const handleCategoryChange = (category: AwardCategory | 'all') => {
    setCategoryFilter(category);
  };
  
  const isMyAwardsTab = activeTab === 0;
  const isAvailableAwardsTab = activeTab === 1;
  
  return (
    <PageLayout
      title="奖励系统"
      subtitle="追踪你的成就和进度"
      breadcrumbs={[{ label: '奖励' }]}
    >
      {/* Main tabs */}
      <Box sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          sx={{
            '& .MuiTabs-indicator': {
              height: 3,
              borderRadius: '3px 3px 0 0',
            },
          }}
        >
          <Tab
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <EmojiEvents />
                <span>我的奖励</span>
              </Box>
            }
            sx={{ textTransform: 'none', fontWeight: 600 }}
          />
          <Tab
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Lock />
                <span>可用奖励</span>
              </Box>
            }
            sx={{ textTransform: 'none', fontWeight: 600 }}
          />
        </Tabs>
      </Box>
      
      {/* Category filters */}
      <Box sx={{ mb: 3, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {categories.map((cat) => (
          <Chip
            key={cat.value}
            label={cat.label}
            onClick={() => handleCategoryChange(cat.value)}
            sx={{
              borderRadius: '9999px',
              backgroundColor: categoryFilter === cat.value ? colors.primaryContainer : colors.surfaceContainer,
              color: categoryFilter === cat.value ? colors.onPrimaryContainer : colors.onSurfaceVariant,
              fontWeight: categoryFilter === cat.value ? 600 : 500,
              '&:hover': {
                backgroundColor: categoryFilter === cat.value ? colors.primaryContainer : `${colors.primary}10`,
              },
            }}
          />
        ))}
      </Box>
      
      {/* My Awards Tab */}
      {isMyAwardsTab && (
        <>
          {myAwardsLoading ? (
            <LoadingSpinner message="加载奖励..." />
          ) : !myAwards || myAwards.length === 0 ? (
            <EmptyState
              title="暂无奖励"
              message="完成实验和发现来解锁奖励"
              icon={<EmojiEvents sx={{ fontSize: 64, color: colors.onSurfaceVariant }} />}
              actionLabel="去实验室"
              onAction={() => window.location.href = '/lab'}
            />
          ) : (
            <Grid container spacing={2}>
              {myAwards.map((award) => (
                <Grid size={{ xs: 12, md: 6 }} key={award.id}>
                  <AwardCard award={award} />
                </Grid>
              ))}
            </Grid>
          )}
        </>
      )}
      
      {/* Available Awards Tab */}
      {isAvailableAwardsTab && (
        <>
          {availableAwardsLoading ? (
            <LoadingSpinner message="加载可用奖励..." />
          ) : !availableAwards || availableAwards.length === 0 ? (
            <EmptyState
              title="所有奖励已解锁"
              message="恭喜你解锁了所有可用奖励！"
              icon={<TrendingUp sx={{ fontSize: 64, color: colors.success }} />}
            />
          ) : (
            <Grid container spacing={2}>
              {availableAwards.map((award) => (
                <Grid size={{ xs: 12, md: 6 }} key={award.template_id}>
                  <AwardCard award={award} variant="progress" />
                </Grid>
              ))}
            </Grid>
          )}
        </>
      )}
    </PageLayout>
  );
};

export default AwardsPage;
