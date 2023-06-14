import '~/css/global.scss'

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import { RealViewportProvider } from '~/context/real-viewport'

import { AppHooks } from './app-hooks'

const inter = Inter({ subsets: ['latin'], variable: '--font-body' })

export const metadata: Metadata = {
  title: {
    default: 'Fabroos',
    template: '%s | Fabroos'
  },
  description: `A minimalist's boilerplate — Next.js with TypeScript.`,
  icons: [
    {
      rel: 'apple-touch-icon',
      url: '/apple-touch-icon.png'
    }
  ],
  manifest: '/manifest.webmanifest',
  twitter: {
    card: 'summary',
    title: 'Fabroos',
    creator: '@fabroos',
    siteId: '@fabroos'
  }
}

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body style={{ opacity: 0 }} className={inter.variable}>
        <RealViewportProvider>
          <main>{children}</main>
          <AppHooks />
        </RealViewportProvider>
      </body>
    </html>
  )
}

export default RootLayout
