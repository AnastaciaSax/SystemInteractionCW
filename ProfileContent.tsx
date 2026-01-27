import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import FeedbackSection from './FeedbackSection';
import WishlistPreview from './WishlistPreview';
import TradeAdsPreview from './TradeAdsPreview';
import ProfileSettings from './ProfileSettings';
import AchievementsSection from './AchievementsSection';

interface ProfileContentProps {
  activeTab: 'user-data' | 'settings';
  user: any;
  isOwnProfile: boolean;
  ratings: any[];
  wishlist: any[];
  tradeAds: any[];
  onUpdateProfile: (data: any) => Promise<boolean>;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

const ProfileContent: React.FC<ProfileContentProps> = ({
  activeTab,
  user,
  isOwnProfile,
  ratings,
  wishlist,
  tradeAds,
  onUpdateProfile,
  onSuccess,
  onError,
}) => {
  if (activeTab === 'settings' && !isOwnProfile) {
    return (
      <Box sx={{ textAlign: 'center', py: 10 }}>
        <Typography variant="h5" sx={{ color: '#560D30', fontFamily: '"McLaren", cursive' }}>
          You can only edit your own profile settings! 🐾
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      {activeTab === 'user-data' ? (
        <>
          {/* Секция отзывов */}
          <FeedbackSection 
            user={user}
            ratings={ratings}
          />
          
          {/* Секция вишлиста */}
          {wishlist.length > 0 && (
            <WishlistPreview 
              wishlist={wishlist}
              username={user?.username}
            />
          )}
          
          {/* Секция объявлений */}
          {tradeAds.length > 0 && (
            <TradeAdsPreview 
              tradeAds={tradeAds}
              username={user?.username}
            />
          )}
          
          {/* Если нет данных */}
          {wishlist.length === 0 && tradeAds.length === 0 && ratings.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 10 }}>
              <Typography variant="h5" sx={{ color: '#560D30', fontFamily: '"McLaren", cursive', mb: 2 }}>
                No activity yet 🌱
              </Typography>
              <Typography sx={{ color: '#852654', fontFamily: '"Nobile", sans-serif' }}>
                {isOwnProfile 
                  ? "Start by adding figurines to your wishlist or creating trade ads!"
                  : "This collector hasn't been active yet."}
              </Typography>
            </Box>
          )}
        </>
      ) : (
        <>
          {/* Настройки профиля */}
          <ProfileSettings 
            user={user}
            onUpdateProfile={onUpdateProfile}
            onSuccess={onSuccess}
            onError={onError}
          />
          
          {/* Достижения */}
          <AchievementsSection 
            user={user}
            isOwnProfile={isOwnProfile}
          />
        </>
      )}
    </Box>
  );
};

export default ProfileContent;