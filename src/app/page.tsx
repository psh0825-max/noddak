'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Camera, Upload, FileText, AlertTriangle, ChevronRight, Shield, Zap, CheckCircle, Download, Scale, Car, Sparkles, Clock, MapPin, Banknote, Hash, ArrowRight, Star, TrendingUp, Share2, Edit3, ChevronDown, ChevronUp, Moon, Sun, History, RefreshCw, Printer, X } from 'lucide-react'
import { toast } from 'sonner'
import { saveAnalysis, createThumbnail } from '@/lib/db'

export default function Home() {
  const [step, setStep] = useState<'home' | 'upload' | 'analyzing' | 'result'>('home')
  const [image, setImage] = useState<string | null>(null)
  const [result, setResult] = useState<any>(null)
  const [editingLetter, setEditingLetter] = useState(false)
  const [editedLetter, setEditedLetter] = useState('')
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({ appeal: true })
  const [analysisStep, setAnalysisStep] = useState(0)
  const [elapsed, setElapsed] = useState(0)
  const [darkMode, setDarkMode] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const cameraRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Dark mode init
  useEffect(() => {
    const saved = localStorage.getItem('noddak-dark')
    if (saved !== null) {
      setDarkMode(saved === 'true')
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true)
    }
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
    localStorage.setItem('noddak-dark', String(darkMode))
  }, [darkMode])

  // Analysis progress animation
  useEffect(() => {
    if (step !== 'analyzing') return
    setAnalysisStep(0)
    setElapsed(0)
    const stepTimer = setInterval(() => {
      setAnalysisStep(prev => (prev < 3 ? prev + 1 : prev))
    }, 3000)
    const elapsedTimer = setInterval(() => {
      setElapsed(prev => prev + 1)
    }, 1000)
    return () => { clearInterval(stepTimer); clearInterval(elapsedTimer) }
  }, [step])

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current && editingLetter) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px'
    }
  }, [editedLetter, editingLetter])

  // Save to IndexedDB when result arrives
  useEffect(() => {
    if (result && image && step === 'result') {
      (async () => {
        try {
          const thumb = await createThumbnail(image)
          await saveAnalysis({
            date: new Date().toISOString().split('T')[0],
            image: thumb,
            result,
            createdAt: Date.now(),
          })
        } catch { /* silent */ }
      })()
    }
  }, [result, image, step])

  const handleFile = useCallback(async (file: File) => {
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
        if (data.error) throw new Error(data.error)
        setResult(data)
        setEditedLetter(data.appeal_letter || '')
        setStep('result')
      } catch {
        toast.error('분석 중 오류가 발생했습니다. 다시 시도해주세요.')
        setStep('upload')
      }
    }
    reader.readAsDataURL(file)
  }, [])

  const handleRetry = useCallback(() => {
    if (!image) return
    setStep('analyzing')
    fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image }),
    })
      .then(res => { if (!res.ok) throw new Error(); return res.json() })
      .then(data => { setResult(data); setEditedLetter(data.appeal_letter || ''); setStep('result') })
      .catch(() => { toast.error('재시도 실패'); setStep('upload') })
  }, [image])

  const toggleSection = (key: string) => {
    setExpandedSections(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const handleShare = async () => {
    const text = `🚗 노딱AI 분석 결과\n\n위반: ${result.violation_type || '주정차 위반'}\n과태료: ${result.fine_amount || '미확인'}\n이의신청 가능성: ${result.appeal_chance || '보통'}\n\n${result.appeal_reason || ''}\n\n노딱AI로 분석해보세요 → https://noddak.run.app`
    if (navigator.share) {
      try {
        await navigator.share({ title: '노딱AI 분석 결과', text })
      } catch { /* user cancelled */ }
    } else {
      await navigator.clipboard.writeText(text)
      toast.success('결과가 클립보드에 복사되었습니다')
    }
  }

  const handleDownloadPDF = async () => {
    toast.loading('PDF 생성 중...')
    try {
      const { generatePDF } = await import('@/lib/pdf')
      await generatePDF({ ...result, appeal_letter: editedLetter || result.appeal_letter })
      toast.dismiss()
      toast.success('PDF가 다운로드되었습니다')
    } catch {
      toast.dismiss()
      // Fallback to HTML
      const text = (editedLetter || result.appeal_letter || '').replace(/\\n/g, '\n')
      const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>body{font-family:'Apple SD Gothic Neo','Noto Sans KR',sans-serif;padding:48px;line-height:2;font-size:14px;color:#111;max-width:700px;margin:0 auto}h1{font-size:22px;text-align:center;margin-bottom:32px;letter-spacing:2px;border-bottom:2px solid #dc2626;padding-bottom:16px}hr{border:none;border-top:1px solid #ddd;margin:24px 0}.footer{margin-top:40px;text-align:right;font-size:12px;color:#999}</style></head><body><h1>이 의 신 청 서</h1><div style="white-space:pre-wrap">${text}</div><hr><div class="footer">노딱AI에서 생성됨<br>※ AI가 생성한 초안입니다. 제출 전 반드시 확인하세요.</div></body></html>`
      const blob = new Blob([html], { type: 'text/html' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url; a.download = '이의신청서_노딱AI.html'; a.click()
      URL.revokeObjectURL(url)
      toast.success('HTML 파일이 다운로드되었습니다')
    }
  }

  const DarkModeToggle = () => (
    <button onClick={() => setDarkMode(!darkMode)}
      className="fixed top-4 right-4 z-50 w-10 h-10 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 flex items-center justify-center shadow-lg transition-all hover:scale-110"
      aria-label="다크 모드 전환">
      {darkMode ? <Sun size={18} className="text-yellow-500" /> : <Moon size={18} className="text-gray-600" />}
    </button>
  )

  // ─── HOME ───
  if (step === 'home') {
    return (
      <div className="min-h-screen flex flex-col items-center dark:bg-gray-900">
        <DarkModeToggle />
        <div className="hero-top px-6 pt-14 pb-16 text-center relative w-full">
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
              <span className="badge badge-white mb-4 inline-flex"><Sparkles size={12} /> AI 이의신청 도우미</span>
            </div>
            <h1 className="animate-fade-in-delay text-4xl font-black mb-3 tracking-tight text-white drop-shadow-lg">노딱AI</h1>
            <p className="animate-fade-in-delay text-white/80 text-base mb-8 max-w-xs mx-auto leading-relaxed">
              주정차 위반 딱지 사진 한 장이면<br/><b className="text-white">AI가 이의신청서를 자동 작성</b>
            </p>
            <div className="animate-fade-in-delay-2 w-full max-w-xs mx-auto">
              <button onClick={() => setStep('upload')} className="btn-white">지금 시작하기 <ArrowRight size={18} /></button>
            </div>
          </div>
        </div>

        <div className="relative z-10 -mt-5 px-6 w-full max-w-md">
          <div className="animate-fade-in-delay-2 grid grid-cols-3 gap-3">
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

        <div className="px-6 mt-10 max-w-md mx-auto w-full">
          <div className="animate-fade-in-delay-3">
            <h2 className="font-extrabold text-xl mb-1 text-center dark:text-white">이렇게 사용하세요</h2>
            <p className="text-sm text-gray-400 text-center mb-6">3단계로 간편하게</p>
            <div className="space-y-0">
              {[
                { num: '1', icon: <Camera size={20} />, title: '딱지 촬영', desc: '주정차 위반 딱지를 카메라로 찍으세요', color: 'from-red-500 to-red-600' },
                { num: '2', icon: <Zap size={20} />, title: 'AI 분석', desc: '위반 내용과 항소 가능성을 분석합니다', color: 'from-orange-500 to-orange-600' },
                { num: '3', icon: <FileText size={20} />, title: '신청서 생성', desc: '법률 근거가 포함된 이의신청서 완성', color: 'from-amber-500 to-amber-600' },
              ].map((s, i) => (
                <div key={s.num}>
                  <div className="card flex gap-4 items-center">
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${s.color} text-white flex items-center justify-center text-sm font-black shrink-0 shadow-md`}>{s.num}</div>
                    <div className="flex-1">
                      <div className="font-bold text-[15px] dark:text-white">{s.title}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{s.desc}</div>
                    </div>
                    <div className="icon-circle" style={{ width: 40, height: 40, borderRadius: 12 }}>{s.icon}</div>
                  </div>
                  {i < 2 && <div className="step-line" />}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="px-6 mt-14 mb-6 w-full max-w-md">
          <div className="card-highlight text-center py-8 px-6">
            <div className="text-4xl mb-3">🚗</div>
            <div className="font-extrabold text-lg mb-2 dark:text-white">딱지 받으셨나요?</div>
            <div className="text-sm text-gray-500 mb-5 leading-relaxed">사진 한 장으로 이의신청<br/>가능 여부를 확인하세요</div>
            <button onClick={() => setStep('upload')} className="btn-primary text-sm !py-3.5">딱지 분석하기 <ChevronRight size={16} /></button>
          </div>
        </div>

        <div className="mt-6 flex justify-center gap-6 text-xs text-gray-400 items-center px-6 w-full max-w-md">
          <span className="flex items-center gap-1.5"><Shield size={13} /> 사진 미저장</span>
          <span className="flex items-center gap-1.5"><Scale size={13} /> 실제 법률 근거</span>
          <span className="flex items-center gap-1.5"><Sparkles size={13} /> 완전 무료</span>
        </div>

        <footer className="text-center py-10 mt-8 space-y-3 border-t border-gray-100 dark:border-gray-800 w-full max-w-md px-6">
          <div className="flex justify-center gap-5 text-sm text-gray-400">
            <a href="/history" className="hover:text-red-500 transition">📋 분석 히스토리</a>
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
      <div className="min-h-screen flex flex-col dark:bg-gray-900">
        <DarkModeToggle />
        <div className="hero-top px-6 pt-10 pb-16 text-center relative">
          <div className="relative z-10 max-w-md mx-auto">
            <button onClick={() => setStep('home')} className="absolute left-0 top-0.5 text-white/70 text-sm hover:text-white transition font-medium">← 뒤로</button>
            <div className="icon-circle-lg bg-white/15 backdrop-blur-sm mx-auto mb-3 border border-white/25">
              <Camera size={30} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-1">딱지 사진 업로드</h2>
            <p className="text-white/70 text-sm">주정차 위반 딱지가 잘 보이게 촬영해주세요</p>
          </div>
        </div>

        <div className="flex-1 px-6 -mt-6 relative z-10 max-w-md mx-auto w-full">
          {image && (
            <div className="animate-scale-in mb-5">
              <img src={image} alt="딱지" className="rounded-2xl border-2 border-gray-100 dark:border-gray-700 w-full shadow-lg" />
            </div>
          )}
          {!image && (
            <div className="card text-center py-14 mb-5 border-dashed border-2 border-gray-200 dark:border-gray-700">
              <div className="icon-circle icon-circle-red mx-auto mb-4" style={{ width: 60, height: 60, borderRadius: 18 }}>
                <Upload size={26} />
              </div>
              <div className="text-[15px] font-bold text-gray-600 dark:text-gray-300 mb-1.5">사진을 선택하세요</div>
              <div className="text-sm text-gray-400">카메라로 촬영하거나 갤러리에서 선택</div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <input ref={cameraRef} type="file" accept="image/*" capture="environment" className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
            <button onClick={() => cameraRef.current?.click()} className="btn-primary !text-[15px] !py-4">
              <Camera size={18} /> 촬영
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
            <button onClick={() => fileRef.current?.click()} className="btn-outline !text-[15px] !py-4 w-full">
              <Upload size={18} /> 갤러리
            </button>
          </div>

          <p className="text-xs text-gray-400 text-center mt-6 flex items-center justify-center gap-1.5">
            <Shield size={11} /> 사진은 분석 후 즉시 삭제되며 서버에 저장되지 않습니다
          </p>
        </div>
      </div>
    )
  }

  // ─── ANALYZING ───
  if (step === 'analyzing') {
    const steps = [
      { label: '사진 분석 중...', done: analysisStep > 0 },
      { label: '위반 내용 확인 중...', done: analysisStep > 1 },
      { label: '법률 근거 검색 중...', done: analysisStep > 2 },
      { label: '신청서 작성 중...', done: analysisStep > 3 },
    ]
    return (
      <div className="min-h-screen hero-bg dark:bg-gray-900 flex flex-col items-center justify-center px-6">
        <DarkModeToggle />
        <div className="animate-fade-in text-center">
          <div className="relative inline-block mb-8">
            <div className="spinner" />
          </div>
          <h2 className="text-xl font-bold mb-2 dark:text-white">AI가 분석 중입니다</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">위반 내용을 확인하고 이의신청서를 작성하고 있어요</p>
          <div className="flex items-center justify-center gap-2 text-xs text-gray-400 mb-8">
            <Clock size={12} /> {elapsed}초 경과 · 보통 10~20초 소요
          </div>

          <div className="max-w-[280px] mx-auto text-left space-y-3">
            {steps.map((s, i) => (
              <div key={i} className={`flex items-center gap-3 text-sm transition-all duration-500 ${i <= analysisStep ? 'opacity-100' : 'opacity-30'}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all duration-500 ${s.done ? 'bg-green-500' : 'bg-gradient-to-br from-red-500 to-orange-500'}`}>
                  {s.done ? <CheckCircle size={14} className="text-white" /> : <Sparkles size={12} className="text-white animate-pulse" />}
                </div>
                <span className={`dark:text-gray-300 ${s.done ? 'text-green-600 dark:text-green-400 line-through' : 'text-gray-500'}`}>{s.label}</span>
              </div>
            ))}
          </div>

          <button onClick={() => { setStep('upload'); setImage(null) }}
            className="mt-8 text-sm text-gray-400 hover:text-red-500 transition">
            취소
          </button>

          {image && (
            <div className="mt-6 animate-scale-in">
              <img src={image} alt="딱지" className="rounded-2xl border w-36 mx-auto opacity-20" />
            </div>
          )}
        </div>
      </div>
    )
  }

  // ─── RESULT ───
  if (step === 'result' && result) {
    const isNotTicket = result.violation_type === '딱지 아님'
    const chanceColor = result.appeal_chance === '높음' ? 'chance-high' : result.appeal_chance === '보통' ? 'chance-medium' : 'chance-low'
    const chanceBg = result.appeal_chance === '높음' ? 'bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-800' : result.appeal_chance === '보통' ? 'bg-yellow-50 border-yellow-200 dark:bg-yellow-950/30 dark:border-yellow-800' : 'bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-800'
    const chanceIcon = result.appeal_chance === '높음' ? '🟢' : result.appeal_chance === '보통' ? '🟡' : '🔴'
    const currentLetter = editedLetter || result.appeal_letter || ''

    if (isNotTicket) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center px-6 dark:bg-gray-900">
          <DarkModeToggle />
          <div className="text-center animate-fade-in">
            <div className="text-6xl mb-4">🤔</div>
            <h2 className="text-xl font-bold mb-2 dark:text-white">딱지가 아닌 것 같아요</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">주정차 위반 딱지(고지서) 사진을 업로드해주세요.</p>
            <button onClick={() => { setStep('upload'); setImage(null); setResult(null) }} className="btn-primary max-w-xs mx-auto">
              다시 업로드하기
            </button>
          </div>
        </div>
      )
    }

    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <DarkModeToggle />
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
          {/* 항소 가능성 */}
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
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{result.appeal_reason || ''}</p>
            {result.appeal_points && result.appeal_points.length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-200/60 dark:border-gray-700">
                <div className="text-xs font-bold text-gray-400 mb-2">주장 가능한 포인트</div>
                {result.appeal_points.map((p: string, i: number) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300 mb-1.5">
                    <CheckCircle size={14} className="text-green-500 mt-0.5 shrink-0" />
                    <span>{p}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 위반 정보 — collapsible */}
          <div className="animate-fade-in-delay result-card mb-4">
            <button onClick={() => toggleSection('violation')} className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <AlertTriangle size={16} className="text-red-500" />
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">위반 정보</span>
              </div>
              {expandedSections.violation === false ? <ChevronDown size={16} className="text-gray-400" /> : <ChevronUp size={16} className="text-gray-400" />}
            </button>
            {expandedSections.violation !== false && (
              <div className="mt-3">
                <div className="result-item">
                  <span className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400"><AlertTriangle size={14} /> 위반 유형</span>
                  <span className="font-bold text-sm dark:text-white">{result.violation_type || '주정차 위반'}</span>
                </div>
                <div className="result-item">
                  <span className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400"><Banknote size={14} /> 과태료</span>
                  <span className="font-bold text-sm text-red-600">{result.fine_amount || '미확인'}</span>
                </div>
                <div className="result-item">
                  <span className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400"><Clock size={14} /> 위반 일시</span>
                  <span className="text-sm dark:text-gray-300">{result.violation_date || '미확인'}</span>
                </div>
                <div className="result-item">
                  <span className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400"><MapPin size={14} /> 위반 장소</span>
                  <span className="text-sm text-right max-w-[55%] dark:text-gray-300">{result.violation_location || '미확인'}</span>
                </div>
                {result.vehicle_number && result.vehicle_number !== '___' && (
                  <div className="result-item">
                    <span className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400"><Hash size={14} /> 차량번호</span>
                    <span className="text-sm font-mono dark:text-gray-300">{result.vehicle_number}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 적용 법령 — collapsible with tooltips */}
          {result.legal_basis && result.legal_basis.length > 0 && (
            <div className="animate-fade-in-delay result-card mb-4">
              <button onClick={() => toggleSection('legal')} className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <Scale size={16} className="text-red-500" />
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">적용 법령</span>
                </div>
                {expandedSections.legal === false ? <ChevronDown size={16} className="text-gray-400" /> : <ChevronUp size={16} className="text-gray-400" />}
              </button>
              {expandedSections.legal !== false && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {result.legal_basis.map((law: string, i: number) => (
                    <span key={i} className="badge badge-red text-xs" title={law}>§ {law}</span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 이의신청서 — editable, collapsible */}
          <div className="animate-fade-in-delay-2 result-card mb-5">
            <div className="flex items-center justify-between mb-3">
              <button onClick={() => toggleSection('appeal')} className="flex items-center gap-2">
                <FileText size={16} className="text-red-500" />
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">이의신청서 (초안)</span>
                {expandedSections.appeal === false ? <ChevronDown size={16} className="text-gray-400 ml-1" /> : <ChevronUp size={16} className="text-gray-400 ml-1" />}
              </button>
              <button onClick={() => { setEditingLetter(!editingLetter) }}
                className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 transition">
                {editingLetter ? <><X size={12} /> 완료</> : <><Edit3 size={12} /> 편집</>}
              </button>
            </div>
            {expandedSections.appeal !== false && (
              editingLetter ? (
                <textarea
                  ref={textareaRef}
                  value={editedLetter}
                  onChange={(e) => setEditedLetter(e.target.value)}
                  className="w-full bg-white dark:bg-gray-800 dark:text-gray-200 rounded-2xl p-5 text-sm leading-relaxed border border-red-200 dark:border-red-800 focus:outline-none focus:ring-2 focus:ring-red-500/30 resize-none min-h-[200px]"
                />
              ) : (
                <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-5 text-sm leading-relaxed whitespace-pre-wrap border border-gray-100 dark:border-gray-700 max-h-72 overflow-y-auto dark:text-gray-200">
                  {currentLetter || '이의신청서를 생성할 수 없습니다.'}
                </div>
              )
            )}
          </div>

          {/* Action buttons */}
          <div className="animate-fade-in-delay-2 grid grid-cols-2 gap-3 mb-3">
            <button onClick={() => {
              navigator.clipboard.writeText(currentLetter)
              toast.success('이의신청서가 복사되었습니다')
            }} className="btn-primary !text-sm !py-3">
              <CheckCircle size={15} /> 복사
            </button>
            <button onClick={handleDownloadPDF} className="btn-outline text-sm">
              <Download size={15} /> PDF 저장
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-5">
            <button onClick={handleShare} className="btn-outline text-sm">
              <Share2 size={15} /> 공유
            </button>
            <button onClick={() => window.print()} className="btn-outline text-sm">
              <Printer size={15} /> 인쇄
            </button>
          </div>

          <button onClick={() => { setStep('upload'); setImage(null); setResult(null); setEditingLetter(false); setEditedLetter('') }}
            className="w-full text-center text-sm text-gray-400 hover:text-red-500 transition py-2 font-medium">
            🔄 다른 딱지 분석하기
          </button>

          <div className="flex justify-center gap-4 mt-3">
            <a href="/history" className="text-xs text-gray-400 hover:text-red-500 transition flex items-center gap-1">
              <History size={12} /> 분석 히스토리
            </a>
          </div>

          <p className="text-xs text-gray-400 text-center mt-4 flex items-center justify-center gap-1">
            <AlertTriangle size={10} /> AI가 생성한 초안입니다. 실제 제출 전 내용을 반드시 확인하세요.
          </p>
        </div>
      </div>
    )
  }

  return null
}
