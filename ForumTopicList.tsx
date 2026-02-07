/// client/src/pages/ChitChat/components/ForumTopicList.tsx

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Chip,
  Skeleton
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchInput from '../../../components/ui/SearchInput'; // Импортируем SearchInput
import { LocalForumTopic } from '../../../utils/forumStorage';

interface ForumTopicListProps {
  topics: LocalForumTopic[];
  selectedTopic: LocalForumTopic | null;
  onSelectTopic: (topic: LocalForumTopic) => void;
  onSearch: (query: string) => void;
  onCreateTopic: () => void;
  loading: boolean;
  categoryFilter: string;
  onCategoryChange: (category: string) => void;
}

const ForumTopicList: React.FC<ForumTopicListProps> = ({
  topics,
  selectedTopic,
  onSelectTopic,
  onSearch,
  onCreateTopic,
  loading,
  categoryFilter,
  onCategoryChange
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { value: 'ALL', label: 'All', color: '#560D30' },
    { value: 'GENERAL', label: 'General', color: '#EC2EA6' },
    { value: 'TRADING', label: 'Trading', color: '#4CAF50' },
    { value: 'COLLECTING', label: 'Collecting', color: '#2196F3' },
    { value: 'REVIEWS', label: 'Reviews', color: '#FF9800' },
    { value: 'NEWS', label: 'News', color: '#9C27B0' },
    { value: 'EVENTS', label: 'Events', color: '#00BCD4' }
  ];

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    onSearch(value);
  };

  const handleSearchClear = () => {
    setSearchQuery('');
    onSearch('');
  };

  const getCategoryColor = (category: string) => {
    const cat = categories.find(c => c.value === category);
    return cat?.color || '#852654';
  };

  if (loading) {
    return (
      <Box
        sx={{
          alignSelf: 'stretch',
          padding: 2,
          background: 'white',
          borderRadius: 2,
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
          gap: 2,
          display: 'inline-flex',
          height: '720px', // Фиксированная высота как у ChatList
          minHeight: '600px',
        }}
      >
        <Skeleton variant="text" width={128} height={40} />
        <Skeleton variant="rectangular" width={224} height={40} sx={{ borderRadius: 1 }} />
        {[1, 2, 3, 4].map(i => (
          <Skeleton key={i} variant="rectangular" width={224} height={100} sx={{ borderRadius: 2 }} />
        ))}
      </Box>
    );
  }

  return (
    <Box
      sx={{
        alignSelf: 'stretch',
        padding: 2,
        background: 'white',
        borderRadius: 2,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        gap: 2,
        display: 'inline-flex',
        height: '720px', // Фиксированная высота
        minHeight: '600px',
      }}
    >
      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography
          sx={{
            color: '#560D30',
            fontSize: 20,
            fontFamily: '"McLaren", cursive',
            fontWeight: 400,
          }}
        >
          Forum Topics
        </Typography>
        
        <Button
          onClick={onCreateTopic}
          startIcon={<AddIcon />}
          sx={{
            background: 'linear-gradient(90deg, #EC2EA6 0%, #F05EBA 100%)',
            color: 'white',
            '&:hover': {
              background: 'linear-gradient(90deg, #F05EBA 0%, #EC2EA6 100%)',
            },
            fontSize: 12,
            padding: '4px 12px',
          }}
        >
          New Topic
        </Button>
      </Box>

      {/* Поиск с использованием SearchInput */}
      <SearchInput
        placeholder="Search topics..."
        value={searchQuery}
        onChange={handleSearchChange}
        onClear={handleSearchClear}
        onSearch={() => onSearch(searchQuery)}
        size="small"
        fullWidth
      />

      {/* Фильтры категорий */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
        {categories.map(category => (
          <Chip
            key={category.value}
            label={category.label}
            onClick={() => onCategoryChange(category.value)}
            sx={{
              background: categoryFilter === category.value ? category.color : 'rgba(240, 94, 186, 0.1)',
              color: categoryFilter === category.value ? 'white' : category.color,
              border: `1px solid ${category.color}`,
              '&:hover': {
                background: category.color,
                color: 'white'
              }
            }}
            size="small"
          />
        ))}
      </Box>

      {/* Список тем с фиксированной высотой и скроллом */}
      <Box 
        sx={{ 
          flexDirection: 'column', 
          justifyContent: 'flex-start', 
          alignItems: 'flex-start', 
          gap: 1.5, 
          display: 'flex', 
          width: '100%',
          flex: 1, // Занимает все доступное пространство
          overflowY: 'auto', // Добавляем скролл
          pr: 0.5, // Немного отступа для скроллбара
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'rgba(240, 94, 186, 0.1)',
            borderRadius: '3px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#F05EBA',
            borderRadius: '3px',
          },
        }}
      >
        {topics.map((topic) => (
          <Box
            key={topic.id}
            onClick={() => onSelectTopic(topic)}
            sx={{
              width: '100%',
              padding: 1.5,
              position: 'relative',
              boxShadow: '0px 0px 8px #F6C4D4',
              cursor: 'pointer',
              borderRadius: 2,
              transition: 'all 0.3s ease',
              background: selectedTopic?.id === topic.id 
                ? 'linear-gradient(90deg, rgba(240, 94, 186, 0.1) 0%, rgba(153, 242, 247, 0.1) 100%)'
                : 'white',
              border: selectedTopic?.id === topic.id ? '1px #EC2EA6 solid' : '1px #DFE0EB solid',
              '&:hover': {
                transform: 'translateX(2px)',
                boxShadow: '0px 4px 12px rgba(246, 196, 212, 0.8)',
              },
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
              <Typography
                sx={{
                  color: selectedTopic?.id === topic.id ? '#EC2EA6' : '#560D30',
                  fontSize: 14,
                  fontFamily: '"McLaren", cursive',
                  fontWeight: 600,
                  flex: 1,
                }}
              >
                {topic.isPinned && '📌 '}{topic.title}
              </Typography>
              
              <Chip
                label={topic.category}
                size="small"
                sx={{
                  background: getCategoryColor(topic.category),
                  color: 'white',
                  fontSize: 10,
                  height: 20,
                }}
              />
            </Box>
            
            <Typography
              sx={{
                color: '#852654',
                fontSize: 12,
                fontFamily: '"Nobile", sans-serif',
                mb: 1,
              }}
            >
              {topic.description}
            </Typography>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography sx={{ color: '#560D30', fontSize: 10, fontFamily: '"Nobile", sans-serif' }}>
                  👥 {topic.participants}
                </Typography>
                <Typography sx={{ color: '#560D30', fontSize: 10, fontFamily: '"Nobile", sans-serif' }}>
                  💬 {topic.messageCount}
                </Typography>
              </Box>
              
              <Typography sx={{ color: '#852654', fontSize: 10, fontFamily: '"Nobile", sans-serif' }}>
                {new Date(topic.lastActivity).toLocaleDateString()}
              </Typography>
            </Box>
          </Box>
        ))}
        
        {topics.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 4, width: '100%' }}>
            <Typography
              sx={{
                color: '#852654',
                fontSize: 14,
                fontFamily: '"Nobile", sans-serif',
                fontStyle: 'italic',
              }}
            >
              {searchQuery ? 'No topics found for your search' : 'No topics found. Create the first one!'} 🚀
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ForumTopicList;