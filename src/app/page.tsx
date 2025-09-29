'use client'

import Link from 'next/link'
import { usePublishedNewsList } from '@/hooks/useFrontendNews'

export default function Home() {
  const { 
    newsList, 
    pagination, 
    loading, 
    error, 
    updateParams 
  } = usePublishedNewsList({ 
    limit: 20,
    latest: true
  });

  // 格式化时间
  const formatTime = (isoDate: string) => {
    const date = new Date(isoDate)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) {
      return '刚刚'
    } else if (diffInHours < 24) {
      return `${diffInHours}小时前`
    } else {
      const diffInDays = Math.floor(diffInHours / 24)
      return `${diffInDays}天前`
    }
  }

  const getCategoryColor = (category: string | null) => {
    if (!category) return 'bg-gray-100 text-gray-800';
    
    const colors: Record<string, string> = {
      '财经': 'bg-blue-100 text-blue-800',
      '科技': 'bg-green-100 text-green-800',
      '国际': 'bg-purple-100 text-purple-800',
      '体育': 'bg-orange-100 text-orange-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const getPlainPreview = (content: string | null) => {
    if (!content) return '';

    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(content, 'text/html');
      const text = doc.body.textContent || '';
      return text.replace(/\u00a0/g, ' ').replace(/\s+/g, ' ').trim();
    } catch (err) {
      console.warn('Failed to parse content preview', err);
      return content.replace(/<[^>]*>/g, '').replace(/\u00a0/g, ' ').trim();
    }
  };

  const handleLoadMore = () => {
    if (pagination && pagination.hasNext) {
      updateParams({ page: pagination.current + 1 });
    }
  };

  if (error) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="text-red-600 mb-4">加载失败: {error}</div>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              重新加载
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* 主要内容区域 */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">最新新闻</h1>
          {pagination && (
            <p className="text-gray-600">共 {pagination.totalCount} 条新闻</p>
          )}
        </div>

        {/* 加载状态 */}
        {loading && newsList.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-600">加载中...</div>
          </div>
        )}

        {/* 新闻列表 */}
        {newsList.length > 0 && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="divide-y divide-gray-200">
              {newsList.map((news) => (
                <Link 
                  key={news.id} 
                  href={`/news/${news.id}`}
                  className="block p-6 hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="flex items-center justify-between">
                    {/* 左侧内容 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center mb-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(news.category)}`}>
                          {news.category || '未分类'}
                        </span>
                      </div>
                      <h2 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors duration-200">
                        {news.title}
                      </h2>
                      {news.content && (
                        <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                          {getPlainPreview(news.content)}
                        </p>
                      )}
                    </div>
                    
                    {/* 右侧时间信息 */}
                    <div className="ml-6 flex-shrink-0">
                      <span className="text-sm text-gray-500 font-medium">
                        {formatTime(news.isoDate)}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* 暂无数据 */}
        {!loading && newsList.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500">暂无新闻数据</div>
          </div>
        )}

        {/* 加载更多按钮 */}
        {newsList.length > 0 && pagination && (
          <div className="text-center mt-8 space-y-4">
            {pagination.hasNext ? (
              <button 
                onClick={handleLoadMore}
                disabled={loading}
                className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? '加载中...' : '加载更多新闻'}
              </button>
            ) : (
              <div className="text-gray-500">没有更多内容</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
