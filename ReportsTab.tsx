import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Divider
} from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import TableChartIcon from '@mui/icons-material/TableChart';
import GridOnIcon from '@mui/icons-material/GridOn';
import DownloadIcon from '@mui/icons-material/Download';
import { adminAPI } from '../../../../services/adminApi';

interface ReportsTabProps {
  onShowNotification: (message: string, type: 'success' | 'error' | 'info') => void;
}

const ReportsTab: React.FC<ReportsTabProps> = ({ onShowNotification }) => {
  const [loading, setLoading] = useState<string | null>(null);

  const handleExport = async (type: string, format: 'pdf' | 'csv') => {
  setLoading(`${type}-${format}`);
  try {
    await adminAPI.exportReport(type, format);
    onShowNotification(`Report exported successfully as ${format.toUpperCase()}`, 'success');
  } catch (error) {
    onShowNotification('Export failed', 'error');
  } finally {
    setLoading(null);
  }
};

  const reports = [
    { id: 'users', title: 'Users Report', description: 'List of all users with profile data' },
    { id: 'trades', title: 'Trades Report', description: 'All trade ads and their status' },
    { id: 'articles', title: 'Articles Report', description: 'Published articles and authors' },
  ];

  return (
    <Box>
      <Typography variant="h5" sx={{ fontFamily: '"McLaren", cursive', color: '#560D30', mb: 3 }}>
        Generate Reports
      </Typography>

      <Grid container spacing={3}>
        {reports.map((report) => (
          <Grid item xs={12} md={4} key={report.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" sx={{ color: '#560D30', mb: 1 }}>
                  {report.title}
                </Typography>
                <Typography variant="body2" sx={{ color: '#852654', mb: 2 }}>
                  {report.description}
                </Typography>
                <Divider />
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-around' }}>
                  <Button
                    size="small"
                    startIcon={<PictureAsPdfIcon />}
                    onClick={() => handleExport(report.id, 'pdf')}
                    disabled={loading === `${report.id}-pdf`}
                    sx={{ color: '#F44336' }}
                  >
                    PDF
                  </Button>
                  <Button
                    size="small"
                    startIcon={<TableChartIcon />}
                    onClick={() => handleExport(report.id, 'csv')}
                    disabled={loading === `${report.id}-csv`}
                    sx={{ color: '#4CAF50' }}
                  >
                    CSV
                  </Button>
                </Box>
              </CardContent>
              <CardActions>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<DownloadIcon />}
                  onClick={() => handleExport(report.id, 'pdf')}
                  disabled={loading === `${report.id}-pdf`}
                  sx={{
                    borderColor: '#EC2EA6',
                    color: '#EC2EA6',
                    '&:hover': { borderColor: '#F056B7' }
                  }}
                >
                  Download
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ReportsTab;