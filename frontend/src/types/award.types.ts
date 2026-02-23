// Award Types

export type AwardCategory =
  | 'discovery'
  | 'database_contribution'
  | 'community'
  | 'special'
  | 'achievement';

export interface AwardTemplateSchema {
  id: number;
  name: string;
  description: string;
  category: AwardCategory;
  metadata: Record<string, unknown>;
}

export interface UserAwardSchema {
  id: number;
  user_id: number;
  template_id: number;
  tier: number; // 1=Bronze, 2=Silver, 3=Gold
  progress: Record<string, unknown>;
  granted_at: string; // ISO datetime
  related_entity_type?: string | null;
  related_entity_id?: number | null;
  template: AwardTemplateSchema;
}

export interface AvailableAwardSchema {
  template_id: number;
  name: string;
  description: string;
  category: AwardCategory;
  metadata: Record<string, unknown>;
  progress: Record<string, unknown> & { current?: number; target?: number; percentage?: number };
}

export interface LeaderboardEntrySchema {
  rank: number;
  user_id: number;
  username: string;
  award_count: number;
  total_points: number;
}

export interface UserRankSchema {
  rank: number | null;
  user_id: number;
  username: string;
  award_count: number;
  total_points: number;
  category?: string | null;
}

export interface DashboardStatsSchema {
  user_id: number;
  username: string;
  dashboard_stats: Record<string, unknown>;
}

export interface RecentAwardsSchema {
  user_id: number;
  recent_awards: UserAwardSchema[];
  days_back: number;
  total_count: number;
}

export interface RecentAchievementsSchema {
  achievements: Array<{
    user_id: number;
    username: string;
    award_name: string;
    award_tier: number;
    granted_at: string;
  }>;
  generated_at: string;
}

export interface CommunityStatisticsSchema {
  category_statistics: Record<string, {
    total_awards: number;
    total_users: number;
    top_category: string;
  }>;
  generated_at: string;
}

export const awardCategoryLabels: Record<AwardCategory, string> = {
  discovery: '发现',
  database_contribution: '数据库贡献',
  community: '社区',
  special: '特殊',
  achievement: '成就',
};

export const tierColors: Record<number, string> = {
  1: '#cd7f32', // Bronze
  2: '#c0c0c0', // Silver
  3: '#ffd700', // Gold
};

export const tierLabels: Record<number, string> = {
  1: '青铜',
  2: '白银',
  3: '黄金',
};
