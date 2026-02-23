import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Button,
  Collapse,
  IconButton,
} from '@mui/material';
import {
  ExpandMore,
  ExpandLess,
  Science,
  Whatshot,
  Opacity,
  Lightbulb,
  Cloud,
  Waves,
  OpenWith,
  Texture,
  Add,
} from '@mui/icons-material';
import { colors } from '@/theme';
import { useLabStore } from '@/store';
import type { ReactionPrediction, Effect } from '@/types';

interface ReactionResultProps {
  result: ReactionPrediction;
}

const effectIcons: Record<string, React.ReactNode> = {
  gas_production: <Cloud />,
  light_emission: <Lightbulb />,
  temperature_change: <Whatshot />,
  foam_production: <Waves />,
  state_change: <Science />,
  volume_change: <OpenWith />,
  spill: <Opacity />,
  texture_change: <Texture />,
};

const EffectCard: React.FC<{ effect: Effect }> = ({ effect }) => {
  const getEffectDetails = () => {
    switch (effect.effect_type) {
      case 'gas_production':
        return {
          title: '气体产生',
          subtitle: effect.gas_type,
          detail: `强度: ${(effect.intensity * 100).toFixed(0)}% · 持续: ${effect.duration}s`,
          color: effect.color,
        };
      case 'light_emission':
        return {
          title: '光发射',
          subtitle: '发光现象',
          detail: `强度: ${(effect.intensity * 100).toFixed(0)}% · 半径: ${effect.radius}m`,
          color: effect.color,
        };
      case 'temperature_change':
        return {
          title: '温度变化',
          subtitle: effect.delta_celsius > 0 ? '放热反应' : '吸热反应',
          detail: `变化: ${effect.delta_celsius > 0 ? '+' : ''}${effect.delta_celsius}°C`,
          color: effect.delta_celsius > 0 ? '#ef4444' : '#3b82f6',
        };
      case 'foam_production':
        return {
          title: '泡沫产生',
          subtitle: `${effect.bubble_size}气泡`,
          detail: `密度: ${(effect.density * 100).toFixed(0)}% · 稳定: ${effect.stability}s`,
          color: effect.color,
        };
      case 'state_change':
        return {
          title: '状态变化',
          subtitle: '物态转变',
          detail: `最终状态: ${effect.final_state}`,
          color: colors.primary,
        };
      case 'volume_change':
        return {
          title: '体积变化',
          subtitle: effect.factor > 1 ? '膨胀' : '收缩',
          detail: `变化倍数: ${effect.factor.toFixed(2)}x`,
          color: effect.factor > 1 ? '#22c55e' : '#f59e0b',
        };
      case 'spill':
        return {
          title: '溢出',
          subtitle: '液体溢出',
          detail: `溢出量: ${(effect.amount_percentage * 100).toFixed(0)}% · 扩散: ${effect.spread_radius}m`,
          color: '#ef4444',
        };
      case 'texture_change':
        return {
          title: '质地变化',
          subtitle: effect.texture_type,
          detail: `粘度: ${(effect.viscosity * 100).toFixed(0)}%`,
          color: effect.color,
        };
      default:
        return {
          title: '未知效果',
          subtitle: '',
          detail: '',
          color: colors.onSurfaceVariant,
        };
    }
  };
  
  const details = getEffectDetails();
  
  return (
    <Card
      sx={{
        borderRadius: '16px',
        backgroundColor: `${details.color}10`,
        border: `1px solid ${details.color}30`,
      }}
    >
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '12px',
              backgroundColor: `${details.color}20`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: details.color,
            }}
          >
            {effectIcons[effect.effect_type] || <Science />}
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: colors.onSurface }}>
              {details.title}
            </Typography>
            <Typography variant="caption" sx={{ color: colors.onSurfaceVariant }}>
              {details.subtitle}
            </Typography>
          </Box>
        </Box>
        <Typography
          variant="caption"
          sx={{
            color: colors.onSurfaceVariant,
            mt: 1,
            display: 'block',
          }}
        >
          {details.detail}
        </Typography>
      </CardContent>
    </Card>
  );
};

export const ReactionResult: React.FC<ReactionResultProps> = ({ result }) => {
  const [expanded, setExpanded] = React.useState(true);
  const addBenchProduct = useLabStore((s) => s.addBenchProduct);
  
  return (
    <Box sx={{ mt: 3 }}>
      {/* World first badge */}
      {result.is_world_first && (
        <Box
          sx={{
            mb: 3,
            p: 2,
            borderRadius: '16px',
            background: `linear-gradient(135deg, ${colors.gold}30 0%, ${colors.gold}10 100%)`,
            border: `2px solid ${colors.gold}`,
            textAlign: 'center',
          }}
        >
          <Typography variant="h5" sx={{ color: colors.gold, fontWeight: 700, mb: 0.5 }}>
            🎉 世界首次发现！
          </Typography>
          <Typography variant="body2" sx={{ color: colors.onSurfaceVariant }}>
            你是第一个发现这个反应的人
          </Typography>
        </Box>
      )}
      
      {/* Result header */}
      <Card
        sx={{
          borderRadius: '24px',
          backgroundColor: colors.surfaceContainer,
          mb: 2,
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
            }}
            onClick={() => setExpanded(!expanded)}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '16px',
                  backgroundColor: colors.primaryContainer,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: colors.primary,
                }}
              >
                <Science />
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, color: colors.onSurface }}>
                  反应结果
                </Typography>
                <Typography variant="body2" sx={{ color: colors.onSurfaceVariant }}>
                  {result.products.length} 种产物 · {result.effects.length} 种效果
                </Typography>
              </Box>
            </Box>
            <IconButton>
              {expanded ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </Box>
          
          <Collapse in={expanded}>
            {/* Explanation */}
            <Box sx={{ mt: 3, p: 2, backgroundColor: colors.surfaceContainerLow, borderRadius: '16px' }}>
              <Typography variant="body2" sx={{ color: colors.onSurface }}>
                {result.explanation}
              </Typography>
            </Box>
            
            {/* Products */}
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, color: colors.onSurface, mb: 2 }}>
                产物
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {result.products.map((product, index) => (
                  <Card
                    key={index}
                    sx={{
                      borderRadius: '16px',
                      backgroundColor: colors.surfaceContainerLow,
                    }}
                  >
                    <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Typography variant="h6" sx={{ fontFamily: 'monospace', color: colors.onSurface }}>
                            {product.molecular_formula}
                          </Typography>
                          <Chip
                            label={`${product.quantity.toFixed(2)} mol`}
                            size="small"
                            sx={{
                              borderRadius: '9999px',
                              backgroundColor: colors.secondaryContainer,
                              color: colors.onSecondaryContainer,
                            }}
                          />
                          {product.is_soluble && (
                            <Chip
                              label="可溶"
                              size="small"
                              sx={{
                                borderRadius: '9999px',
                                backgroundColor: colors.successContainer,
                                color: colors.onSuccessContainer,
                              }}
                            />
                          )}
                        </Box>
                        <Button
                          size="small"
                          startIcon={<Add />}
                          onClick={() => addBenchProduct(product)}
                          sx={{
                            borderRadius: '9999px',
                            textTransform: 'none',
                          }}
                        >
                          添加到实验台
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </Box>
            
            {/* Effects */}
            {result.effects.length > 0 && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: colors.onSurface, mb: 2 }}>
                  实验现象
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 1.5 }}>
                  {result.effects.map((effect, index) => (
                    <EffectCard key={index} effect={effect} />
                  ))}
                </Box>
              </Box>
            )}
          </Collapse>
        </CardContent>
      </Card>
    </Box>
  );
};
