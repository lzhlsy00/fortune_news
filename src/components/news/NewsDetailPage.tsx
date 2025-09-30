'use client'

/* eslint-disable @next/next/no-img-element */

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import { useFrontendNews } from '@/hooks/useFrontendNews'
import type { NewsItem } from '@/types/api'
import type { Components } from 'react-markdown'
import type { JSX, ReactNode } from 'react'
import type { Locale } from '@/i18n/config'
import type { AppMessages } from '@/i18n/messages'

interface NewsDetailPageProps {
  newsId: number
  locale: Locale
  messages: AppMessages
}

export default function NewsDetailPage({ newsId, locale, messages }: NewsDetailPageProps) {
  const router = useRouter()
  const { fetchNewsDetail, loading, error } = useFrontendNews()
  const [newsItem, setNewsItem] = useState<NewsItem | null>(null)

  const loadNewsDetail = useCallback(
    async (id: number) => {
      try {
        const news = await fetchNewsDetail(id)
        setNewsItem(news)
      } catch (err) {
        console.error('Failed to load news detail:', err)
      }
    },
    [fetchNewsDetail]
  )

  useEffect(() => {
    if (newsId) {
      void loadNewsDetail(newsId)
    }
  }, [newsId, loadNewsDetail])

  const formatTime = (isoDate: string) => {
    const date = new Date(isoDate)
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  }

  const categoryColorMap: Record<string, string> = {
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

  type MarkdownComponentProps<T extends keyof JSX.IntrinsicElements> = JSX.IntrinsicElements[T] & {
    children?: ReactNode
  }

  const markdownComponents: Components = {
    h1: ({ children }: MarkdownComponentProps<'h1'>) => (
      <h1 className="text-2xl font-bold text-gray-900 mb-4 mt-8 first:mt-0">{children}</h1>
    ),
    h2: ({ children }: MarkdownComponentProps<'h2'>) => (
      <h2 className="text-xl font-semibold text-gray-900 mb-3 mt-6 first:mt-0">{children}</h2>
    ),
    h3: ({ children }: MarkdownComponentProps<'h3'>) => (
      <h3 className="text-lg font-medium text-gray-900 mb-2 mt-4 first:mt-0">{children}</h3>
    ),
    p: ({ children }: MarkdownComponentProps<'p'>) => (
      <p className="mb-4 text-gray-700 leading-relaxed">{children}</p>
    ),
    ul: ({ children }: MarkdownComponentProps<'ul'>) => (
      <ul className="list-disc pl-6 mb-4 space-y-1">{children}</ul>
    ),
    ol: ({ children }: MarkdownComponentProps<'ol'>) => (
      <ol className="list-decimal pl-6 mb-4 space-y-1">{children}</ol>
    ),
    li: ({ children }: MarkdownComponentProps<'li'>) => <li className="text-gray-700">{children}</li>,
    blockquote: ({ children }: MarkdownComponentProps<'blockquote'>) => (
      <blockquote className="border-l-4 border-blue-400 pl-4 py-2 mb-4 bg-blue-50 italic text-gray-700">
        {children}
      </blockquote>
    ),
    code: ({ children }: MarkdownComponentProps<'code'>) => (
      <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-gray-800">{children}</code>
    ),
    pre: ({ children }: MarkdownComponentProps<'pre'>) => (
      <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto mb-4">{children}</pre>
    ),
    a: ({ href, children, ...rest }: MarkdownComponentProps<'a'>) => (
      <a
        href={typeof href === 'string' ? href : undefined}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:text-blue-800 underline"
        {...rest}
      >
        {children}
      </a>
    ),
    img: ({ src, alt, ...rest }: MarkdownComponentProps<'img'>) => (
      <img
        src={typeof src === 'string' ? src : undefined}
        alt={alt ?? ''}
        className="max-w-full h-auto rounded-lg shadow-md my-4"
        {...rest}
      />
    ),
    table: ({ children }: MarkdownComponentProps<'table'>) => (
      <div className="overflow-x-auto mb-4">
        <table className="min-w-full border-collapse border border-gray-300">{children}</table>
      </div>
    ),
    th: ({ children, ...rest }: MarkdownComponentProps<'th'>) => (
      <th className="border border-gray-300 bg-gray-100 px-4 py-2 text-left font-semibold text-gray-900" {...rest}>
        {children}
      </th>
    ),
    td: ({ children, ...rest }: MarkdownComponentProps<'td'>) => (
      <td className="border border-gray-300 px-4 py-2 text-gray-700" {...rest}>
        {children}
      </td>
    ),
  }

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="text-gray-600">{messages.detail.loading}</div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !newsItem) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="text-red-600 mb-4">
              {messages.detail.notFound}
            </div>
            <div className="space-x-4">
              <button
                onClick={() => router.back()}
                className="px-6 py-3 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                {messages.detail.back}
              </button>
              <Link
                href={`/${locale}`}
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                {messages.detail.backToHome}
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {messages.detail.back}
          </button>
        </div>

        <article className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-8 border-b border-gray-200">
            <div className="mb-4">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getCategoryStyle(newsItem.category)}`}>
                {newsItem.category || messages.detail.categoryUnknown}
              </span>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
              {newsItem.title}
            </h1>

            <div className="flex items-center text-gray-500 text-sm space-x-6">
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {formatTime(newsItem.isoDate)}
              </div>
            </div>
          </div>

          <div className="p-8">
            {newsItem.content ? (
              <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                <ReactMarkdown rehypePlugins={[rehypeRaw]} components={markdownComponents}>
                  {newsItem.content}
                </ReactMarkdown>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">{messages.detail.noContent}</p>
              </div>
            )}
          </div>

          <div className="px-8 py-6 bg-gray-50 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <Link href={`/${locale}`} className="text-blue-600 hover:text-blue-800 transition-colors">
                {messages.detail.backToList}
              </Link>

              <div className="flex space-x-4">
                <button
                  onClick={() => {
                    if (navigator.share) {
                      void navigator.share({
                        title: newsItem.title,
                        url: window.location.href,
                      })
                    } else {
                      void navigator.clipboard.writeText(window.location.href)
                      alert(messages.detail.shareCopied)
                    }
                  }}
                  className="text-gray-600 hover:text-gray-800 transition-colors"
                >
                  {messages.detail.share}
                </button>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  )
}
