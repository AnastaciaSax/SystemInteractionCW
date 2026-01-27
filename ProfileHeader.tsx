import React, { useState, useRef } from 'react';
import { Box, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DiamondIcon from '@mui/icons-material/Diamond';
import Tooltip from '@mui/material/Tooltip';

interface ProfileHeaderProps {
  user: any;
  isOwnProfile: boolean;
  onAvatarUpload: (file: File) => Promise<boolean>;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  user,
  isOwnProfile,
  onAvatarUpload,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Проверяем, заслужил ли пользователь знак доверия
  const hasTrustBadge = user?.profile?.tradeCount >= 5 && user?.profile?.rating >= 4.0;

  const handleAvatarClick = () => {
    if (isOwnProfile && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be less than 5MB');
      return;
    }

    setIsUploading(true);
    try {
      await onAvatarUpload(file);
    } catch (error) {
      console.error('Avatar upload error:', error);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const getStatusEmoji = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'expert': return '💎';
      case 'active trader': return '✨';
      case 'beginner': return '🌱';
      default: return '👤';
    }
  };

  return (
    <Box
      sx={{
        width: '100%',
        height: { xs: 'auto', md: '276px' },
        backgroundImage: 'linear-gradient(180deg, rgba(246, 196, 212, 0.9) 0%, rgba(246, 196, 212, 0.7) 100%)',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'flex-start',
        gap: 2,
        display: 'flex',
        borderRadius: '20px',
        mb: 4,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          alignSelf: 'stretch',
          height: '124px',
          paddingLeft: { xs: 2, sm: 4, md: 6 },
          paddingRight: { xs: 2, sm: 4, md: 6 },
          background: 'var(--brand, #F6C4D4)',
          justifyContent: 'flex-start',
          alignItems: 'center',
          gap: { xs: 2, md: 4 },
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          paddingY: { xs: 3, sm: 0 },
        }}
      >
        {/* Аватар с возможностью редактирования */}
        <Box sx={{ position: 'relative' }}>
          <Box
            sx={{
              width: { xs: '120px', sm: '160px', md: '209px' },
              height: { xs: '120px', sm: '160px', md: '209px' },
              borderRadius: '9999px',
              outline: '6px var(--checked, #EC2EA6) solid',
              outlineOffset: '-3px',
              overflow: 'hidden',
              cursor: isOwnProfile ? 'pointer' : 'default',
              position: 'relative',
              '&:hover': isOwnProfile ? {
                '& .edit-overlay': {
                  opacity: 1,
                },
              } : {},
            }}
            onClick={handleAvatarClick}
          >
            <img
              src={user?.profile?.avatar || '/assets/default-avatar.png'}
              alt={user?.username || 'User'}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
            
            {isOwnProfile && (
              <>
                <Box
                  className="edit-overlay"
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: 0,
                    transition: 'opacity 0.3s ease',
                    borderRadius: '9999px',
                  }}
                >
                  <EditIcon sx={{ color: 'white', fontSize: 32 }} />
                </Box>
                
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </>
            )}
          </Box>
          
          {/* Значок алмаза (Trust Badge) */}
          {hasTrustBadge && (
            <Tooltip 
              title="Trusted Collector - Earned through 5+ successful trades and high ratings!"
              arrow
              placement="top"
            >
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 10,
                  right: 10,
                  backgroundColor: '#EC2EA6',
                  borderRadius: '50%',
                  width: 40,
                  height: 40,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '3px solid white',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
                  cursor: 'help',
                  zIndex: 10,
                }}
              >
                <DiamondIcon sx={{ color: 'white', fontSize: 24 }} />
              </Box>
            </Tooltip>
          )}
        </Box>

        {/* Информация о пользователе */}
        <Box sx={{ 
          flexDirection: 'column', 
          justifyContent: 'flex-end', 
          alignItems: 'flex-start', 
          gap: 1,
          flex: 1,
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                color: 'var(--title, #560D30)',
                fontSize: { xs: '24px', sm: '28px', md: '32px' },
                fontFamily: '"McLaren", cursive',
                fontWeight: 400,
              }}
            >
              {user?.username} {getStatusEmoji(user?.profile?.status)}
            </Box>
          </Box>
          
          <Box
            sx={{
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              color: 'var(--2d, #852654)',
              fontSize: { xs: '14px', md: '16px' },
              fontFamily: '"Nobile", sans-serif',
              fontWeight: 400,
            }}
          >
            Region: {user?.region || 'Not specified'}
          </Box>
          
          <Box
            sx={{
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              color: 'var(--2d, #852654)',
              fontSize: { xs: '14px', md: '16px' },
              fontFamily: '"Nobile", sans-serif',
              fontWeight: 400,
            }}
          >
            Status: {user?.profile?.status || 'Beginner'} • {user?.profile?.tradeCount || 0} trades completed
          </Box>
          
          {user?.profile?.bio && (
            <Box
              sx={{
                color: '#804A64',
                fontSize: '16px',
                fontFamily: '"Nobile", sans-serif',
                fontWeight: 400,
                mt: 1,
                maxWidth: '500px',
                fontStyle: 'italic',
              }}
            >
              "{user.profile.bio}"
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default ProfileHeader;