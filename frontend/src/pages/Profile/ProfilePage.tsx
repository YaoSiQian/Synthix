import React from 'react';
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  Avatar,
  TextField,
  Button,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
} from '@mui/material';
import {
  Person,
  Email,
  CalendarToday,
  Science,
  EmojiEvents,
  TrendingUp,
  Edit,
  Save,
  Cancel,
} from '@mui/icons-material';
import { PageLayout } from '@/components/layout';
import { LoadingSpinner, StatCard } from '@/components/common';
import { useAuth, useMyRank, useReactionStats } from '@/hooks';
import { colors } from '@/theme';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const { data: myRank } = useMyRank();
  const { data: reactionStats } = useReactionStats();
  
  const [isEditing, setIsEditing] = React.useState(false);
  const [formData, setFormData] = React.useState({
    username: user?.username || '',
    email: user?.email || '',
  });
  
  const handleSave = () => {
    // TODO: Implement profile update
    setIsEditing(false);
  };
  
  const handleCancel = () => {
    setFormData({
      username: user?.username || '',
      email: user?.email || '',
    });
    setIsEditing(false);
  };
  
  if (!user) {
    return (
      <PageLayout title="个人资料">
        <LoadingSpinner message="加载用户信息..." />
      </PageLayout>
    );
  }
  
  return (
    <PageLayout
      title="个人资料"
      subtitle="管理你的账户信息"
      breadcrumbs={[{ label: '个人资料' }]}
    >
      <Grid container spacing={3}>
        {/* Profile header */}
        <Grid size={{ xs: 12 }}>
          <Card
            sx={{
              borderRadius: '24px',
              background: `linear-gradient(135deg, ${colors.primary}15 0%, ${colors.primary}05 100%)`,
              border: `2px solid ${colors.primary}20`,
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: { xs: 'wrap', sm: 'nowrap' } }}>
                <Avatar
                  sx={{
                    width: 100,
                    height: 100,
                    backgroundColor: colors.primary,
                    color: colors.onPrimary,
                    fontSize: '2.5rem',
                    fontWeight: 600,
                  }}
                >
                  {user.username.charAt(0).toUpperCase()}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: colors.onSurface, mb: 0.5 }}>
                    {user.username}
                  </Typography>
                  <Typography variant="body1" sx={{ color: colors.onSurfaceVariant, mb: 1 }}>
                    {user.email}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Chip
                      icon={<Science sx={{ fontSize: 16 }} />}
                      label={`${reactionStats?.total_reactions || 0} 次实验`}
                      size="small"
                      sx={{
                        borderRadius: '9999px',
                        backgroundColor: colors.primaryContainer,
                        color: colors.onPrimaryContainer,
                      }}
                    />
                    <Chip
                      icon={<EmojiEvents sx={{ fontSize: 16 }} />}
                      label={`${myRank?.award_count || 0} 个奖励`}
                      size="small"
                      sx={{
                        borderRadius: '9999px',
                        backgroundColor: colors.gold + '20',
                        color: colors.gold,
                      }}
                    />
                    <Chip
                      icon={<TrendingUp sx={{ fontSize: 16 }} />}
                      label={`排名 #${myRank?.rank || '-'}`}
                      size="small"
                      sx={{
                        borderRadius: '9999px',
                        backgroundColor: colors.successContainer,
                        color: colors.success,
                      }}
                    />
                  </Box>
                </Box>
                <Button
                  variant="outlined"
                  startIcon={isEditing ? <Cancel /> : <Edit />}
                  onClick={() => isEditing ? handleCancel() : setIsEditing(true)}
                  sx={{
                    borderRadius: '9999px',
                    textTransform: 'none',
                  }}
                >
                  {isEditing ? '取消' : '编辑'}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Stats */}
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="总反应次数"
            value={reactionStats?.total_reactions || 0}
            icon={<Science sx={{ fontSize: 24 }} />}
            color={colors.primary}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="发现次数"
            value={reactionStats?.total_discoveries || 0}
            icon={<TrendingUp sx={{ fontSize: 24 }} />}
            color={colors.tertiary}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="奖励数量"
            value={myRank?.award_count || 0}
            icon={<EmojiEvents sx={{ fontSize: 24 }} />}
            color={colors.gold}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="总积分"
            value={myRank?.total_points?.toLocaleString() || 0}
            icon={<TrendingUp sx={{ fontSize: 24 }} />}
            color={colors.success}
          />
        </Grid>
        
        {/* Account info */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <Card
            sx={{
              borderRadius: '24px',
              backgroundColor: colors.surfaceContainer,
              height: '100%',
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: colors.onSurface, mb: 3 }}>
                账户信息
              </Typography>
              
              {isEditing ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <TextField
                    fullWidth
                    label="用户名"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
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
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '16px',
                        backgroundColor: colors.surfaceContainerLow,
                      },
                    }}
                  />
                  <Button
                    variant="contained"
                    startIcon={<Save />}
                    onClick={handleSave}
                    sx={{
                      mt: 1,
                      borderRadius: '9999px',
                      textTransform: 'none',
                    }}
                  >
                    保存更改
                  </Button>
                </Box>
              ) : (
                <List>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon>
                      <Person sx={{ color: colors.primary }} />
                    </ListItemIcon>
                    <ListItemText
                      primary="用户名"
                      secondary={user.username}
                      primaryTypographyProps={{ color: colors.onSurfaceVariant }}
                      secondaryTypographyProps={{ color: colors.onSurface, fontWeight: 500 }}
                    />
                  </ListItem>
                  <Divider component="li" sx={{ borderColor: colors.outlineVariant }} />
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon>
                      <Email sx={{ color: colors.primary }} />
                    </ListItemIcon>
                    <ListItemText
                      primary="邮箱"
                      secondary={user.email}
                      primaryTypographyProps={{ color: colors.onSurfaceVariant }}
                      secondaryTypographyProps={{ color: colors.onSurface, fontWeight: 500 }}
                    />
                  </ListItem>
                  <Divider component="li" sx={{ borderColor: colors.outlineVariant }} />
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon>
                      <CalendarToday sx={{ color: colors.primary }} />
                    </ListItemIcon>
                    <ListItemText
                      primary="注册时间"
                      secondary={new Date(user.created_at).toLocaleDateString('zh-CN')}
                      primaryTypographyProps={{ color: colors.onSurfaceVariant }}
                      secondaryTypographyProps={{ color: colors.onSurface, fontWeight: 500 }}
                    />
                  </ListItem>
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>
        
        {/* Account status */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <Card
            sx={{
              borderRadius: '24px',
              backgroundColor: colors.surfaceContainer,
              height: '100%',
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: colors.onSurface, mb: 3 }}>
                账户状态
              </Typography>
              
              <List>
                <ListItem sx={{ px: 0 }}>
                  <ListItemText
                    primary="账户状态"
                    secondary={user.is_active ? '活跃' : '已禁用'}
                    primaryTypographyProps={{ color: colors.onSurfaceVariant }}
                    secondaryTypographyProps={{
                      color: user.is_active ? colors.success : colors.error,
                      fontWeight: 600,
                    }}
                  />
                  <Chip
                    label={user.is_active ? '正常' : '已禁用'}
                    size="small"
                    sx={{
                      borderRadius: '9999px',
                      backgroundColor: user.is_active ? colors.successContainer : colors.errorContainer,
                      color: user.is_active ? colors.success : colors.error,
                      fontWeight: 600,
                    }}
                  />
                </ListItem>
                <Divider component="li" sx={{ borderColor: colors.outlineVariant }} />
                <ListItem sx={{ px: 0 }}>
                  <ListItemText
                    primary="用户 ID"
                    secondary={user.id}
                    primaryTypographyProps={{ color: colors.onSurfaceVariant }}
                    secondaryTypographyProps={{ color: colors.onSurface, fontWeight: 500, fontFamily: 'monospace' }}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </PageLayout>
  );
};

export default ProfilePage;
