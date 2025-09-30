'use client'

import { useState, useEffect, useCallback, useRef } from 'react';
import { frontendNewsApi, handleFrontendApiError, PublicNewsListParams } from '../services/frontendApi';
import { NewsItem, PaginationInfo } from '../types/api';

export const useFrontendNews = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const fetchPublishedNews = useCallback(async (params: PublicNewsListParams = {}) => {
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
  }, []);

  const fetchNewsDetail = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const result = await frontendNewsApi.getNewsDetail(id);
      if (result.success && result.data) {
        return result.data;
      }

      throw new Error(result.message || 'News not found');
    } catch (err) {
      const errorMessage = handleFrontendApiError(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPopularCategories = useCallback(async () => {
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
  }, []);

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

  const paramsRef = useRef(params);

  useEffect(() => {
    paramsRef.current = params;
  }, [params]);

  const loadNews = useCallback(async (newParams?: PublicNewsListParams) => {
    try {
      const finalParams = newParams ?? paramsRef.current;
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
  }, [fetchPublishedNews]);

  const refreshNews = useCallback(() => {
    void loadNews();
  }, [loadNews]);

  const updateParams = useCallback(
    (newParams: Partial<PublicNewsListParams>) => {
      const updatedParams = { ...paramsRef.current, ...newParams };
      void loadNews(updatedParams);
    },
    [loadNews]
  );

  useEffect(() => {
    void loadNews();
  }, [loadNews]);

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
