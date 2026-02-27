import jsPDF from 'jspdf'

// We'll load Noto Sans KR font from CDN at runtime
let fontLoaded = false
let fontBase64 = ''

async function loadFont(): Promise<string> {
  if (fontLoaded && fontBase64) return fontBase64
  try {
    // Use a subset of Noto Sans KR Regular from Google Fonts CDN
    const res = await fetch('https://cdn.jsdelivr.net/gh/nicholasgasior/gfonts-base64@master/NotoSansKR-Regular.ttf.base64.txt')
    if (!res.ok) throw new Error('Font fetch failed')
    fontBase64 = await res.text()
    fontLoaded = true
    return fontBase64
  } catch {
    // Fallback: try alternative source
    try {
      const res = await fetch('https://rawcdn.githack.com/nicholasgasior/gfonts-base64/master/NotoSansKR-Regular.ttf.base64.txt')
      if (!res.ok) throw new Error('Fallback font fetch failed')
      fontBase64 = await res.text()
      fontLoaded = true
      return fontBase64
    } catch {
      return '' // Will fall back to default font
    }
  }
}

export async function generatePDF(result: any): Promise<void> {
  const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' })

  // Try to load Korean font
  const font = await loadFont()
  if (font) {
    doc.addFileToVFS('NotoSansKR.ttf', font)
    doc.addFont('NotoSansKR.ttf', 'NotoSansKR', 'normal')
    doc.setFont('NotoSansKR')
  }

  const pageWidth = doc.internal.pageSize.getWidth()
  const margin = 25
  const contentWidth = pageWidth - margin * 2
  let y = 30

  const setFont = (size: number, style: 'normal' | 'bold' = 'normal') => {
    doc.setFontSize(size)
    if (font) {
      doc.setFont('NotoSansKR', style)
    }
  }

  const addText = (text: string, x: number, yPos: number, options?: any) => {
    doc.text(text, x, yPos, options)
  }

  const addWrappedText = (text: string, x: number, startY: number, maxW: number, lineHeight: number): number => {
    const lines = doc.splitTextToSize(text, maxW)
    for (const line of lines) {
      if (startY > 270) {
        doc.addPage()
        startY = 25
      }
      doc.text(line, x, startY)
      startY += lineHeight
    }
    return startY
  }

  // Header line
  doc.setDrawColor(220, 38, 38)
  doc.setLineWidth(0.8)
  doc.line(margin, y - 5, pageWidth - margin, y - 5)

  // Title
  setFont(22, 'bold')
  addText('이 의 신 청 서', pageWidth / 2, y + 5, { align: 'center' })
  y += 15

  doc.setDrawColor(220, 38, 38)
  doc.setLineWidth(0.4)
  doc.line(margin, y, pageWidth - margin, y)
  y += 12

  // Section: 수신
  setFont(11, 'bold')
  addText('수신: 관할 지자체 / 경찰서', margin, y)
  y += 10

  // Section: 신청인 정보
  setFont(12, 'bold')
  doc.setTextColor(220, 38, 38)
  addText('1. 신청인 정보', margin, y)
  doc.setTextColor(0, 0, 0)
  y += 8

  setFont(10)
  const info = [
    ['성명', '___'],
    ['차량번호', result.vehicle_number || '___'],
    ['연락처', '___'],
    ['주소', '___'],
  ]
  for (const [label, value] of info) {
    addText(`${label}: ${value}`, margin + 4, y)
    y += 6
  }
  y += 6

  // Section: 위반 내용
  setFont(12, 'bold')
  doc.setTextColor(220, 38, 38)
  addText('2. 위반 내용', margin, y)
  doc.setTextColor(0, 0, 0)
  y += 8

  setFont(10)
  const violation = [
    ['위반 일시', result.violation_date || '미확인'],
    ['위반 장소', result.violation_location || '미확인'],
    ['위반 유형', result.violation_type || '주정차 위반'],
    ['과태료', result.fine_amount || '미확인'],
  ]
  for (const [label, value] of violation) {
    addText(`${label}: ${value}`, margin + 4, y)
    y += 6
  }
  y += 6

  // Section: 이의신청 사유
  setFont(12, 'bold')
  doc.setTextColor(220, 38, 38)
  addText('3. 이의신청 사유', margin, y)
  doc.setTextColor(0, 0, 0)
  y += 8

  setFont(10)
  // Extract the appeal reason section from appeal_letter or use appeal_reason
  const appealText = result.appeal_letter || result.appeal_reason || ''
  y = addWrappedText(appealText, margin + 4, y, contentWidth - 8, 5.5)
  y += 6

  // Section: 적용 법령
  if (result.legal_basis && result.legal_basis.length > 0) {
    if (y > 250) { doc.addPage(); y = 25 }
    setFont(12, 'bold')
    doc.setTextColor(220, 38, 38)
    addText('4. 관련 법령', margin, y)
    doc.setTextColor(0, 0, 0)
    y += 8

    setFont(10)
    for (const law of result.legal_basis) {
      addText(`• ${law}`, margin + 4, y)
      y += 6
    }
    y += 6
  }

  // Section: 요청 사항
  if (y > 250) { doc.addPage(); y = 25 }
  setFont(12, 'bold')
  doc.setTextColor(220, 38, 38)
  addText('5. 요청 사항', margin, y)
  doc.setTextColor(0, 0, 0)
  y += 8

  setFont(10)
  y = addWrappedText(
    '위 사유에 의거하여 본 과태료 부과 처분의 취소(또는 감경)를 요청합니다.\n질서위반행위규제법 제20조에 따라 이의를 제기합니다.',
    margin + 4, y, contentWidth - 8, 5.5
  )
  y += 12

  // Date and signature
  const today = new Date()
  const dateStr = `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일`
  setFont(10)
  addText(`날짜: ${dateStr}`, margin + 4, y)
  y += 7
  addText('신청인: ___ (서명 또는 인)', margin + 4, y)
  y += 15

  // Footer line
  doc.setDrawColor(200, 200, 200)
  doc.setLineWidth(0.3)
  doc.line(margin, y, pageWidth - margin, y)
  y += 6

  setFont(8)
  doc.setTextColor(150, 150, 150)
  addText('노딱AI에서 생성됨 | AI가 생성한 초안입니다. 제출 전 반드시 확인하세요.', pageWidth / 2, y, { align: 'center' })

  doc.save('이의신청서_노딱AI.pdf')
}
