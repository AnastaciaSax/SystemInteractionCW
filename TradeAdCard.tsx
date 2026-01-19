// client/src/components/cards/TradeAdCard/TradeAdCard.tsx
import React, { useState } from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Avatar,
  Chip,
  IconButton,
  Menu,
  MenuItem,
   Button,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Modal from '../ui/Modal';
import TradeAdForm from '../forms/TradeAdForm';
import { useNavigate } from 'react-router-dom';

interface TradeAdCardProps {
  ad: any;
  isOwner?: boolean;
  onDelete?: (id: string) => Promise<void>;
  onUpdate?: (id: string, data: any) => Promise<void>;
  showMenu?: boolean;
}

const TradeAdCard: React.FC<TradeAdCardProps> = ({
  ad,
  isOwner = false,
  onDelete,
  onUpdate,
  showMenu = true,
}) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    handleMenuClose();
    setEditModalOpen(true);
  };

  const handleDelete = async () => {
    handleMenuClose();
    if (window.confirm('Are you sure you want to delete this trade ad?')) {
      setLoading(true);
      try {
        await onDelete?.(ad.id);
      } catch (error) {
        console.error('Delete error:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleUpdate = async (data: any) => {
    setLoading(true);
    try {
      await onUpdate?.(ad.id, data);
      setEditModalOpen(false);
    } catch (error) {
      console.error('Update error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOfferTrade = () => {
    navigate(`/chit-chat?trade=${ad.id}&user=${ad.user.id}`);
  };

  const handleViewProfile = () => {
    navigate(`/profile/${ad.user.id}`);
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'MINT': return '#4CAF50';
      case 'TLC': return '#FF9800';
      case 'GOOD': return '#2196F3';
      case 'NIB': return '#9C27B0';
      default: return '#560D30';
    }
  };

  const getConditionLabel = (condition: string) => {
    switch (condition) {
      case 'MINT': return 'Mint';
      case 'TLC': return 'Needs TLC';
      case 'GOOD': return 'Good';
      case 'NIB': return 'New in Box';
      default: return condition;
    }
  };

  return (
    <>
      <Card
        onClick={() => setDetailModalOpen(true)}
        sx={{
          width: '100%',
          maxWidth: { xs: '100%', sm: 400, md: 412 },
          borderRadius: '10px',
          overflow: 'hidden',
          cursor: 'pointer',
          transition: 'transform 0.3s, box-shadow 0.3s',
          position: 'relative',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 24px rgba(86, 13, 48, 0.2)',
          },
        }}
      >
        {showMenu && isOwner && (
          <IconButton
            onClick={handleMenuClick}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              zIndex: 1,
              '&:hover': {
                backgroundColor: 'white',
              },
            }}
          >
            <MoreVertIcon sx={{ color: '#560D30' }} />
          </IconButton>
        )}

        <CardMedia
          component="img"
          height="412"
          image={ad.photo || '/assets/default-figurine.png'}
          alt={ad.title}
          sx={{
            objectFit: 'cover',
            backgroundColor: '#FFF1F8',
          }}
        />
        
        <CardContent sx={{ padding: 3, backgroundColor: 'white' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="h6"
                sx={{
                  fontFamily: '"McLaren", cursive',
                  color: '#560D30',
                  mb: 1,
                  fontSize: { xs: '16px', sm: '18px', md: '20px' },
                }}
              >
                {ad.title}
              </Typography>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
                <Chip
                  label={`Condition: ${getConditionLabel(ad.condition)}`}
                  size="small"
                  sx={{
                    backgroundColor: getConditionColor(ad.condition),
                    color: 'white',
                    fontSize: '12px',
                    height: '24px',
                  }}
                />
                
                <Chip
                  label={`Series: ${ad.figurine?.series || ad.series}`}
                  size="small"
                  sx={{
                    backgroundColor: '#F05EBA',
                    color: 'white',
                    fontSize: '12px',
                    height: '24px',
                  }}
                />
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                <LocationOnIcon sx={{ fontSize: 16, color: '#882253' }} />
                <Typography
                  variant="body2"
                  sx={{
                    color: '#882253',
                    fontFamily: '"Nobile", sans-serif',
                    fontSize: '14px',
                  }}
                >
                  {ad.location}
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
              <Avatar
                src={ad.user?.profile?.avatar || '/assets/default-avatar.png'}
                sx={{
                  width: 60,
                  height: 60,
                  border: '2px solid #560D30',
                }}
              >
                {ad.user?.username?.charAt(0) || 'U'}
              </Avatar>
              
              <Typography
                variant="caption"
                sx={{
                  fontFamily: '"Nobile", sans-serif',
                  color: '#560D30',
                  textAlign: 'center',
                  fontWeight: 'bold',
                }}
              >
                {ad.user?.username || 'Unknown'}
              </Typography>
              
              {ad.user?.profile?.rating && (
                <Chip
                  label={`★ ${ad.user.profile.rating.toFixed(1)}`}
                  size="small"
                  sx={{
                    backgroundColor: '#FFD700',
                    color: '#560D30',
                    fontSize: '12px',
                    height: '20px',
                  }}
                />
              )}
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 1 }}>
            <ChatBubbleOutlineIcon sx={{ color: '#560D30', fontSize: 20 }} />
            <Typography
              variant="caption"
              sx={{
                color: '#560D30',
                fontFamily: '"Nobile", sans-serif',
                fontStyle: 'italic',
              }}
            >
              Click to view details
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Menu for owner actions */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        onClick={(e) => e.stopPropagation()}
      >
        <MenuItem onClick={handleEdit} disabled={loading}>
          <EditIcon sx={{ mr: 1, fontSize: 20 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={handleDelete} disabled={loading}>
          <DeleteIcon sx={{ mr: 1, fontSize: 20 }} />
          Delete
        </MenuItem>
      </Menu>

      {/* Edit Modal */}
      <Modal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit TradeAd"
        maxWidth="md"
      >
        <TradeAdForm
          initialData={ad}
          onSubmit={handleUpdate}
          onCancel={() => setEditModalOpen(false)}
          loading={loading}
          submitText="Update"
        />
      </Modal>

      {/* Detail Modal */}
      <Modal
        open={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        maxWidth="lg"
        blurBackground
      >
        <Box sx={{ p: 4 }}>
          <Typography
            variant="h4"
            sx={{
              fontFamily: '"McLaren", cursive',
              color: '#560D30',
              mb: 3,
              textAlign: 'center',
            }}
          >
            {ad.title}
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
            {/* Left side: Image */}
            <Box sx={{ flex: 1 }}>
              <img
                src={ad.photo || '/assets/default-figurine.png'}
                alt={ad.title}
                style={{
                  width: '100%',
                  borderRadius: '10px',
                  aspectRatio: '1/1',
                  objectFit: 'cover',
                }}
              />
            </Box>

            {/* Right side: Details */}
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography
                variant="h6"
                sx={{ fontFamily: '"McLaren", cursive', color: '#560D30' }}
              >
                Description
              </Typography>
              <Typography sx={{ color: '#666', fontFamily: '"Nobile", sans-serif' }}>
                {ad.description}
              </Typography>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 2 }}>
                <Chip
                  label={`Condition: ${getConditionLabel(ad.condition)}`}
                  sx={{
                    backgroundColor: getConditionColor(ad.condition),
                    color: 'white',
                  }}
                />
                <Chip
                  label={`Series: ${ad.figurine?.series || ad.series}`}
                  sx={{ backgroundColor: '#F05EBA', color: 'white' }}
                />
                <Chip
                  label={`Region: ${ad.region}`}
                  sx={{ backgroundColor: '#560D30', color: 'white' }}
                />
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
                <LocationOnIcon sx={{ color: '#882253' }} />
                <Typography sx={{ color: '#882253', fontFamily: '"Nobile", sans-serif' }}>
                  {ad.location}
                </Typography>
              </Box>

              {/* Owner Info */}
              <Box
                sx={{
                  mt: 4,
                  p: 3,
                  backgroundColor: 'rgba(86, 13, 48, 0.05)',
                  borderRadius: '10px',
                  border: '1px solid rgba(236, 46, 166, 0.2)',
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ fontFamily: '"McLaren", cursive', color: '#560D30', mb: 2 }}
                >
                  Owner Information
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar
                    src={ad.user?.profile?.avatar || '/assets/default-avatar.png'}
                    sx={{ width: 60, height: 60, border: '2px solid #560D30' }}
                  >
                    {ad.user?.username?.charAt(0) || 'U'}
                  </Avatar>
                  <Box>
                    <Typography sx={{ fontFamily: '"Nobile", sans-serif', fontWeight: 'bold', color: '#560D30' }}>
                      {ad.user?.username || 'Unknown'}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography sx={{ color: '#FFD700', fontWeight: 'bold' }}>
                        ★ {ad.user?.profile?.rating?.toFixed(1) || '0.0'}
                      </Typography>
                      <Typography sx={{ color: '#666', fontSize: '14px' }}>
                        ({ad.user?.profile?.tradeCount || 0} trades)
                      </Typography>
                    </Box>
                    <Typography sx={{ color: '#666', fontSize: '14px', fontFamily: '"Nobile", sans-serif' }}>
                      {ad.user?.profile?.status || 'Member'}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* Action Buttons */}
              <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
                {isOwner ? (
                  <Button
                    variant="contained"
                    onClick={handleEdit}
                    sx={{
                      backgroundColor: '#560D30',
                      fontFamily: '"McLaren", cursive',
                      '&:hover': { backgroundColor: '#82164A' },
                    }}
                  >
                    Edit TradeAd
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="contained"
                      onClick={handleOfferTrade}
                      sx={{
                        backgroundColor: '#560D30',
                        fontFamily: '"McLaren", cursive',
                        '&:hover': { backgroundColor: '#82164A' },
                      }}
                    >
                      Offer Trade
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={handleViewProfile}
                      sx={{
                        borderColor: '#560D30',
                        color: '#560D30',
                        fontFamily: '"McLaren", cursive',
                        '&:hover': { borderColor: '#82164A', color: '#82164A' },
                      }}
                    >
                      View Profile
                    </Button>
                  </>
                )}
              </Box>
            </Box>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default TradeAdCard;