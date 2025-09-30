import { notFound } from 'next/navigation'
import HomePage from '@/components/home/HomePage'
import type { Locale } from '@/i18n/config'
import { locales } from '@/i18n/config'
import { getMessages } from '@/i18n/messages'

interface LocalePageProps {
  params: Promise<{
    locale: string
  }>
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function LocaleHomePage({ params }: LocalePageProps) {
  const { locale } = await params
  const localeParam = locale as Locale

  if (!locales.includes(localeParam)) {
    notFound()
  }

  const messages = getMessages(localeParam)

  return <HomePage locale={localeParam} messages={messages} />
}
