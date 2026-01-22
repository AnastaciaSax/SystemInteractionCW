// client/src/components/cards/TradeAdCard.tsx
import React, { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  CircularProgress,
} from '@mui/material';
import { TradeAdWithDetails } from '../../services/types';
import TradeAdDetailsModal from './TradeAdDetailsModal';
import TradeAdForm from '../forms/TradeAdForm';

interface TradeAdCardProps {
  ad: TradeAdWithDetails;
  isOwner?: boolean;
  onDelete?: (id: string) => Promise<void>;
  onUpdate?: (id: string, data: any) => Promise<void>;
}

const TradeAdCard: React.FC<TradeAdCardProps> = ({ 
  ad, 
  isOwner = false, 
  onDelete, 
  onUpdate 
}) => {
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [offerHovered, setOfferHovered] = useState(false);
  const [editHovered, setEditHovered] = useState(false);
  const [deleteHovered, setDeleteHovered] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDetailsClick = () => {
    setDetailsModalOpen(true);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditModalOpen(true);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!onDelete) return;
    
    setLoading(true);
    try {
      await onDelete(ad.id);
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error('Error deleting ad:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (data: any) => {
    if (!onUpdate) return;
    
    setLoading(true);
    try {
      await onUpdate(ad.id, data);
      setEditModalOpen(false);
    } catch (error) {
      console.error('Error updating ad:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Box
        sx={{
          width: '100%',
          maxWidth: 412,
          display: 'flex',
          flexDirection: 'column',
          gap: '17px',
          position: 'relative',
        }}
      >
        {/* Badge для владельца */}
        {isOwner && (
          <Box
            sx={{
              position: 'absolute',
              top: 10,
              left: 10,
              backgroundColor: 'rgba(86, 13, 48, 0.9)',
              color: 'white',
              padding: '2px 8px',
              borderRadius: '4px',
              fontSize: '12px',
              fontFamily: '"Nobile", sans-serif',
              zIndex: 1,
            }}
          >
            Your Ad
          </Box>
        )}

        {/* Изображение фигурки */}
        <Box
          component="img"
          src={ad.photo || '/assets/default-figurine.png'}
          alt={ad.title}
          sx={{
            width: '100%',
            height: { xs: 300, sm: 350, md: 412 },
            objectFit: 'cover',
            borderRadius: '10px',
            backgroundColor: '#f5f5f5',
            cursor: 'pointer',
            '&:hover': {
              opacity: 0.9,
            },
          }}
          onClick={handleDetailsClick}
        />

        {/* Информация и кнопки */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          {/* Информация */}
          <Box sx={{ flex: 1 }}>
            <Typography
              sx={{
                color: '#560D30',
                fontSize: '20px',
                fontFamily: '"McLaren", cursive',
                fontWeight: 400,
                lineHeight: 1.2,
                mb: 0.5,
                textAlign: 'left',
              }}
            >
              {ad.title}
            </Typography>
            <Typography
              sx={{
                color: '#882253',
                fontSize: '16px',
                fontFamily: '"Nobile", sans-serif',
                fontWeight: 400,
                mb: 0.5,
                textAlign: 'left',
              }}
            >
              Condition: {ad.condition}
            </Typography>
            <Typography
              sx={{
                color: '#882253',
                fontSize: '16px',
                fontFamily: '"Nobile", sans-serif',
                fontWeight: 400,
                textAlign: 'left',
              }}
            >
              Series: {ad.figurine?.series || 'Unknown'}
            </Typography>
          </Box>

          {/* Кнопки действий */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            {/* Кнопка Offer trade */}
            <IconButton
              onClick={handleDetailsClick}
              onMouseEnter={() => setOfferHovered(true)}
              onMouseLeave={() => setOfferHovered(false)}
              sx={{
                width: 60,
                height: 60,
                backgroundColor: '#F05EBA',
                borderRadius: '50%',
                flexShrink: 0,
                transition: 'all 0.2s ease',
                padding: 0,
                '&:hover': {
                  backgroundColor: '#F056B7',
                  transform: 'scale(1.05)',
                },
              }}
            >
              <Box
                sx={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <img
                  src={offerHovered 
                    ? '/assets/offer-trade-active.svg' 
                    : '/assets/offer-trade-default.svg'
                  }
                  alt="Offer trade"
                  style={{ 
                    width: '70%',
                    height: '70%',
                    objectFit: 'contain',
                    transition: 'all 0.2s ease',
                  }}
                />
              </Box>
            </IconButton>

            {/* Кнопки управления для владельца */}
            {isOwner && (
              <>
                {/* Кнопка редактирования */}
                <IconButton
                  onClick={handleEditClick}
                  onMouseEnter={() => setEditHovered(true)}
                  onMouseLeave={() => setEditHovered(false)}
                  sx={{
                    width: 60,
                    height: 60,
                    backgroundColor: '#4CAF50',
                    borderRadius: '50%',
                    flexShrink: 0,
                    transition: 'all 0.2s ease',
                    padding: 0,
                    '&:hover': {
                      backgroundColor: '#45a049',
                      transform: 'scale(1.05)',
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <img
                      src={editHovered 
                        ? '/assets/edit-active.svg' 
                        : '/assets/edit-default.svg'
                      }
                      alt="Edit"
                      style={{ 
                        width: '70%',
                        height: '70%',
                        objectFit: 'contain',
                        transition: 'all 0.2s ease',
                      }}
                    />
                  </Box>
                </IconButton>

                {/* Кнопка удаления */}
                <IconButton
                  onClick={handleDeleteClick}
                  onMouseEnter={() => setDeleteHovered(true)}
                  onMouseLeave={() => setDeleteHovered(false)}
                  sx={{
                    width: 60,
                    height: 60,
                    backgroundColor: '#f44336',
                    borderRadius: '50%',
                    flexShrink: 0,
                    transition: 'all 0.2s ease',
                    padding: 0,
                    '&:hover': {
                      backgroundColor: '#d32f2f',
                      transform: 'scale(1.05)',
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <img
                      src={deleteHovered 
                        ? '/assets/delete-active.svg' 
                        : '/assets/delete-default.svg'
                      }
                      alt="Delete"
                      style={{ 
                        width: '70%',
                        height: '70%',
                        objectFit: 'contain',
                        transition: 'all 0.2s ease',
                      }}
                    />
                  </Box>
                </IconButton>
              </>
            )}
          </Box>
        </Box>
      </Box>

      {/* Модальное окно с деталями объявления */}
      <TradeAdDetailsModal
        open={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        ad={ad}
      />

      {/* Модальное окно редактирования */}
      <Dialog
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '20px',
            backgroundColor: '#FFF6F9',
          }
        }}
      >
        <DialogContent>
          <TradeAdForm
            initialData={ad}
            onSubmit={handleUpdate}
            onCancel={() => setEditModalOpen(false)}
            loading={loading}
            submitText="Save Changes"
          />
        </DialogContent>
      </Dialog>

      {/* Диалог подтверждения удаления */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => !loading && setDeleteDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: '20px',
            backgroundColor: '#FFF6F9',
            padding: 2,
          }
        }}
      >
        <DialogTitle sx={{ color: '#560D30', fontFamily: '"McLaren", cursive' }}>
          Delete Trade Ad
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: '#882253', fontFamily: '"Nobile", sans-serif' }}>
            Are you sure you want to delete "{ad.title}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ padding: 3 }}>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            disabled={loading}
            sx={{
              color: '#560D30',
              fontFamily: '"Nobile", sans-serif',
              '&:hover': {
                backgroundColor: 'rgba(86, 13, 48, 0.1)',
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={confirmDelete}
            disabled={loading}
            variant="contained"
            sx={{
              backgroundColor: '#f44336',
              color: 'white',
              fontFamily: '"Nobile", sans-serif',
              '&:hover': {
                backgroundColor: '#d32f2f',
              },
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TradeAdCard;