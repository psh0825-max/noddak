'use client'

import { useState, useRef } from 'react'
import { Camera, Upload, FileText, AlertTriangle, ChevronRight, Shield, Zap, CheckCircle, Download, Scale, Car, Sparkles, Clock, MapPin, Banknote, Hash } from 'lucide-react'
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
        toast.error('분석 중 오류가 발생했습니다. 다시 시도해주세요.')
        setStep('upload')
      }
    }
    reader.readAsDataURL(file)
  }

  // ─── HOME ───
  if (step === 'home') {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="hero-bg flex-1 flex flex-col items-center justify-center px-6 py-16 text-center">
          {/* Logo area */}
          <div className="animate-fade-in mb-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shadow-lg shadow-red-200 mx-auto mb-4">
              <Car size={36} className="text-white" />
            </div>
          </div>

          <div className="animate-fade-in">
            <span className="badge badge-gradient mb-4 inline-flex">
              <Sparkles size={12} /> AI 이의신청 도우미
            </span>
          </div>

          <h1 className="animate-fade-in-delay text-4xl font-black mb-3 tracking-tight leading-tight">
            노딱<span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">AI</span>
          </h1>
          <p className="animate-fade-in-delay text-gray-500 text-base mb-10 max-w-sm leading-relaxed">
            주정차 위반 딱지 사진을 찍으면<br/>
            <b className="text-gray-700">AI가 이의신청서를 자동으로 작성</b>해드립니다
          </p>

          <div className="animate-fade-in-delay-2 w-full max-w-xs">
            <button onClick={() => setStep('upload')} className="btn-primary">
              시작하기 <ChevronRight size={18} />
            </button>
          </div>

          {/* Feature cards */}
          <div className="animate-fade-in-delay-2 grid grid-cols-3 gap-3 mt-14 max-w-sm w-full">
            {[
              { icon: <Camera size={22} />, label: '사진 촬영', color: 'icon-circle-red' },
              { icon: <Zap size={22} />, label: 'AI 분석', color: 'icon-circle-orange' },
              { icon: <FileText size={22} />, label: '신청서 생성', color: 'icon-circle-blue' },
            ].map((f) => (
              <div key={f.label} className="card text-center py-5 px-2">
                <div className={`icon-circle ${f.color} mx-auto mb-2.5`}>{f.icon}</div>
                <div className="text-xs font-bold text-gray-700">{f.label}</div>
              </div>
            ))}
          </div>

          {/* How it works */}
          <div className="mt-14 max-w-sm w-full text-left">
            <h2 className="font-bold text-lg mb-5 text-center">💡 이렇게 사용하세요</h2>
            <div className="space-y-4">
              {[
                { num: '1', title: '딱지 촬영', desc: '주정차 위반 딱지를 카메라로 촬영하세요', color: 'from-red-500 to-red-600' },
                { num: '2', title: 'AI 분석', desc: 'AI가 위반 내용과 항소 가능성을 분석합니다', color: 'from-orange-500 to-orange-600' },
                { num: '3', title: '신청서 생성', desc: '법률 근거가 포함된 이의신청서가 자동 작성됩니다', color: 'from-amber-500 to-amber-600' },
              ].map((s) => (
                <div key={s.num} className="card flex gap-4 items-center">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} text-white flex items-center justify-center text-sm font-bold shrink-0 shadow-sm`}>{s.num}</div>
                  <div>
                    <div className="font-bold text-sm">{s.title}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Trust badges */}
          <div className="mt-10 flex gap-4 text-xs text-gray-400 items-center">
            <span className="flex items-center gap-1"><Shield size={12} /> 사진 미저장</span>
            <span className="flex items-center gap-1"><Scale size={12} /> 법률 근거 인용</span>
            <span className="flex items-center gap-1"><Sparkles size={12} /> 무료</span>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center py-6 space-y-2 bg-white border-t">
          <div className="flex justify-center gap-4 text-xs text-gray-400">
            <a href="/guide" className="hover:text-red-500 transition">📖 사용 가이드</a>
            <a href="/privacy" className="hover:text-red-500 transition">개인정보처리방침</a>
            <a href="/terms" className="hover:text-red-500 transition">이용약관</a>
          </div>
          <div className="text-xs text-gray-300">© 2026 LightOn Plus Lab</div>
        </footer>
      </div>
    )
  }

  // ─── UPLOAD ───
  if (step === 'upload') {
    return (
      <div className="min-h-screen hero-bg flex flex-col items-center justify-center px-6">
        <div className="animate-fade-in w-full max-w-sm">
          <button onClick={() => setStep('home')} className="mb-8 text-sm text-gray-500 hover:text-gray-700 transition">← 뒤로</button>

          <div className="text-center mb-8">
            <div className="icon-circle icon-circle-red mx-auto mb-4">
              <Camera size={24} />
            </div>
            <h2 className="text-2xl font-bold mb-2">딱지 사진 업로드</h2>
            <p className="text-gray-500 text-sm">주정차 위반 딱지가 잘 보이게 촬영해주세요</p>
          </div>

          {image && (
            <div className="animate-scale-in mb-6">
              <img src={image} alt="딱지" className="rounded-2xl border-2 border-gray-100 w-full shadow-lg" />
            </div>
          )}

          <div className="flex gap-3">
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

          <p className="text-xs text-gray-400 text-center mt-4 flex items-center justify-center gap-1">
            <Shield size={10} /> 사진은 분석 후 즉시 삭제됩니다
          </p>
        </div>
      </div>
    )
  }

  // ─── ANALYZING ───
  if (step === 'analyzing') {
    return (
      <div className="min-h-screen hero-bg flex flex-col items-center justify-center px-6">
        <div className="animate-fade-in text-center">
          <div className="relative inline-block mb-8">
            <div className="spinner" />
            <div className="absolute inset-0 spinner" style={{ animationDirection: 'reverse', borderColor: 'transparent', borderTopColor: '#f97316', opacity: 0.3 }} />
          </div>
          <h2 className="text-xl font-bold mb-2">AI가 분석 중입니다</h2>
          <p className="text-gray-500 text-sm mb-2">위반 내용을 확인하고 이의신청서를 작성하고 있어요</p>
          <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
            <Clock size={12} /> 보통 10~20초 소요
          </div>
          {image && (
            <div className="mt-8 animate-scale-in">
              <img src={image} alt="딱지" className="rounded-2xl border w-44 mx-auto opacity-40" />
            </div>
          )}
        </div>
      </div>
    )
  }

  // ─── RESULT ───
  if (step === 'result' && result) {
    const chanceColor = result.appeal_chance === '높음' ? 'chance-high' : result.appeal_chance === '보통' ? 'chance-medium' : 'chance-low'
    const chanceBg = result.appeal_chance === '높음' ? 'bg-green-50 border-green-200' : result.appeal_chance === '보통' ? 'bg-yellow-50 border-yellow-200' : 'bg-red-50 border-red-200'

    return (
      <div className="min-h-screen bg-gray-50 px-5 py-6 max-w-lg mx-auto">
        <div className="animate-fade-in">
          <button onClick={() => { setStep('home'); setImage(null); setResult(null) }}
            className="mb-5 text-sm text-gray-500 hover:text-gray-700 transition">← 처음으로</button>

          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="icon-circle icon-circle-red">
              <Scale size={22} />
            </div>
            <div>
              <h2 className="text-xl font-bold">분석 결과</h2>
              <p className="text-xs text-gray-500">AI가 딱지를 분석했습니다</p>
            </div>
          </div>

          {/* 위반 정보 카드 */}
          <div className="result-card mb-4">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">위반 정보</div>
            <div className="result-item">
              <span className="flex items-center gap-2 text-sm text-gray-500"><AlertTriangle size={14} /> 위반 유형</span>
              <span className="font-bold text-sm">{result.violation_type || '주정차 위반'}</span>
            </div>
            <div className="result-item">
              <span className="flex items-center gap-2 text-sm text-gray-500"><Banknote size={14} /> 과태료</span>
              <span className="font-bold text-sm text-red-600">{result.fine_amount || '미확인'}</span>
            </div>
            <div className="result-item">
              <span className="flex items-center gap-2 text-sm text-gray-500"><Clock size={14} /> 위반 일시</span>
              <span className="text-sm">{result.violation_date || '미확인'}</span>
            </div>
            <div className="result-item">
              <span className="flex items-center gap-2 text-sm text-gray-500"><MapPin size={14} /> 위반 장소</span>
              <span className="text-sm text-right max-w-[55%]">{result.violation_location || '미확인'}</span>
            </div>
            {result.vehicle_number && result.vehicle_number !== '___' && (
              <div className="result-item">
                <span className="flex items-center gap-2 text-sm text-gray-500"><Hash size={14} /> 차량번호</span>
                <span className="text-sm font-mono">{result.vehicle_number}</span>
              </div>
            )}
          </div>

          {/* 항소 가능성 */}
          <div className={`result-card mb-4 border-2 ${chanceBg}`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Shield size={18} className="text-gray-600" />
                <span className="font-bold text-sm">이의신청 가능성</span>
              </div>
              <span className={`text-2xl font-black ${chanceColor}`}>
                {result.appeal_chance || '보통'}
              </span>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">{result.appeal_reason || ''}</p>

            {result.appeal_points && result.appeal_points.length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <div className="text-xs font-bold text-gray-400 mb-2">주장 가능한 포인트</div>
                {result.appeal_points.map((p: string, i: number) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-gray-600 mb-1.5">
                    <CheckCircle size={14} className="text-green-500 mt-0.5 shrink-0" />
                    <span>{p}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 적용 법령 */}
          {result.legal_basis && result.legal_basis.length > 0 && (
            <div className="result-card mb-4">
              <div className="flex items-center gap-2 mb-3">
                <Scale size={16} className="text-red-500" />
                <span className="font-bold text-sm">적용 법령</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {result.legal_basis.map((law: string, i: number) => (
                  <span key={i} className="badge badge-red text-xs">§ {law}</span>
                ))}
              </div>
            </div>
          )}

          {/* 이의신청서 */}
          <div className="result-card mb-6">
            <div className="flex items-center gap-2 mb-3">
              <FileText size={16} className="text-red-500" />
              <span className="font-bold text-sm">이의신청서 (초안)</span>
            </div>
            <div className="bg-gray-50 rounded-2xl p-5 text-sm leading-relaxed whitespace-pre-wrap border border-gray-100 max-h-80 overflow-y-auto">
              {result.appeal_letter || '이의신청서를 생성할 수 없습니다.'}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 mb-4">
            <button onClick={() => {
              navigator.clipboard.writeText(result.appeal_letter || '')
              toast.success('이의신청서가 복사되었습니다')
            }} className="btn-sm flex-1">
              <CheckCircle size={14} /> 복사
            </button>
            <button onClick={() => {
              const text = (result.appeal_letter || '').replace(/\\n/g, '\n')
              const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>body{font-family:'Apple SD Gothic Neo',sans-serif;padding:48px;line-height:2;font-size:14px;color:#111;max-width:700px;margin:0 auto}h1{font-size:22px;text-align:center;margin-bottom:32px;letter-spacing:2px}hr{border:none;border-top:1px solid #ddd;margin:24px 0}.footer{margin-top:40px;text-align:right;font-size:12px;color:#999}</style></head><body><h1>이 의 신 청 서</h1><div style="white-space:pre-wrap">${text}</div><hr><div class="footer">노딱AI (noddak.lightonpluslab.com) 에서 생성됨<br>※ AI가 생성한 초안입니다. 제출 전 반드시 확인하세요.</div></body></html>`
              const blob = new Blob([html], { type: 'text/html' })
              const url = URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url; a.download = '이의신청서_노딱AI.html'; a.click()
              URL.revokeObjectURL(url)
              toast.success('파일이 다운로드되었습니다')
            }} className="btn-outline flex-1 text-sm">
              <Download size={14} /> 저장
            </button>
            <button onClick={() => { setStep('upload'); setImage(null); setResult(null) }}
              className="btn-outline flex-1 text-sm">
              다시 분석
            </button>
          </div>

          <p className="text-xs text-gray-400 text-center flex items-center justify-center gap-1">
            <AlertTriangle size={10} /> AI가 생성한 초안입니다. 실제 제출 전 내용을 반드시 확인하세요.
          </p>
        </div>
      </div>
    )
  }

  return null
}
