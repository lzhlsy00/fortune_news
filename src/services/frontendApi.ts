import { NewsItem, BaseResponse, NewsListResponse, CategoryStat } from '../types/api';

// 前台API配置 - 只获取已发布的新闻
const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1').replace(/\/$/, '');

// 创建fetch封装
type QueryParamValue = string | number | boolean | null | undefined;
type QueryParams = Record<string, QueryParamValue>;

const apiClient = {
  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = `${API_BASE_URL}${normalizedEndpoint}`;

    const headers = new Headers(options.headers);

    if (options.body && !headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }

    const config: RequestInit = {
      ...options,
      headers,
    };

    console.log(`Frontend API请求: ${config.method || 'GET'} ${url}`);
    
    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      console.log(`Frontend API响应: ${response.status} ${url}`);
      
      if (!response.ok) {
        throw new Error(data.message || `HTTP ${response.status}`);
      }
      
      return data;
    } catch (error) {
      console.error('Frontend API请求失败:', error);
      throw error;
    }
  },

  async get<T>(endpoint: string, params?: QueryParams): Promise<T> {
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
};

// 前台新闻API接口
export interface PublicNewsListParams {
  page?: number;
  limit?: number;
  category?: string;
  hot?: boolean;
  latest?: boolean;
}

// 前台API服务
export const frontendNewsApi = {
  // 获取已发布的新闻列表
  getPublishedNews: async (params: PublicNewsListParams = {}) => {
    // 强制只获取已发布的新闻
    const publishedParams: PublicNewsListParams = {
      latest: params.latest ?? true,
      ...params,
    };

    return apiClient.get<NewsListResponse>('/public/news', publishedParams);
  },

  // 获取单个新闻详情（只有已发布的）
  getNewsDetail: async (id: number): Promise<BaseResponse<NewsItem>> => {
    return apiClient.get<BaseResponse<NewsItem>>(`/public/news/${id}`);
  },

  // 获取热门分类
  getPopularCategories: async () => {
    const result = await apiClient.get<BaseResponse<CategoryStat[]>>('/public/categories');

    if (result.success && result.data) {
      return result.data;
    }

    return [];
  }
};

// 错误处理工具
export const handleFrontendApiError = (error: unknown): string => {
  if (error && typeof error === 'object' && 'message' in error) {
    const message = (error as { message?: string }).message;
    if (message) {
      return message;
    }
  }
  return 'Failed to load news';
};
