// client/src/pages/Trade/components/TradeFilters.tsx
import React, { useState } from 'react';
import { Box, Button } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import AddIcon from '@mui/icons-material/Add';
import ToggleSwitch from '../../../components/ui/ToggleSwitch';
import SearchInput from '../../../components/ui/SearchInput';
import FilterSelect from '../../../components/ui/FilterSelect';
import SeriesFilter from '../../../components/ui/SeriesFilter';
import Modal from '../../../components/ui/Modal';
import TradeAdForm from '../../../components/forms/TradeAdForm';

interface TradeFiltersProps {
  filters: {
    search: string;
    series: string;
    condition: string;
    region: string;
    view: string;
  };
  onFilterChange: (filters: any) => void;
  onCreateAd?: (data: any) => Promise<void>;
}

const TradeFilters: React.FC<TradeFiltersProps> = ({
  filters,
  onFilterChange,
  onCreateAd,
}) => {
  const [localFilters, setLocalFilters] = useState(filters);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
  };

  const handleApplyFilters = () => {
    onFilterChange(localFilters);
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
          gap: 3,
          mb: 4,
          padding: { xs: 2, sm: 3 },
          background: 'rgba(255, 255, 255, 0.42)',
          borderRadius: 3,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        }}
      >
        {/* First Row: Search and Controls */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 2,
            alignItems: { xs: 'stretch', md: 'center' },
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ display: 'flex', gap: 2, flex: 1 }}>
            <SearchInput
              placeholder="Search by title, description..."
              value={localFilters.search}
              onChange={(value) => handleFilterChange('search', value)}
              onSearch={handleApplyFilters}
              fullWidth
              size="medium"
            />

            <FilterSelect
              label=""
              value={localFilters.series}
              options={[
                { value: 'ALL', label: 'All Series' },
                ...seriesOptions.map(s => ({ value: s, label: s }))
              ]}
              onChange={(value) => handleFilterChange('series', value)}
              size="medium"
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <ToggleSwitch
              options={[
                { value: 'ALL', label: 'All' },
                { value: 'MINE', label: 'Mine' },
              ]}
              value={localFilters.view}
              onChange={(value) => {
                handleFilterChange('view', value);
                handleApplyFilters();
              }}
              variant="outlined"
            />

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setCreateModalOpen(true)}
              sx={{
                backgroundColor: '#EC2EA6',
                color: 'white',
                borderRadius: '10px',
                fontFamily: '"McLaren", cursive',
                '&:hover': {
                  backgroundColor: '#F056B7',
                },
              }}
            >
              Create TradeAd
            </Button>
          </Box>
        </Box>

        {/* Second Row: Series Filter */}
        <SeriesFilter
          series={seriesOptions}
          selectedSeries={localFilters.series === 'ALL' ? '' : localFilters.series}
          onSeriesChange={(series) => {
            handleFilterChange('series', series);
            handleApplyFilters();
          }}
          variant="buttons"
          fullWidth
        />

        {/* Third Row: Condition and Region Filters */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 3,
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <FilterSelect
              label="Condition:"
              value={localFilters.condition}
              options={conditionOptions}
              onChange={(value) => handleFilterChange('condition', value)}
              size="small"
            />

            <FilterSelect
              label="Region:"
              value={localFilters.region}
              options={regionOptions}
              onChange={(value) => handleFilterChange('region', value)}
              size="small"
            />
          </Box>

          <Button
            variant="contained"
            startIcon={<FilterListIcon />}
            onClick={handleApplyFilters}
            sx={{
              backgroundColor: '#560D30',
              color: 'white',
              borderRadius: '10px',
              fontFamily: '"McLaren", cursive',
              '&:hover': {
                backgroundColor: '#82164A',
              },
            }}
          >
            Apply Filters
          </Button>
        </Box>
      </Box>

      {/* Create TradeAd Modal */}
      <Modal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Create TradeAd"
        maxWidth="md"
        blurBackground
      >
        <TradeAdForm
          onSubmit={handleCreateAd}
          onCancel={() => setCreateModalOpen(false)}
          loading={loading}
          submitText="Create TradeAd"
        />
      </Modal>
    </>
  );
};

export default TradeFilters;