import { NextRequest, NextResponse } from 'next/server'

export const maxDuration = 60

const LEGAL_REFERENCE = `
【한국 주정차 위반 관련 법률 근거】

■ 도로교통법
- 제32조 (정차 및 주차의 금지): 교차로, 횡단보도, 건널목, 버스정류장 10m 이내, 소방용 방화물통 5m 이내 등 정차·주차 금지
- 제33조 (주차의 금지): 터널, 다리, 도로공사 구역, 소방용 기계·기구 설치 5m 이내 등
- 제34조 (정차 또는 주차의 방법 및 시간의 제한): 지자체 조례로 구역·시간·방법 제한 가능
- 제35조 (주차위반에 대한 조치): 경찰·시장 등이 주차위반 차량에 스티커 부착·이동 명령 가능
- 제142조 (과태료 부과): 법 위반시 과태료 부과 (제32~34조 위반)
- 제160조 (과태료): 주정차 위반 일반도로 4만원, 어린이보호구역 등 8~13만원

■ 도로교통법 시행령
- 별표 10 (과태료 금액): 승용차 기준
  · 일반도로 주차위반: 4만원
  · 일반도로 정차위반: 4만원
  · 어린이보호구역 주차위반: 8만원 (장애인구역 등 가중)
  · 소화전 5m 이내: 8만원
  · 버스전용차로: 5만원

■ 질서위반행위규제법 (이의신청 근거)
- 제16조 (의견 제출): 과태료 부과 전 10일 이상 의견 제출 기간 부여 의무
- 제17조 (과태료의 부과): 서면으로 과태료 부과, 이의제기 방법·기간 고지 의무
- 제20조 (이의제기): 과태료 부과 통지를 받은 날로부터 60일 이내 서면으로 이의제기 가능
- 제21조 (이의제기의 효과): 이의제기시 과태료 부과 효력 상실, 관할법원에 통보
- 제24조의3 (과태료 감경): 자진납부시 20% 감경, 경제적 어려움 시 감경·분납 가능

■ 주요 이의신청 성공 사유 (판례·실무)
1. 긴급피난 (도로교통법 제33조의2): 응급환자, 차량 고장 등 불가피한 사유
2. 주차금지 표지판 미설치·훼손: 운전자가 금지 구역을 인지할 수 없었던 경우
3. 단속 절차 하자: 스티커 미부착, 사진 미촬영, 고지서 미발송
4. 이중 단속: 동일 위반에 대해 중복 과태료 부과
5. 차량 도용·양도 후 미이전: 실제 운전자가 아닌 경우
6. 배달·하역 등 5분 이내 정차: 화물 상하차 목적의 일시 정차
7. 노인·장애인·임산부 등 불가피한 정차: 승하차 목적
8. 시간제 주차구역에서 초과시간이 경미한 경우
9. 주정차 허용 시간대 혼동 (표지판 불명확)
10. 견인 후 통보 지연 (즉시 통보 의무 위반)

■ 이의신청 절차
1. 과태료 부과 통지서 수령
2. 60일 이내 관할 지자체에 서면 이의신청서 제출
3. 이의제기시 과태료 부과 효력 상실
4. 관할 지방법원으로 사건 이송 → 법원 재판
5. 약식재판 또는 정식재판으로 진행

■ 이의신청서 제출처
- 관할 지방자치단체 (시·군·구청) 교통과
- 경찰서 교통관리계 (경찰 단속의 경우)
- 온라인: 정부24 (www.gov.kr) 또는 이파인 (www.efine.go.kr)
`

export async function POST(req: NextRequest) {
  try {
    const { image } = await req.json()
    if (!image) return NextResponse.json({ error: '이미지가 없습니다' }, { status: 400 })

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) return NextResponse.json({ error: 'API 키 미설정' }, { status: 500 })

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

${LEGAL_REFERENCE}

위 법률 근거를 참고하여 이 주정차 위반 딱지(고지서) 사진을 분석하세요.
반드시 실제 법 조항 번호를 정확히 인용하여 이의신청서를 작성하세요.

다음 JSON 형식으로만 응답하세요 (마크다운 코드블록 없이 순수 JSON):

{
  "violation_type": "위반 유형",
  "fine_amount": "과태료 금액",
  "violation_date": "위반 일시",
  "violation_location": "위반 장소",
  "vehicle_number": "차량 번호",
  "appeal_chance": "높음/보통/낮음",
  "appeal_reason": "이의신청 가능성 근거 (해당 법 조항 인용, 2-3문장)",
  "appeal_points": ["구체적 항소 포인트 (법 조항 포함)"],
  "legal_basis": ["적용 법 조항 목록 (예: 도로교통법 제32조 제1항)"],
  "appeal_letter": "이의신청서 전문 (아래 양식)"
}

【이의신청서 양식】
이의신청서

수신: [관할 지자체/경찰서]

1. 신청인 정보
  - 성명: ___
  - 차량번호: [딱지에서 읽은 번호]
  - 연락처: ___
  - 주소: ___

2. 위반 내용
  - 위반 일시: [딱지에서 읽은 일시]
  - 위반 장소: [딱지에서 읽은 장소]
  - 위반 유형: [위반 유형]
  - 과태료: [금액]
  - 고지서 번호: [있으면 기재]

3. 이의신청 사유
  [도로교통법, 질서위반행위규제법 등 구체적 법 조항을 인용하여 논리적으로 서술.
   위 법률 근거의 '주요 이의신청 성공 사유' 중 해당되는 것을 적용.
   사실관계 → 법적 근거 → 결론 순으로 작성.]

4. 관련 법령
  - [적용되는 법 조항 나열]

5. 증빙자료
  - 별첨

6. 요청 사항
  위 사유에 의거하여 본 과태료 부과 처분의 취소(또는 감경)를 요청합니다.

질서위반행위규제법 제20조에 따라 이의를 제기합니다.

날짜: [오늘 날짜]
신청인: ___ (서명 또는 인)

---
주의:
- 딱지가 아닌 이미지면 violation_type을 "딱지 아님"으로 설정
- 이의신청서는 정중하고 논리적인 법률 문서 어조
- 반드시 실제 법 조항 번호를 정확히 인용
- appeal_letter의 빈칸은 "___"로 표시`
              },
              {
                inlineData: { mimeType, data: base64Data },
              },
            ],
          }],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 3000,
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
