import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
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
  Avatar,
  CircularProgress,
  Alert,
  Paper
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  Category as CategoryIcon
} from '@mui/icons-material';
import { adminAPI, ArticleAdmin } from '../../../../services/adminApi';
import { motion, AnimatePresence } from 'framer-motion';
import ImageUpload from '../../../../components/forms/ImageUpload';

interface ArticlesTabProps {
  onShowNotification: (message: string, type: 'success' | 'error' | 'info') => void;
}

const ArticlesTab: React.FC<ArticlesTabProps> = ({ onShowNotification }) => {
const [articles, setArticles] = useState<ArticleAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'ADVICE_BEGINNERS' as any,
    tags: [] as string[],
    published: true,
    imageUrl: ''
  });
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    setLoading(true);
    try {
const data = await adminAPI.getArticles();
setArticles(data); // теперь data типизировано
    } catch (error) {
      onShowNotification('Failed to load articles', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (article: any = null) => {
    if (article) {
      setSelectedArticle(article);
      setFormData({
        title: article.title,
        content: article.content,
        category: article.category,
        tags: article.tags || [],
        published: article.published,
        imageUrl: article.imageUrl || ''
      });
    } else {
      setSelectedArticle(null);
      setFormData({
        title: '',
        content: '',
        category: 'ADVICE_BEGINNERS',
        tags: [],
        published: true,
        imageUrl: ''
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedArticle(null);
    setFormData({
      title: '',
      content: '',
      category: 'ADVICE_BEGINNERS',
      tags: [],
      published: true,
      imageUrl: ''
    });
  };

  const handleSaveArticle = async () => {
    try {
      if (selectedArticle) {
        await adminAPI.updateArticle(selectedArticle.id, formData);
        onShowNotification('Article updated successfully', 'success');
      } else {
        await adminAPI.createArticle(formData);
        onShowNotification('Article created successfully', 'success');
      }
      fetchArticles();
      handleCloseDialog();
    } catch (error) {
      onShowNotification('Failed to save article', 'error');
    }
  };

  const handleDeleteArticle = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      try {
        await adminAPI.deleteArticle(id);
        onShowNotification('Article deleted successfully', 'success');
        fetchArticles();
      } catch (error) {
        onShowNotification('Failed to delete article', 'error');
      }
    }
  };

  const handleTogglePublish = async (article: any) => {
    try {
      await adminAPI.updateArticle(article.id, {
        published: !article.published
      });
      onShowNotification(
        `Article ${article.published ? 'unpublished' : 'published'}`,
        'success'
      );
      fetchArticles();
    } catch (error) {
      onShowNotification('Failed to update article', 'error');
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()]
      });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(t => t !== tag)
    });
  };

  const getCategoryColor = (category: string) => {
    const colors: any = {
      CARE_STORAGE: '#4CAF50',
      HISTORY_NEWS: '#2196F3',
      RULES_POLITICS: '#FF9800',
      ADVICE_BEGINNERS: '#EC2EA6'
    };
    return colors[category] || '#560D30';
  };

  const handleImageUpload = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('image', file);
const response = await adminAPI.uploadImage(formData);
setFormData(prev => ({ ...prev, imageUrl: response.url }));
    } catch (error) {
      onShowNotification('Failed to upload image', 'error');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress sx={{ color: '#EC2EA6' }} />
      </Box>
    );
  }

  return (
    <Box>
      {/* Заголовок и кнопка создания */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontFamily: '"McLaren", cursive',
            color: '#560D30'
          }}
        >
          Manage Articles ({articles.length})
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{
            backgroundColor: '#EC2EA6',
            '&:hover': { backgroundColor: '#F056B7' },
            borderRadius: 2
          }}
        >
          Create Article
        </Button>
      </Box>

      {/* Список статей */}
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <Grid container spacing={3}>
            {articles.length === 0 ? (
              <Grid item xs={12}>
                <Alert severity="info" sx={{ borderRadius: 2 }}>
                  No articles yet. Create your first article!
                </Alert>
              </Grid>
            ) : (
              articles.map((article) => (
                <Grid item xs={12} md={6} lg={4} key={article.id}>
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
                        border: `2px solid ${getCategoryColor(article.category)}20`,
                        '&:hover': {
                          borderColor: `${getCategoryColor(article.category)}40`,
                          boxShadow: `0 8px 32px ${getCategoryColor(article.category)}20`
                        }
                      }}
                    >
                      {article.imageUrl && (
                        <Box
                          sx={{
                            height: 140,
                            backgroundImage: `url(${article.imageUrl})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            borderTopLeftRadius: 8,
                            borderTopRightRadius: 8
                          }}
                        />
                      )}
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Chip
                            label={article.category.replace('_', ' ')}
                            size="small"
                            sx={{
                              backgroundColor: `${getCategoryColor(article.category)}20`,
                              color: getCategoryColor(article.category),
                              fontWeight: 600
                            }}
                          />
                          <Chip
                            icon={article.published ? <VisibilityIcon /> : <VisibilityOffIcon />}
                            label={article.published ? 'Published' : 'Draft'}
                            size="small"
                            color={article.published ? 'success' : 'warning'}
                            variant="outlined"
                          />
                        </Box>
                        <Typography
                          variant="h6"
                          sx={{
                            fontFamily: '"McLaren", cursive',
                            color: '#560D30',
                            mb: 1,
                            fontSize: '1.1rem'
                          }}
                        >
                          {article.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: '#852654',
                            mb: 2,
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                          }}
                        >
                          {article.content.substring(0, 150)}...
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <CalendarIcon sx={{ fontSize: 14, color: '#852654' }} />
                          <Typography variant="caption" sx={{ color: '#852654' }}>
                            {new Date(article.createdAt).toLocaleDateString()}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <PersonIcon sx={{ fontSize: 14, color: '#852654' }} />
                          <Typography variant="caption" sx={{ color: '#852654' }}>
                            {article.author?.username || 'Unknown'}
                          </Typography>
                        </Box>
                        <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {article.tags?.map((tag: string) => (
                            <Chip
                              key={tag}
                              label={tag}
                              size="small"
                              variant="outlined"
                              sx={{ fontSize: '0.65rem' }}
                            />
                          ))}
                        </Box>
                      </CardContent>
                      <CardActions sx={{ p: 2, pt: 0 }}>
                        <Tooltip title="Edit">
                          <IconButton
                            size="small"
                            onClick={() => handleOpenDialog(article)}
                            sx={{ color: '#560D30' }}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={article.published ? "Unpublish" : "Publish"}>
                          <IconButton
                            size="small"
                            onClick={() => handleTogglePublish(article)}
                            sx={{
                              color: article.published ? '#4CAF50' : '#FFC107'
                            }}
                          >
                            {article.published ? <VisibilityIcon /> : <VisibilityOffIcon />}
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteArticle(article.id)}
                            sx={{ color: '#F44336' }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </CardActions>
                    </Card>
                  </motion.div>
                </Grid>
              ))
            )}
          </Grid>
        </motion.div>
      </AnimatePresence>

      {/* Диалог создания/редактирования статьи */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        scroll="paper"
      >
        <DialogTitle sx={{ fontFamily: '"McLaren", cursive', color: '#560D30' }}>
          {selectedArticle ? 'Edit Article' : 'Create New Article'}
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Загрузка изображения */}
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1, color: '#560D30' }}>
                Featured Image
              </Typography>
              <ImageUpload
                initialImage={formData.imageUrl}
                onImageUpload={handleImageUpload}
                aspectRatio={16/9}
                maxSize={5}
              />
            </Box>

            <TextField
              label="Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              fullWidth
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2
                }
              }}
            />

            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={formData.category}
                label="Category"
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                sx={{ borderRadius: 2 }}
              >
                <MenuItem value="CARE_STORAGE">Care & Storage</MenuItem>
                <MenuItem value="HISTORY_NEWS">History & News</MenuItem>
                <MenuItem value="RULES_POLITICS">Rules & Politics</MenuItem>
                <MenuItem value="ADVICE_BEGINNERS">Advice for Beginners</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              multiline
              rows={8}
              fullWidth
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2
                }
              }}
            />

            {/* Теги */}
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1, color: '#560D30' }}>
                Tags
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                {formData.tags.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    onDelete={() => handleRemoveTag(tag)}
                    size="small"
                    sx={{
                      backgroundColor: '#EC2EA620',
                      border: '1px solid #EC2EA640'
                    }}
                  />
                ))}
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  placeholder="Add tag..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  size="small"
                  sx={{ flexGrow: 1 }}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                />
                <Button
                  onClick={handleAddTag}
                  variant="outlined"
                  size="small"
                  sx={{
                    borderColor: '#EC2EA6',
                    color: '#EC2EA6',
                    '&:hover': {
                      borderColor: '#F056B7',
                      backgroundColor: 'rgba(236, 46, 166, 0.05)'
                    }
                  }}
                >
                  Add
                </Button>
              </Box>
            </Box>

            <FormControlLabel
              control={
                <Switch
                  checked={formData.published}
                  onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                  color="primary"
                />
              }
              label="Publish immediately"
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={handleCloseDialog}
            sx={{ color: '#852654' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveArticle}
            variant="contained"
            disabled={!formData.title || !formData.content}
            sx={{
              backgroundColor: '#EC2EA6',
              '&:hover': { backgroundColor: '#F056B7' },
              '&.Mui-disabled': {
                backgroundColor: 'rgba(0, 0, 0, 0.12)'
              }
            }}
          >
            {selectedArticle ? 'Update Article' : 'Create Article'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ArticlesTab;