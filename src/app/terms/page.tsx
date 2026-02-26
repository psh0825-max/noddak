import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata = { title: '이용약관 — 노딱AI' }

export default function TermsPage() {
  return (
    <div className="min-h-screen px-6 py-8 max-w-lg mx-auto">
      <Link href="/" className="text-sm text-gray-500 mb-6 inline-block">
        <ArrowLeft size={14} className="inline mr-1" />뒤로
      </Link>

      <h1 className="text-2xl font-bold mb-6">이용약관</h1>

      <div className="prose prose-sm text-gray-600 space-y-6">
        <section>
          <h2 className="text-lg font-semibold text-gray-900">제1조 (목적)</h2>
          <p>이 약관은 LightOn Plus Lab(이하 "회사")이 제공하는 노딱AI 서비스(이하 "서비스")의 이용조건 및 절차에 관한 사항을 규정합니다.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">제2조 (서비스의 내용)</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>주정차 위반 딱지 사진의 AI 분석</li>
            <li>이의신청서 초안 자동 생성</li>
            <li>관련 법률 정보 제공</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">제3조 (서비스 이용)</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>서비스는 무료로 제공됩니다</li>
            <li>회원가입 없이 누구나 이용할 수 있습니다</li>
            <li>서비스 이용량에 제한이 있을 수 있습니다</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">제4조 (면책사항)</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>본 서비스는 <b>법률 상담을 대체하지 않습니다</b></li>
            <li>AI가 생성한 이의신청서는 <b>참고용 초안</b>이며, 정확성과 법적 효력을 보장하지 않습니다</li>
            <li>이의신청 결과(인용, 기각, 법원 이송 등)에 대해 회사는 책임을 지지 않습니다</li>
            <li>AI가 인용한 법 조항이 최신 법령과 다를 수 있습니다</li>
            <li>사용자는 서비스 이용 결과에 대해 스스로 책임을 집니다</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">제5조 (지식재산권)</h2>
          <p>서비스의 소프트웨어, 디자인, 콘텐츠에 대한 지식재산권은 회사에 귀속됩니다. 다만, AI가 생성한 이의신청서에 대한 권리는 사용자에게 귀속됩니다.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">제6조 (서비스 변경 및 중단)</h2>
          <p>회사는 운영상 필요에 따라 서비스를 변경하거나 중단할 수 있으며, 이로 인한 손해에 대해 책임을 지지 않습니다.</p>
        </section>

        <p className="text-xs text-gray-400">시행일: 2026년 2월 27일</p>
      </div>
    </div>
  )
}
