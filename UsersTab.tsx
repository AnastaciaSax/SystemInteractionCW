import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Chip,
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  Switch,
  FormControlLabel,
  Avatar,
  CircularProgress
} from '@mui/material';
import {
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Block as BlockIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Refresh as RefreshIcon,
  FilterList as FilterIcon
} from '@mui/icons-material';
import { adminAPI, UserListItem } from '../../../../services/adminApi';
import { motion, AnimatePresence } from 'framer-motion';

interface UsersTabProps {
  onShowNotification: (message: string, type: 'success' | 'error' | 'info') => void;
}

const UsersTab: React.FC<UsersTabProps> = ({ onShowNotification }) => {
const [users, setUsers] = useState<UserListItem[]>([]);
const [filteredUsers, setFilteredUsers] = useState<UserListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState<any>({});

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, statusFilter, roleFilter]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await adminAPI.getUsers();
      setUsers(data);
      setFilteredUsers(data);
    } catch (error) {
      onShowNotification('Failed to load users', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = [...users];

    // Поиск
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Фильтр по статусу
    if (statusFilter !== 'all') {
      filtered = filtered.filter(user => 
        statusFilter === 'verified' ? user.isVerified : !user.isVerified
      );
    }

    // Фильтр по роли
    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    setFilteredUsers(filtered);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, user: any) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedUser(null);
  };

  const handleEditUser = (user: any) => {
    setEditForm({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
    });
    setEditDialogOpen(true);
    handleMenuClose();
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    if (window.confirm(`Delete user ${selectedUser.username}? This action cannot be undone.`)) {
      try {
        await adminAPI.deleteUser(selectedUser.id);
        onShowNotification('User deleted successfully', 'success');
        fetchUsers();
      } catch (error) {
        onShowNotification('Failed to delete user', 'error');
      }
    }
    handleMenuClose();
  };

  const handleToggleStatus = async (user: any) => {
    try {
      await adminAPI.updateUser(user.id, {
        isVerified: !user.isVerified
      });
      onShowNotification(`User ${user.isVerified ? 'unverified' : 'verified'}`, 'success');
      fetchUsers();
    } catch (error) {
      onShowNotification('Failed to update user', 'error');
    }
  };

  const handleSaveEdit = async () => {
    try {
      await adminAPI.updateUser(editForm.id, editForm);
      onShowNotification('User updated successfully', 'success');
      fetchUsers();
      setEditDialogOpen(false);
    } catch (error) {
      onShowNotification('Failed to update user', 'error');
    }
  };

  const getStatusChip = (user: any) => {
    if (!user.isVerified) {
      return <Chip label="Unverified" color="warning" size="small" />;
    }
    return <Chip label="Verified" color="success" size="small" />;
  };

  const getRoleChip = (role: string) => {
    const colors: any = {
      ADMIN: 'error',
      USER: 'primary',
      MODERATOR: 'secondary'
    };
    return (
      <Chip
        label={role}
        color={colors[role] || 'default'}
        size="small"
        sx={{ fontWeight: 600 }}
      />
    );
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
      {/* Фильтры и поиск */}
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
          mb: 3,
          alignItems: 'center'
        }}
      >
        <TextField
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          size="small"
          sx={{
            flexGrow: 1,
            maxWidth: 300,
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              backgroundColor: 'white'
            }
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#852654' }} />
              </InputAdornment>
            )
          }}
        />

        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            label="Status"
            onChange={(e) => setStatusFilter(e.target.value)}
            sx={{ borderRadius: 2 }}
          >
            <MenuItem value="all">All Status</MenuItem>
            <MenuItem value="verified">Verified</MenuItem>
            <MenuItem value="unverified">Unverified</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Role</InputLabel>
          <Select
            value={roleFilter}
            label="Role"
            onChange={(e) => setRoleFilter(e.target.value)}
            sx={{ borderRadius: 2 }}
          >
            <MenuItem value="all">All Roles</MenuItem>
            <MenuItem value="ADMIN">Admin</MenuItem>
            <MenuItem value="USER">User</MenuItem>
          </Select>
        </FormControl>

        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={fetchUsers}
          sx={{
            borderRadius: 2,
            borderColor: '#EC2EA6',
            color: '#EC2EA6',
            '&:hover': {
              borderColor: '#F056B7',
              backgroundColor: 'rgba(236, 46, 166, 0.05)'
            }
          }}
        >
          Refresh
        </Button>
      </Box>

      {/* Таблица пользователей */}
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <TableContainer
            component={Paper}
            sx={{
              borderRadius: 2,
              overflow: 'hidden',
              maxHeight: 500,
              '&::-webkit-scrollbar': {
                width: 8,
                height: 8
              },
              '&::-webkit-scrollbar-track': {
                background: 'rgba(0, 0, 0, 0.05)',
                borderRadius: 4
              },
              '&::-webkit-scrollbar-thumb': {
                background: '#EC2EA6',
                borderRadius: 4
              }
            }}
          >
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700, backgroundColor: '#F8FFFF' }}>User</TableCell>
                  <TableCell sx={{ fontWeight: 700, backgroundColor: '#F8FFFF' }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 700, backgroundColor: '#F8FFFF' }}>Role</TableCell>
                  <TableCell sx={{ fontWeight: 700, backgroundColor: '#F8FFFF' }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 700, backgroundColor: '#F8FFFF' }}>Joined</TableCell>
                  <TableCell sx={{ fontWeight: 700, backgroundColor: '#F8FFFF' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                      <Typography sx={{ color: '#852654', fontFamily: '"Nobile", sans-serif' }}>
                        No users found
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow
                      key={user.id}
                      hover
                      sx={{
                        '&:hover': {
                          backgroundColor: 'rgba(236, 46, 166, 0.03)'
                        }
                      }}
                    >
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar
                            src={user.profile?.avatar}
                            sx={{
                              width: 40,
                              height: 40,
                              border: '2px solid #EC2EA6'
                            }}
                          >
                            {user.username.charAt(0).toUpperCase()}
                          </Avatar>
                          <Box>
                            <Typography sx={{ fontWeight: 600, color: '#560D30' }}>
                              {user.username}
                            </Typography>
                            {user.age && (
                              <Typography variant="caption" sx={{ color: '#852654' }}>
                                Age: {user.age}
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{getRoleChip(user.role)}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {getStatusChip(user)}
                          <Tooltip title={user.isVerified ? "Unverify user" : "Verify user"}>
                            <IconButton
                              size="small"
                              onClick={() => handleToggleStatus(user)}
                              sx={{
                                color: user.isVerified ? '#4CAF50' : '#FFC107'
                              }}
                            >
                              {user.isVerified ? <CheckCircleIcon /> : <CancelIcon />}
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                      <TableCell>
                        {new Date(user.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={(e) => handleMenuOpen(e, user)}
                        >
                          <MoreVertIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </motion.div>
      </AnimatePresence>

      {/* Меню действий */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleEditUser(selectedUser)}>
          <EditIcon fontSize="small" sx={{ mr: 1, color: '#560D30' }} />
          Edit User
        </MenuItem>
        <MenuItem onClick={handleDeleteUser}>
          <DeleteIcon fontSize="small" sx={{ mr: 1, color: '#F44336' }} />
          Delete User
        </MenuItem>
      </Menu>

      {/* Диалог редактирования */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontFamily: '"McLaren", cursive', color: '#560D30' }}>
          Edit User
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <TextField
              label="Username"
              value={editForm.username || ''}
              onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
              fullWidth
              size="small"
            />
            <TextField
              label="Email"
              value={editForm.email || ''}
              onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
              fullWidth
              size="small"
            />
            <FormControl size="small" fullWidth>
              <InputLabel>Role</InputLabel>
              <Select
                value={editForm.role || 'USER'}
                label="Role"
                onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
              >
                <MenuItem value="USER">User</MenuItem>
                <MenuItem value="ADMIN">Admin</MenuItem>
              </Select>
            </FormControl>
            <FormControlLabel
              control={
                <Switch
                  checked={editForm.isVerified || false}
                  onChange={(e) => setEditForm({ ...editForm, isVerified: e.target.checked })}
                  color="primary"
                />
              }
              label="Verified Account"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setEditDialogOpen(false)}
            sx={{ color: '#852654' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveEdit}
            variant="contained"
            sx={{
              backgroundColor: '#EC2EA6',
              '&:hover': { backgroundColor: '#F056B7' }
            }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UsersTab;