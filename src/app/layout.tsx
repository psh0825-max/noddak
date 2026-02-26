import type { Metadata, Viewport } from 'next'
import { Toaster } from 'sonner'
import './globals.css'

export const metadata: Metadata = {
  title: '노딱 — AI 주차 딱지 이의신청',
  description: '주정차 위반 딱지 사진을 찍으면 AI가 이의신청서를 자동으로 작성해드립니다.',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#dc2626',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <Toaster position="top-center" richColors />
        {children}
      </body>
    </html>
  )
}
