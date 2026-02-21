import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  SvgIconTypeMap,
  alpha 
} from '@mui/material';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import { motion } from 'framer-motion';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactElement;
  color: string;
  onClick?: () => void;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  change, 
  icon, 
  color,
  onClick 
}) => {
  const isPositive = change !== undefined && change >= 0;

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card
        onClick={onClick}
        sx={{
          height: '100%',
          borderRadius: 3,
          backgroundColor: alpha(color, 0.1),
          border: `2px solid ${alpha(color, 0.3)}`,
          cursor: onClick ? 'pointer' : 'default',
          transition: 'all 0.3s ease',
          '&:hover': {
            borderColor: alpha(color, 0.5),
            backgroundColor: alpha(color, 0.15),
            transform: 'translateY(-2px)',
            boxShadow: `0 8px 32px ${alpha(color, 0.2)}`
          }
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Box
              sx={{
                width: 50,
                height: 50,
                borderRadius: '12px',
                backgroundColor: alpha(color, 0.2),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: `2px solid ${alpha(color, 0.3)}`
              }}
            >
              {React.cloneElement(icon, { 
                sx: { fontSize: 28, color: color } 
              })}
            </Box>
            
            {change !== undefined && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  px: 1.5,
                  py: 0.5,
                  borderRadius: '20px',
                  backgroundColor: isPositive 
                    ? alpha('#4CAF50', 0.2) 
                    : alpha('#F44336', 0.2),
                  border: `1px solid ${isPositive ? '#4CAF50' : '#F44336'}`,
                }}
              >
                {isPositive ? (
                  <TrendingUpIcon sx={{ fontSize: 16, color: '#4CAF50' }} />
                ) : (
                  <TrendingDownIcon sx={{ fontSize: 16, color: '#F44336' }} />
                )}
                <Typography
                  sx={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: isPositive ? '#4CAF50' : '#F44336',
                    fontFamily: '"Nobile", sans-serif'
                  }}
                >
                  {isPositive ? '+' : ''}{change.toFixed(1)}%
                </Typography>
              </Box>
            )}
          </Box>
          
          <Typography
            variant="h3"
            sx={{
              fontSize: { xs: '1.75rem', sm: '2rem' },
              fontWeight: 700,
              color: color,
              mb: 0.5,
              fontFamily: '"McLaren", cursive'
            }}
          >
            {typeof value === 'number' ? value.toLocaleString() : value}
          </Typography>
          
          <Typography
            sx={{
              color: '#560D30',
              fontSize: '0.875rem',
              fontFamily: '"Nobile", sans-serif',
              opacity: 0.8
            }}
          >
            {title}
          </Typography>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StatCard;