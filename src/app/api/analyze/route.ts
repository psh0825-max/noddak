import { NextRequest, NextResponse } from 'next/server'

export const maxDuration = 60

export async function POST(req: NextRequest) {
  try {
    const { image } = await req.json()
    if (!image) return NextResponse.json({ error: '이미지가 없습니다' }, { status: 400 })

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) return NextResponse.json({ error: 'API 키 미설정' }, { status: 500 })

    // base64 데이터 추출
    const base64Match = image.match(/^data:image\/(\w+);base64,(.+)$/)
    if (!base64Match) return NextResponse.json({ error: '잘못된 이미지 형식' }, { status: 400 })

    const mimeType = `image/${base64Match[1]}`
    const base64Data = base64Match[2]

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [
              {
                text: `당신은 한국 주정차 위반 전문 법률 AI 어시스턴트입니다.
이 주정차 위반 딱지(고지서) 사진을 분석하여 다음 JSON 형식으로만 응답하세요. 마크다운 코드블록 없이 순수 JSON만 응답:

{
  "violation_type": "위반 유형 (예: 주차위반, 정차위반, 소화전 앞 주차 등)",
  "fine_amount": "과태료 금액 (예: 40,000원)",
  "violation_date": "위반 일시",
  "violation_location": "위반 장소",
  "vehicle_number": "차량 번호",
  "appeal_chance": "높음/보통/낮음",
  "appeal_reason": "이의신청 가능성에 대한 근거 설명 (2-3문장)",
  "appeal_points": ["이의신청 시 주장할 수 있는 포인트 배열"],
  "appeal_letter": "이의신청서 전문 (아래 양식)"
}

【이의신청서 양식】
이의신청서

1. 신청인 정보
  - 성명: ___
  - 차량번호: [딱지에서 읽은 번호]
  - 연락처: ___

2. 위반 내용
  - 위반 일시: [딱지에서 읽은 일시]
  - 위반 장소: [딱지에서 읽은 장소]
  - 위반 유형: [위반 유형]
  - 과태료: [금액]

3. 이의신청 사유
  [구체적인 이의신청 사유를 도로교통법 조항과 함께 작성. 가능한 항소 포인트를 논리적으로 서술.]

4. 증빙자료
  - 별첨

위와 같이 이의신청합니다.

날짜: [오늘 날짜]
신청인: ___ (인)

---
주의: 딱지가 아닌 이미지면 violation_type을 "딱지 아님"으로, appeal_letter를 "이 이미지에서 주정차 위반 딱지를 찾을 수 없습니다."로 응답.`
              },
              {
                inlineData: {
                  mimeType,
                  data: base64Data,
                },
              },
            ],
          }],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 2048,
          },
        }),
      }
    )

    if (!response.ok) {
      const err = await response.text()
      console.error('Gemini error:', err)
      throw new Error('Gemini API 오류')
    }

    const data = await response.json()
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ''

    // JSON 파싱
    let parsed
    try {
      const cleaned = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim()
      const jsonMatch = cleaned.match(/\{[\s\S]*\}/)
      parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : { appeal_letter: text }
    } catch {
      parsed = { appeal_letter: text }
    }

    return NextResponse.json(parsed)
  } catch (error: any) {
    console.error('Analyze error:', error)
    return NextResponse.json(
      { error: error.message || '분석 실패' },
      { status: 500 }
    )
  }
}
