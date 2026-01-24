import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  CircularProgress,
} from '@mui/material';
import { figurinesAPI } from '../../services/api';
import ImageUpload from './ImageUpload';

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
  const isEditMode = submitText.toLowerCase().includes('save') && Object.keys(initialData).length > 0;
  
  const [formData, setFormData] = useState({
    title: initialData.title || '',
    description: initialData.description || '',
    condition: initialData.condition || 'MINT',
    series: initialData.series || 'G2',
    photo: initialData.photo || '',
    figurineId: initialData.figurineId || '',
    location: initialData.location || '',
  });

  const [initialFormData] = useState({
    title: initialData.title || '',
    description: initialData.description || '',
    condition: initialData.condition || 'MINT',
    series: initialData.series || 'G2',
    photo: initialData.photo || '',
    figurineId: initialData.figurineId || '',
    location: initialData.location || '',
  });
  
  const [hasChanges, setHasChanges] = useState(false);
  const [figurines, setFigurines] = useState<any[]>([]);
  const [figurinesLoading, setFigurinesLoading] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [hasPhoto, setHasPhoto] = useState(!!initialData.photo);

  useEffect(() => {
    fetchFigurines();
  }, []);

  // Проверяем изменения при каждом обновлении formData или photoFile
  useEffect(() => {
    if (!isEditMode) {
      // Для создания: все обязательные поля заполнены И есть фото
      const hasRequiredFields = 
        formData.title.trim() !== '' &&
        formData.description.trim() !== '' &&
        formData.location.trim() !== '' &&
        formData.figurineId !== '';
      
      setHasChanges(hasRequiredFields && hasPhoto);
    } else {
      // Для редактирования: проверяем, есть ли ЛЮБЫЕ изменения в форме
      const textFieldsChanged = 
        formData.title !== initialFormData.title ||
        formData.description !== initialFormData.description ||
        formData.condition !== initialFormData.condition ||
        formData.series !== initialFormData.series ||
        formData.figurineId !== initialFormData.figurineId ||
        formData.location !== initialFormData.location;
      
      // В режиме редактирования: либо есть изменения в полях, либо загружено новое фото
      const hasAnyChanges = textFieldsChanged || !!photoFile;
      
      // Проверяем, что обязательные поля заполнены
      const requiredFieldsFilled = 
        formData.title.trim() !== '' &&
        formData.description.trim() !== '' &&
        formData.location.trim() !== '' &&
        formData.figurineId !== '';
      
      setHasChanges(hasAnyChanges && requiredFieldsFilled);
    }
  }, [formData, photoFile, initialFormData, isEditMode, hasPhoto]);

  const fetchFigurines = async () => {
    setFigurinesLoading(true);
    try {
      const response = await figurinesAPI.getAll();
      setFigurines(response.data || []);
    } catch (error) {
      console.error('Error fetching figurines:', error);
    } finally {
      setFigurinesLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoUpload = async (file: File) => {
    setPhotoFile(file);
    setHasPhoto(true);
  };

  const handlePhotoRemove = () => {
    setPhotoFile(null);
    setHasPhoto(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('condition', formData.condition);
    formDataToSend.append('location', formData.location);
    formDataToSend.append('figurineId', formData.figurineId);
    
    // При создании объявления фото обязательно
    // При редактировании - опционально
    if (photoFile) {
      formDataToSend.append('photo', photoFile);
    } else if (!isEditMode && !hasPhoto) {
      // В режиме создания, если фото не загружено, не отправляем форму
      return;
    }
    
    await onSubmit(formDataToSend);
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
        {isEditMode ? 'Edit TradeAd' : 'Create TradeAd'}
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
          Photo{!isEditMode ? '*' : ''}:
        </Typography>
        
        <Box sx={{ width: 355 }}>
          <ImageUpload
            initialImage={formData.photo}
            onImageUpload={handlePhotoUpload}
            onImageRemove={handlePhotoRemove}
            aspectRatio={1}
            maxSize={5}
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
          Title*:
        </Typography>
        <TextField
          name="title"
          value={formData.title}
          onChange={handleChange}
          fullWidth
          required
          placeholder="Brown Shorthair Cat With Bow"
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
          Description*:
        </Typography>
        <TextField
          name="description"
          value={formData.description}
          onChange={handleChange}
          multiline
          rows={4}
          fullWidth
          required
          placeholder="Pretty figure's looking for a new kind owner..."
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

      {/* Location */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
        <Typography 
          sx={{ 
            color: '#852654', 
            fontFamily: '"Nobile", sans-serif',
            fontSize: '16px',
            minWidth: 66,
          }}
        >
          Location*:
        </Typography>
        <TextField
          name="location"
          value={formData.location}
          onChange={handleChange}
          fullWidth
          required
          placeholder="New York, Lincoln Street"
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

      {/* Figurine Selection */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 5, flexWrap: 'wrap' }}>
        <Typography 
          sx={{ 
            color: '#82164A', 
            fontFamily: '"Nobile", sans-serif',
            fontSize: '16px',
            minWidth: 83,
          }}
        >
          Figurine*:
        </Typography>
        <FormControl sx={{ maxWidth: 294, minWidth: 200 }}>
          {figurinesLoading ? (
            <CircularProgress size={24} sx={{ color: '#EC2EA6' }} />
          ) : (
            <Select
              name="figurineId"
              value={formData.figurineId}
              onChange={handleSelectChange}
              required
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
                    maxHeight: 300,
                  },
                },
              }}
            >
              {figurines.map((figurine) => (
                <MenuItem key={figurine.id} value={figurine.id}>
                  {figurine.number} - {figurine.name} ({figurine.series})
                </MenuItem>
              ))}
            </Select>
          )}
        </FormControl>
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
          Condition*:
        </Typography>
        <FormControl sx={{ maxWidth: 294, minWidth: 200 }}>
          <Select
            name="condition"
            value={formData.condition}
            onChange={handleSelectChange}
            required
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
            <MenuItem value="TLC">TLC</MenuItem>
            <MenuItem value="GOOD">Good</MenuItem>
            <MenuItem value="NIB">New in Box</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Кнопки */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 4 }}>
        <Button
          type="submit"
          disabled={loading || figurinesLoading || !hasChanges}
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

      <Typography
        sx={{
          color: '#882253',
          fontFamily: '"Nobile", sans-serif',
          fontSize: '12px',
          textAlign: 'center',
          mt: 2,
        }}
      >
        * Required fields
      </Typography>
    </Box>
  );
};

export default TradeAdForm;