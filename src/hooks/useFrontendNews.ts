'use client'

import { useState, useEffect, useCallback } from 'react';
import { frontendNewsApi, handleFrontendApiError, PublicNewsListParams } from '../services/frontendApi';
import { NewsItem, PaginationInfo } from '../types/api';

export const useFrontendNews = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const fetchPublishedNews = async (params: PublicNewsListParams = {}) => {
    setLoading(true);
    setError(null);
    try {
      const result = await frontendNewsApi.getPublishedNews(params);
      return result;
    } catch (err) {
      const errorMessage = handleFrontendApiError(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const fetchNewsDetail = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const result = await frontendNewsApi.getNewsDetail(id);
      if (result.success && result.data) {
        return result.data;
      } else {
        throw new Error(result.message || 'News not found');
      }
    } catch (err) {
      const errorMessage = handleFrontendApiError(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const fetchPopularCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const categories = await frontendNewsApi.getPopularCategories();
      return categories;
    } catch (err) {
      const errorMessage = handleFrontendApiError(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    fetchPublishedNews,
    fetchNewsDetail,
    fetchPopularCategories,
    clearError
  };
};

// 新闻列表Hook
export const usePublishedNewsList = (initialParams: PublicNewsListParams = {}) => {
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [params, setParams] = useState<PublicNewsListParams>({ latest: true, ...initialParams });
  const { loading, error, fetchPublishedNews, clearError } = useFrontendNews();

  const loadNews = async (newParams?: PublicNewsListParams) => {
    try {
      const finalParams = newParams || params;
      const result = await fetchPublishedNews(finalParams);
      if (result.success && result.data) {
        const shouldAppend = Boolean(newParams?.page && newParams.page > 1);
        setNewsList((prev) => {
          if (!shouldAppend) {
            return result.data.news;
          }

          const existingIds = new Set(prev.map((item) => item.id));
          const merged = [...prev];
          result.data.news.forEach((item) => {
            if (!existingIds.has(item.id)) {
              merged.push(item);
              existingIds.add(item.id);
            }
          });
          return merged;
        });
        setPagination(result.data.pagination);
        if (newParams) {
          setParams(finalParams);
        }
      }
    } catch (err) {
      console.error('Failed to load published news:', err);
    }
  };

  const refreshNews = () => loadNews();

  const updateParams = (newParams: Partial<PublicNewsListParams>) => {
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
