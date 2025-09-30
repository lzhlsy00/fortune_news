'use client'

import Link from 'next/link'
import { usePublishedNewsList } from '@/hooks/useFrontendNews'
import type { AppMessages } from '@/i18n/messages'
import { formatWithCount, formatWithError } from '@/i18n/utils'
import type { Locale } from '@/i18n/config'
import type { NewsItem } from '@/types/api'

interface HomePageProps {
  locale: Locale
  messages: AppMessages
}

const getRelativeTime = (isoDate: string, messages: AppMessages['time']) => {
  const date = new Date(isoDate)
  const now = new Date()
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

  if (diffInHours < 1) {
    return messages.justNow
  }

  if (diffInHours < 24) {
    return formatWithCount(messages.hoursAgo, diffInHours)
  }

  const diffInDays = Math.floor(diffInHours / 24)
  return formatWithCount(messages.daysAgo, diffInDays)
}

const getPlainPreview = (content: string | null) => {
  if (!content) return ''

  try {
    const parser = new DOMParser()
    const doc = parser.parseFromString(content, 'text/html')
    const text = doc.body.textContent || ''
    return text.replace(/\u00a0/g, ' ').replace(/\s+/g, ' ').trim()
  } catch (err) {
    console.warn('Failed to parse content preview', err)
    return content.replace(/<[^>]*>/g, '').replace(/\u00a0/g, ' ').trim()
  }
}

interface CategoryColorMap {
  [key: string]: string
}

const categoryColorMap: CategoryColorMap = {
  '财经': 'bg-blue-100 text-blue-800',
  '科技': 'bg-green-100 text-green-800',
  '国际': 'bg-purple-100 text-purple-800',
  '体育': 'bg-orange-100 text-orange-800',
  Finance: 'bg-blue-100 text-blue-800',
  Technology: 'bg-green-100 text-green-800',
  World: 'bg-purple-100 text-purple-800',
  Sports: 'bg-orange-100 text-orange-800',
}

const getCategoryStyle = (category: string | null) => {
  if (!category) return 'bg-gray-100 text-gray-800'
  return categoryColorMap[category] || 'bg-gray-100 text-gray-800'
}

export default function HomePage({ locale, messages }: HomePageProps) {
  const {
    newsList,
    pagination,
    loading,
    error,
    updateParams,
  } = usePublishedNewsList({
    limit: 20,
    latest: true,
  })

  const shouldDisplayNews = (news: NewsItem) =>
    news.status === 'PUBLISH' && news.titleKo !== null && news.titleEn !== null

  const getLocalizedTitle = (news: NewsItem) => {
    if (locale === 'en') {
      return news.titleEn ?? news.title
    }

    if (locale === 'ko') {
      return news.titleKo ?? news.title
    }

    return news.title
  }

  const getLocalizedContent = (news: NewsItem) => {
    if (locale === 'en') {
      return news.translationEn ?? news.content
    }

    if (locale === 'ko') {
      return news.translationKo ?? news.content
    }

    return news.content
  }

  const visibleNews = newsList.filter(shouldDisplayNews)

  const handleLoadMore = () => {
    if (pagination && pagination.hasNext) {
      updateParams({ page: pagination.current + 1 })
    }
  }

  if (error) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="text-red-600 mb-4">
              {formatWithError(messages.home.loadFailed, error)}
            </div>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              {messages.home.reload}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{messages.home.heading}</h1>
          {pagination && (
            <p className="text-gray-600">
              {formatWithCount(messages.home.totalCount, pagination.totalCount)}
            </p>
          )}
        </div>

        {loading && newsList.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-600">{messages.home.loading}</div>
          </div>
        )}

        {visibleNews.length > 0 && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="divide-y divide-gray-200">
              {visibleNews.map((news) => {
                const localizedTitle = getLocalizedTitle(news)
                const localizedContent = getLocalizedContent(news)

                return (
                  <Link
                    key={news.id}
                    href={`/${locale}/news/${news.id}`}
                    className="block p-6 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center mb-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryStyle(news.category)}`}>
                            {news.category || messages.home.categoryUnknown}
                          </span>
                        </div>
                        <h2 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors duration-200">
                          {localizedTitle}
                        </h2>
                        {localizedContent && (
                          <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                            {getPlainPreview(localizedContent)}
                          </p>
                        )}
                      </div>

                      <div className="ml-6 flex-shrink-0 text-sm text-gray-500 font-medium">
                        {getRelativeTime(news.isoDate, messages.time)}
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        )}

        {!loading && visibleNews.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500">{messages.home.noData}</div>
          </div>
        )}

        {visibleNews.length > 0 && pagination && (
          <div className="text-center mt-8 space-y-4">
            {pagination.hasNext ? (
              <button
                onClick={handleLoadMore}
                disabled={loading}
                className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? messages.home.loadMoreLoading : messages.home.loadMore}
              </button>
            ) : (
              <div className="text-gray-500">{messages.home.noMore}</div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
