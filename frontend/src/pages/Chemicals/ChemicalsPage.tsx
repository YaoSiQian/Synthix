import React from 'react';
import {
  Box,
  Grid,
  Typography,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
  Pagination,
  Chip,
} from '@mui/material';
import { Search, Science } from '@mui/icons-material';
import { PageLayout } from '@/components/layout';
import { ChemicalCard } from '@/components/lab';
import { LoadingSpinner, EmptyState } from '@/components/common';
import { useChemicals, useChemicalSearch } from '@/hooks';
import { colors } from '@/theme';

const stateFilters = [
  { value: 'all', label: '全部', icon: '⚗️' },
  { value: 'solid', label: '固体', icon: '⬛' },
  { value: 'liquid', label: '液体', icon: '💧' },
  { value: 'gas', label: '气体', icon: '💨' },
  { value: 'plasma', label: '等离子体', icon: '⚡' },
];

const ChemicalsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [stateFilter, setStateFilter] = React.useState('all');
  const [page, setPage] = React.useState(1);
  const itemsPerPage = 12;
  
  const { data: chemicalsData, isLoading } = useChemicals();
  const { data: searchResults, isLoading: searchLoading } = useChemicalSearch(searchQuery);
  
  const chemicals = chemicalsData?.results || [];
  
  // Filter chemicals
  const filteredChemicals = React.useMemo(() => {
    let result = searchQuery && searchResults ? searchResults : chemicals;
    
    if (stateFilter !== 'all') {
      result = result.filter((c) => c.state_of_matter === stateFilter);
    }
    
    return result;
  }, [chemicals, searchResults, searchQuery, stateFilter]);
  
  // Pagination
  const totalPages = Math.ceil(filteredChemicals.length / itemsPerPage);
  const paginatedChemicals = filteredChemicals.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setPage(1);
  };
  
  const handleStateFilterChange = (_: React.SyntheticEvent, newValue: string) => {
    setStateFilter(newValue);
    setPage(1);
  };
  
  return (
    <PageLayout
      title="化学品库"
      subtitle="浏览和管理你的化学品收藏"
      breadcrumbs={[{ label: '化学品库' }]}
    >
      {/* Search and filters */}
      <Box sx={{ mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              placeholder="搜索化学品 (分子式或名称)..."
              value={searchQuery}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: colors.onSurfaceVariant }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '9999px',
                  backgroundColor: colors.surfaceContainer,
                },
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Tabs
              value={stateFilter}
              onChange={handleStateFilterChange}
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
              {stateFilters.map((filter) => (
                <Tab
                  key={filter.value}
                  value={filter.value}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <span>{filter.icon}</span>
                      <span>{filter.label}</span>
                    </Box>
                  }
                  sx={{
                    textTransform: 'none',
                    borderRadius: '9999px',
                    minHeight: '40px',
                    px: 2,
                    color: colors.onSurfaceVariant,
                    '&.Mui-selected': {
                      color: colors.onPrimaryContainer,
                      backgroundColor: colors.primaryContainer,
                    },
                  }}
                />
              ))}
            </Tabs>
          </Grid>
        </Grid>
      </Box>
      
      {/* Results count */}
      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="body2" sx={{ color: colors.onSurfaceVariant }}>
          共 {filteredChemicals.length} 种化学品
        </Typography>
        {searchQuery && (
          <Chip
            label={`搜索: "${searchQuery}"`}
            size="small"
            onDelete={() => setSearchQuery('')}
            sx={{
              borderRadius: '9999px',
              backgroundColor: colors.primaryContainer,
              color: colors.onPrimaryContainer,
            }}
          />
        )}
        {stateFilter !== 'all' && (
          <Chip
            label={`状态: ${stateFilters.find((f) => f.value === stateFilter)?.label}`}
            size="small"
            onDelete={() => setStateFilter('all')}
            sx={{
              borderRadius: '9999px',
              backgroundColor: colors.secondaryContainer,
              color: colors.onSecondaryContainer,
            }}
          />
        )}
      </Box>
      
      {/* Chemicals grid */}
      {isLoading || searchLoading ? (
        <LoadingSpinner message="加载化学品..." />
      ) : paginatedChemicals.length === 0 ? (
        <EmptyState
          title="未找到化学品"
          message={searchQuery ? '尝试使用其他关键词搜索' : '化学品库为空，请添加一些化学品'}
          icon={<Science sx={{ fontSize: 64, color: colors.onSurfaceVariant }} />}
          actionLabel="去实验室添加"
          onAction={() => window.location.href = '/lab'}
        />
      ) : (
        <>
          <Grid container spacing={2}>
            {paginatedChemicals.map((chemical) => (
              <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={chemical.id}>
                <ChemicalCard chemical={chemical} showActions={false} />
              </Grid>
            ))}
          </Grid>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(_, value) => setPage(value)}
                color="primary"
                shape="rounded"
                sx={{
                  '& .MuiPaginationItem-root': {
                    borderRadius: '12px',
                  },
                }}
              />
            </Box>
          )}
        </>
      )}
    </PageLayout>
  );
};

export default ChemicalsPage;
