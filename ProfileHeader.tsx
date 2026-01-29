import React, { useState, useRef } from 'react';
import { Box, IconButton, CircularProgress } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DiamondIcon from '@mui/icons-material/Diamond';
import Tooltip from '@mui/material/Tooltip';
import StarIcon from '@mui/icons-material/Star';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WorkIcon from '@mui/icons-material/Work';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

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
  const [currentAvatar, setCurrentAvatar] = useState<string | null>(null);
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
    
    // Создаем временный URL для предпросмотра
    const tempUrl = URL.createObjectURL(file);
    setCurrentAvatar(tempUrl);

    try {
      const success = await onAvatarUpload(file);
      if (success) {
        // После успешной загрузки очищаем временный URL
        URL.revokeObjectURL(tempUrl);
        setCurrentAvatar(null);
      } else {
        // Если загрузка не удалась, очищаем временный URL и показываем старый аватар
        URL.revokeObjectURL(tempUrl);
        setCurrentAvatar(null);
      }
    } catch (error) {
      console.error('Avatar upload error:', error);
      // Очищаем временный URL в случае ошибки
      if (tempUrl) {
        URL.revokeObjectURL(tempUrl);
      }
      setCurrentAvatar(null);
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
      case 'verified': return '✅';
      default: return '👤';
    }
  };

  // Форматирование даты
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not specified';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Расчет стажа в годах
  const calculateYears = (dateString: string) => {
    if (!dateString) return 0;
    const joinDate = new Date(dateString);
    const today = new Date();
    const years = today.getFullYear() - joinDate.getFullYear();
    const m = today.getMonth() - joinDate.getMonth();
    return m < 0 ? years - 1 : years;
  };

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: { xs: 'auto', md: '276px' },
        backgroundImage: 'url(/assets/banner-profile.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'flex-start',
        display: 'flex',
        mb: 4,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Розовая подложка */}
      <Box
        sx={{
          alignSelf: 'stretch',
          maxHeight: '200px',
          paddingLeft: { xs: 2, sm: 4, md: 6 },
          paddingRight: { xs: 2, sm: 4, md: 6 },
          background: 'var(--brand, #F6C4D4)',
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
          gap: { xs: 2, md: 4 },
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          paddingTop: { xs: 3, sm: 4, md: 4 },
          paddingBottom: { xs: 2, sm: 3, md: 3 },
          position: 'relative',
        }}
      >
        {/* Аватар с возможностью редактирования */}
        <Box sx={{ 
          position: 'relative',
          marginTop: { xs: '-50px', sm: '-60px', md: '-80px' },
        }}>
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
              backgroundColor: '#F6C4D4', // Фон на случай прозрачного изображения
              '&:hover': isOwnProfile ? {
                '& .edit-overlay': {
                  opacity: 1,
                },
              } : {},
            }}
            onClick={handleAvatarClick}
          >
            {isUploading ? (
              // Показываем спиннер во время загрузки
              <Box
                sx={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'rgba(246, 196, 212, 0.8)',
                }}
              >
                <CircularProgress 
                  size={60} 
                  sx={{ 
                    color: '#EC2EA6',
                    '& .MuiCircularProgress-circle': {
                      strokeLinecap: 'round',
                    }
                  }} 
                />
              </Box>
            ) : (
              <img
                src={currentAvatar || user?.profile?.avatar || '/assets/default-avatar.png'}
                alt={user?.username || 'User'}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  backgroundColor: '#F6C4D4', // Задний фон для прозрачных изображений
                }}
                onError={(e) => {
                  // Если изображение не загрузилось, показываем дефолтное
                  e.currentTarget.src = '/assets/default-avatar.png';
                }}
              />
            )}
            
            {isOwnProfile && !isUploading && (
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
          
          {/* Значок алмаза (Trust Badge) - показываем только если статус Expert или имеет Trust Badge */}
          {(user?.profile?.status === 'Expert' || hasTrustBadge) && (
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
          justifyContent: 'flex-start', 
          alignItems: 'flex-start', 
          gap: 1,
          flex: 1,
          paddingTop: { xs: 2, sm: 1, md: 0 },
        }}>
          {/* Имя пользователя и статус */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2,
            flexWrap: 'wrap',
            mb: 0.5,
          }}>
            <Box
              sx={{
                color: 'var(--title, #560D30)',
                fontSize: { xs: '24px', sm: '28px', md: '32px' },
                fontFamily: '"McLaren", cursive',
                fontWeight: 400,
                lineHeight: 1.2,
              }}
            >
              {user?.username || 'Anonymous'}
            </Box>
            <Box
              sx={{
                color: 'var(--2d, #852654)',
                fontSize: { xs: '16px', sm: '18px', md: '20px' },
                fontFamily: '"McLaren", cursive',
                fontWeight: 400,
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
              }}
            >
              {getStatusEmoji(user?.profile?.status || 'beginner')}
            </Box>
          </Box>
          
          {/* Основные данные в один ряд */}
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'flex-start', sm: 'center' },
            flexWrap: 'wrap',
            gap: { xs: 1, sm: 3 },
            mb: 1,
          }}>
            {/* Регион */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LocationOnIcon sx={{ color: '#852654', fontSize: 16 }} />
              <Box
                sx={{
                  color: 'var(--2d, #852654)',
                  fontSize: '14px',
                  fontFamily: '"Nobile", sans-serif',
                  fontWeight: 400,
                }}
              >
                <strong>Region:</strong> {user?.region || 'Not specified'}
              </Box>
            </Box>

            {/* Количество сделок */}
            {user?.profile?.tradeCount !== undefined && user?.profile?.tradeCount !== null && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <WorkIcon sx={{ color: '#852654', fontSize: 16 }} />
                <Box
                  sx={{
                    color: 'var(--2d, #852654)',
                    fontSize: '14px',
                    fontFamily: '"Nobile", sans-serif',
                    fontWeight: 400,
                  }}
                >
                  <strong>Trades:</strong> {user.profile.tradeCount}
                </Box>
              </Box>
            )}
          </Box>
          
          {/* Дополнительные данные во втором ряду */}
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'flex-start', sm: 'center' },
            flexWrap: 'wrap',
            gap: { xs: 1, sm: 3 },
          }}>
            {/* Дата регистрации */}
            {user?.createdAt && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CalendarTodayIcon sx={{ color: '#852654', fontSize: 14 }} />
                <Box
                  sx={{
                    color: 'var(--2d, #852654)',
                    fontSize: '12px',
                    fontFamily: '"Nobile", sans-serif',
                    fontWeight: 400,
                  }}
                >
                  <strong>Joined:</strong> {formatDate(user.createdAt)} 
                  {` (${calculateYears(user.createdAt)} year${calculateYears(user.createdAt) !== 1 ? 's' : ''})`}
                </Box>
              </Box>
            )}
            
            {/* Локация из профиля */}
            {user?.profile?.location && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box
                  sx={{
                    color: 'var(--2d, #852654)',
                    fontSize: '12px',
                    fontFamily: '"Nobile", sans-serif',
                    fontWeight: 400,
                  }}
                >
                  <strong>Location:</strong> {user.profile.location}
                </Box>
              </Box>
            )}
            
            {/* Статус верификации */}
            {user?.isVerified && (
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                backgroundColor: 'rgba(76, 175, 80, 0.1)',
                padding: '2px 8px',
                borderRadius: '12px',
              }}>
                <Box
                  sx={{
                    color: '#4CAF50',
                    fontSize: '12px',
                    fontFamily: '"Nobile", sans-serif',
                    fontWeight: 600,
                  }}
                >
                  ✅ Verified Collector
                </Box>
              </Box>
            )}
          </Box>
          
          {/* Биография (если есть) */}
          {user?.profile?.bio && (
            <Box
              sx={{
                color: '#804A64',
                fontSize: '14px',
                fontFamily: '"Nobile", sans-serif',
                fontWeight: 400,
                mt: 2,
                maxWidth: '500px',
                fontStyle: 'italic',
                lineHeight: 1.4,
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