import React from 'react';
import { Box, Button, Tooltip, Badge } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import SettingsIcon from '@mui/icons-material/Settings';

interface QuickActionsProps {
  onAction: (action: string) => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({ onAction }) => {
  return (
    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
      <Tooltip title="Refresh Dashboard">
        <Button
          variant="outlined"
          size="small"
          startIcon={<RefreshIcon />}
          onClick={() => onAction('refresh')}
          sx={{
            borderColor: '#EC2EA6',
            color: '#EC2EA6',
            '&:hover': {
              borderColor: '#F056B7',
              backgroundColor: 'rgba(236, 46, 166, 0.05)'
            }
          }}
        >
          Refresh
        </Button>
      </Tooltip>

      <Tooltip title="Export Report">
        <Button
          variant="outlined"
          size="small"
          startIcon={<DownloadIcon />}
          onClick={() => onAction('export')}
          sx={{
            borderColor: '#4CAF50',
            color: '#4CAF50',
            '&:hover': {
              borderColor: '#66BB6A',
              backgroundColor: 'rgba(76, 175, 80, 0.05)'
            }
          }}
        >
          Export
        </Button>
      </Tooltip>

      <Tooltip title="Clear Cache">
        <Button
          variant="outlined"
          size="small"
          startIcon={<DeleteSweepIcon />}
          onClick={() => onAction('clear-cache')}
          sx={{
            borderColor: '#FF9800',
            color: '#FF9800',
            '&:hover': {
              borderColor: '#FFB74D',
              backgroundColor: 'rgba(255, 152, 0, 0.05)'
            }
          }}
        >
          Clear Cache
        </Button>
      </Tooltip>
    </Box>
  );
};

export default QuickActions;