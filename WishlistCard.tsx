// client/src/components/cards/WishlistCard.tsx
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
  TextField,
  CircularProgress,
} from '@mui/material';
import { Figurine } from '../../services/types';

interface WishlistCardProps {
  figurine: Figurine & { wishlistItem?: any };
  isInWishlist: boolean;
  wishlistNote?: string;
  wishlistItemId?: string | null;
  onAddToWishlist?: (figurineId: string, note?: string) => Promise<any>;
  onUpdateNote?: (wishlistItemId: string, note: string) => Promise<void>;
  onRemoveFromWishlist?: (wishlistItemId: string) => Promise<void>;
  onSuccess?: (message: string) => void;
  onError?: (message: string) => void;
}

const WishlistCard: React.FC<WishlistCardProps> = ({
  figurine,
  isInWishlist,
  wishlistNote = '',
  wishlistItemId = null,
  onAddToWishlist,
  onUpdateNote,
  onRemoveFromWishlist,
  onSuccess,
  onError,
}) => {
  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [note, setNote] = useState(wishlistNote);
  const [loading, setLoading] = useState(false);
  const [addHovered, setAddHovered] = useState(false);
  const [noteHovered, setNoteHovered] = useState(false);
  const [deleteHovered, setDeleteHovered] = useState(false);

  // Определяем номер изображения для wishlist
  const getImageNumber = () => {
    const match = figurine.imageUrl?.match(/wishlist-(\d+)\.png/);
    return match ? match[1] : '1';
  };

  const imageUrl = figurine.imageUrl || `/assets/wishlist-${getImageNumber()}.png`;

  const handleAddToWishlist = async () => {
    if (!onAddToWishlist) return;
    
    setLoading(true);
    try {
      await onAddToWishlist(figurine.id);
      if (onSuccess) onSuccess(`Added ${figurine.name} to wishlist!`);
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      if (onError) onError('Failed to add to wishlist');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenNoteModal = () => {
    setNote(wishlistNote);
    setNoteModalOpen(true);
  };

  const handleSaveNote = async () => {
    if (!onUpdateNote || !wishlistItemId) return;
    
    setLoading(true);
    try {
      await onUpdateNote(wishlistItemId, note);
      setNoteModalOpen(false);
      if (onSuccess) onSuccess('Note saved successfully!');
    } catch (error) {
      console.error('Error saving note:', error);
      if (onError) onError('Failed to save note');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFromWishlist = async () => {
    if (!onRemoveFromWishlist || !wishlistItemId) return;
    
    setLoading(true);
    try {
      await onRemoveFromWishlist(wishlistItemId);
      setDeleteDialogOpen(false);
      if (onSuccess) onSuccess('Removed from wishlist');
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      if (onError) onError('Failed to remove from wishlist');
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
        {/* Badge если в вишлисте */}
        {isInWishlist && (
          <Box
            sx={{
              position: 'absolute',
              top: 10,
              left: 10,
              backgroundColor: '#F05EBA',
              color: 'white',
              padding: '2px 8px',
              borderRadius: '4px',
              fontSize: '12px',
              fontFamily: '"Nobile", sans-serif',
              zIndex: 1,
            }}
          >
            On Wishlist
          </Box>
        )}

        {/* Изображение фигурки */}
        <Box
          component="img"
          src={imageUrl}
          alt={figurine.name}
          sx={{
            width: '100%',
            height: { xs: 300, sm: 350, md: 412 },
            objectFit: 'cover',
            borderRadius: '10px',
            backgroundColor: '#f5f5f5',
          }}
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
              {figurine.number}
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
              Rarity: {figurine.rarity}
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
              Mold: {figurine.mold}
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
              Year: {figurine.year}
            </Typography>
          </Box>

          {/* Кнопки действий */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            {!isInWishlist ? (
              // Кнопка добавления в вишлист
              <IconButton
                onClick={handleAddToWishlist}
                disabled={loading}
                onMouseEnter={() => setAddHovered(true)}
                onMouseLeave={() => setAddHovered(false)}
                sx={{
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  flexShrink: 0,
                  transition: 'all 0.2s ease',
                  padding: 0,
                  '&:hover': {
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
                  {loading ? (
                    <CircularProgress size={30} color="secondary" />
                  ) : (
                    <img
                      src={addHovered 
                        ? '/assets/add-to-wishlist-active.svg' 
                        : '/assets/add-to-wishlist-default.svg'
                      }
                      alt="Add to wishlist"
                      style={{ 
                        width: '90%',
                        height: '90%',
                        objectFit: 'contain',
                        transition: 'all 0.2s ease',
                      }}
                    />
                  )}
                </Box>
              </IconButton>
            ) : (
              <>
                {/* Кнопка заметки */}
                <IconButton
                  onClick={handleOpenNoteModal}
                  onMouseEnter={() => setNoteHovered(true)}
                  onMouseLeave={() => setNoteHovered(false)}
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    flexShrink: 0,
                    transition: 'all 0.2s ease',
                    padding: 0,
                    '&:hover': {
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
                      src={noteHovered 
                        ? '/assets/make-note-active.svg' 
                        : '/assets/make-note-default.svg'
                      }
                      alt="Make note"
                      style={{ 
                        width: '90%',
                        height: '90%',
                        objectFit: 'contain',
                        transition: 'all 0.2s ease',
                      }}
                    />
                  </Box>
                </IconButton>

                {/* Кнопка удаления из вишлиста */}
                <IconButton
                  onClick={() => setDeleteDialogOpen(true)}
                  onMouseEnter={() => setDeleteHovered(true)}
                  onMouseLeave={() => setDeleteHovered(false)}
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    flexShrink: 0,
                    transition: 'all 0.2s ease',
                    padding: 0,
                    '&:hover': {
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
                      alt="Remove from wishlist"
                      style={{ 
                        width: '90%',
                        height: '90%',
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

      {/* Модальное окно для заметки */}
      <Dialog
        open={noteModalOpen}
        onClose={() => !loading && setNoteModalOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '20px',
            backgroundColor: '#FFF6F9',
          }
        }}
      >
        <DialogContent>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 3,
              padding: 4,
            }}
          >
            <Typography
              variant="h4"
              sx={{
                color: '#560D30',
                fontSize: '48px',
                fontFamily: '"McLaren", cursive',
                fontWeight: 400,
                textTransform: 'capitalize',
                mb: 2,
              }}
            >
              Make Note
            </Typography>
            
            <TextField
              fullWidth
              multiline
              rows={4}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add your notes about this figurine..."
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '10px',
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  border: '1px solid #EC2EA6',
                  '&:hover': {
                    borderColor: '#F056B7',
                  },
                  '&.Mui-focused': {
                    borderColor: '#560D30',
                  },
                },
                '& .MuiInputBase-input': {
                  color: '#852654',
                  fontFamily: '"Nobile", sans-serif',
                  fontSize: '16px',
                },
              }}
            />
            
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <Button
                onClick={handleSaveNote}
                disabled={loading}
                variant="contained"
                sx={{
                  backgroundColor: '#560D30',
                  color: '#FFF6F9',
                  fontSize: '16px',
                  fontFamily: '"McLaren", cursive',
                  fontWeight: 400,
                  borderRadius: '10px',
                  px: 4,
                  py: 1,
                  '&:hover': {
                    backgroundColor: '#82164A',
                  },
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Save'}
              </Button>
              <Button
                onClick={() => setNoteModalOpen(false)}
                disabled={loading}
                variant="outlined"
                sx={{
                  borderColor: '#560D30',
                  color: '#560D30',
                  fontSize: '16px',
                  fontFamily: '"McLaren", cursive',
                  fontWeight: 400,
                  borderRadius: '10px',
                  px: 4,
                  py: 1,
                  '&:hover': {
                    borderColor: '#82164A',
                    backgroundColor: 'rgba(86, 13, 48, 0.1)',
                  },
                }}
              >
                Cancel
              </Button>
            </Box>
          </Box>
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
          Remove from Wishlist
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: '#882253', fontFamily: '"Nobile", sans-serif' }}>
            Are you sure you want to remove #{figurine.number} from your wishlist? Your notes will be lost.
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
            onClick={handleDeleteFromWishlist}
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
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Remove'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default WishlistCard;