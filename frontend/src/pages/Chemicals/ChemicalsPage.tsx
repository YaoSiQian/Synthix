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
import { useTranslation } from 'react-i18next';
import { PageLayout } from '@/components/layout';
import { ChemicalCard } from '@/components/lab';
import { LoadingSpinner, EmptyState } from '@/components/common';
import { useChemicals, useChemicalSearch } from '@/hooks';
import { colors } from '@/theme';

const stateFilters = [
  { value: 'all', labelKey: 'common.all', icon: '⚗️' },
  { value: 'solid', labelKey: 'chemicals.solid', icon: '⬛' },
  { value: 'liquid', labelKey: 'chemicals.liquid', icon: '💧' },
  { value: 'gas', labelKey: 'chemicals.gas', icon: '💨' },
  { value: 'plasma', labelKey: 'chemicals.plasma', icon: '⚡' },
];

const ChemicalsPage: React.FC = () => {
  const { t } = useTranslation();
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
      title={t('chemicals.title')}
      subtitle={t('chemicals.search')}
      breadcrumbs={[{ label: t('chemicals.title') }]}
    >
      {/* Search and filters */}
      <Box sx={{ mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              placeholder={t('chemicals.search')}
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
                      <span>{t(filter.labelKey)}</span>
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
          {t('common.showing')} {filteredChemicals.length} {t('chemicals.title')}
        </Typography>
        {searchQuery && (
          <Chip
            label={`${t('common.search')}: "${searchQuery}"`}
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
            label={`${t('common.filter')}: ${t(stateFilters.find((f) => f.value === stateFilter)?.labelKey || '')}`}
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
        <LoadingSpinner message={t('common.loading')} />
      ) : paginatedChemicals.length === 0 ? (
        <EmptyState
          title={t('chemicals.noResults')}
          message={searchQuery ? t('chemicals.noResults') : t('chemicals.noResults')}
          icon={<Science sx={{ fontSize: 64, color: colors.onSurfaceVariant }} />}
          actionLabel={t('nav.lab')}
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
