import { Camera, Upload, Zap, FileText, Copy, AlertTriangle, CheckCircle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export const metadata = { title: '사용 가이드 — 노딱AI' }

export default function GuidePage() {
  return (
    <div className="min-h-screen px-6 py-8 max-w-lg mx-auto">
      <Link href="/" className="text-sm text-gray-500 mb-6 inline-block">
        <ArrowLeft size={14} className="inline mr-1" />뒤로
      </Link>

      <h1 className="text-2xl font-bold mb-2">📖 노딱AI 사용 가이드</h1>
      <p className="text-gray-500 text-sm mb-8">주정차 위반 딱지 이의신청을 AI가 도와드립니다.</p>

      <div className="space-y-6">
        <section className="card">
          <h2 className="font-bold text-lg mb-3 flex items-center gap-2">
            <Camera size={20} className="text-red-500" /> 1단계: 딱지 촬영
          </h2>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>• 주정차 위반 딱지(고지서)를 <b>카메라로 촬영</b>하거나 <b>갤러리에서 선택</b>하세요</li>
            <li>• 딱지의 <b>위반 유형, 일시, 장소, 금액</b>이 잘 보이도록 찍어주세요</li>
            <li>• 흐릿하거나 잘린 사진은 분석 정확도가 떨어질 수 있습니다</li>
          </ul>
        </section>

        <section className="card">
          <h2 className="font-bold text-lg mb-3 flex items-center gap-2">
            <Zap size={20} className="text-red-500" /> 2단계: AI 분석
          </h2>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>• AI가 딱지 사진을 분석하여 <b>위반 내용을 자동 인식</b>합니다</li>
            <li>• <b>이의신청 가능성</b> (높음/보통/낮음)을 판단합니다</li>
            <li>• 분석에는 보통 10~20초 정도 소요됩니다</li>
          </ul>
        </section>

        <section className="card">
          <h2 className="font-bold text-lg mb-3 flex items-center gap-2">
            <FileText size={20} className="text-red-500" /> 3단계: 이의신청서 확인
          </h2>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>• AI가 <b>도로교통법, 질서위반행위규제법</b> 등 실제 법 조항을 인용하여 이의신청서를 작성합니다</li>
            <li>• <b>적용 법령</b> 섹션에서 근거 조항을 확인할 수 있습니다</li>
            <li>• 이의신청서에서 <b>___</b> 부분은 본인 정보를 직접 입력하세요</li>
          </ul>
        </section>

        <section className="card">
          <h2 className="font-bold text-lg mb-3 flex items-center gap-2">
            <Copy size={20} className="text-red-500" /> 4단계: 복사 또는 PDF 다운로드
          </h2>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>• <b>복사하기</b>: 이의신청서 텍스트를 클립보드에 복사합니다</li>
            <li>• <b>PDF 저장</b>: 이의신청서를 PDF 파일로 다운로드합니다</li>
            <li>• 복사한 내용을 이메일이나 정부24에서 활용하세요</li>
          </ul>
        </section>

        <section className="card">
          <h2 className="font-bold text-lg mb-3 flex items-center gap-2">
            <CheckCircle size={20} className="text-red-500" /> 이의신청 제출 방법
          </h2>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>• <b>온라인</b>: 정부24 (gov.kr) 또는 이파인 (efine.go.kr)</li>
            <li>• <b>방문</b>: 관할 시·군·구청 교통과</li>
            <li>• <b>우편</b>: 과태료 부과 통지서에 기재된 주소로 발송</li>
            <li>• <b>기한</b>: 과태료 부과 통지를 받은 날로부터 <b>60일 이내</b> (질서위반행위규제법 제20조)</li>
          </ul>
        </section>

        <section className="card border-red-200 bg-red-50">
          <h2 className="font-bold text-lg mb-3 flex items-center gap-2">
            <AlertTriangle size={20} className="text-red-500" /> 주의사항
          </h2>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>• AI가 생성한 <b>초안</b>입니다. 실제 제출 전 반드시 내용을 확인하세요</li>
            <li>• 법률 상담을 대체하지 않습니다. 필요시 변호사와 상담하세요</li>
            <li>• 사진은 서버에 저장되지 않으며, 분석 후 즉시 삭제됩니다</li>
            <li>• 이의신청이 기각될 수 있으며, 이 경우 관할 법원에서 재판이 진행됩니다</li>
          </ul>
        </section>
      </div>

      <div className="mt-8 text-center">
        <Link href="/" className="btn-primary inline-flex max-w-xs">
          시작하기
        </Link>
      </div>
    </div>
  )
}
