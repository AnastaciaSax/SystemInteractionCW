import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Container, Skeleton } from '@mui/material';
import Header from '../../components/Layout/Header';
import Footer from '../../components/Layout/Footer';
import ProfileHeader from './components/ProfileHeader';
import ProfileContent from './components/ProfileContent';
import Notification from '../../components/ui/Notification';
import { profileAPI } from '../../services/api';
import './Profile.css';

const Profile: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [profileUser, setProfileUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'user-data' | 'settings'>('user-data');
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    type: 'success' | 'error' | 'info';
  }>({
    open: false,
    message: '',
    type: 'info',
  });

  const [userWishlist, setUserWishlist] = useState<any[]>([]);
  const [userTradeAds, setUserTradeAds] = useState<any[]>([]);
  const [userRatings, setUserRatings] = useState<any[]>([]);

  const showNotification = (message: string, type: 'success' | 'error' | 'info') => {
    setNotification({
      open: true,
      message,
      type,
    });
  };

  // Проверяем, свой ли это профиль
  const isOwnProfile = () => {
    if (!currentUser || !profileUser) return false;
    return currentUser.id === profileUser.id;
  };

  // Загружаем данные профиля
  const fetchProfileData = async () => {
    setLoading(true);
    try {
      // Получаем текущего пользователя
      const currentUserStr = localStorage.getItem('user');
      if (currentUserStr) {
        setCurrentUser(JSON.parse(currentUserStr));
      }

      // Определяем, чей профиль загружать
      const userId = id || JSON.parse(currentUserStr || '{}').id;
      
      if (!userId) {
        navigate('/sign-in');
        return;
      }

      // Загружаем данные профиля пользователя
      const profileResponse = await profileAPI.getProfile(userId);
      const userData = profileResponse.data as any;
      setProfileUser(userData);
      
      // Загружаем отзывы
      if (userData && userData.ratingsReceived && Array.isArray(userData.ratingsReceived)) {
        setUserRatings(userData.ratingsReceived);
      } else {
        setUserRatings([]);
      }
      
      // Загружаем вишлист пользователя
      const wishlistResponse = await profileAPI.getUserWishlist(userId);
      setUserWishlist(wishlistResponse.data as any[] || []);
      
      // Загружаем объявления пользователя
      const tradeAdsResponse = await profileAPI.getUserTradeAds(userId);
      setUserTradeAds(tradeAdsResponse.data as any[] || []);
      
    } catch (error) {
      console.error('Error fetching profile data:', error);
      showNotification('Failed to load profile data', 'error');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, [id]);

  const handleTabChange = (tab: 'user-data' | 'settings') => {
    if (isOwnProfile() || tab === 'user-data') {
      setActiveTab(tab);
    }
  };

  const handleUpdateProfile = async (data: any): Promise<boolean> => {
    try {
      const response = await profileAPI.updateProfile(data);
      const responseData = response.data as any;
      
      if (responseData.success) {
        // Обновляем данные текущего пользователя
        localStorage.setItem('user', JSON.stringify(responseData.user));
        setCurrentUser(responseData.user);
        setProfileUser(responseData.user);
        
        // Показываем уведомление об ачивке
        if (responseData.newAchievement) {
          showNotification(
            `🎉 Yay! You earned the "${responseData.newAchievement}" achievement!`,
            'success'
          );
        } else {
          showNotification('Profile updated successfully! ✨', 'success');
        }
        
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating profile:', error);
      showNotification('Failed to update profile', 'error');
      return false;
    }
  };

  const handleAvatarUpload = async (file: File): Promise<boolean> => {
  try {
    const formData = new FormData();
    formData.append('avatar', file);
    
    const response = await profileAPI.uploadAvatar(formData);
    const responseData = response.data as any;
    
    if (responseData.success) {
      // Обновляем данные пользователя из ответа сервера
      if (responseData.user) {
        localStorage.setItem('user', JSON.stringify(responseData.user));
        setCurrentUser(responseData.user);
        setProfileUser(responseData.user);
      }
      
      showNotification('Avatar updated successfully! 📸', 'success');
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error uploading avatar:', error);
    showNotification('Failed to upload avatar', 'error');
    return false;
  }
};

  // Skeleton для загрузки
  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(90deg, #FFF1F8 0%, #E9C4D9 100%)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Header />
        
        <Container
          sx={{
            maxWidth: '1280px !important',
            py: { xs: 4, sm: 6, md: 8 },
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Skeleton для заголовка профиля */}
          <Skeleton
            variant="rectangular"
            width="100%"
            height={276}
            sx={{
              borderRadius: '20px',
              mb: 4,
              bgcolor: 'rgba(246, 196, 212, 0.5)',
            }}
          />

          {/* Skeleton для переключателя вкладок */}
          <Box sx={{ 
            width: '100%', 
            display: 'flex', 
            justifyContent: 'flex-end',
            alignItems: 'center',
            mb: 4 
          }}>
            <Skeleton
              variant="rectangular"
              width={622}
              height={37}
              sx={{
                borderRadius: '10px',
                bgcolor: 'rgba(255, 255, 255, 0.8)',
              }}
            />
          </Box>

          {/* Skeleton для контента */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {/* Skeleton для секции отзывов */}
            <Box>
              <Skeleton
                variant="text"
                width={200}
                height={48}
                sx={{ mb: 3, bgcolor: 'rgba(86, 13, 48, 0.2)' }}
              />
              <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                {[1, 2, 3].map((i) => (
                  <Skeleton
                    key={i}
                    variant="rectangular"
                    width={300}
                    height={200}
                    sx={{
                      borderRadius: '40px',
                      bgcolor: 'rgba(153, 242, 247, 0.3)',
                    }}
                  />
                ))}
              </Box>
            </Box>

            {/* Skeleton для вишлиста */}
            <Box>
              <Skeleton
                variant="text"
                width={300}
                height={48}
                sx={{ mb: 3, bgcolor: 'rgba(86, 13, 48, 0.2)' }}
              />
              <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                {[1, 2, 3].map((i) => (
                  <Skeleton
                    key={i}
                    variant="rectangular"
                    width={350}
                    height={400}
                    sx={{
                      borderRadius: '10px',
                      bgcolor: 'rgba(255, 255, 255, 0.7)',
                    }}
                  />
                ))}
              </Box>
            </Box>
          </Box>
        </Container>

        <Footer />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(90deg, #FFF1F8 0%, #E9C4D9 100%)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}
    >
      <Header />

      {/* Уведомление */}
      <Notification
        open={notification.open}
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification(prev => ({ ...prev, open: false }))}
        duration={5000}
      />

      <Container
        sx={{
          maxWidth: '1280px !important',
          py: { xs: 4, sm: 6, md: 8 },
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <ProfileHeader
          user={profileUser}
          isOwnProfile={isOwnProfile()}
          onAvatarUpload={handleAvatarUpload}
        />

        {/* Переключатель вкладок - выровнен по правому краю как в макете */}
        <Box sx={{ 
          width: '100%', 
          display: 'flex', 
          justifyContent: 'flex-end', // Выравнивание по правому краю
          alignItems: 'center',
          mb: 4 
        }}>
          <Box
            sx={{
              width: '622px',
              height: '37px',
              background: 'white',
              borderRadius: '10px',
              outline: '1px solid #EC2EA6',
              outlineOffset: '-1px',
              display: 'flex',
              overflow: 'hidden',
            }}
          >
            {isOwnProfile() ? (
              // Для владельца профиля показываем обе вкладки
              <>
                <Box
                  onClick={() => handleTabChange('user-data')}
                  sx={{
                    flex: 1,
                    alignSelf: 'stretch',
                    background: activeTab === 'user-data' ? '#F05EBA' : 'transparent',
                    borderRadius: '10px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      backgroundColor: activeTab === 'user-data' ? '#F05EBA' : 'rgba(240, 94, 186, 0.1)',
                    },
                  }}
                >
                  <Box
                    sx={{
                      textAlign: 'center',
                      color: activeTab === 'user-data' ? 'white' : '#560D30',
                      fontSize: '20px',
                      fontFamily: '"McLaren", cursive',
                      fontWeight: 400,
                      padding: '4px 0',
                    }}
                  >
                    USER DATA
                  </Box>
                </Box>
                
                <Box
                  onClick={() => handleTabChange('settings')}
                  sx={{
                    flex: 1,
                    alignSelf: 'stretch',
                    background: activeTab === 'settings' ? '#F05EBA' : 'transparent',
                    borderRadius: '10px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      backgroundColor: activeTab === 'settings' ? '#F05EBA' : 'rgba(240, 94, 186, 0.1)',
                    },
                  }}
                >
                  <Box
                    sx={{
                      textAlign: 'center',
                      color: activeTab === 'settings' ? 'white' : '#560D30',
                      fontSize: '20px',
                      fontFamily: '"McLaren", cursive',
                      fontWeight: 400,
                      padding: '4px 0',
                    }}
                  >
                    SETTINGS
                  </Box>
                </Box>
              </>
            ) : (
              // Для гостей показываем только USER DATA как активную вкладку
              <Box
                sx={{
                  flex: 1,
                  alignSelf: 'stretch',
                  background: '#F05EBA', // Всегда активная для гостей
                  borderRadius: '10px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Box
                  sx={{
                    textAlign: 'center',
                    color: 'white',
                    fontSize: '20px',
                    fontFamily: '"McLaren", cursive',
                    fontWeight: 400,
                    padding: '4px 0',
                  }}
                >
                  USER DATA
                </Box>
              </Box>
            )}
          </Box>
        </Box>

        <ProfileContent
          activeTab={activeTab}
          user={profileUser}
          isOwnProfile={isOwnProfile()}
          ratings={userRatings}
          wishlist={userWishlist}
          tradeAds={userTradeAds}
          onUpdateProfile={handleUpdateProfile}
          onSuccess={(message) => showNotification(message, 'success')}
          onError={(message) => showNotification(message, 'error')}
        />
      </Container>

      <Footer />
    </Box>
  );
};

export default Profile;