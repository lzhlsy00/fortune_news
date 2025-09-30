"use client"

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { locales, localeLabels } from '@/i18n/config'
import type { AppMessages } from '@/i18n/messages'
import type { Locale } from '@/i18n/config'

interface NavbarProps {
  locale: Locale
  messages: AppMessages['navbar']
}

const replaceLocaleInPath = (pathname: string | null, targetLocale: Locale) => {
  if (!pathname || pathname === '') {
    return `/${targetLocale}`
  }

  const segments = pathname.split('/').filter((segment) => segment.length > 0)

  if (segments.length === 0) {
    return `/${targetLocale}`
  }

  if (locales.includes(segments[0] as Locale)) {
    segments[0] = targetLocale
  } else {
    segments.unshift(targetLocale)
  }

  return `/${segments.join('/')}`
}

export default function Navbar({ locale, messages }: NavbarProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement | null>(null)

  const buildHref = (targetLocale: Locale) => {
    const basePath = replaceLocaleInPath(pathname, targetLocale)
    const query = searchParams?.toString()
    return query ? `${basePath}?${query}` : basePath
  }

  useEffect(() => {
    if (!menuOpen) return

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      if (!menuRef.current || menuRef.current.contains(target)) {
        return
      }
      setMenuOpen(false)
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [menuOpen])

  return (
    <nav className="bg-white shadow-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href={`/${locale}`} className="flex items-center space-x-2">
              <div className="text-2xl font-bold text-blue-600">FortuneNews</div>
            </Link>
          </div>

          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenuOpen((prev) => !prev)}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-haspopup="menu"
              aria-expanded={menuOpen}
            >
              <span className="sr-only">{messages.language}</span>
              <svg
                className="w-5 h-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 21a9 9 0 100-18 9 9 0 000 18zm0 0c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m-7.5 9h15"
                />
              </svg>
            </button>

            {menuOpen && (
              <div
                role="menu"
                className="absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 py-1 z-20"
              >
                <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  {messages.language}
                </div>
                {locales.map((itemLocale) => (
                  <Link
                    key={itemLocale}
                    href={buildHref(itemLocale)}
                    className={`flex justify-between items-center px-4 py-2 text-sm transition-colors duration-150 ${
                      itemLocale === locale
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    onClick={() => setMenuOpen(false)}
                    role="menuitem"
                  >
                    <span>{localeLabels[itemLocale]}</span>
                    {itemLocale === locale && (
                      <svg
                        className="w-4 h-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
