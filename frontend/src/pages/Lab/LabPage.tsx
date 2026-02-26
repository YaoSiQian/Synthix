import React from 'react';
import {
  Box,
  Grid,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Add,
  PlayArrow,
  Science,
  Refresh,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { PageLayout } from '@/components/layout';
import { ChemicalCard, EnvironmentSelector, Beaker, ReactionResult } from '@/components/lab';
import { LoadingSpinner, EmptyState } from '@/components/common';
import { useLabStore, useUIStore } from '@/store';
import { useChemicals, useCreateChemical, useRunReaction } from '@/hooks';
import { colors } from '@/theme';
import type { ChemicalRead, Environment } from '@/types';

const LabPage: React.FC = () => {
  const { t } = useTranslation();
  const {
    reactants,
    addReactant,
    removeReactant,
    clearReactants,
    selectedEnvironment,
    setEnvironment,
    selectedCatalyst,
    setCatalyst,
    benchProducts,
    lastReaction,
    isReacting,
  } = useLabStore();
  
  const { data: chemicalsData, isLoading: chemicalsLoading } = useChemicals();
  const createChemicalMutation = useCreateChemical();
  const runReactionMutation = useRunReaction();
  const addNotification = useUIStore((s) => s.addNotification);
  
  const [newFormula, setNewFormula] = React.useState('');
  const [newContext, setNewContext] = React.useState('');
  
  const chemicals = chemicalsData?.results || [];
  
  const handleAddChemical = () => {
    if (!newFormula.trim()) {
      addNotification({
        type: 'error',
        title: t('notifications.inputError'),
        message: t('notifications.enterFormula'),
      });
      return;
    }
    
    createChemicalMutation.mutate(
      { molecular_formula: newFormula, context: newContext || undefined },
      {
        onSuccess: () => {
          setNewFormula('');
          setNewContext('');
        },
      }
    );
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const chemicalData = e.dataTransfer.getData('chemical');
    if (chemicalData) {
      try {
        const chemical: ChemicalRead = JSON.parse(chemicalData);
        addReactant(chemical);
        addNotification({
          type: 'success',
          title: t('notifications.addSuccess'),
          message: t('notifications.chemicalAdded', { formula: chemical.molecular_formula }),
        });
      } catch (err) {
        console.error('Failed to parse chemical data:', err);
      }
    }
  };
  
  const handleRunReaction = () => {
    if (reactants.length === 0) {
      addNotification({
        type: 'error',
        title: t('notifications.cannotStart'),
        message: t('notifications.addReactantsFirst'),
      });
      return;
    }
    
    runReactionMutation.mutate({
      reactants: reactants.map((r) => ({ chemical_id: r.id, quantity: 1.0 })),
      environment: selectedEnvironment,
      catalyst_id: selectedCatalyst,
    });
  };
  
  const handleAddFromBench = (product: typeof benchProducts[0]) => {
    // Find or create chemical for the product
    const existingChemical = chemicals.find((c) => c.molecular_formula === product.molecular_formula);
    if (existingChemical) {
      addReactant(existingChemical);
    } else {
      addNotification({
        type: 'info',
        title: t('notifications.addSuccess'),
        message: t('notifications.chemicalAdded', { formula: product.molecular_formula }),
      });
    }
  };
  
  return (
    <PageLayout title={t('lab.title')} subtitle={t('lab.selectChemical')}>
      <Grid container spacing={3}>
        {/* Left side - Lab operations */}
        <Grid size={{ xs: 12, lg: 8 }}>
          {/* Quick add chemical */}
          <Card
            sx={{
              borderRadius: '24px',
              backgroundColor: colors.surfaceContainer,
              mb: 3,
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: colors.onSurface, mb: 2 }}>
                {t('lab.addReactant')}
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: { xs: 'wrap', sm: 'nowrap' } }}>
                <TextField
                  label={t('lab.molecularFormula')}
                  placeholder="H2O, NaCl, C6H12O6"
                  value={newFormula}
                  onChange={(e) => setNewFormula(e.target.value)}
                  sx={{
                    flex: 1,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '16px',
                      backgroundColor: colors.surfaceContainerLow,
                    },
                  }}
                />
                <TextField
                  label={t('lab.context')}
                  placeholder="NaCl, Vitamin C"
                  value={newContext}
                  onChange={(e) => setNewContext(e.target.value)}
                  sx={{
                    flex: 1,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '16px',
                      backgroundColor: colors.surfaceContainerLow,
                    },
                  }}
                />
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={handleAddChemical}
                  disabled={createChemicalMutation.isPending}
                  sx={{
                    borderRadius: '9999px',
                    px: 3,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {t('lab.add')}
                </Button>
              </Box>
            </CardContent>
          </Card>
          
          {/* Environment selector */}
          <Card
            sx={{
              borderRadius: '24px',
              backgroundColor: colors.surfaceContainer,
              mb: 3,
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <EnvironmentSelector
                value={selectedEnvironment}
                onChange={(env) => setEnvironment(env as Environment)}
                disabled={isReacting}
              />
            </CardContent>
          </Card>
          
          {/* Reaction area */}
          <Card
            sx={{
              borderRadius: '24px',
              backgroundColor: colors.surfaceContainer,
              mb: 3,
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: colors.onSurface }}>
                  {t('lab.reactants')}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<Refresh />}
                    onClick={clearReactants}
                    disabled={reactants.length === 0 || isReacting}
                    sx={{ borderRadius: '9999px', textTransform: 'none' }}
                  >
                    {t('lab.clear')}
                  </Button>
                </Box>
              </Box>
              
              {/* Beaker */}
              <Box sx={{ mb: 3 }}>
                <Beaker
                  reactantCount={reactants.length}
                  environment={selectedEnvironment}
                  isReacting={isReacting}
                  effects={lastReaction?.effects || []}
                  onDrop={handleDrop}
                />
              </Box>
              
              {/* Reactants list */}
              {reactants.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: colors.onSurface, mb: 1.5 }}>
                    {t('lab.reactants')}
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {reactants.map((reactant) => (
                      <Chip
                        key={reactant.id}
                        label={reactant.molecular_formula}
                        onDelete={() => removeReactant(reactant.id)}
                        sx={{
                          borderRadius: '9999px',
                          backgroundColor: colors.primaryContainer,
                          color: colors.onPrimaryContainer,
                          fontWeight: 500,
                          '& .MuiChip-deleteIcon': {
                            color: colors.onPrimaryContainer,
                          },
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              )}
              
              {/* Catalyst selector */}
              <Box sx={{ mb: 3 }}>
                <FormControl fullWidth>
                  <InputLabel>{t('lab.catalyst')}</InputLabel>
                  <Select
                    value={selectedCatalyst || ''}
                    onChange={(e) => setCatalyst(e.target.value ? Number(e.target.value) : null)}
                    disabled={isReacting}
                    sx={{
                      borderRadius: '16px',
                      backgroundColor: colors.surfaceContainerLow,
                    }}
                  >
                    <MenuItem value="">{t('lab.none')}</MenuItem>
                    {chemicals.map((c) => (
                      <MenuItem key={c.id} value={c.id}>
                        {c.molecular_formula} ({c.common_name})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              
              {/* Run reaction button */}
              <Button
                fullWidth
                variant="contained"
                size="large"
                startIcon={<PlayArrow />}
                onClick={handleRunReaction}
                disabled={reactants.length === 0 || isReacting}
                sx={{
                  py: 1.5,
                  borderRadius: '9999px',
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  backgroundColor: colors.primary,
                  '&:hover': {
                    backgroundColor: `${colors.primary}E6`,
                    boxShadow: '0 4px 12px rgba(103, 80, 164, 0.4)',
                  },
                }}
              >
                {isReacting ? t('lab.running') : t('lab.runReaction')}
              </Button>
            </CardContent>
          </Card>
          
          {/* Reaction result */}
          {lastReaction && <ReactionResult result={lastReaction} />}
        </Grid>
        
        {/* Right side - Info panel */}
        <Grid size={{ xs: 12, lg: 4 }}>
          {/* Chemical inventory */}
          <Card
            sx={{
              borderRadius: '24px',
              backgroundColor: colors.surfaceContainer,
              mb: 3,
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: colors.onSurface, mb: 2 }}>
                {t('chemicals.title')}
              </Typography>
              
              {chemicalsLoading ? (
                <LoadingSpinner size={32} message={t('common.loading')} />
              ) : chemicals.length === 0 ? (
                <EmptyState
                  title={t('chemicals.noResults')}
                  message={t('lab.addReactant')}
                  icon={<Science sx={{ fontSize: 48, color: colors.onSurfaceVariant }} />}
                />
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {chemicals.map((chemical) => (
                    <ChemicalCard
                      key={chemical.id}
                      chemical={chemical}
                      draggable
                      onAdd={addReactant}
                      compact
                    />
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
          
          {/* Bench products */}
          {benchProducts.length > 0 && (
            <Card
              sx={{
                borderRadius: '24px',
                backgroundColor: colors.surfaceContainer,
                mb: 3,
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: colors.onSurface, mb: 2 }}>
                  {t('lab.products')}
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {benchProducts.map((product, index) => (
                    <Card
                      key={index}
                      sx={{
                        borderRadius: '16px',
                        backgroundColor: colors.surfaceContainerLow,
                      }}
                    >
                      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Box>
                            <Typography
                              variant="body1"
                              sx={{ fontFamily: 'monospace', fontWeight: 600, color: colors.onSurface }}
                            >
                              {product.molecular_formula}
                            </Typography>
                            <Typography variant="caption" sx={{ color: colors.onSurfaceVariant }}>
                              {product.quantity.toFixed(2)} mol
                            </Typography>
                          </Box>
                          <Button
                            size="small"
                            startIcon={<Add />}
                            onClick={() => handleAddFromBench(product)}
                            sx={{ borderRadius: '9999px', textTransform: 'none' }}
                          >
                            {t('lab.add')}
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </PageLayout>
  );
};

export default LabPage;
