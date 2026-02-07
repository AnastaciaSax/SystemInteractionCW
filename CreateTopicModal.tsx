import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import Modal from '../../../components/ui/Modal';

interface CreateTopicModalProps {
  open: boolean;
  onClose: () => void;
  onCreateTopic: (title: string, description: string, category: string) => void;
}

const CreateTopicModal: React.FC<CreateTopicModalProps> = ({
  open,
  onClose,
  onCreateTopic,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('GENERAL');

  const handleSubmit = () => {
    if (title.trim() && description.trim()) {
      onCreateTopic(title, description, category);
      handleClose();
    }
  };

  const handleClose = () => {
    setTitle('');
    setDescription('');
    setCategory('GENERAL');
    onClose();
  };

  const categories = [
    { value: 'GENERAL', label: 'General Discussion', color: '#EC2EA6' },
    { value: 'TRADING', label: 'Trading Tips & Strategies', color: '#4CAF50' },
    { value: 'COLLECTING', label: 'Rare Finds & Collections', color: '#2196F3' },
    { value: 'REVIEWS', label: 'User Reviews & Feedback', color: '#FF9800' },
    { value: 'NEWS', label: 'News & Announcements', color: '#9C27B0' },
    { value: 'EVENTS', label: 'Events & Meetups', color: '#00BCD4' }
  ];

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Create New Forum Topic"
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
          Start a new discussion topic for the community
        </Typography>

        {/* Заголовок */}
        <TextField
          label="Topic Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter an interesting title..."
          fullWidth
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              borderColor: '#F6C4D4',
              '&:hover fieldset': {
                borderColor: '#EC2EA6',
              },
            },
          }}
        />

        {/* Описание */}
        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe what this topic is about..."
          multiline
          rows={3}
          fullWidth
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              borderColor: '#F6C4D4',
              '&:hover fieldset': {
                borderColor: '#EC2EA6',
              },
            },
          }}
        />

        {/* Категория */}
        <FormControl fullWidth>
          <InputLabel>Category</InputLabel>
          <Select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            label="Category"
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
            {categories.map((cat) => (
              <MenuItem 
                key={cat.value} 
                value={cat.value}
                sx={{ color: cat.color, fontWeight: 600 }}
              >
                {cat.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Информация */}
        <Box sx={{ 
          p: 2, 
          background: 'rgba(255, 241, 248, 0.3)', 
          borderRadius: 2,
          border: '1px solid #F6C4D4'
        }}>
          <Typography sx={{ color: '#560D30', fontSize: 12, fontFamily: '"Nobile", sans-serif', fontWeight: 600 }}>
            💡 Tips for a great topic:
          </Typography>
          <Typography sx={{ color: '#852654', fontSize: 11, fontFamily: '"Nobile", sans-serif', mt: 1 }}>
            • Be clear and specific with your title<br/>
            • Provide enough context for discussion<br/>
            • Choose the right category to reach interested members<br/>
            • Keep it friendly and collector-focused
          </Typography>
        </Box>

        {/* Кнопки */}
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
            disabled={!title.trim() || !description.trim()}
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
            Create Topic
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default CreateTopicModal;