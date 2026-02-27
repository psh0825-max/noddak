import { NextRequest, NextResponse } from 'next/server'

export const maxDuration = 60

const LEGAL_REFERENCE = `
【한국 주정차 위반 관련 법률 — 도로교통법 (시행 2026.1.1, 법률 제21016호)】

■ 제32조(정차 및 주차의 금지)
모든 차의 운전자는 다음 각 호의 어느 하나에 해당하는 곳에서는 차를 정차하거나 주차하여서는 아니 된다. 다만, 이 법이나 이 법에 따른 명령 또는 경찰공무원의 지시를 따르는 경우와 위험방지를 위하여 일시정지하는 경우에는 그러하지 아니하다.
1. 교차로·횡단보도·건널목이나 보도와 차도가 구분된 도로의 보도(「주차장법」에 따라 차도와 보도에 걸쳐서 설치된 노상주차장은 제외한다)
2. 교차로의 가장자리나 도로의 모퉁이로부터 5미터 이내인 곳
3. 안전지대가 설치된 도로에서는 그 안전지대의 사방으로부터 각각 10미터 이내인 곳
4. 버스여객자동차의 정류지(停留地)임을 표시하는 기둥이나 표지판 또는 선이 설치된 곳으로부터 10미터 이내인 곳. 다만, 버스여객자동차의 운전자가 그 버스여객자동차의 운행시간 중에 운행노선에 따르는 정류장에서 승객을 태우거나 내리기 위하여 차를 정차하거나 주차하는 경우에는 그러하지 아니한다.
5. 건널목의 가장자리 또는 횡단보도로부터 10미터 이내인 곳
6. 다음 각 목의 곳으로부터 5미터 이내인 곳
  가. 「소방기본법」 제10조에 따른 소방용수시설 또는 비상소화장치가 설치된 곳
  나. 「소방시설 설치 및 관리에 관한 법률」 제2조제1항제1호에 따른 소방시설로서 대통령령으로 정하는 시설이 설치된 곳
7. 시·도경찰청장이 도로에서의 위험을 방지하고 교통의 안전과 원활한 소통을 확보하기 위하여 필요하다고 인정하여 지정한 곳
8. 시장등이 제12조제1항에 따라 지정한 어린이 보호구역

■ 제33조(주차금지의 장소)
모든 차의 운전자는 다음 각 호의 어느 하나에 해당하는 곳에 차를 주차해서는 아니 된다.
1. 터널 안 및 다리 위
2. 다음 각 목의 곳으로부터 5미터 이내인 곳
  가. 도로공사를 하고 있는 경우에는 그 공사 구역의 양쪽 가장자리
  나. 「다중이용업소의 안전관리에 관한 특별법」에 따른 다중이용업소의 영업장이 속한 건축물로 소방본부장의 요청에 의하여 시·도경찰청장이 지정한 곳
3. 시·도경찰청장이 도로에서의 위험을 방지하고 교통의 안전과 원활한 소통을 확보하기 위하여 필요하다고 인정하여 지정한 곳

■ 제34조(정차 또는 주차의 방법 및 시간의 제한)
도로 또는 노상주차장에 정차하거나 주차하려고 하는 차의 운전자는 차를 차도의 우측 가장자리에 정차하는 등 대통령령으로 정하는 정차 또는 주차의 방법·시간과 금지사항 등을 지켜야 한다.

■ 제34조의2(정차 또는 주차를 금지하는 장소의 특례)
① 다음 각 호의 어느 하나에 해당하는 경우에는 제32조제1호·제4호·제5호·제7호·제8호 또는 제33조제3호에도 불구하고 정차하거나 주차할 수 있다.
1. 「자전거 이용 활성화에 관한 법률」 제2조제2호에 따른 자전거이용시설 중 전기자전거 충전소 및 자전거주차장치에 자전거를 정차 또는 주차하는 경우
2. 시장등의 요청에 따라 시·도경찰청장이 안전표지로 자전거등의 정차 또는 주차를 허용한 경우
② 시·도경찰청장이 안전표지로 구역·시간·방법 및 차의 종류를 정하여 정차나 주차를 허용한 곳에서는 제32조제7호·제8호 또는 제33조제3호에도 불구하고 정차하거나 주차할 수 있다.

■ 제34조의3(경사진 곳에서의 정차 또는 주차의 방법)
경사진 곳에 정차하거나 주차하려는 자동차의 운전자는 대통령령으로 정하는 바에 따라 고임목을 설치하거나 조향장치(操向裝置)를 도로의 가장자리 방향으로 돌려놓는 등 미끄럼 사고의 발생을 방지하기 위한 조치를 취하여야 한다.

■ 제35조(주차위반에 대한 조치)
① 다음 각 호의 어느 하나에 해당하는 사람은 제32조·제33조 또는 제34조를 위반하여 주차하고 있는 차가 교통에 위험을 일으키게 하거나 방해될 우려가 있을 때에는 차의 운전자 또는 관리 책임이 있는 사람에게 주차 방법을 변경하거나 그 곳으로부터 이동할 것을 명할 수 있다.
1. 경찰공무원
2. 시장등(도지사를 포함한다. 이하 이 조에서 같다)이 대통령령으로 정하는 바에 따라 임명하는 공무원(이하 "시·군공무원"이라 한다)
② 경찰서장이나 시장등은 제1항의 경우 차의 운전자나 관리 책임이 있는 사람이 현장에 없을 때에는 도로에서의 위험을 방지하고 교통의 안전과 원활한 소통을 확보하기 위하여 필요한 범위에서 그 차의 주차방법을 직접 변경하거나 변경에 필요한 조치를 할 수 있으며, 부득이한 경우에는 관할 경찰서나 경찰서장 또는 시장등이 지정하는 곳으로 이동하게 할 수 있다.
③~⑦ (이동조치, 반환, 공고, 매각/폐차, 비용 부담 관련)

■ 부칙 <제21246호, 2025.12.30.>
이 법은 공포 후 6개월이 경과한 날부터 시행한다. 다만, 제2조제35호 및 제45조의 개정규정은 공포한 날부터 시행하고, 법률 제20864호 도로교통법 일부개정법률 제45조제1항의 개정규정은 2026년 4월 2일부터 시행한다.

■ 제142조(행정소송과의 관계)
이 법에 따른 처분으로서 해당 처분에 대한 행정소송은 행정심판의 재결(裁決)을 거치지 아니하면 제기할 수 없다.

■ 제160조(과태료)
① 다음 각 호의 어느 하나에 해당하는 사람에게는 500만원 이하의 과태료를 부과한다.
② 다음 각 호의 어느 하나에 해당하는 사람에게는 20만원 이하의 과태료를 부과한다.
③ 차 또는 노면전차가 제5조, 제6조제1항·제2항(통행 금지 또는 제한을 위반한 경우를 말한다), 제13조제1항·제3항·제5항, 제14조제2항·제5항, 제15조제3항(제61조제2항에서 준용하는 경우를 포함한다), 제17조제3항, 제18조, 제19조제3항, 제21조제1항·제3항, 제22조, 제23조, 제25조제1항·제2항·제5항, 제25조의2제1항·제2항, 제27조제1항·제7항, 제29조제4항·제5항, 제32조부터 제34조까지, 제37조제(제1항제2호는 제외한다), 제38조제1항, 제39조제1항·제4항, 제48조제1항, 제49조제1항제10호·제11호·제11호의2, 제50조제3항, 제60조제1항·제2항, 제62조 또는 제68조제3항제5호를 위반한 사실이 사진, 비디오테이프, 그 밖의 영상기록매체 또는 적재량 측정자료에 의하여 입증되고 다음 각 호의 어느 하나에 해당하는 경우에는 제56조제1항에 따른 고용주등에게 20만원 이하의 과태료를 부과한다.
  1. 위반행위를 한 운전자를 확인할 수 없어 제143조제1항에 따른 고지서를 발급할 수 없는 경우(제15조제3항, 제29조제4항·제5항, 제32조, 제33조 또는 제34조를 위반한 경우만 해당한다)
  2. 제163조에 따라 범칙금 통고처분을 할 수 없는 경우
④ 제3항에도 불구하고 다음 각 호의 어느 하나에 해당하는 경우에는 과태료처분을 할 수 없다.
  1. 차 또는 노면전차를 도난당하였거나 그 밖의 부득이한 사유가 있는 경우
  2. 운전자가 해당 위반행위로 제156조에 따라 처벌된 경우(제163조에 따라 범칙금 통고처분을 받은 경우를 포함한다)
  3. 「질서위반행위규제법」 제16조제2항에 따른 의견 제출 또는 같은 법 제20조제1항에 따른 이의제기의 결과 위반행위를 한 운전자가 밝혀진 경우
  4. 자동차가 「여객자동차 운수사업법」에 따른 자동차대여사업자 또는 「여신전문금융업법」에 따른 시설대여업자가 대여한 자동차로서 그 자동차만 임대한 것이 명백한 경우

■ 과태료 (도로교통법 시행령 별표 10 기준)
- 승용차 일반도로 주정차 위반: 4만원
- 어린이 보호구역 주정차 위반: 8만원 (장애인구역 등 가중 시 최대 13만원)
- 소화전 5m 이내: 8만원
- 버스전용차로: 5만원
- 장애인 전용구역: 10만원

■ 질서위반행위규제법 (이의신청 근거)
- 제16조(의견 제출): 과태료 부과 전 10일 이상 의견 제출 기간 부여 의무
- 제17조(과태료의 부과): 서면으로 과태료 부과, 이의제기 방법·기간 고지 의무
- 제20조(이의제기): 과태료 부과 통지를 받은 날로부터 60일 이내 서면으로 이의제기 가능
- 제21조(이의제기의 효과): 이의제기시 과태료 부과 효력 상실, 관할법원에 통보
- 제24조의3(과태료 감경): 자진납부시 20% 감경

■ 주요 이의신청 성공 사유 (판례·실무)
1. 긴급피난: 응급환자, 차량 고장 등 불가피한 사유
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
2. 60일 이내 관할 지자체에 서면 이의신청서 제출 (질서위반행위규제법 제20조)
3. 이의제기시 과태료 부과 효력 상실 (제21조)
4. 관할 지방법원으로 사건 이송 → 법원 재판
5. 온라인 제출: 정부24(www.gov.kr) 또는 이파인(www.efine.go.kr)
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
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [
              {
                text: `당신은 한국 주정차 위반 전문 법률 AI 어시스턴트입니다.

${LEGAL_REFERENCE}

위 법률 원문을 참고하여 이 주정차 위반 딱지(고지서) 사진을 분석하세요.
반드시 실제 법 조항 번호와 항·호를 정확히 인용하여 이의신청서를 작성하세요.

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
  "legal_basis": ["적용 법 조항 목록 (예: 도로교통법 제32조 제1항 제2호)"],
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
  [도로교통법 제32~35조, 질서위반행위규제법 등 구체적 법 조항의 조·항·호를 인용하여 논리적으로 서술.
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
- 딱지가 아닌 이미지(음식, 풍경, 사람, 영수증, 일반 문서 등)인 경우 반드시 violation_type을 "딱지 아님"으로 설정하고 appeal_letter에 "이 이미지는 주정차 위반 딱지가 아닙니다."라고 작성
- 이의신청서는 정중하고 논리적인 법률 문서 어조
- 반드시 실제 법 조항의 조·항·호 번호를 정확히 인용
- appeal_letter의 빈칸은 "___"로 표시
- appeal_letter 내의 줄바꿈은 반드시 \\n으로 이스케이프 처리 (JSON 호환)`
              },
              {
                inlineData: { mimeType, data: base64Data },
              },
            ],
          }],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 3000,
            responseMimeType: 'application/json',
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
    const parts = data.candidates?.[0]?.content?.parts || []
    
    // Log all parts for debugging
    console.log('Parts count:', parts.length)
    parts.forEach((p: any, i: number) => {
      console.log(`Part ${i}: thought=${!!p.thought}, hasText=${!!p.text}, textLen=${p.text?.length || 0}`)
    })

    // Gemini 2.5 thinking: find the part that contains valid JSON (non-thought)
    let text = ''
    for (let i = parts.length - 1; i >= 0; i--) {
      const p = parts[i]
      if (p.text && !p.thought) {
        text = p.text
        break
      }
    }
    // Fallback: just grab any text
    if (!text) {
      for (const p of parts) {
        if (p.text) { text = p.text; break; }
      }
    }

    console.log('Selected text (first 500):', JSON.stringify(text.substring(0, 500)))

    let parsed: any

    // Since responseMimeType is 'application/json', Gemini should return valid JSON.
    // But we still need robust parsing for edge cases.
    const tryParse = (str: string): any => {
      try { return JSON.parse(str) } catch { return null }
    }

    // Attempt 1: Direct parse
    parsed = tryParse(text)

    // Attempt 2: Fix unescaped newlines in string values
    if (!parsed) {
      const fixedText = text.replace(/(?<=:\s*"(?:[^"\\]|\\.)*)(?<!\\)\n/g, '\\n')
      parsed = tryParse(fixedText)
    }

    // Attempt 3: Extract JSON object from text
    if (!parsed) {
      const cleaned = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim()
      let depth = 0, start = -1, end = -1
      for (let i = 0; i < cleaned.length; i++) {
        if (cleaned[i] === '{') { if (depth === 0) start = i; depth++ }
        else if (cleaned[i] === '}') { depth--; if (depth === 0) { end = i; break } }
      }
      if (start >= 0 && end > start) {
        const substr = cleaned.substring(start, end + 1)
        parsed = tryParse(substr)
        // Try fixing newlines in extracted substring
        if (!parsed) {
          parsed = tryParse(substr.replace(/(?<=:\s*"(?:[^"\\]|\\.)*)(?<!\\)\n/g, '\\n'))
        }
      }
    }

    // Attempt 4: Regex extraction as last resort
    if (!parsed) {
      console.error('All JSON parse attempts failed, using regex extraction')
      const getField = (key: string) => {
        const m = text.match(new RegExp(`"${key}"\\s*:\\s*"((?:[^"\\\\]|\\\\.)*)"`, 's'))
        return m ? m[1].replace(/\\n/g, '\n').replace(/\\"/g, '"') : undefined
      }
      const getArray = (key: string) => {
        const m = text.match(new RegExp(`"${key}"\\s*:\\s*\\[([^\\]]*)\\]`, 's'))
        if (!m) return undefined
        return m[1].match(/"((?:[^"\\\\]|\\\\.)*)"/g)?.map(s => s.slice(1, -1))
      }
      parsed = {
        violation_type: getField('violation_type') || '분석 실패',
        fine_amount: getField('fine_amount'),
        violation_date: getField('violation_date'),
        violation_location: getField('violation_location'),
        vehicle_number: getField('vehicle_number'),
        appeal_chance: getField('appeal_chance') || '보통',
        appeal_reason: getField('appeal_reason'),
        appeal_points: getArray('appeal_points'),
        legal_basis: getArray('legal_basis'),
        appeal_letter: getField('appeal_letter') || text,
      }
    }

    console.log('Parse result keys:', Object.keys(parsed))

    return NextResponse.json(parsed)
  } catch (error: any) {
    console.error('Analyze error:', error)
    return NextResponse.json(
      { error: error.message || '분석 실패' },
      { status: 500 }
    )
  }
}
