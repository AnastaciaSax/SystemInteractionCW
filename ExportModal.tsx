import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography
} from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import TableChartIcon from '@mui/icons-material/TableChart';

interface ExportModalProps {
  open: boolean;
  onClose: () => void;
  onExport: (format: 'pdf' | 'csv', reportType: string) => void;
}

const ExportModal: React.FC<ExportModalProps> = ({ open, onClose, onExport }) => {
  const [reportType, setReportType] = useState('users');
  const [format, setFormat] = useState<'pdf' | 'csv'>('pdf');

  const handleExport = () => {
    onExport(format, reportType);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontFamily: '"McLaren", cursive', color: '#560D30' }}>
        Export Report
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 2 }}>
          <FormControl fullWidth size="small">
            <InputLabel>Report Type</InputLabel>
            <Select
              value={reportType}
              label="Report Type"
              onChange={(e) => setReportType(e.target.value)}
            >
              <MenuItem value="users">Users Report</MenuItem>
              <MenuItem value="trades">Trades Report</MenuItem>
              <MenuItem value="articles">Articles Report</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth size="small">
            <InputLabel>Format</InputLabel>
            <Select
              value={format}
              label="Format"
              onChange={(e) => setFormat(e.target.value as 'pdf' | 'csv')}
            >
              <MenuItem value="pdf">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PictureAsPdfIcon fontSize="small" sx={{ color: '#F44336' }} />
                  PDF Document
                </Box>
              </MenuItem>
              <MenuItem value="csv">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TableChartIcon fontSize="small" sx={{ color: '#4CAF50' }} />
                  CSV File
                </Box>
              </MenuItem>
            </Select>
          </FormControl>

          <Typography variant="body2" sx={{ color: '#852654', mt: 2 }}>
            The report will be generated and downloaded automatically.
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} sx={{ color: '#852654' }}>Cancel</Button>
        <Button
          onClick={handleExport}
          variant="contained"
          sx={{
            backgroundColor: '#EC2EA6',
            '&:hover': { backgroundColor: '#F056B7' }
          }}
        >
          Export
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ExportModal;