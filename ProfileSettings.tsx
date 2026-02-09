import React, { useState } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel,
  Paper,
  CircularProgress,
  Divider,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import RestartAltIcon from '@mui/icons-material/RestartAlt'; 
import SettingsIcon from '@mui/icons-material/Settings';
import { Grid } from '@mui/material';
import { resetUISettings } from '../../../utils/uiSettings';

interface ProfileSettingsProps {
  user: any;
  onUpdateProfile: (data: any) => Promise<boolean>;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ 
  user, 
  onUpdateProfile, 
  onSuccess, 
  onError 
}) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    bio: user?.profile?.bio || '',
    location: user?.profile?.location || '',
    region: user?.region || 'EU',
  });
  const [isResetting, setIsResetting] = useState(false);

  const handleChange = (field: string) => (event: any) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      const success = await onUpdateProfile(formData);
      if (success) {
        onSuccess('Profile settings saved successfully! ✨');
      }
    } catch (error) {
      onError('Failed to save profile settings');
    } finally {
      setLoading(false);
    }
  };

  const handleResetSettings = () => {
    if (window.confirm(
      'Are you sure you want to reset all UI settings?\n\n' +
      'This will reset:\n' +
      '• All filters and sort orders\n' +
      '• Search queries\n' +
      '• UI preferences\n\n' +
      'Your account data, chats, and favorites will NOT be affected.'
    )) {
      setIsResetting(true);
      
      // Сбрасываем настройки UI
      resetUISettings();
      
      // Показываем уведомление
      onSuccess('✅ All UI settings have been reset successfully!');
      
      // Обновляем страницу через 2 секунды, чтобы изменения применились
      setTimeout(() => {
        window.location.reload();
      }, 2000);
      
      setIsResetting(false);
    }
  };

  const regionOptions = [
    { value: 'USA', label: 'US' },
    { value: 'EU', label: 'EU' },
    { value: 'CIS', label: 'CIS' },
    { value: 'ASIA', label: 'Asia' },
    { value: 'OTHER', label: 'Other' },
  ];

  return (
    <Box sx={{ mb: 8 }}>
      <Typography
        variant="h4"
        sx={{
          color: 'var(--title, #560D30)',
          fontSize: { xs: '28px', md: '36px' },
          fontFamily: '"McLaren", cursive',
          fontWeight: 400,
          mb: 4,
        }}
      >
        Profile Settings ⚙️
      </Typography>

      {/* Форма редактирования профиля */}
      <Paper
        elevation={0}
        sx={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 240, 245, 0.9) 100%)',
          borderRadius: '20px',
          padding: { xs: 3, md: 5 },
          border: '2px solid rgba(236, 46, 166, 0.2)',
          mb: 4,
        }}
      >
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Username */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Username"
                value={formData.username}
                onChange={handleChange('username')}
                helperText="This is how other collectors will see you!"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    background: 'white',
                  },
                  '& .MuiInputLabel-root': {
                    fontFamily: '"Nobile", sans-serif',
                  },
                  '& .MuiInputBase-input': {
                    fontFamily: '"Nobile", sans-serif',
                  },
                }}
              />
            </Grid>

            {/* Region */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth sx={{ 
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  background: 'white',
                }
              }}>
                <InputLabel>Region</InputLabel>
                <Select
                  value={formData.region}
                  label="Region"
                  onChange={handleChange('region')}
                >
                  {regionOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Location */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Location"
                value={formData.location}
                onChange={handleChange('location')}
                helperText="City, Country (optional)"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    background: 'white',
                  },
                }}
              />
            </Grid>

            {/* Bio */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Bio"
                value={formData.bio}
                onChange={handleChange('bio')}
                helperText="Tell other collectors about yourself and your collection!"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    background: 'white',
                  },
                }}
              />
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<SaveIcon />}
                  disabled={loading}
                  sx={{
                    backgroundColor: '#EC2EA6',
                    color: 'white',
                    borderRadius: '12px',
                    fontFamily: '"McLaren", cursive',
                    fontWeight: 400,
                    textTransform: 'none',
                    padding: '12px 24px',
                    fontSize: '18px',
                    '&:hover': {
                      backgroundColor: '#F056B7',
                    },
                    '&:disabled': {
                      opacity: 0.6,
                    },
                  }}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      {/* Отдельная секция для сброса UI настроек */}
      <Paper
        elevation={0}
        sx={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 240, 245, 0.9) 100%)',
          borderRadius: '20px',
          padding: { xs: 3, md: 5 },
          border: '2px solid rgba(255, 107, 107, 0.3)',
          mb: 4,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <SettingsIcon sx={{ color: '#FF6B6B', fontSize: 30 }} />
          <Typography
            variant="h5"
            sx={{
              color: '#FF6B6B',
              fontSize: { xs: '24px', md: '28px' },
              fontFamily: '"McLaren", cursive',
              fontWeight: 400,
            }}
          >
            Interface Storage
          </Typography>
        </Box>

        <Typography
          sx={{
            color: '#852654',
            fontSize: '16px',
            fontFamily: '"Nobile", sans-serif',
            mb: 3,
            lineHeight: 1.6,
          }}
        >
          Reset all interface preferences including filters, sort orders, and search queries.
          This will restore all UI settings to their default values.
        </Typography>

        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mt: 4,
          pt: 3,
          borderTop: '1px solid rgba(255, 107, 107, 0.2)'
        }}>
          <Typography
            sx={{
              color: '#852654',
              fontSize: '14px',
              fontFamily: '"Nobile", sans-serif',
              fontStyle: 'italic',
              maxWidth: '60%',
            }}
          >
            ⚠️ This will not affect your account data, chats, or favorites.
          </Typography>
          
          <Button
            variant="outlined"
            onClick={handleResetSettings}
            disabled={isResetting}
            startIcon={isResetting ? <CircularProgress size={20} /> : <RestartAltIcon />}
            sx={{
              borderColor: '#FF6B6B',
              color: '#FF6B6B',
              borderRadius: '12px',
              fontFamily: '"McLaren", cursive',
              fontWeight: 400,
              textTransform: 'none',
              padding: '10px 24px',
              fontSize: '16px',
              '&:hover': {
                borderColor: '#FF5252',
                backgroundColor: 'rgba(255, 107, 107, 0.04)',
              },
              '&:disabled': {
                opacity: 0.6,
              },
            }}
          >
            {isResetting ? 'Resetting...' : 'Reset UI Settings'}
          </Button>
        </Box>
      </Paper>

      {/* Tips */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          background: 'rgba(153, 242, 247, 0.2)',
          borderRadius: '15px',
          borderLeft: '4px solid #99F2F7',
        }}
      >
        <Typography
          sx={{
            color: '#2D7A80',
            fontSize: '16px',
            fontFamily: '"Nobile", sans-serif',
            fontStyle: 'italic',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            lineHeight: 1.6,
          }}
        >
          💡 <strong>Tip:</strong> Complete your profile to earn the "Profile Customizer" achievement! 
          More details = better connections with fellow collectors!
        </Typography>
      </Paper>
    </Box>
  );
};

export default ProfileSettings;