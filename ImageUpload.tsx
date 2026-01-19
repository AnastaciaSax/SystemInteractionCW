// client/src/components/forms/ImageUpload/ImageUpload.tsx
import React, { useState, useRef } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  IconButton,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ClearIcon from '@mui/icons-material/Clear';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface ImageUploadProps {
  initialImage?: string | null;
  onImageUpload: (file: File) => void;
  aspectRatio?: number;
  maxSize?: number; // in MB
  accept?: string;
  error?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  initialImage,
  onImageUpload,
  aspectRatio = 1,
  maxSize = 5,
  accept = 'image/*',
  error,
}) => {
  const [image, setImage] = useState<string | null>(initialImage || null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      setUploadError(`File size must be less than ${maxSize}MB`);
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setUploadError('Please upload an image file');
      return;
    }

    setUploading(true);
    setUploadError('');

    try {
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImage(result);
        setUploading(false);
        onImageUpload(file);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      setUploading(false);
      setUploadError('Failed to upload image');
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setUploadError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box
        onClick={handleClick}
        sx={{
          width: '100%',
          height: 0,
          paddingBottom: `${100 / aspectRatio}%`,
          position: 'relative',
          border: `2px dashed ${error || uploadError ? '#FF4C4C' : '#EC2EA6'}`,
          borderRadius: '10px',
          backgroundColor: image ? 'transparent' : 'rgba(255, 246, 249, 0.5)',
          cursor: 'pointer',
          overflow: 'hidden',
          '&:hover': {
            borderColor: error || uploadError ? '#FF4C4C' : '#F056B7',
            backgroundColor: 'rgba(255, 246, 249, 0.8)',
          },
        }}
      >
        {image ? (
          <>
            <img
              src={image}
              alt="Preview"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveImage();
              }}
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                '&:hover': {
                  backgroundColor: 'white',
                },
              }}
            >
              <ClearIcon sx={{ color: '#560D30' }} />
            </IconButton>
            <Box
              sx={{
                position: 'absolute',
                bottom: 8,
                right: 8,
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                padding: '2px 8px',
                borderRadius: '12px',
              }}
            >
              <CheckCircleIcon sx={{ color: '#4CAF50', fontSize: 16 }} />
              <Typography sx={{ fontSize: '12px', color: '#560D30' }}>
                Uploaded
              </Typography>
            </Box>
          </>
        ) : uploading ? (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <CircularProgress size={40} sx={{ color: '#EC2EA6' }} />
            <Typography sx={{ color: '#560D30', fontSize: '14px' }}>
              Uploading...
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <CloudUploadIcon sx={{ fontSize: 48, color: '#EC2EA6' }} />
            <Typography sx={{ color: '#560D30', textAlign: 'center' }}>
              Click to upload image
            </Typography>
            <Typography sx={{ color: '#852654', fontSize: '12px' }}>
              Max size: {maxSize}MB
            </Typography>
          </Box>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          style={{ display: 'none' }}
          disabled={uploading}
        />
      </Box>

      {(error || uploadError) && (
        <Typography color="error" sx={{ fontSize: '12px', mt: 1 }}>
          {error || uploadError}
        </Typography>
      )}
    </Box>
  );
};

export default ImageUpload;