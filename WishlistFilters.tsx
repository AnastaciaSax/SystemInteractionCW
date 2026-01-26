import React from 'react';
import { Box } from '@mui/material';
import SearchInput from '../../../components/ui/SearchInput';
import SortSelect from '../../../components/ui/SortSelect';
import ToggleSwitch from '../../../components/ui/ToggleSwitch';
import FilterSelect from '../../../components/ui/FilterSelect';
import YearRangeFilter from '../../../components/ui/YearRangeFilter';

interface WishlistFiltersProps {
  filters: {
    search: string;
    yearRange: string;
    rarity: string;
    mold: string;
    view: string;
    sort: string;
  };
  onFilterChange: (filters: any) => void;
}

const WishlistFilters: React.FC<WishlistFiltersProps> = ({
  filters,
  onFilterChange,
}) => {
  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    onFilterChange(newFilters);
  };

  const rarityOptions = [
    { value: 'ALL', label: 'All Rarities' },
    { value: 'COMMON', label: 'Common' },
    { value: 'UNCOMMON', label: 'Uncommon' },
    { value: 'RARE', label: 'Rare' },
    { value: 'EXCLUSIVE', label: 'Exclusive' },
  ];

  const moldOptions = [
    { value: 'ALL', label: 'All Molds' },
    { value: 'CAT', label: 'Cat' },
    { value: 'DOG', label: 'Dog' },
    { value: 'RODENT', label: 'Rodent' },
    { value: 'CATTLE', label: 'Cattle' },
    { value: 'KANGAROO', label: 'Kangaroo' },
    { value: 'BEAR', label: 'Bear' },
    { value: 'OTHER', label: 'Other' },
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'rarity', label: 'By Rarity' },
    { value: 'number', label: 'By Number' },
  ];

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        mb: 4,
        padding: { xs: 2, sm: 3 },
        borderRadius: 3,
      }}
    >
      {/* Первая строка: поиск, сортировка, переключатель */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 2,
          alignItems: { xs: 'stretch', md: 'center' },
          justifyContent: 'space-between',
        }}
      >
        {/* Поиск и сортировка */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2,
          flex: 1,
          flexWrap: { xs: 'wrap', md: 'nowrap' },
        }}>
          <SearchInput
            placeholder="Search figurines..."
            value={filters.search}
            onChange={(value) => handleFilterChange('search', value)}
            fullWidth
            size="small"
          />
          
          <SortSelect
            value={filters.sort || 'newest'}
            onChange={(value) => handleFilterChange('sort', value)}
            size="small"
            placeholder="Sort by"
            options={sortOptions}
          />
        </Box>

        {/* Переключатель All/Mine */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2,
          flexWrap: { xs: 'wrap', sm: 'nowrap' },
        }}>
          <ToggleSwitch
            options={[
              { value: 'ALL', label: 'All' },
              { value: 'MINE', label: 'Mine' },
            ]}
            value={filters.view}
            onChange={(value) => handleFilterChange('view', value)}
            variant="outlined"
            size="small"
          />
        </Box>
      </Box>

      {/* Вторая строка: фильтр по годам */}
      <Box sx={{ width: '100%' }}>
        <YearRangeFilter
          value={filters.yearRange}
          onChange={(value) => handleFilterChange('yearRange', value)}
        />
      </Box>

      {/* Третья строка: Rarity, Mold */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 3,
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2,
          flexWrap: 'wrap',
        }}>
          <FilterSelect
            label="Rarity:"
            value={filters.rarity}
            options={rarityOptions}
            onChange={(value) => handleFilterChange('rarity', value)}
            size="small"
          />

          <FilterSelect
            label="Mold:"
            value={filters.mold}
            options={moldOptions}
            onChange={(value) => handleFilterChange('mold', value)}
            size="small"
          />
        </Box>
      </Box>
    </Box>
  );
};

export default WishlistFilters;