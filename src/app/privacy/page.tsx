import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata = { title: '개인정보처리방침 — 노딱AI' }

export default function PrivacyPage() {
  return (
    <div className="min-h-screen px-6 py-8 max-w-lg mx-auto">
      <Link href="/" className="text-sm text-gray-500 mb-6 inline-block">
        <ArrowLeft size={14} className="inline mr-1" />뒤로
      </Link>

      <h1 className="text-2xl font-bold mb-6">개인정보처리방침</h1>

      <div className="prose prose-sm text-gray-600 space-y-6">
        <section>
          <h2 className="text-lg font-semibold text-gray-900">1. 수집하는 개인정보</h2>
          <p>노딱AI는 <b>개인정보를 수집하지 않습니다.</b></p>
          <ul className="list-disc pl-5 space-y-1">
            <li>회원가입이 없습니다</li>
            <li>이름, 이메일, 전화번호 등을 요구하지 않습니다</li>
            <li>업로드된 딱지 사진은 서버에 저장되지 않습니다</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">2. 이미지 처리</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>업로드된 이미지는 AI 분석 목적으로만 사용됩니다</li>
            <li>분석이 완료되면 이미지는 즉시 메모리에서 삭제됩니다</li>
            <li>서버 디스크, 데이터베이스 등에 영구 저장하지 않습니다</li>
            <li>이미지는 Google Gemini API로 전송되어 분석됩니다</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">3. 제3자 제공</h2>
          <p>분석을 위해 Google Gemini API에 이미지가 전송됩니다. Google의 개인정보처리방침은 <a href="https://policies.google.com/privacy" className="text-red-500 underline" target="_blank">여기</a>에서 확인하세요.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">4. 쿠키 및 분석</h2>
          <p>노딱AI는 쿠키를 사용하지 않으며, 별도의 사용자 추적이나 분석 도구를 사용하지 않습니다.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">5. 면책조항</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>노딱AI는 <b>법률 상담 서비스가 아닙니다</b></li>
            <li>AI가 생성한 이의신청서는 <b>초안</b>이며, 법적 효력을 보장하지 않습니다</li>
            <li>실제 제출 전 반드시 내용을 확인하고, 필요시 법률 전문가와 상담하세요</li>
            <li>이의신청 결과에 대해 노딱AI는 어떠한 책임도 지지 않습니다</li>
            <li>AI가 인용한 법 조항은 참고용이며, 최신 법령과 다를 수 있습니다</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">6. 문의</h2>
          <p>개인정보 관련 문의: <a href="mailto:support@lightonpluslab.com" className="text-red-500 underline">support@lightonpluslab.com</a></p>
        </section>

        <p className="text-xs text-gray-400">시행일: 2026년 2월 27일</p>
      </div>
    </div>
  )
}
