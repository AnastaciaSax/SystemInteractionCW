import React, { useState, useRef } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  IconButton,
  CircularProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Modal from '../../../components/ui/Modal';

interface TradeOfferModalProps {
  open: boolean;
  onClose: () => void;
  onSendOffer: (file: File, message: string) => void;
  tradeAd?: any;
}

const TradeOfferModal: React.FC<TradeOfferModalProps> = ({
  open,
  onClose,
  onSendOffer,
  tradeAd,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [message, setMessage] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSend = async () => {
    if (!file || !message.trim()) return;
    
    setUploading(true);
    try {
      await onSendOffer(file, message);
      handleClose();
    } catch (error) {
      console.error('Error sending trade offer:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setPreview('');
    setMessage('');
    setUploading(false);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Send Trade Offer"
      maxWidth="sm"
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Typography
          sx={{
            color: '#852654',
            fontSize: '14px',
            fontFamily: '"Nobile", sans-serif',
          }}
        >
          Attach a photo of the figurine you want to trade for "{tradeAd?.title}"
        </Typography>

        {/* File upload */}
        <Box
          onClick={() => fileInputRef.current?.click()}
          sx={{
            border: '2px dashed #EC2EA6',
            borderRadius: 2,
            p: 4,
            textAlign: 'center',
            cursor: 'pointer',
            background: 'rgba(255, 241, 248, 0.3)',
            transition: 'all 0.3s ease',
            '&:hover': {
              background: 'rgba(255, 241, 248, 0.5)',
              borderColor: '#F05EBA',
            },
          }}
        >
          {preview ? (
            <Box sx={{ position: 'relative' }}>
              <img
                src={preview}
                alt="Preview"
                style={{
                  width: '100%',
                  maxHeight: '300px',
                  objectFit: 'contain',
                  borderRadius: '8px',
                }}
              />
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  setFile(null);
                  setPreview('');
                }}
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  background: 'rgba(255, 255, 255, 0.9)',
                }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
          ) : (
            <>
              <CloudUploadIcon
                sx={{
                  fontSize: 48,
                  color: '#EC2EA6',
                  mb: 2,
                }}
              />
              <Typography
                sx={{
                  color: '#560D30',
                  fontSize: '16px',
                  fontFamily: '"Nobile", sans-serif',
                }}
              >
                Click to upload image
              </Typography>
              <Typography
                sx={{
                  color: '#852654',
                  fontSize: '12px',
                  fontFamily: '"Nobile", sans-serif',
                  mt: 1,
                }}
              >
                JPG, PNG, GIF up to 5MB
              </Typography>
            </>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
        </Box>

        {/* Message input */}
        <TextField
          multiline
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Add a message about your trade offer..."
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
            onClick={handleSend}
            disabled={!file || !message.trim() || uploading}
            sx={{
              background: 'linear-gradient(90deg, #EC2EA6 0%, #F05EBA 100%)',
              color: 'white',
              '&:hover': {
                background: 'linear-gradient(90deg, #F05EBA 0%, #EC2EA6 100%)',
              },
              '&:disabled': {
                background: 'rgba(236, 46, 166, 0.3)',
              },
            }}
            variant="contained"
          >
            {uploading ? (
              <CircularProgress size={24} sx={{ color: 'white' }} />
            ) : (
              'Send Trade Offer'
            )}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default TradeOfferModal;