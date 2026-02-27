import type { Metadata, Viewport } from 'next'
import { Toaster } from 'sonner'
import SWRegister from '@/components/SWRegister'
import './globals.css'

export const metadata: Metadata = {
  title: '노딱AI — AI 주차 딱지 이의신청 도우미',
  description: '주정차 위반 딱지 사진 한 장이면 AI가 법률 근거를 분석하고 이의신청서를 자동 작성합니다. 무료, 10초 분석.',
  keywords: ['주정차위반', '이의신청', '딱지', '과태료', 'AI', '노딱'],
  openGraph: {
    title: '노딱AI — AI 주차 딱지 이의신청 도우미',
    description: '딱지 사진 한 장으로 AI가 이의신청서를 자동 작성합니다.',
    type: 'website',
    locale: 'ko_KR',
    siteName: '노딱AI',
    url: 'https://noddak.run.app',
  },
  twitter: {
    card: 'summary_large_image',
    title: '노딱AI — AI 주차 딱지 이의신청 도우미',
    description: '딱지 사진 한 장으로 AI가 이의신청서를 자동 작성합니다.',
  },
  robots: 'index, follow',
  other: {
    'naver-site-verification': '',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#dc2626',
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: '노딱AI',
  description: '주정차 위반 딱지 사진 한 장이면 AI가 법률 근거를 분석하고 이의신청서를 자동 작성합니다.',
  url: 'https://noddak.run.app',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Web',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'KRW' },
  creator: { '@type': 'Organization', name: 'LightOn Plus Lab' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <Toaster position="top-center" richColors />
        <SWRegister />
        {children}
      </body>
    </html>
  )
}
