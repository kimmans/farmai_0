import type { Farm } from "~/+types/farm";

interface QuestionPromptFarm extends Partial<Farm> {
  size?: number | null;
  crop?: string;
}

// 농가 정보 템플릿 생성 함수
function createFarmInfoString(farm: QuestionPromptFarm) {
  return `
농장명: ${farm.name}
농장주: ${farm.owner_name}
재배작물: ${farm.crop || '-'}
위치: ${farm.location}
면적: ${farm.size ? `${farm.size}㎡` : '-'}
최근 업데이트: ${new Date(farm.updated_at!).toLocaleDateString()}
`;
}

// 기본 프롬프트 생성 함수
function createBasePrompt(farm: QuestionPromptFarm) {
  return `
당신은 스마트팜 전문 컨설턴트입니다. 다음 농가 정보를 바탕으로 인터뷰 질문 3개를 추천해주세요:

${createFarmInfoString(farm)}

환경 데이터:
- 주간 온도: 25°C
- 야간 온도: 18°C
- 습도: 65%
- CO2 농도: 800 ppm
- 조도: 15,000 lux
- 외부 온도: 22°C
- 날씨: 맑음

관수 데이터:
- 공급 EC: 2.5 mS/cm
- 공급 pH: 6.2
- 배액 EC: 2.8 mS/cm
- 배액 pH: 6.4
- 수분 함량: 35%
- 공급량: 2.5 L
- 배액량: 1.8 L

생육 데이터:
- 생육 단계: 개화기
- 솎음 작업: 상단 잎 2장 제거, 과실 솎음 작업 완료

병해충 데이터:
- 발생 병해: 흰가루병
- 발생 해충: 진딧물
- 발생 부위: 잎, 줄기
- 발생 정도: 경미
- 방제 방법: 유기농 살충제 사용
- 방제 결과: 방제 후 병해충 발생이 감소함

경영 데이터:
- 생산량: 1,200kg
- 판매량: 1,000kg
- 판매 금액: 8,000,000원
- 생산 비용: 3,500,000원
- 순이익: 4,500,000원
`;
}

export const QUESTION_PROMPTS = {
  // 질문 추천 모드
  SUGGEST_QUESTIONS: (basePrompt: string) => `
${basePrompt}

**질문 추천 모드**: 농가의 현재 상황을 고려하여 구체적이고 실질적인 인터뷰 질문 3개를 추천합니다.

다음 형식으로 답변해주세요:

1. 질문 1
2. 질문 2
3. 질문 3

각 질문은 다음 기준을 만족해야 합니다:
- 농가의 현재 상황과 직접적으로 관련된 내용
- 구체적이고 실질적인 내용
- 답변을 통해 유용한 정보를 얻을 수 있는 내용
- 농가주가 쉽게 답변할 수 있는 내용
`
};

export function getQuestionPrompt(farm: QuestionPromptFarm) {
  const basePrompt = createBasePrompt(farm);
  return {
    suggestQuestions: QUESTION_PROMPTS.SUGGEST_QUESTIONS(basePrompt)
  };
} 