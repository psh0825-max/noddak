'use client'

import { useState, useRef } from 'react'
import { Camera, Upload, FileText, AlertTriangle, ChevronRight, Shield, Zap, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'

export default function Home() {
  const [step, setStep] = useState<'home' | 'upload' | 'analyzing' | 'result'>('home')
  const [image, setImage] = useState<string | null>(null)
  const [result, setResult] = useState<any>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const cameraRef = useRef<HTMLInputElement>(null)

  async function handleFile(file: File) {
    if (!file.type.startsWith('image/')) {
      toast.error('이미지 파일만 업로드 가능합니다')
      return
    }
    const reader = new FileReader()
    reader.onload = async (e) => {
      const dataUrl = e.target?.result as string
      setImage(dataUrl)
      setStep('analyzing')

      try {
        const res = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: dataUrl }),
        })
        if (!res.ok) throw new Error('분석 실패')
        const data = await res.json()
        setResult(data)
        setStep('result')
      } catch {
        toast.error('분석 중 오류가 발생했습니다')
        setStep('upload')
      }
    }
    reader.readAsDataURL(file)
  }

  if (step === 'home') {
    return (
      <div className="min-h-screen flex flex-col">
        {/* Hero */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center">
          <div className="badge-red badge mb-4">
            <AlertTriangle size={14} /> AI 이의신청 도우미
          </div>
          <h1 className="text-4xl font-black mb-3 tracking-tight">
            노딱<span className="text-red-500">AI</span>
          </h1>
          <p className="text-gray-500 text-base mb-8 max-w-sm leading-relaxed">
            주정차 위반 딱지 사진을 찍으면<br/>
            AI가 이의신청서를 자동으로 작성해드립니다.
          </p>
          <button onClick={() => setStep('upload')} className="btn-primary max-w-xs">
            시작하기 <ChevronRight size={18} />
          </button>

          {/* Features */}
          <div className="grid grid-cols-3 gap-3 mt-12 max-w-sm w-full">
            <div className="card text-center py-4">
              <Camera size={24} className="mx-auto mb-2 text-red-500" />
              <div className="text-xs font-semibold">사진 촬영</div>
            </div>
            <div className="card text-center py-4">
              <Zap size={24} className="mx-auto mb-2 text-red-500" />
              <div className="text-xs font-semibold">AI 분석</div>
            </div>
            <div className="card text-center py-4">
              <FileText size={24} className="mx-auto mb-2 text-red-500" />
              <div className="text-xs font-semibold">신청서 생성</div>
            </div>
          </div>

          {/* How it works */}
          <div className="mt-12 max-w-sm w-full text-left">
            <h2 className="font-bold text-lg mb-4">이렇게 사용하세요</h2>
            <div className="space-y-3">
              {[
                { num: '1', title: '딱지 촬영', desc: '주정차 위반 딱지를 카메라로 촬영하세요' },
                { num: '2', title: 'AI 분석', desc: 'AI가 위반 내용과 항소 가능성을 분석합니다' },
                { num: '3', title: '신청서 생성', desc: '이의신청서가 자동으로 작성됩니다' },
              ].map((s) => (
                <div key={s.num} className="flex gap-3 items-start">
                  <div className="w-7 h-7 rounded-full bg-red-500 text-white flex items-center justify-center text-sm font-bold shrink-0">{s.num}</div>
                  <div>
                    <div className="font-semibold text-sm">{s.title}</div>
                    <div className="text-xs text-gray-500">{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center py-6 text-xs text-gray-400">
          <Shield size={12} className="inline mr-1" />
          사진은 서버에 저장되지 않습니다
        </footer>
      </div>
    )
  }

  if (step === 'upload') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6">
        <button onClick={() => setStep('home')} className="self-start mb-8 text-sm text-gray-500">← 뒤로</button>
        <h2 className="text-2xl font-bold mb-2">딱지 사진 업로드</h2>
        <p className="text-gray-500 text-sm mb-8">주정차 위반 딱지가 잘 보이게 촬영해주세요</p>

        {image && (
          <div className="mb-6 w-full max-w-xs">
            <img src={image} alt="딱지" className="rounded-2xl border w-full" />
          </div>
        )}

        <div className="flex gap-3 w-full max-w-xs">
          <input ref={cameraRef} type="file" accept="image/*" capture="environment" className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
          <button onClick={() => cameraRef.current?.click()} className="btn-primary flex-1">
            <Camera size={18} /> 촬영
          </button>

          <input ref={fileRef} type="file" accept="image/*" className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
          <button onClick={() => fileRef.current?.click()} className="btn-outline flex-1">
            <Upload size={18} /> 갤러리
          </button>
        </div>
      </div>
    )
  }

  if (step === 'analyzing') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6">
        <div className="w-16 h-16 border-4 border-red-200 border-t-red-500 rounded-full animate-spin mb-6" />
        <h2 className="text-xl font-bold mb-2">AI가 분석 중입니다</h2>
        <p className="text-gray-500 text-sm">위반 내용을 확인하고 이의신청서를 작성하고 있어요...</p>
        {image && <img src={image} alt="딱지" className="mt-6 rounded-2xl border w-48 opacity-50" />}
      </div>
    )
  }

  // result
  if (step === 'result' && result) {
    return (
      <div className="min-h-screen px-6 py-8 max-w-lg mx-auto">
        <button onClick={() => { setStep('home'); setImage(null); setResult(null) }}
          className="mb-6 text-sm text-gray-500">← 처음으로</button>

        {/* 분석 결과 */}
        <h2 className="text-2xl font-bold mb-4">분석 결과</h2>

        <div className="card mb-4">
          <div className="flex items-center justify-between mb-3">
            <span className="font-semibold">위반 유형</span>
            <span className="badge badge-red">{result.violation_type || '주정차 위반'}</span>
          </div>
          <div className="flex items-center justify-between mb-3">
            <span className="font-semibold">과태료</span>
            <span className="font-bold text-red-600">{result.fine_amount || '미확인'}</span>
          </div>
          <div className="flex items-center justify-between mb-3">
            <span className="font-semibold">위반 일시</span>
            <span className="text-gray-600">{result.violation_date || '미확인'}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-semibold">위반 장소</span>
            <span className="text-gray-600">{result.violation_location || '미확인'}</span>
          </div>
        </div>

        {/* 항소 가능성 */}
        <div className="card mb-4">
          <div className="flex items-center gap-2 mb-3">
            <Shield size={18} className="text-red-500" />
            <span className="font-bold">이의신청 가능성</span>
          </div>
          <div className={`text-2xl font-black mb-2 ${
            result.appeal_chance === '높음' ? 'text-green-600' :
            result.appeal_chance === '보통' ? 'text-yellow-600' : 'text-red-600'
          }`}>
            {result.appeal_chance || '보통'}
          </div>
          <p className="text-sm text-gray-500">{result.appeal_reason || ''}</p>
        </div>

        {/* 이의신청서 */}
        <div className="card mb-6">
          <div className="flex items-center gap-2 mb-3">
            <FileText size={18} className="text-red-500" />
            <span className="font-bold">이의신청서 (초안)</span>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 text-sm leading-relaxed whitespace-pre-wrap border">
            {result.appeal_letter || '이의신청서를 생성할 수 없습니다.'}
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={() => {
            navigator.clipboard.writeText(result.appeal_letter || '')
            toast.success('이의신청서가 복사되었습니다')
          }} className="btn-primary flex-1">
            <CheckCircle size={18} /> 복사하기
          </button>
          <button onClick={() => { setStep('upload'); setImage(null); setResult(null) }}
            className="btn-outline flex-1">
            다시 분석
          </button>
        </div>

        <p className="text-xs text-gray-400 text-center mt-6">
          ⚠️ AI가 생성한 초안입니다. 실제 제출 전 내용을 반드시 확인하세요.
        </p>
      </div>
    )
  }

  return null
}
