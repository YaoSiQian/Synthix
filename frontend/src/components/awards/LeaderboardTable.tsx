import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Typography,
  Box,
  Chip,
} from '@mui/material';
import { EmojiEvents, MilitaryTech } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { colors, tierColors } from '@/theme';
import type { LeaderboardEntrySchema } from '@/types';

interface LeaderboardTableProps {
  entries: LeaderboardEntrySchema[];
  highlightUserId?: number;
}

const rankColors: Record<number, string> = {
  1: tierColors[3], // Gold
  2: tierColors[2], // Silver
  3: tierColors[1], // Bronze
};

const rankIcons: Record<number, React.ReactNode> = {
  1: <MilitaryTech sx={{ color: rankColors[1], fontSize: 28 }} />,
  2: <MilitaryTech sx={{ color: rankColors[2], fontSize: 24 }} />,
  3: <MilitaryTech sx={{ color: rankColors[3], fontSize: 20 }} />,
};

export const LeaderboardTable: React.FC<LeaderboardTableProps> = ({
  entries,
  highlightUserId,
}) => {
  const { t } = useTranslation();
  
  return (
    <TableContainer
      component={Paper}
      sx={{
        borderRadius: '24px',
        backgroundColor: colors.surfaceContainer,
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        overflow: 'hidden',
      }}
    >
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: colors.surfaceContainerHigh }}>
            <TableCell sx={{ fontWeight: 600, color: colors.onSurface, width: 80 }}>{t('leaderboard.rank')}</TableCell>
            <TableCell sx={{ fontWeight: 600, color: colors.onSurface }}>{t('leaderboard.user')}</TableCell>
            <TableCell sx={{ fontWeight: 600, color: colors.onSurface, textAlign: 'center' }}>
              {t('leaderboard.awards')}
            </TableCell>
            <TableCell sx={{ fontWeight: 600, color: colors.onSurface, textAlign: 'right' }}>
              {t('leaderboard.points')}
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {entries.map((entry) => {
            const isHighlighted = entry.user_id === highlightUserId;
            const isTop3 = entry.rank <= 3;
            
            return (
              <TableRow
                key={entry.user_id}
                sx={{
                  backgroundColor: isHighlighted ? `${colors.primary}08` : 'inherit',
                  '&:hover': {
                    backgroundColor: isHighlighted ? `${colors.primary}12` : `${colors.primary}04`,
                  },
                  transition: 'background-color 200ms ease',
                }}
              >
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {isTop3 ? (
                      rankIcons[entry.rank]
                    ) : (
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: 600,
                          color: colors.onSurfaceVariant,
                          width: 28,
                          textAlign: 'center',
                        }}
                      >
                        {entry.rank}
                      </Typography>
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar
                      sx={{
                        width: 40,
                        height: 40,
                        backgroundColor: isHighlighted ? colors.primary : colors.secondaryContainer,
                        color: isHighlighted ? colors.onPrimary : colors.onSecondaryContainer,
                        fontWeight: 600,
                      }}
                    >
                      {entry.username.charAt(0).toUpperCase()}
                    </Avatar>
                    <Box>
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: isHighlighted ? 600 : 500,
                          color: colors.onSurface,
                        }}
                      >
                        {entry.username}
                      </Typography>
                      {isHighlighted && (
                        <Chip
                          label="你"
                          size="small"
                          sx={{
                            height: 18,
                            fontSize: '0.625rem',
                            borderRadius: '9999px',
                            backgroundColor: colors.primary,
                            color: colors.onPrimary,
                            fontWeight: 600,
                          }}
                        />
                      )}
                    </Box>
                  </Box>
                </TableCell>
                <TableCell align="center">
                  <Box
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 0.5,
                      px: 2,
                      py: 0.5,
                      borderRadius: '9999px',
                      backgroundColor: colors.secondaryContainer,
                      color: colors.onSecondaryContainer,
                    }}
                  >
                    <EmojiEvents sx={{ fontSize: 16 }} />
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {entry.award_count}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell align="right">
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: 700,
                      color: isTop3 ? rankColors[entry.rank] : colors.primary,
                    }}
                  >
                    {entry.total_points.toLocaleString()}
                  </Typography>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
