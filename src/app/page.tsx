'use client'

import { useState, useRef } from 'react'
import { Camera, Upload, FileText, AlertTriangle, ChevronRight, Shield, Zap, CheckCircle, Download, Scale, Car, Sparkles, Clock, MapPin, Banknote, Hash, ArrowRight, Star, TrendingUp } from 'lucide-react'
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
        {/* Bold Red Hero */}
        <div className="hero-top px-6 pt-14 pb-16 text-center relative">
          {/* Floating decorations */}
          <div className="floating-shape w-32 h-32 bg-white" style={{ top: '10%', right: '-5%', animationDelay: '0s' }} />
          <div className="floating-shape w-20 h-20 bg-white" style={{ top: '60%', left: '-3%', animationDelay: '2s' }} />
          <div className="floating-shape w-16 h-16 bg-white" style={{ top: '30%', left: '15%', animationDelay: '4s' }} />

          <div className="relative z-10">
            <div className="animate-fade-in mb-5">
              <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-4 border border-white/30 animate-pulse-glow">
                <Car size={38} className="text-white drop-shadow-lg" />
              </div>
            </div>

            <div className="animate-fade-in">
              <span className="badge badge-white mb-4 inline-flex">
                <Sparkles size={12} /> AI 이의신청 도우미
              </span>
            </div>

            <h1 className="animate-fade-in-delay text-4xl font-black mb-3 tracking-tight text-white drop-shadow-lg">
              노딱AI
            </h1>
            <p className="animate-fade-in-delay text-white/80 text-base mb-8 max-w-xs mx-auto leading-relaxed">
              주정차 위반 딱지 사진 한 장이면<br/>
              <b className="text-white">AI가 이의신청서를 자동 작성</b>
            </p>

            <div className="animate-fade-in-delay-2 w-full max-w-xs mx-auto">
              <button onClick={() => setStep('upload')} className="btn-white">
                지금 시작하기 <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Stats section */}
        <div className="relative z-10 -mt-5 px-5">
          <div className="animate-fade-in-delay-2 grid grid-cols-3 gap-3 max-w-md mx-auto">
            {[
              { num: '10초', label: '분석 시간', icon: <Zap size={16} className="text-orange-500" /> },
              { num: '무료', label: '이용 요금', icon: <Star size={16} className="text-red-500" /> },
              { num: '법률', label: '근거 인용', icon: <Scale size={16} className="text-blue-500" /> },
            ].map((s) => (
              <div key={s.label} className="card stat-card">
                <div className="mb-1">{s.icon}</div>
                <div className="stat-number">{s.num}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* How it works */}
        <div className="px-6 mt-10 max-w-md mx-auto w-full">
          <div className="animate-fade-in-delay-3">
            <h2 className="font-extrabold text-xl mb-1 text-center">이렇게 사용하세요</h2>
            <p className="text-sm text-gray-400 text-center mb-6">3단계로 간편하게</p>

            <div className="space-y-0">
              {[
                { num: '1', icon: <Camera size={20} />, title: '딱지 촬영', desc: '주정차 위반 딱지를 카메라로 찍으세요', color: 'from-red-500 to-red-600', iconBg: 'icon-circle-red' },
                { num: '2', icon: <Zap size={20} />, title: 'AI 분석', desc: '위반 내용과 항소 가능성을 분석합니다', color: 'from-orange-500 to-orange-600', iconBg: 'icon-circle-orange' },
                { num: '3', icon: <FileText size={20} />, title: '신청서 생성', desc: '법률 근거가 포함된 이의신청서 완성', color: 'from-amber-500 to-amber-600', iconBg: 'icon-circle-blue' },
              ].map((s, i) => (
                <div key={s.num}>
                  <div className="card flex gap-4 items-center">
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${s.color} text-white flex items-center justify-center text-sm font-black shrink-0 shadow-md`}>{s.num}</div>
                    <div className="flex-1">
                      <div className="font-bold text-[15px]">{s.title}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{s.desc}</div>
                    </div>
                    <div className="icon-circle" style={{ width: 40, height: 40, borderRadius: 12 }}>
                      {s.icon}
                    </div>
                  </div>
                  {i < 2 && <div className="step-line" />}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA repeat */}
        <div className="px-6 mt-14 mb-6 max-w-sm mx-auto w-full">
          <div className="card-highlight text-center py-8 px-6">
            <div className="text-4xl mb-3">🚗</div>
            <div className="font-extrabold text-lg mb-2">딱지 받으셨나요?</div>
            <div className="text-sm text-gray-500 mb-5 leading-relaxed">사진 한 장으로 이의신청<br/>가능 여부를 확인하세요</div>
            <button onClick={() => setStep('upload')} className="btn-primary text-sm !py-3.5">
              딱지 분석하기 <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Trust */}
        <div className="mt-6 flex justify-center gap-6 text-xs text-gray-400 items-center px-6">
          <span className="flex items-center gap-1.5"><Shield size={13} /> 사진 미저장</span>
          <span className="flex items-center gap-1.5"><Scale size={13} /> 실제 법률 근거</span>
          <span className="flex items-center gap-1.5"><Sparkles size={13} /> 완전 무료</span>
        </div>

        {/* Footer */}
        <footer className="text-center py-10 mt-8 space-y-3 border-t border-gray-100 mx-6">
          <div className="flex justify-center gap-5 text-sm text-gray-400">
            <a href="/guide" className="hover:text-red-500 transition">📖 사용 가이드</a>
            <a href="/privacy" className="hover:text-red-500 transition">개인정보처리방침</a>
            <a href="/terms" className="hover:text-red-500 transition">이용약관</a>
          </div>
          <div className="text-xs text-gray-300 pt-1">© 2026 LightOn Plus Lab</div>
        </footer>
      </div>
    )
  }

  // ─── UPLOAD ───
  if (step === 'upload') {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="hero-top px-6 pt-10 pb-14 text-center relative">
          <div className="relative z-10">
            <button onClick={() => setStep('home')} className="absolute left-0 top-0 text-white/70 text-sm hover:text-white transition">← 뒤로</button>
            <div className="icon-circle-lg bg-white/15 backdrop-blur-sm mx-auto mb-3 border border-white/25">
              <Camera size={30} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-1">딱지 사진 업로드</h2>
            <p className="text-white/70 text-sm">주정차 위반 딱지가 잘 보이게 촬영해주세요</p>
          </div>
        </div>

        <div className="flex-1 px-6 -mt-5 relative z-10 max-w-md mx-auto w-full">
          {image && (
            <div className="animate-scale-in mb-5">
              <img src={image} alt="딱지" className="rounded-2xl border-2 border-gray-100 w-full shadow-lg" />
            </div>
          )}

          {!image && (
            <div className="card text-center py-12 mb-5 border-dashed border-2 border-gray-200">
              <div className="icon-circle icon-circle-red mx-auto mb-3">
                <Upload size={24} />
              </div>
              <div className="text-sm font-bold text-gray-600 mb-1">사진을 선택하세요</div>
              <div className="text-xs text-gray-400">카메라로 촬영하거나 갤러리에서 선택</div>
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

          <p className="text-xs text-gray-400 text-center mt-5 flex items-center justify-center gap-1.5">
            <Shield size={11} /> 사진은 분석 후 즉시 삭제되며 서버에 저장되지 않습니다
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
            <div className="absolute inset-0 spinner" style={{ animationDirection: 'reverse', borderColor: 'transparent', borderTopColor: '#f97316', opacity: 0.3, width: 64, height: 64, top: -4, left: -4 }} />
          </div>
          <h2 className="text-xl font-bold mb-2">AI가 분석 중입니다</h2>
          <p className="text-gray-500 text-sm mb-2">위반 내용을 확인하고 이의신청서를 작성하고 있어요</p>
          <div className="flex items-center justify-center gap-2 text-xs text-gray-400 mb-8">
            <Clock size={12} /> 보통 10~20초 소요
          </div>

          {/* Progress steps */}
          <div className="max-w-[260px] mx-auto text-left space-y-3">
            {['사진 분석 중...', '위반 내용 확인 중...', '법률 근거 검색 중...', '신청서 작성 중...'].map((t, i) => (
              <div key={i} className="flex items-center gap-3 text-sm animate-fade-in" style={{ animationDelay: `${i * 0.8}s` }}>
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shrink-0">
                  <Sparkles size={12} className="text-white" />
                </div>
                <span className="text-gray-500">{t}</span>
              </div>
            ))}
          </div>

          {image && (
            <div className="mt-8 animate-scale-in">
              <img src={image} alt="딱지" className="rounded-2xl border w-40 mx-auto opacity-30" />
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
    const chanceIcon = result.appeal_chance === '높음' ? '🟢' : result.appeal_chance === '보통' ? '🟡' : '🔴'

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Result header */}
        <div className="hero-top px-6 pt-8 pb-14 relative">
          <div className="relative z-10">
            <button onClick={() => { setStep('home'); setImage(null); setResult(null) }}
              className="text-white/70 text-sm hover:text-white transition mb-4 block">← 처음으로</button>

            <div className="flex items-center gap-3">
              <div className="icon-circle-lg bg-white/15 backdrop-blur-sm border border-white/25">
                <CheckCircle size={28} className="text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">분석 완료!</h2>
                <p className="text-white/70 text-sm">AI가 딱지를 분석했습니다</p>
              </div>
            </div>
          </div>
        </div>

        <div className="px-5 -mt-5 relative z-10 max-w-lg mx-auto pb-8">
          {/* 항소 가능성 — 큰 카드 */}
          <div className={`animate-fade-in result-card mb-4 border-2 ${chanceBg}`}>
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">이의신청 가능성</div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{chanceIcon}</span>
                  <span className={`text-3xl font-black ${chanceColor}`}>{result.appeal_chance || '보통'}</span>
                </div>
              </div>
              <div className="icon-circle icon-circle-red" style={{ width: 56, height: 56 }}>
                <TrendingUp size={24} />
              </div>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">{result.appeal_reason || ''}</p>

            {result.appeal_points && result.appeal_points.length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-200/60">
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

          {/* 위반 정보 카드 */}
          <div className="animate-fade-in-delay result-card mb-4">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle size={16} className="text-red-500" />
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">위반 정보</span>
            </div>
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

          {/* 적용 법령 */}
          {result.legal_basis && result.legal_basis.length > 0 && (
            <div className="animate-fade-in-delay result-card mb-4">
              <div className="flex items-center gap-2 mb-3">
                <Scale size={16} className="text-red-500" />
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">적용 법령</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {result.legal_basis.map((law: string, i: number) => (
                  <span key={i} className="badge badge-red text-xs">§ {law}</span>
                ))}
              </div>
            </div>
          )}

          {/* 이의신청서 */}
          <div className="animate-fade-in-delay-2 result-card mb-5">
            <div className="flex items-center gap-2 mb-3">
              <FileText size={16} className="text-red-500" />
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">이의신청서 (초안)</span>
            </div>
            <div className="bg-gray-50 rounded-2xl p-5 text-sm leading-relaxed whitespace-pre-wrap border border-gray-100 max-h-72 overflow-y-auto">
              {result.appeal_letter || '이의신청서를 생성할 수 없습니다.'}
            </div>
          </div>

          {/* Action buttons */}
          <div className="animate-fade-in-delay-2 flex gap-3 mb-5">
            <button onClick={() => {
              navigator.clipboard.writeText(result.appeal_letter || '')
              toast.success('이의신청서가 복사되었습니다')
            }} className="btn-primary flex-1 !text-sm !py-3">
              <CheckCircle size={15} /> 복사하기
            </button>
            <button onClick={() => {
              const text = (result.appeal_letter || '').replace(/\\n/g, '\n')
              const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>body{font-family:'Apple SD Gothic Neo',sans-serif;padding:48px;line-height:2;font-size:14px;color:#111;max-width:700px;margin:0 auto}h1{font-size:22px;text-align:center;margin-bottom:32px;letter-spacing:2px}hr{border:none;border-top:1px solid #ddd;margin:24px 0}.footer{margin-top:40px;text-align:right;font-size:12px;color:#999}</style></head><body><h1>이 의 신 청 서</h1><div style="white-space:pre-wrap">${text}</div><hr><div class="footer">노딱AI에서 생성됨<br>※ AI가 생성한 초안입니다. 제출 전 반드시 확인하세요.</div></body></html>`
              const blob = new Blob([html], { type: 'text/html' })
              const url = URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url; a.download = '이의신청서_노딱AI.html'; a.click()
              URL.revokeObjectURL(url)
              toast.success('파일이 다운로드되었습니다')
            }} className="btn-outline flex-1 text-sm">
              <Download size={15} /> 저장
            </button>
          </div>

          <button onClick={() => { setStep('upload'); setImage(null); setResult(null) }}
            className="w-full text-center text-sm text-gray-400 hover:text-red-500 transition py-2 font-medium">
            🔄 다른 딱지 분석하기
          </button>

          <p className="text-xs text-gray-400 text-center mt-4 flex items-center justify-center gap-1">
            <AlertTriangle size={10} /> AI가 생성한 초안입니다. 실제 제출 전 내용을 반드시 확인하세요.
          </p>
        </div>
      </div>
    )
  }

  return null
}
