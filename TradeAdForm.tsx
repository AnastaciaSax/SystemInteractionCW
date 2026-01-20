// client/src/components/forms/TradeAdForm.tsx
import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

interface TradeAdFormProps {
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
  submitText?: string;
  initialData?: any;
}

const TradeAdForm: React.FC<TradeAdFormProps> = ({
  onSubmit,
  onCancel,
  loading = false,
  submitText = 'Save',
  initialData = {},
}) => {
  const [formData, setFormData] = useState({
    title: initialData.title || '',
    description: initialData.description || '',
    condition: initialData.condition || 'MINT',
    series: initialData.series || 'G2',
    region: initialData.region || 'USA',
    photo: initialData.photo || '',
  });

  const [photoPreview, setPhotoPreview] = useState(initialData.photo || '');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPhotoPreview(result);
        setFormData(prev => ({ ...prev, photo: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        width: '100%',
        maxWidth: 800,
        margin: '0 auto',
      }}
    >
      <Typography
        variant="h4"
        sx={{
          color: '#560D30',
          fontFamily: '"McLaren", cursive',
          fontWeight: 400,
          fontSize: '48px',
          textTransform: 'capitalize',
          textAlign: 'center',
          mb: 2,
        }}
      >
        {submitText === 'Save' ? 'Edit TradeAd' : 'Create TradeAd'}
      </Typography>

      {/* Загрузка фото */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 4, flexWrap: 'wrap' }}>
        <Typography 
          sx={{ 
            color: '#852654', 
            fontFamily: '"Nobile", sans-serif',
            fontSize: '16px',
            minWidth: 66,
            pt: 1,
          }}
        >
          Photo:
        </Typography>
        
        <Box sx={{ position: 'relative', width: 355, height: 355 }}>
          <Box
            sx={{
              width: '100%',
              height: '100%',
              borderRadius: '10px',
              border: '1px dashed #EC2EA6',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: 'pointer',
              overflow: 'hidden',
              position: 'relative',
              bgcolor: photoPreview ? 'transparent' : '#F8F8F8',
            }}
            onClick={() => document.getElementById('photo-upload')?.click()}
          >
            {photoPreview ? (
              <img
                src={photoPreview}
                alt="Preview"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '10px',
                }}
              />
            ) : (
              <>
                <img
                  src="/assets/attach.svg"
                  alt="Attach photo"
                  style={{ width: 35, height: 35, marginBottom: 2 }}
                />
                <Typography
                  sx={{
                    color: '#560D30',
                    fontFamily: '"Nobile", sans-serif',
                    fontSize: '14px',
                    mt: 1,
                  }}
                >
                  Click to upload photo
                </Typography>
              </>
            )}
          </Box>
          <input
            id="photo-upload"
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            style={{ display: 'none' }}
          />
        </Box>
      </Box>

      {/* Название */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
        <Typography 
          sx={{ 
            color: '#852654', 
            fontFamily: '"Nobile", sans-serif',
            fontSize: '16px',
            minWidth: 66,
          }}
        >
          Name:
        </Typography>
        <TextField
          name="title"
          value={formData.title}
          onChange={handleChange}
          fullWidth
          required
          sx={{
            maxWidth: 378,
            '& .MuiOutlinedInput-root': {
              borderRadius: '10px',
              backgroundColor: 'white',
              '& fieldset': {
                borderColor: '#EC2EA6',
              },
              '&:hover fieldset': {
                borderColor: '#F056B7',
              },
            },
          }}
        />
      </Box>

      {/* Описание */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 4, flexWrap: 'wrap' }}>
        <Typography 
          sx={{ 
            color: '#852654', 
            fontFamily: '"Nobile", sans-serif',
            fontSize: '16px',
            minWidth: 66,
            pt: 1,
          }}
        >
          Description:
        </Typography>
        <TextField
          name="description"
          value={formData.description}
          onChange={handleChange}
          multiline
          rows={4}
          fullWidth
          sx={{
            maxWidth: 378,
            '& .MuiOutlinedInput-root': {
              borderRadius: '10px',
              backgroundColor: 'white',
              '& fieldset': {
                borderColor: '#EC2EA6',
              },
              '&:hover fieldset': {
                borderColor: '#F056B7',
              },
            },
          }}
        />
      </Box>

      {/* Condition */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 5, flexWrap: 'wrap' }}>
        <Typography 
          sx={{ 
            color: '#82164A', 
            fontFamily: '"Nobile", sans-serif',
            fontSize: '16px',
            minWidth: 83,
          }}
        >
          Condition:
        </Typography>
        <FormControl sx={{ maxWidth: 294, minWidth: 200 }}>
          <Select
            name="condition"
            value={formData.condition}
            onChange={handleSelectChange}
            sx={{
              borderRadius: '10px',
              backgroundColor: 'white',
              border: '1px solid #F056B7',
              height: '40px',
              '& .MuiSelect-select': {
                padding: '10px 32px 10px 16px',
              },
            }}
            MenuProps={{
              PaperProps: {
                sx: {
                  borderRadius: '10px',
                  marginTop: '8px',
                  border: '1px solid #EC2EA6',
                },
              },
            }}
          >
            <MenuItem value="MINT">Mint</MenuItem>
            <MenuItem value="TLC">Needs TLC</MenuItem>
            <MenuItem value="GOOD">Good</MenuItem>
            <MenuItem value="NIB">New in Box</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Series */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 5, flexWrap: 'wrap' }}>
        <Typography 
          sx={{ 
            color: '#82164A', 
            fontFamily: '"Nobile", sans-serif',
            fontSize: '16px',
            minWidth: 83,
          }}
        >
          Series:
        </Typography>
        <FormControl sx={{ maxWidth: 294, minWidth: 200 }}>
          <Select
            name="series"
            value={formData.series}
            onChange={handleSelectChange}
            sx={{
              borderRadius: '10px',
              backgroundColor: 'white',
              border: '1px solid #F056B7',
              height: '40px',
              '& .MuiSelect-select': {
                padding: '10px 32px 10px 16px',
              },
            }}
            MenuProps={{
              PaperProps: {
                sx: {
                  borderRadius: '10px',
                  marginTop: '8px',
                  border: '1px solid #EC2EA6',
                },
              },
            }}
          >
            <MenuItem value="G2">G2</MenuItem>
            <MenuItem value="G3">G3</MenuItem>
            <MenuItem value="G4">G4</MenuItem>
            <MenuItem value="G5">G5</MenuItem>
            <MenuItem value="G6">G6</MenuItem>
            <MenuItem value="G7">G7</MenuItem>
            <MenuItem value="OTHER">Other</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Region */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 5, flexWrap: 'wrap' }}>
        <Typography 
          sx={{ 
            color: '#82164A', 
            fontFamily: '"Nobile", sans-serif',
            fontSize: '16px',
            minWidth: 83,
          }}
        >
          Region:
        </Typography>
        <FormControl sx={{ maxWidth: 294, minWidth: 200 }}>
          <Select
            name="region"
            value={formData.region}
            onChange={handleSelectChange}
            sx={{
              borderRadius: '10px',
              backgroundColor: 'white',
              border: '1px solid #F056B7',
              height: '40px',
              '& .MuiSelect-select': {
                padding: '10px 32px 10px 16px',
              },
            }}
            MenuProps={{
              PaperProps: {
                sx: {
                  borderRadius: '10px',
                  marginTop: '8px',
                  border: '1px solid #EC2EA6',
                },
              },
            }}
          >
            <MenuItem value="USA">USA</MenuItem>
            <MenuItem value="EU">Europe</MenuItem>
            <MenuItem value="CIS">CIS</MenuItem>
            <MenuItem value="ASIA">Asia</MenuItem>
            <MenuItem value="OTHER">Other</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Кнопки */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 4 }}>
        <Button
          type="submit"
          disabled={loading}
          variant="contained"
          sx={{
            backgroundColor: '#560D30',
            color: '#FFF6F9',
            borderRadius: '10px',
            padding: '12px 35px',
            fontFamily: '"McLaren", cursive',
            fontWeight: 400,
            textTransform: 'none',
            fontSize: '16px',
            '&:hover': {
              backgroundColor: '#82164A',
            },
            '&:disabled': {
              backgroundColor: '#CCCCCC',
            },
          }}
        >
          {loading ? 'Saving...' : submitText}
        </Button>
        <Button
          onClick={onCancel}
          variant="outlined"
          sx={{
            color: '#560D30',
            border: '1px solid #560D30',
            borderRadius: '10px',
            padding: '12px 35px',
            fontFamily: '"McLaren", cursive',
            fontWeight: 400,
            textTransform: 'none',
            fontSize: '16px',
            '&:hover': {
              backgroundColor: 'rgba(86, 13, 48, 0.1)',
              border: '1px solid #560D30',
            },
          }}
        >
          Cancel
        </Button>
      </Box>
    </Box>
  );
};

export default TradeAdForm;