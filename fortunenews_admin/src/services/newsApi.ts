import {
  NewsListResponse,
  NewsItem,
  NewsListParams,
  NewsUpdateData,
  NewsUploadData,
  BaseResponse,
  StatsResponse
} from '../types/api';

// API配置
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

// 创建fetch封装
const apiClient = {
  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    console.log(`API请求: ${config.method || 'GET'} ${url}`);
    
    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      console.log(`API响应: ${response.status} ${url}`);
      
      if (!response.ok) {
        throw new Error(data.message || `HTTP ${response.status}`);
      }
      
      return data;
    } catch (error) {
      console.error('API请求失败:', error);
      throw error;
    }
  },

  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
    }
    
    const queryString = searchParams.toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    
    return this.request<T>(url);
  },

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    });
  },
};

// API服务
export const newsApi = {
  // 获取新闻列表
  getNewsList: async (params: NewsListParams = {}): Promise<NewsListResponse> => {
    return apiClient.get<NewsListResponse>('/admin/news', params);
  },

  // 获取单个新闻
  getNewsById: async (id: number): Promise<BaseResponse<NewsItem>> => {
    return apiClient.get<BaseResponse<NewsItem>>(`/admin/news/${id}`);
  },

  // 更新新闻
  updateNews: async (id: number, data: NewsUpdateData): Promise<BaseResponse<NewsItem>> => {
    return apiClient.put<BaseResponse<NewsItem>>(`/admin/news/${id}`, data);
  },

  // 删除新闻
  deleteNews: async (id: number): Promise<BaseResponse<{ id: number }>> => {
    return apiClient.delete<BaseResponse<{ id: number }>>(`/admin/news/${id}`);
  },

  // 获取统计信息
  getStats: async (): Promise<StatsResponse> => {
    return apiClient.get<StatsResponse>('/admin/stats');
  },

  // 上传新闻（第三方接口）
  uploadNews: async (data: NewsUploadData): Promise<BaseResponse<NewsItem>> => {
    return apiClient.post<BaseResponse<NewsItem>>('/upload', data);
  }
};

// 错误处理工具
export const handleApiError = (error: any): string => {
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }
  if (error?.response?.data?.errors?.length > 0) {
    return error.response.data.errors.map((e: any) => e.message).join(', ');
  }
  if (error?.message) {
    return error.message;
  }
  return '未知错误';
};
