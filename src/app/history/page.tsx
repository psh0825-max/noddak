'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Trash2, Eye, Calendar, MapPin, Banknote, AlertTriangle, Clock } from 'lucide-react'
import { getAllAnalyses, deleteAnalysis, type AnalysisRecord } from '@/lib/db'
import { toast } from 'sonner'

export default function HistoryPage() {
  const [records, setRecords] = useState<AnalysisRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<AnalysisRecord | null>(null)

  useEffect(() => {
    getAllAnalyses().then(r => { setRecords(r); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  const handleDelete = async (id: number) => {
    if (!confirm('이 분석 결과를 삭제하시겠습니까?')) return
    await deleteAnalysis(id)
    setRecords(prev => prev.filter(r => r.id !== id))
    if (selected?.id === id) setSelected(null)
    toast.success('삭제되었습니다')
  }

  const chanceIcon = (c: string) => c === '높음' ? '🟢' : c === '보통' ? '🟡' : '🔴'

  if (selected) {
    const r = selected.result
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-5 pt-6 pb-10 max-w-lg mx-auto">
        <button onClick={() => setSelected(null)} className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-500 mb-4">
          <ArrowLeft size={16} /> 목록으로
        </button>
        <div className="result-card mb-4">
          <div className="text-xs text-gray-400 mb-2">{new Date(selected.createdAt).toLocaleString('ko-KR')}</div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">{chanceIcon(r.appeal_chance)}</span>
            <span className="font-bold text-lg dark:text-white">{r.violation_type || '주정차 위반'}</span>
          </div>
          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
            <div className="flex items-center gap-2"><Banknote size={14} /> 과태료: <b className="text-red-600">{r.fine_amount || '미확인'}</b></div>
            <div className="flex items-center gap-2"><Clock size={14} /> {r.violation_date || '미확인'}</div>
            <div className="flex items-center gap-2"><MapPin size={14} /> {r.violation_location || '미확인'}</div>
          </div>
        </div>
        {r.appeal_letter && (
          <div className="result-card">
            <div className="text-xs font-bold text-gray-400 mb-2">이의신청서</div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 text-sm whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto dark:text-gray-200">
              {r.appeal_letter}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="hero-top px-6 pt-8 pb-14 relative">
        <div className="relative z-10 max-w-lg mx-auto">
          <a href="/" className="text-white/70 text-sm hover:text-white transition mb-4 block">← 홈으로</a>
          <h1 className="text-2xl font-bold text-white">📋 분석 히스토리</h1>
          <p className="text-white/70 text-sm mt-1">이전 분석 결과를 다시 확인하세요</p>
        </div>
      </div>

      <div className="px-5 -mt-5 relative z-10 max-w-lg mx-auto pb-10">
        {loading ? (
          <div className="text-center py-16 text-gray-400">불러오는 중...</div>
        ) : records.length === 0 ? (
          <div className="card text-center py-16">
            <div className="text-4xl mb-3">📭</div>
            <div className="font-bold text-gray-500 dark:text-gray-400 mb-2">아직 분석 기록이 없어요</div>
            <a href="/" className="text-sm text-red-500 hover:underline">딱지 분석하러 가기 →</a>
          </div>
        ) : (
          <div className="space-y-3">
            {records.map(record => {
              const r = record.result
              return (
                <div key={record.id} className="card flex gap-4 items-center">
                  {record.image && (
                    <img src={record.image} alt="" className="w-16 h-16 rounded-xl object-cover shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span>{chanceIcon(r.appeal_chance)}</span>
                      <span className="font-bold text-sm truncate dark:text-white">{r.violation_type || '주정차 위반'}</span>
                    </div>
                    <div className="text-xs text-gray-400 flex items-center gap-1">
                      <Calendar size={11} /> {record.date}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{r.fine_amount || ''} · {r.violation_location || ''}</div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => setSelected(record)}
                      className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-red-50 dark:hover:bg-red-900/30 transition">
                      <Eye size={14} className="text-gray-500" />
                    </button>
                    <button onClick={() => record.id && handleDelete(record.id)}
                      className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-red-50 dark:hover:bg-red-900/30 transition">
                      <Trash2 size={14} className="text-gray-400" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
