import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

export const maxDuration = 60

export async function POST(req: NextRequest) {
  try {
    const { image } = await req.json()
    if (!image) return NextResponse.json({ error: '이미지가 없습니다' }, { status: 400 })

    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) return NextResponse.json({ error: 'API 키 미설정' }, { status: 500 })

    const openai = new OpenAI({ apiKey })

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      max_tokens: 2000,
      messages: [
        {
          role: 'system',
          content: `당신은 한국 주정차 위반 전문 법률 AI 어시스턴트입니다.
사용자가 보내는 주정차 위반 딱지(고지서) 사진을 분석하여 다음 JSON 형식으로 응답하세요:

{
  "violation_type": "위반 유형 (예: 주차위반, 정차위반, 소화전 앞 주차 등)",
  "fine_amount": "과태료 금액 (예: 40,000원)",
  "violation_date": "위반 일시 (예: 2026년 2월 26일 14:30)",
  "violation_location": "위반 장소",
  "vehicle_number": "차량 번호",
  "appeal_chance": "높음/보통/낮음",
  "appeal_reason": "이의신청 가능성에 대한 근거 설명 (2-3문장)",
  "appeal_points": ["이의신청 시 주장할 수 있는 포인트 배열"],
  "appeal_letter": "실제 이의신청서 전문 (아래 양식 참고)"
}

【이의신청서 양식】
이의신청서

1. 신청인 정보
  - 성명: [사용자가 입력]
  - 차량번호: [딱지에서 읽은 번호]
  - 연락처: [사용자가 입력]

2. 위반 내용
  - 위반 일시: [딱지에서 읽은 일시]
  - 위반 장소: [딱지에서 읽은 장소]
  - 위반 유형: [위반 유형]
  - 과태료: [금액]

3. 이의신청 사유
  [구체적인 이의신청 사유를 법적 근거와 함께 작성.
   도로교통법 관련 조항을 인용하고,
   가능한 항소 포인트를 논리적으로 서술.]

4. 증빙자료
  - 별첨

위와 같이 이의신청합니다.

날짜: [오늘 날짜]
신청인: [성명] (인)

---
주의사항:
- 딱지가 아닌 이미지가 오면 "이 이미지에서 주정차 위반 딱지를 찾을 수 없습니다"라고 안내
- 이의신청서는 정중하고 논리적인 어조로 작성
- 실제 법적 효력을 가질 수 있도록 도로교통법 조항 인용
- appeal_letter의 [사용자가 입력] 부분은 "___" (빈칸)으로 표시
- JSON만 응답 (마크다운 없이)`
        },
        {
          role: 'user',
          content: [
            { type: 'text', text: '이 주정차 위반 딱지를 분석해주세요.' },
            { type: 'image_url', image_url: { url: image, detail: 'high' } },
          ],
        },
      ],
    })

    const text = response.choices[0]?.message?.content || ''

    // JSON 파싱
    let parsed
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/)
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
