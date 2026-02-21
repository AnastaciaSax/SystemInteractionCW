import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Switch,
  FormControlLabel,
  TextField,
  Button,
  Divider,
  Grid,
  Alert,
  CircularProgress
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { adminAPI } from '../../../../services/adminApi';

const SettingsTab: React.FC = () => {
  const [settings, setSettings] = useState({
    siteName: 'Collector Mingle',
    allowRegistrations: true,
    requireEmailVerification: true,
    maintenanceMode: false,
    maxTradeAdsPerUser: 10,
    reportEmail: 'admin@collectormingle.com'
  });
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // Загрузить настройки с сервера (пока заглушка)
    // adminAPI.getSettings().then(setSettings);
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      // await adminAPI.updateSettings(settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ fontFamily: '"McLaren", cursive', color: '#560D30', mb: 3 }}>
        System Settings
      </Typography>

      <Paper sx={{ p: 4, borderRadius: 2 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              label="Site Name"
              value={settings.siteName}
              onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
              fullWidth
              size="small"
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Report Email"
              value={settings.reportEmail}
              onChange={(e) => setSettings({ ...settings, reportEmail: e.target.value })}
              fullWidth
              size="small"
              type="email"
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Max Trade Ads per User"
              value={settings.maxTradeAdsPerUser}
              onChange={(e) => setSettings({ ...settings, maxTradeAdsPerUser: parseInt(e.target.value) || 0 })}
              fullWidth
              size="small"
              type="number"
            />
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" sx={{ color: '#560D30', mb: 2 }}>Features</Typography>
            
            <FormControlLabel
              control={
                <Switch
                  checked={settings.allowRegistrations}
                  onChange={(e) => setSettings({ ...settings, allowRegistrations: e.target.checked })}
                />
              }
              label="Allow new user registrations"
            />
            
            <FormControlLabel
              control={
                <Switch
                  checked={settings.requireEmailVerification}
                  onChange={(e) => setSettings({ ...settings, requireEmailVerification: e.target.checked })}
                />
              }
              label="Require email verification"
            />
            
            <FormControlLabel
              control={
                <Switch
                  checked={settings.maintenanceMode}
                  onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                />
              }
              label="Maintenance mode (site offline)"
            />
          </Grid>

          {saved && (
            <Grid item xs={12}>
              <Alert severity="success">Settings saved successfully!</Alert>
            </Grid>
          )}

          <Grid item xs={12}>
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleSave}
              disabled={loading}
              sx={{
                backgroundColor: '#EC2EA6',
                '&:hover': { backgroundColor: '#F056B7' }
              }}
            >
              {loading ? <CircularProgress size={24} /> : 'Save Settings'}
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default SettingsTab;