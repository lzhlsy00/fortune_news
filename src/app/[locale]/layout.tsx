import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import Navbar from '@/components/Navbar'
import type { Locale } from '@/i18n/config'
import { locales } from '@/i18n/config'
import { getMessages } from '@/i18n/messages'

interface LocaleLayoutProps {
  children: React.ReactNode
  params: Promise<{
    locale: string
  }>
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params
  const localeParam = locale as Locale

  if (!locales.includes(localeParam)) {
    notFound()
  }

  const messages = getMessages(localeParam)

  return (
    <>
      <Suspense fallback={<div className="h-16" />}>
        <Navbar locale={localeParam} messages={messages.navbar} />
      </Suspense>
      <main className="min-h-screen">{children}</main>
    </>
  )
}
