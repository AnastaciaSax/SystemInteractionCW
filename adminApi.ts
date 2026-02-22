import api from './api';

export interface DashboardStats {
  totalUsers: number;
  userGrowth: number;
  activeTrades: number;
  tradeGrowth: number;
  totalArticles: number;
  articleGrowth: number;
  revenue: number;
  revenueGrowth: number;
}

export interface RecentActivity {
  type: string;
  entity_id: string;
  title: string;
  description: string;
  details: string;
  timestamp: string;
}

export interface UserListItem {
  id: string;
  username: string;
  email: string;
  role: string;
  isVerified: boolean;
  isActive?: boolean;
  age?: number;
  createdAt: string;
  profile?: {
    avatar: string;
    tradeCount: number;
    rating: number;
  };
}

export interface ArticleAdmin {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  published: boolean;
  imageUrl?: string;
  author?: {
    username: string;
  };
  createdAt: string;
}

export interface UploadImageResponse {
  url: string;
}

export const adminAPI = {
  getDashboardStats: (): Promise<DashboardStats> =>
    api.get<DashboardStats>('/admin/dashboard/stats').then(res => res.data) as Promise<DashboardStats>,

  getRecentActivity: (): Promise<RecentActivity[]> =>
    api.get<RecentActivity[]>('/admin/activity/recent').then(res => res.data) as Promise<RecentActivity[]>,

  getUsers: (params?: any): Promise<UserListItem[]> =>
    api.get<UserListItem[]>('/admin/users', { params }).then(res => res.data) as Promise<UserListItem[]>,

  getUserById: (id: string): Promise<UserListItem> =>
    api.get<UserListItem>(`/admin/users/${id}`).then(res => res.data) as Promise<UserListItem>,

  updateUser: (id: string, data: any): Promise<UserListItem> =>
    api.put<UserListItem>(`/admin/users/${id}`, data).then(res => res.data) as Promise<UserListItem>,

  deleteUser: (id: string): Promise<{ success: boolean }> =>
    api.delete<{ success: boolean }>(`/admin/users/${id}`).then(res => res.data) as Promise<{ success: boolean }>,

  getArticles: (params?: any): Promise<ArticleAdmin[]> =>
    api.get<ArticleAdmin[]>('/admin/articles', { params }).then(res => res.data) as Promise<ArticleAdmin[]>,

  getArticleById: (id: string): Promise<ArticleAdmin> =>
    api.get<ArticleAdmin>(`/admin/articles/${id}`).then(res => res.data) as Promise<ArticleAdmin>,

  createArticle: (data: any): Promise<ArticleAdmin> =>
    api.post<ArticleAdmin>('/admin/articles', data).then(res => res.data) as Promise<ArticleAdmin>,

  updateArticle: (id: string, data: any): Promise<ArticleAdmin> =>
    api.put<ArticleAdmin>(`/admin/articles/${id}`, data).then(res => res.data) as Promise<ArticleAdmin>,

  deleteArticle: (id: string): Promise<{ success: boolean }> =>
    api.delete<{ success: boolean }>(`/admin/articles/${id}`).then(res => res.data) as Promise<{ success: boolean }>,

  getAnalytics: (period: string = 'month'): Promise<any> =>
    api.get(`/admin/analytics?period=${period}`).then(res => res.data) as Promise<any>,

  exportReport: (reportType: string, format: 'pdf' | 'csv' | 'excel'): Promise<Blob> =>
    api.get(`/admin/reports/export?type=${reportType}&format=${format}`, {
      responseType: 'blob'
    }).then(res => {
      const blob = new Blob([res.data as BlobPart]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `report-${reportType}-${new Date().toISOString().split('T')[0]}.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      return blob;
    }) as Promise<Blob>,

  clearCache: (): Promise<{ success: boolean }> =>
    api.post<{ success: boolean }>('/admin/system/clear-cache').then(res => res.data) as Promise<{ success: boolean }>,

  uploadImage: (formData: FormData): Promise<UploadImageResponse> =>
    api.post<UploadImageResponse>('/admin/upload/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then(res => res.data) as Promise<UploadImageResponse>,

  getSettings: (): Promise<any> =>
    api.get('/admin/settings').then(res => res.data) as Promise<any>,

  updateSettings: (data: any): Promise<any> =>
    api.put('/admin/settings', data).then(res => res.data) as Promise<any>,
};