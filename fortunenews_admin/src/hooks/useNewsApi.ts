'use client'

import { useState, useEffect, useCallback } from 'react';
import { newsApi, handleApiError } from '../services/newsApi';
import { NewsItem, NewsListParams, NewsUpdateData } from '../types/api';

export const useNewsApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNewsList = async (params: NewsListParams = {}) => {
    setLoading(true);
    setError(null);
    try {
      const result = await newsApi.getNewsList(params);
      return result;
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const fetchNewsById = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const result = await newsApi.getNewsById(id);
      if (result.success && result.data) {
        return result.data;
      } else {
        throw new Error(result.message || '获取新闻失败');
      }
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updateNews = async (id: number, data: NewsUpdateData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await newsApi.updateNews(id, data);
      if (result.success) {
        return result.data;
      } else {
        throw new Error(result.message || '更新失败');
      }
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const deleteNews = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const result = await newsApi.deleteNews(id);
      if (result.success) {
        return result;
      } else {
        throw new Error(result.message || '删除失败');
      }
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const clearError = useCallback(() => setError(null), []);

  return {
    loading,
    error,
    fetchNewsList,
    fetchNewsById,
    updateNews,
    deleteNews,
    clearError
  };
};

// 新闻列表Hook
export const useNewsList = (initialParams: NewsListParams = {}) => {
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [params, setParams] = useState<NewsListParams>(initialParams);
  const { loading, error, fetchNewsList, clearError } = useNewsApi();

  const loadNews = async (newParams?: NewsListParams) => {
    try {
      const finalParams = newParams || params;
      const result = await fetchNewsList(finalParams);
      if (result.success && result.data) {
        setNewsList(result.data.news);
        setPagination(result.data.pagination);
        if (newParams) {
          setParams(finalParams);
        }
      }
    } catch (err) {
      console.error('加载新闻列表失败:', err);
    }
  };

  const refreshNews = () => loadNews();

  const updateParams = (newParams: Partial<NewsListParams>) => {
    const updatedParams = { ...params, ...newParams };
    setParams(updatedParams);
    loadNews(updatedParams);
  };

  useEffect(() => {
    loadNews();
  }, []);

  return {
    newsList,
    pagination,
    params,
    loading,
    error,
    loadNews,
    refreshNews,
    updateParams,
    clearError
  };
};
