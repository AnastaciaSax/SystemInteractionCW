import React from 'react';
import { Box, Typography, Grid, Tooltip, Paper } from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import DiamondIcon from '@mui/icons-material/Diamond';
import StarIcon from '@mui/icons-material/Star';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import EditIcon from '@mui/icons-material/Edit';
import PeopleIcon from '@mui/icons-material/People';
import LockOpenIcon from '@mui/icons-material/LockOpen';

interface AchievementsSectionProps {
  user: any;
  isOwnProfile: boolean;
}

const AchievementsSection: React.FC<AchievementsSectionProps> = ({ user, isOwnProfile }) => {
  // Все возможные достижения
  const allAchievements = [
    {
      id: 'profile_customizer',
      title: 'Profile Customizer',
      description: 'Customize your profile for the first time!',
      icon: <EditIcon />,
      color: '#EC2EA6',
      requirement: 'Update your profile information',
      earned: user?.profile?.achievements?.includes('Profile Customizer') || false,
    },
    {
      id: 'first_trade',
      title: 'First Trade',
      description: 'Complete your first successful trade',
      icon: <ShoppingCartIcon />,
      color: '#4CAF50',
      requirement: 'Complete 1 trade',
      earned: user?.profile?.tradeCount >= 1,
    },
    {
      id: 'trusted_collector',
      title: 'Trusted Collector',
      description: 'Earn trust through successful trades',
      icon: <DiamondIcon />,
      color: '#9C27B0',
      requirement: 'Complete 5+ trades with 4.0+ rating',
      earned: user?.profile?.tradeCount >= 5 && user?.profile?.rating >= 4.0,
    },
    {
      id: 'social_butterfly',
      title: 'Social Butterfly',
      description: 'Connect with other collectors',
      icon: <PeopleIcon />,
      color: '#2196F3',
      requirement: 'Message 5 different collectors',
      earned: false, // Пока не отслеживаем
    },
    {
      id: 'rating_star',
      title: 'Rating Star',
      description: 'Receive your first 5-star rating',
      icon: <StarIcon />,
      color: '#FFC107',
      requirement: 'Get a 5-star rating from another collector',
      earned: user?.profile?.rating === 5,
    },
    {
      id: 'verified_member',
      title: 'Verified Member',
      description: 'Verify your email address',
      icon: <LockOpenIcon />,
      color: '#00BCD4',
      requirement: 'Verify your email',
      earned: user?.isVerified || false,
    },
  ];

  // Разделяем на полученные и будущие
  const earnedAchievements = allAchievements.filter(ach => ach.earned);
  const upcomingAchievements = allAchievements.filter(ach => !ach.earned);

  return (
    <Box>
      <Typography
        variant="h4"
        sx={{
          color: 'var(--title, #560D30)',
          fontSize: { xs: '28px', md: '36px' },
          fontFamily: '"McLaren", cursive',
          fontWeight: 400,
          mb: 4,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <EmojiEventsIcon sx={{ color: '#EC2EA6', fontSize: 40 }} />
        Achievements
      </Typography>

      {/* Полученные достижения */}
      {earnedAchievements.length > 0 && (
        <>
          <Typography
            variant="h5"
            sx={{
              color: '#852654',
              fontSize: '24px',
              fontFamily: '"McLaren", cursive',
              fontWeight: 400,
              mb: 3,
            }}
          >
            Earned Achievements ({earnedAchievements.length}/{allAchievements.length})
          </Typography>
          
          <Grid container spacing={3} sx={{ mb: 6 }}>
            {earnedAchievements.map((achievement) => (
              <Grid item xs={12} sm={6} md={4} key={achievement.id}>
                <Tooltip title={`🎉 Earned: ${achievement.description}`} arrow>
                  <Paper
                    elevation={3}
                    sx={{
                      p: 3,
                      borderRadius: '20px',
                      background: `linear-gradient(135deg, ${achievement.color}15 0%, ${achievement.color}30 100%)`,
                      border: `2px solid ${achievement.color}`,
                      textAlign: 'center',
                      transition: 'transform 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: 60,
                        height: 60,
                        background: achievement.color,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 16px',
                        color: 'white',
                      }}
                    >
                      {achievement.icon}
                    </Box>
                    
                    <Typography
                      sx={{
                        color: achievement.color,
                        fontSize: '20px',
                        fontFamily: '"McLaren", cursive',
                        fontWeight: 400,
                        mb: 1,
                      }}
                    >
                      {achievement.title}
                    </Typography>
                    
                    <Typography
                      sx={{
                        color: '#804A64',
                        fontSize: '14px',
                        fontFamily: '"Nobile", sans-serif',
                        fontWeight: 400,
                      }}
                    >
                      {achievement.description}
                    </Typography>
                  </Paper>
                </Tooltip>
              </Grid>
            ))}
          </Grid>
        </>
      )}

      {/* Будущие достижения */}
      {isOwnProfile && upcomingAchievements.length > 0 && (
        <>
          <Typography
            variant="h5"
            sx={{
              color: '#852654',
              fontSize: '24px',
              fontFamily: '"McLaren", cursive',
              fontWeight: 400,
              mb: 3,
            }}
          >
            Upcoming Achievements
          </Typography>
          
          <Grid container spacing={3}>
            {upcomingAchievements.map((achievement) => (
              <Grid item xs={12} sm={6} md={4} key={achievement.id}>
                <Tooltip title={`🔓 Unlock by: ${achievement.requirement}`} arrow>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      borderRadius: '20px',
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.7) 0%, rgba(240,240,240,0.7) 100%)',
                      border: '2px dashed #999',
                      textAlign: 'center',
                      opacity: 0.7,
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    {/* Затемнение для недоступных */}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(255,255,255,0.8)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Box
                        sx={{
                          width: 60,
                          height: 60,
                          background: '#999',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          opacity: 0.5,
                        }}
                      >
                        {achievement.icon}
                      </Box>
                    </Box>
                    
                    <Typography
                      sx={{
                        color: '#999',
                        fontSize: '20px',
                        fontFamily: '"McLaren", cursive',
                        fontWeight: 400,
                        mb: 1,
                      }}
                    >
                      {achievement.title}
                    </Typography>
                    
                    <Typography
                      sx={{
                        color: '#999',
                        fontSize: '12px',
                        fontFamily: '"Nobile", sans-serif',
                        fontWeight: 400,
                        fontStyle: 'italic',
                      }}
                    >
                      🔒 {achievement.requirement}
                    </Typography>
                  </Paper>
                </Tooltip>
              </Grid>
            ))}
          </Grid>
        </>
      )}

      {/* Если нет достижений */}
      {earnedAchievements.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 6 }}>
          <Typography
            sx={{
              color: '#852654',
              fontSize: '18px',
              fontFamily: '"Nobile", sans-serif',
              fontStyle: 'italic',
              mb: 2,
            }}
          >
            No achievements yet. Start your collector journey to earn badges! 🌟
          </Typography>
          
          {isOwnProfile && (
            <Typography
              sx={{
                color: '#EC2EA6',
                fontSize: '16px',
                fontFamily: '"Nobile", sans-serif',
              }}
            >
              💡 <strong>Tip:</strong> Update your profile settings to earn your first achievement!
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
};

export default AchievementsSection;