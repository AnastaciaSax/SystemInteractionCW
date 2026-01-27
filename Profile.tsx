import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Container } from '@mui/material';
import Header from '../../components/Layout/Header';
import Footer from '../../components/Layout/Footer';
import PageBanner from '../../components/PageBanner';
import ProfileHeader from './components/ProfileHeader';
import ProfileContent from './components/ProfileContent';
import Notification from '../../components/ui/Notification';
import { profileAPI, usersAPI, tradeAPI, wishlistAPI } from '../../services/api';
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
      const userData = profileResponse.data;
      setProfileUser(userData);
      
      // Загружаем отзывы
      if (userData?.ratingsReceived) {
        setUserRatings(userData.ratingsReceived);
      }
      
      // Загружаем вишлист пользователя
      const wishlistResponse = await profileAPI.getUserWishlist(userId);
      setUserWishlist(wishlistResponse.data || []);
      
      // Загружаем объявления пользователя
      const tradeAdsResponse = await profileAPI.getUserTradeAds(userId);
      setUserTradeAds(tradeAdsResponse.data || []);
      
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

  const handleUpdateProfile = async (data: any) => {
    try {
      const response = await profileAPI.updateProfile(data);
      
      if (response.data.success) {
        // Обновляем данные текущего пользователя
        localStorage.setItem('user', JSON.stringify(response.data.user));
        setCurrentUser(response.data.user);
        setProfileUser(response.data.user);
        
        // Показываем уведомление об ачивке
        if (response.data.newAchievement) {
          showNotification(
            `🎉 Yay! You earned the "${response.data.newAchievement}" achievement!`,
            'success'
          );
        } else {
          showNotification('Profile updated successfully! ✨', 'success');
        }
        
        return true;
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      showNotification('Failed to update profile', 'error');
      return false;
    }
  };

  const handleAvatarUpload = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      
      const response = await profileAPI.uploadAvatar(formData);
      
      if (response.data.success) {
        // Обновляем аватар в профиле
        await handleUpdateProfile({ avatar: response.data.avatarUrl });
        showNotification('Avatar updated successfully! 📸', 'success');
        return true;
      }
    } catch (error) {
      console.error('Error uploading avatar:', error);
      showNotification('Failed to upload avatar', 'error');
      return false;
    }
  };

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
        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div className="loading-spinner">Loading profile...</div>
        </Box>
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

      <PageBanner
        title="Profile"
        breadcrumbs={[
          { label: 'Home', path: '/' },
          { label: 'Profile', path: '/profile' },
          profileUser?.username && { label: profileUser.username },
        ].filter(Boolean) as any}
        imageUrl="/assets/banner-profile.png"
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

        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', mb: 4 }}>
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
            
            {isOwnProfile() && (
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