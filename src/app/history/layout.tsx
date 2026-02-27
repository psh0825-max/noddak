import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '분석 히스토리 — 노딱AI',
  description: '이전에 분석한 주정차 위반 딱지 결과를 다시 확인하세요.',
}

export default function HistoryLayout({ children }: { children: React.ReactNode }) {
  return children
}
