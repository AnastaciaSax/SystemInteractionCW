import React, { useState, useRef } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Fade,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ClearIcon from '@mui/icons-material/Clear';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PhotoUploadLoader from '../ui/PhotoUploadLoader';

interface ImageUploadProps {
  initialImage?: string | null;
  onImageUpload: (file: File) => Promise<void>;
  onImageRemove?: () => void; // Добавляем callback для удаления фото
  aspectRatio?: number;
  maxSize?: number; // in MB
  accept?: string;
  error?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  initialImage,
  onImageUpload,
  onImageRemove, // Получаем callback
  aspectRatio = 1,
  maxSize = 5,
  accept = 'image/*',
  error,
}) => {
  const [image, setImage] = useState<string | null>(initialImage || null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const simulateUploadProgress = () => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 30;
      if (progress >= 90) {
        clearInterval(interval);
      }
      setUploadProgress(progress);
    }, 200);
    return interval;
  };

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
    setUploadProgress(0);

    // Создаем preview сразу
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setImage(result);
    };
    reader.readAsDataURL(file);

    // Симулируем прогресс загрузки
    const progressInterval = simulateUploadProgress();

    try {
      await onImageUpload(file);
      
      // Завершаем прогресс
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      // Через секунду скрываем индикатор
      setTimeout(() => {
        setUploading(false);
        setUploadProgress(0);
      }, 1000);
    } catch (error) {
      clearInterval(progressInterval);
      setUploading(false);
      setUploadProgress(0);
      setUploadError('Failed to upload image');
      setImage(null); // Удаляем preview при ошибке
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setUploadError('');
    // Вызываем callback при удалении фото
    if (onImageRemove) {
      onImageRemove();
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Box sx={{ width: '100%', position: 'relative' }}>
      {/* Overlay для загрузки */}
      {uploading && (
        <Fade in={uploading}>
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              zIndex: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              borderRadius: '10px',
            }}
          >
            <PhotoUploadLoader progress={uploadProgress} variant="wave" />
          </Box>
        </Fade>
      )}

      <Box
        onClick={() => !uploading && fileInputRef.current?.click()}
        sx={{
          width: '100%',
          height: 0,
          paddingBottom: `${100 / aspectRatio}%`,
          position: 'relative',
          border: `2px dashed ${error || uploadError ? '#FF4C4C' : '#EC2EA6'}`,
          borderRadius: '10px',
          backgroundColor: image ? 'transparent' : 'rgba(255, 246, 249, 0.5)',
          cursor: uploading ? 'default' : 'pointer',
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          '&:hover': {
            borderColor: uploading ? '#EC2EA6' : (error || uploadError ? '#FF4C4C' : '#F056B7'),
            backgroundColor: uploading 
              ? 'rgba(255, 246, 249, 0.5)' 
              : 'rgba(255, 246, 249, 0.8)',
            transform: uploading ? 'none' : 'scale(1.01)',
          },
        }}
      >
        {image && !uploading ? (
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
        ) : !uploading ? (
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
            <Box
              sx={{
                width: 60,
                height: 60,
                borderRadius: '50%',
                backgroundColor: 'rgba(236, 46, 166, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                animation: 'pulse 2s infinite',
                '@keyframes pulse': {
                  '0%, 100%': { transform: 'scale(1)', opacity: 1 },
                  '50%': { transform: 'scale(1.05)', opacity: 0.8 },
                },
              }}
            >
              <CloudUploadIcon sx={{ fontSize: 30, color: '#EC2EA6' }} />
            </Box>
            <Typography 
              sx={{ 
                color: '#560D30', 
                textAlign: 'center',
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
              }}
            >
              Max size: {maxSize}MB • JPG, PNG, GIF
            </Typography>
          </Box>
        ) : null}

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