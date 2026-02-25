import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  CardMedia,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  CircularProgress,
  Alert,
  Paper,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Verified as VerifiedIcon,
  NotInterested as NotVerifiedIcon,
  Image as ImageIcon,
} from '@mui/icons-material';
import { adminAPI, FigurineAdmin } from '../../../../services/adminApi';
import { motion, AnimatePresence } from 'framer-motion';
import ImageUpload from '../../../../components/forms/ImageUpload';
import SearchInput from '../../../../components/ui/SearchInput';
import FilterSelect from '../../../../components/ui/FilterSelect';
import Pagination from '../Pagination';

const MOLD_OPTIONS = [
  { value: 'CAT', label: 'Cat' },
  { value: 'DOG', label: 'Dog' },
  { value: 'RODENT', label: 'Rodent' },
  { value: 'CATTLE', label: 'Cattle' },
  { value: 'KANGAROO', label: 'Kangaroo' },
  { value: 'BEAR', label: 'Bear' },
  { value: 'OTHER', label: 'Other' },
];

const SERIES_OPTIONS = [
  { value: 'G2', label: 'G2' },
  { value: 'G3', label: 'G3' },
  { value: 'G4', label: 'G4' },
  { value: 'G5', label: 'G5' },
  { value: 'G6', label: 'G6' },
  { value: 'G7', label: 'G7' },
];

const RARITY_OPTIONS = [
  { value: 'COMMON', label: 'Common' },
  { value: 'UNCOMMON', label: 'Uncommon' },
  { value: 'RARE', label: 'Rare' },
  { value: 'EXCLUSIVE', label: 'Exclusive' },
];

interface FigurinesTabProps {
  onShowNotification: (message: string, type: 'success' | 'error' | 'info') => void;
}

const FigurinesTab: React.FC<FigurinesTabProps> = ({ onShowNotification }) => {
  const [figurines, setFigurines] = useState<FigurineAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedFigurine, setSelectedFigurine] = useState<FigurineAdmin | null>(null);
  const [formData, setFormData] = useState({
    number: '',
    name: '',
    mold: 'CAT',
    series: 'G1',
    rarity: 'COMMON',
    year: new Date().getFullYear(),
    description: '',
    imageUrl: '',
    verified: false,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    series: 'ALL',
    rarity: 'ALL',
    mold: 'ALL',
  });
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    pages: 1,
    limit: 9,
  });

  useEffect(() => {
    fetchFigurines();
  }, [searchTerm, filters, pagination.page]);

  const fetchFigurines = async () => {
    setLoading(true);
    try {
      const params: any = {
        page: pagination.page,
        limit: pagination.limit,
        search: searchTerm || undefined,
        series: filters.series !== 'ALL' ? filters.series : undefined,
        rarity: filters.rarity !== 'ALL' ? filters.rarity : undefined,
        mold: filters.mold !== 'ALL' ? filters.mold : undefined,
      };
      const data = await adminAPI.getFigurines(params);
      setFigurines(data.figurines);
      setPagination(prev => ({ ...prev, total: data.total, pages: data.pages }));
    } catch (error) {
      onShowNotification('Failed to load figurines', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (figurine: FigurineAdmin | null = null) => {
    if (figurine) {
      setSelectedFigurine(figurine);
      setFormData({
        number: figurine.number,
        name: figurine.name,
        mold: figurine.mold,
        series: figurine.series,
        rarity: figurine.rarity,
        year: figurine.year,
        description: figurine.description || '',
        imageUrl: figurine.imageUrl || '',
        verified: figurine.verified,
      });
    } else {
      setSelectedFigurine(null);
      setFormData({
        number: '',
        name: '',
        mold: 'CAT',
        series: 'G1',
        rarity: 'COMMON',
        year: new Date().getFullYear(),
        description: '',
        imageUrl: '',
        verified: false,
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedFigurine(null);
  };

  const handleSave = async () => {
    try {
      if (selectedFigurine) {
        await adminAPI.updateFigurine(selectedFigurine.id, formData);
        onShowNotification('Figurine updated successfully', 'success');
      } else {
        await adminAPI.createFigurine(formData);
        onShowNotification('Figurine created successfully', 'success');
      }
      fetchFigurines();
      handleCloseDialog();
    } catch (error: any) {
      onShowNotification(error.response?.data?.error || 'Failed to save figurine', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this figurine?')) {
      try {
        await adminAPI.deleteFigurine(id);
        onShowNotification('Figurine deleted successfully', 'success');
        fetchFigurines();
      } catch (error) {
        onShowNotification('Failed to delete figurine', 'error');
      }
    }
  };

  const handleToggleVerified = async (figurine: FigurineAdmin) => {
    try {
      await adminAPI.updateFigurine(figurine.id, { verified: !figurine.verified });
      onShowNotification(`Figurine ${figurine.verified ? 'unverified' : 'verified'}`, 'success');
      fetchFigurines();
    } catch (error) {
      onShowNotification('Failed to update figurine', 'error');
    }
  };

  const handleImageUpload = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('image', file);
      const response = await adminAPI.uploadFigurineImage(formData);
      setFormData(prev => ({ ...prev, imageUrl: response.url }));
    } catch (error) {
      onShowNotification('Failed to upload image', 'error');
    }
  };

  if (loading && figurines.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress sx={{ color: '#EC2EA6' }} />
      </Box>
    );
  }

  return (
    <Box>
      {/* Заголовок и кнопка создания */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h5" sx={{ fontFamily: '"McLaren", cursive', color: '#560D30' }}>
          Manage Figurines ({pagination.total})
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{
            backgroundColor: '#EC2EA6',
            '&:hover': { backgroundColor: '#F056B7' },
            borderRadius: 2,
          }}
        >
          Create Figurine
        </Button>
      </Box>

      {/* Фильтры и поиск */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3, alignItems: 'center' }}>
        <SearchInput
          placeholder="Search by name or number..."
          value={searchTerm}
          onChange={setSearchTerm}
          size="small"
        />
        <FilterSelect
          label="Series"
          value={filters.series}
          options={[{ value: 'ALL', label: 'All Series' }, ...SERIES_OPTIONS]}
          onChange={(val) => setFilters({ ...filters, series: val })}
        />
        <FilterSelect
          label="Rarity"
          value={filters.rarity}
          options={[{ value: 'ALL', label: 'All Rarities' }, ...RARITY_OPTIONS]}
          onChange={(val) => setFilters({ ...filters, rarity: val })}
        />
        <FilterSelect
          label="Mold"
          value={filters.mold}
          options={[{ value: 'ALL', label: 'All Molds' }, ...MOLD_OPTIONS]}
          onChange={(val) => setFilters({ ...filters, mold: val })}
        />
      </Box>

      {/* Список фигурок */}
      <AnimatePresence>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <Grid container spacing={3}>
            {figurines.length === 0 ? (
              <Grid item xs={12}>
                <Alert severity="info" sx={{ borderRadius: 2 }}>
                  No figurines found. Create your first figurine!
                </Alert>
              </Grid>
            ) : (
              figurines.map((fig) => (
                <Grid item xs={12} sm={6} md={4} key={fig.id}>
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    whileHover={{ y: -5 }}
                  >
                    <Card
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        borderRadius: 2,
                        border: `2px solid ${fig.verified ? '#4CAF50' : '#EC2EA6'}20`,
                        '&:hover': {
                          borderColor: `${fig.verified ? '#4CAF50' : '#EC2EA6'}40`,
                          boxShadow: `0 8px 32px ${fig.verified ? '#4CAF50' : '#EC2EA6'}20`,
                        },
                      }}
                    >
                      {fig.imageUrl ? (
                        <CardMedia
                          component="img"
                          height="180"
                          image={fig.imageUrl}
                          alt={fig.name}
                          sx={{ objectFit: 'cover' }}
                        />
                      ) : (
                        <Box
                          sx={{
                            height: 180,
                            backgroundColor: 'rgba(236, 46, 166, 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <ImageIcon sx={{ fontSize: 60, color: '#EC2EA6' }} />
                        </Box>
                      )}
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Chip
                            label={`${fig.number}`}
                            size="small"
                            sx={{ backgroundColor: '#EC2EA6', color: 'white', fontWeight: 600 }}
                          />
                          <Chip
                            icon={fig.verified ? <VerifiedIcon /> : <NotVerifiedIcon />}
                            label={fig.verified ? 'Verified' : 'Unverified'}
                            size="small"
                            color={fig.verified ? 'success' : 'warning'}
                            variant="outlined"
                          />
                        </Box>
                        <Typography
                          variant="h6"
                          sx={{ fontFamily: '"McLaren", cursive', color: '#560D30', mb: 1, fontSize: '1.1rem' }}
                        >
                          {fig.name}
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
                          <Chip label={`Mold: ${fig.mold}`} size="small" variant="outlined" />
                          <Chip label={`Series: ${fig.series}`} size="small" variant="outlined" />
                          <Chip label={`Rarity: ${fig.rarity}`} size="small" variant="outlined" />
                          <Chip label={`Year: ${fig.year}`} size="small" variant="outlined" />
                        </Box>
                        {fig.description && (
                          <Typography variant="body2" sx={{ color: '#852654' }}>
                            {fig.description.length > 100 ? fig.description.substring(0, 100) + '...' : fig.description}
                          </Typography>
                        )}
                      </CardContent>
                      <CardActions sx={{ p: 2, pt: 0, justifyContent: 'space-between' }}>
                        <Box>
                          <Tooltip title="Edit">
                            <IconButton size="small" onClick={() => handleOpenDialog(fig)} sx={{ color: '#560D30' }}>
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title={fig.verified ? 'Unverify' : 'Verify'}>
                            <IconButton
                              size="small"
                              onClick={() => handleToggleVerified(fig)}
                              sx={{ color: fig.verified ? '#4CAF50' : '#FFC107' }}
                            >
                              {fig.verified ? <VerifiedIcon /> : <NotVerifiedIcon />}
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton size="small" onClick={() => handleDelete(fig.id)} sx={{ color: '#F44336' }}>
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </CardActions>
                    </Card>
                  </motion.div>
                </Grid>
              ))
            )}
          </Grid>
        </motion.div>
      </AnimatePresence>

      {/* Пагинация */}
      {pagination.pages > 1 && (
        <Pagination
    currentPage={pagination.page}
    totalPages={pagination.pages}
onPageChange={(page: number) => setPagination({ ...pagination, page })}
        />
      )}

      {/* Диалог создания/редактирования */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth scroll="paper">
        <DialogTitle sx={{ fontFamily: '"McLaren", cursive', color: '#560D30' }}>
          {selectedFigurine ? 'Edit Figurine' : 'Create New Figurine'}
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1, color: '#560D30' }}>
                Figurine Image
              </Typography>
               <Box sx={{ width: '100%', maxWidth: 355 }}> 
    <ImageUpload
      initialImage={formData.imageUrl}
      onImageUpload={handleImageUpload}
      aspectRatio={1}
      maxSize={5}
    />
  </Box>
            </Box>

            <TextField
              label="Number"
              value={formData.number}
              onChange={(e) => setFormData({ ...formData, number: e.target.value })}
              fullWidth
              required
              size="small"
            />

            <TextField
              label="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              fullWidth
              required
              size="small"
            />

            <Grid container spacing={2}>
              <Grid item xs={4}>
                <FormControl fullWidth size="small">
                  <InputLabel>Mold</InputLabel>
                  <Select
                    value={formData.mold}
                    label="Mold"
                    onChange={(e) => setFormData({ ...formData, mold: e.target.value })}
                  >
                    {MOLD_OPTIONS.map(opt => (
                      <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={4}>
                <FormControl fullWidth size="small">
                  <InputLabel>Series</InputLabel>
                  <Select
                    value={formData.series}
                    label="Series"
                    onChange={(e) => setFormData({ ...formData, series: e.target.value })}
                  >
                    {SERIES_OPTIONS.map(opt => (
                      <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={4}>
                <FormControl fullWidth size="small">
                  <InputLabel>Rarity</InputLabel>
                  <Select
                    value={formData.rarity}
                    label="Rarity"
                    onChange={(e) => setFormData({ ...formData, rarity: e.target.value })}
                  >
                    {RARITY_OPTIONS.map(opt => (
                      <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <TextField
              label="Year"
              type="number"
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) || 0 })}
              fullWidth
              required
              size="small"
              inputProps={{ min: 1900, max: new Date().getFullYear() + 1 }}
            />

            <TextField
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              multiline
              rows={3}
              fullWidth
              size="small"
            />

            <FormControlLabel
              control={
                <Switch
                  checked={formData.verified}
                  onChange={(e) => setFormData({ ...formData, verified: e.target.checked })}
                  color="primary"
                />
              }
              label="Verified"
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleCloseDialog} sx={{ color: '#852654' }}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            disabled={!formData.number || !formData.name}
            sx={{
              backgroundColor: '#EC2EA6',
              '&:hover': { backgroundColor: '#F056B7' },
              '&.Mui-disabled': { backgroundColor: 'rgba(0,0,0,0.12)' },
            }}
          >
            {selectedFigurine ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FigurinesTab;