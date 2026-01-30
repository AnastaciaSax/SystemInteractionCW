import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from '@mui/material';
import ReportIcon from '@mui/icons-material/Report';
import Modal from '../../../components/ui/Modal';

interface ComplaintModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (reason: string, details: string) => void;
  reportedUser: any;
}

const ComplaintModal: React.FC<ComplaintModalProps> = ({
  open,
  onClose,
  onSubmit,
  reportedUser,
}) => {
  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (reason && details.trim()) {
      onSubmit(reason, details);
      setSubmitted(true);
      setTimeout(() => {
        handleClose();
      }, 2000);
    }
  };

  const handleClose = () => {
    setReason('');
    setDetails('');
    setSubmitted(false);
    onClose();
  };

  const reasons = [
    'Inappropriate behavior',
    'Harassment',
    'Scam attempt',
    'Fake trade offer',
    'Spam messages',
    'Other',
  ];

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Report User"
      maxWidth="sm"
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {submitted ? (
          <Alert severity="success" sx={{ mb: 2 }}>
            Complaint submitted successfully. Our team will review it shortly.
          </Alert>
        ) : (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <ReportIcon sx={{ color: '#FF4C4C', fontSize: 32 }} />
              <Box>
                <Typography
                  sx={{
                    color: '#560D30',
                    fontSize: '16px',
                    fontFamily: '"Nobile", sans-serif',
                    fontWeight: 600,
                  }}
                >
                  Reporting: {reportedUser?.username}
                </Typography>
                <Typography
                  sx={{
                    color: '#852654',
                    fontSize: '14px',
                    fontFamily: '"Nobile", sans-serif',
                  }}
                >
                  Your report is anonymous
                </Typography>
              </Box>
            </Box>

            {/* Reason selection */}
            <FormControl fullWidth>
              <InputLabel>Reason for reporting</InputLabel>
              <Select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                label="Reason for reporting"
                sx={{
                  borderRadius: 2,
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#F6C4D4',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#EC2EA6',
                  },
                }}
              >
                {reasons.map((r) => (
                  <MenuItem key={r} value={r}>
                    {r}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Details */}
            <TextField
              multiline
              rows={6}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Please provide details about the issue..."
              variant="outlined"
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  borderColor: '#F6C4D4',
                  '&:hover fieldset': {
                    borderColor: '#EC2EA6',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#EC2EA6',
                  },
                },
              }}
            />

            {/* Buttons */}
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                onClick={handleClose}
                sx={{
                  color: '#560D30',
                  borderColor: '#560D30',
                  '&:hover': {
                    borderColor: '#82164A',
                    background: 'rgba(86, 13, 48, 0.05)',
                  },
                }}
                variant="outlined"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!reason || !details.trim()}
                sx={{
                  background: '#FF4C4C',
                  color: 'white',
                  '&:hover': {
                    background: '#FF3333',
                  },
                  '&:disabled': {
                    background: 'rgba(255, 76, 76, 0.3)',
                  },
                }}
                variant="contained"
                startIcon={<ReportIcon />}
              >
                Submit Report
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Modal>
  );
};

export default ComplaintModal;