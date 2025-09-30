import { notFound } from 'next/navigation'
import NewsDetailPage from '@/components/news/NewsDetailPage'
import type { Locale } from '@/i18n/config'
import { locales } from '@/i18n/config'
import { getMessages } from '@/i18n/messages'

interface NewsDetailPageProps {
  params: Promise<{
    locale: string
    id: string
  }>
}

export default async function LocaleNewsDetailPage({ params }: NewsDetailPageProps) {
  const { locale, id } = await params
  const localeParam = locale as Locale
  const newsId = Number(id)

  if (!locales.includes(localeParam) || Number.isNaN(newsId) || newsId <= 0) {
    notFound()
  }

  const messages = getMessages(localeParam)

  return <NewsDetailPage locale={localeParam} newsId={newsId} messages={messages} />
}
