// client/src/pages/Trade/components/TradeFilters.tsx
import React, { useState } from 'react';
import { Box, Button } from '@mui/material';
import SearchInput from '../../../components/ui/SearchInput';
import SortSelect from '../../../components/ui/SortSelect';
import ToggleSwitch from '../../../components/ui/ToggleSwitch';
import SeriesFilter from '../../../components/ui/SeriesFilter';
import FilterSelect from '../../../components/ui/FilterSelect';
import Modal from '../../../components/ui/Modal';
import TradeAdForm from '../../../components/forms/TradeAdForm';

interface TradeFiltersProps {
  filters: {
    search: string;
    series: string;
    condition: string;
    region: string;
    view: string;
    sort: string;
  };
  onFilterChange: (filters: any) => void;
  onCreateAd?: (data: any) => Promise<void>;
}

const TradeFilters: React.FC<TradeFiltersProps> = ({
  filters,
  onFilterChange,
  onCreateAd,
}) => {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    onFilterChange(newFilters);
  };

  const handleCreateAd = async (data: any) => {
    if (!onCreateAd) return;
    
    setLoading(true);
    try {
      await onCreateAd(data);
      setCreateModalOpen(false);
    } catch (error) {
      console.error('Create ad error:', error);
    } finally {
      setLoading(false);
    }
  };

  const seriesOptions = ['G2', 'G3', 'G4', 'G5', 'G6', 'G7'];
  const conditionOptions = [
    { value: 'ALL', label: 'All Conditions' },
    { value: 'MINT', label: 'Mint' },
    { value: 'TLC', label: 'Needs TLC' },
    { value: 'GOOD', label: 'Good' },
    { value: 'NIB', label: 'New in Box' },
  ];
  const regionOptions = [
    { value: 'ALL', label: 'All Regions' },
    { value: 'USA', label: 'USA' },
    { value: 'EU', label: 'Europe' },
    { value: 'CIS', label: 'CIS' },
    { value: 'ASIA', label: 'Asia' },
    { value: 'OTHER', label: 'Other' },
  ];

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          mb: 4,
          padding: { xs: 2, sm: 3 },
          background: 'rgba(255, 255, 255, 0.42)',
          borderRadius: 3,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        }}
      >
        {/* Первая строка: поиск, сортировка, переключатель, кнопка */}
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
              placeholder="Search..."
              value={filters.search}
              onChange={(value) => handleFilterChange('search', value)}
              fullWidth
              size="small"
            />
            
            <SortSelect
              value={filters.sort || 'newest'}
              onChange={(value) => handleFilterChange('sort', value)}
              size="small"
            />
          </Box>

          {/* Переключатель All/Mine и кнопка создания */}
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

            <Button
              variant="contained"
              onClick={() => setCreateModalOpen(true)}
              sx={{
                backgroundColor: '#EC2EA6',
                color: 'white',
                borderRadius: '10px',
                fontFamily: '"McLaren", cursive',
                fontWeight: 400,
                textTransform: 'none',
                padding: '6px 16px',
                height: '38px',
                whiteSpace: 'nowrap',
                minWidth: '140px',
                '&:hover': {
                  backgroundColor: '#F056B7',
                },
              }}
            >
              Create TradeAd
            </Button>
          </Box>
        </Box>

        {/* Вторая строка: фильтр по сериям */}
        <Box sx={{ width: '100%' }}>
          <SeriesFilter
            series={seriesOptions}
            selectedSeries={filters.series === 'ALL' ? '' : filters.series}
            onSeriesChange={(series) => {
              handleFilterChange('series', series === filters.series ? 'ALL' : series);
            }}
            variant="buttons"
            fullWidth
            size="small"
          />
        </Box>

        {/* Третья строка: Condition и Region */}
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
              label="Condition:"
              value={filters.condition}
              options={conditionOptions}
              onChange={(value) => handleFilterChange('condition', value)}
              size="small"
            />

            <FilterSelect
              label="Region:"
              value={filters.region}
              options={regionOptions}
              onChange={(value) => handleFilterChange('region', value)}
              size="small"
            />
          </Box>
        </Box>
      </Box>

      {/* Модальное окно создания объявления */}
      <Modal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Create TradeAd"
        maxWidth="md"
        blurBackground
        padding={0}
      >
        <Box sx={{ padding: 4 }}>
          <TradeAdForm
            onSubmit={handleCreateAd}
            onCancel={() => setCreateModalOpen(false)}
            loading={loading}
            submitText="Create TradeAd"
          />
        </Box>
      </Modal>
    </>
  );
};

export default TradeFilters;