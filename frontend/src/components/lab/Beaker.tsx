import React from 'react';
import { Box, keyframes } from '@mui/material';
import { colors, environmentColors } from '@/theme';
import type { Environment, Effect } from '@/types';

interface BeakerProps {
  reactantCount: number;
  environment: Environment;
  isReacting?: boolean;
  effects?: Effect[];
  onDrop?: (e: React.DragEvent) => void;
}

const bubbleAnimation = keyframes`
  0% {
    transform: translateY(0) scale(1);
    opacity: 0.8;
  }
  100% {
    transform: translateY(-100px) scale(0.5);
    opacity: 0;
  }
`;

const glowAnimation = keyframes`
  0%, 100% {
    opacity: 0.5;
    filter: blur(20px);
  }
  50% {
    opacity: 0.8;
    filter: blur(30px);
  }
`;

const shakeAnimation = keyframes`
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
  20%, 40%, 60%, 80% { transform: translateX(2px); }
`;

export const Beaker: React.FC<BeakerProps> = ({
  reactantCount,
  environment,
  isReacting = false,
  effects = [],
  onDrop,
}) => {
  const envColor = environmentColors[environment] || colors.primary;
  const liquidHeight = Math.min(reactantCount * 15 + 20, 70);
  
  const hasLightEffect = effects.some((e) => e.effect_type === 'light_emission');
  const hasGasEffect = effects.some((e) => e.effect_type === 'gas_production');
  const hasFoamEffect = effects.some((e) => e.effect_type === 'foam_production');
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };
  
  return (
    <Box
      onDrop={onDrop}
      onDragOver={handleDragOver}
      sx={{
        position: 'relative',
        width: 200,
        height: 280,
        margin: '0 auto',
      }}
    >
      {/* Glow effect */}
      {(hasLightEffect || isReacting) && (
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 250,
            height: 250,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${envColor}60 0%, transparent 70%)`,
            animation: `${glowAnimation} 2s ease-in-out infinite`,
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />
      )}
      
      {/* Beaker SVG */}
      <Box
        component="svg"
        viewBox="0 0 200 280"
        sx={{
          width: '100%',
          height: '100%',
          filter: isReacting ? `drop-shadow(0 0 20px ${envColor}80)` : 'none',
          transition: 'filter 0.5s ease',
          animation: isReacting ? `${shakeAnimation} 0.5s ease-in-out` : 'none',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Beaker outline */}
        <defs>
          <clipPath id="beakerClip">
            <path d="M40 40 L40 220 Q40 260 80 260 L120 260 Q160 260 160 220 L160 40" />
          </clipPath>
          <linearGradient id="liquidGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={envColor} stopOpacity="0.8" />
            <stop offset="100%" stopColor={envColor} stopOpacity="0.4" />
          </linearGradient>
        </defs>
        
        {/* Glass body */}
        <path
          d="M40 40 L40 220 Q40 260 80 260 L120 260 Q160 260 160 220 L160 40"
          fill="none"
          stroke={colors.outline}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Rim */}
        <ellipse
          cx="100"
          cy="40"
          rx="62"
          ry="12"
          fill="none"
          stroke={colors.outline}
          strokeWidth="3"
        />
        
        {/* Liquid */}
        {reactantCount > 0 && (
          <g clipPath="url(#beakerClip)">
            <rect
              x="40"
              y={260 - liquidHeight * 2.4}
              width="120"
              height={liquidHeight * 2.4}
              fill="url(#liquidGradient)"
            />
            {/* Liquid surface */}
            <ellipse
              cx="100"
              cy={260 - liquidHeight * 2.4}
              rx="58"
              ry="10"
              fill={envColor}
              fillOpacity="0.6"
            />
          </g>
        )}
        
        {/* Measurement lines */}
        {[100, 140, 180, 220].map((y) => (
          <line
            key={y}
            x1="50"
            y1={y}
            x2="70"
            y2={y}
            stroke={colors.outlineVariant}
            strokeWidth="2"
            strokeLinecap="round"
          />
        ))}
      </Box>
      
      {/* Bubbles */}
      {hasGasEffect && (
        <Box
          sx={{
            position: 'absolute',
            bottom: 60,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 100,
            height: 150,
            pointerEvents: 'none',
            zIndex: 2,
          }}
        >
          {[...Array(8)].map((_, index) => (
            <Box
              key={index}
              sx={{
                position: 'absolute',
                width: 8 + Math.random() * 8,
                height: 8 + Math.random() * 8,
                borderRadius: '50%',
                backgroundColor: `${envColor}60`,
                left: `${20 + Math.random() * 60}%`,
                bottom: 0,
                animation: `${bubbleAnimation} ${1.5 + Math.random()}s ease-in infinite`,
                animationDelay: `${Math.random() * 1.5}s`,
              }}
            />
          ))}
        </Box>
      )}
      
      {/* Foam */}
      {hasFoamEffect && (
        <Box
          sx={{
            position: 'absolute',
            bottom: 60 + liquidHeight * 0.8,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 110,
            height: 30,
            background: `radial-gradient(ellipse at center, ${envColor}80 0%, ${envColor}40 50%, transparent 100%)`,
            borderRadius: '50%',
            pointerEvents: 'none',
            zIndex: 2,
          }}
        />
      )}
      
      {/* Drop zone indicator */}
      {reactantCount === 0 && (
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            pointerEvents: 'none',
            zIndex: 3,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: colors.onSurfaceVariant,
              fontWeight: 500,
            }}
          >
            拖放化学品到此处
          </Typography>
        </Box>
      )}
    </Box>
  );
};

// Need to import Typography for the drop zone text
import { Typography } from '@mui/material';
