import { CONSULTING_PROMPTS } from "~/common/prompts/consul_prompt";

// 질문 추천 (GPT-4)
export async function getRecommendedQuestions(farmData: any, yaml: string, previousReports: string[], diagnosisData?: any): Promise<{ id: string; question: string; reason: string }[]> {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  if (!apiKey) {
    console.warn("OpenAI API 키가 없어서 기본 질문을 반환합니다.");
    return [
      { id: "rec1", question: "최근 생육 상태에서 가장 신경 쓰이는 점은?", reason: "생육 데이터 기반" },
      { id: "rec2", question: "관수 관리에서 어려운 점은?", reason: "관수 데이터 기반" },
      { id: "rec3", question: "병해충 방제에 대해 궁금한 점은?", reason: "병해충 데이터 기반" },
    ];
  }

  try {
    const prompt = `당신은 농업 컨설턴트입니다. 다음 정보를 바탕으로 농가주에게 물어볼 질문 3개를 추천해주세요.

농장 데이터: ${JSON.stringify(farmData, null, 2)}
딸기 매뉴얼: ${yaml}
기존 컨설팅 기록: ${previousReports.join("\n")}
${diagnosisData ? `진단 결과: ${JSON.stringify(diagnosisData, null, 2)}` : ''}

다음 JSON 형식으로 정확히 답변해주세요:
[
  {
    "question": "질문 내용",
    "reason": "이 질문을 추천하는 이유"
  },
  {
    "question": "질문 내용", 
    "reason": "이 질문을 추천하는 이유"
  },
  {
    "question": "질문 내용",
    "reason": "이 질문을 추천하는 이유"
  }
]`;

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { 
            role: "system", 
            content: "당신은 농업 전문 컨설턴트입니다. 농가 데이터와 진단 결과를 참고하여 농가의 약점이나 개선점에 대해 구체적인 질문을 추천해주세요. 요청된 JSON 형식으로만 답변하세요." 
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 800,
      }),
    });

    if (!res.ok) {
      throw new Error(`API 호출 실패: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content;
    
    if (!content) {
      throw new Error("GPT 응답이 비어있습니다.");
    }

    console.log("GPT 응답:", content);

    // JSON 파싱 시도
    let parsedQuestions;
    try {
      // JSON 블록만 추출
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        parsedQuestions = JSON.parse(jsonMatch[0]);
      } else {
        parsedQuestions = JSON.parse(content);
      }
    } catch (parseError) {
      console.error("JSON 파싱 실패:", parseError);
      console.log("파싱 실패한 내용:", content);
      throw new Error("GPT 응답을 파싱할 수 없습니다.");
    }

    // 응답 형식 검증
    if (!Array.isArray(parsedQuestions) || parsedQuestions.length === 0) {
      throw new Error("GPT 응답이 올바른 배열 형식이 아닙니다.");
    }

    return parsedQuestions.map((q: any, i: number) => ({
      id: `rec${i + 1}`,
      question: q.question || `질문 ${i + 1}`,
      reason: q.reason || "데이터 기반 추천"
    }));

  } catch (error) {
    console.error("질문 추천 중 오류:", error);
    // 에러 발생 시 기본 질문 반환
    return [
      { id: "rec1", question: "최근 생육 상태에서 가장 신경 쓰이는 점은?", reason: "생육 데이터 기반" },
      { id: "rec2", question: "관수 관리에서 어려운 점은?", reason: "관수 데이터 기반" },
      { id: "rec3", question: "병해충 방제에 대해 궁금한 점은?", reason: "병해충 데이터 기반" },
    ];
  }
}

// Whisper 음성 변환
export async function transcribeAudio(audioBlob: Blob): Promise<{ text: string; success: boolean; error?: string }> {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  if (!apiKey) throw new Error("OpenAI API 키가 필요합니다.");
  const formData = new FormData();
  formData.append("file", audioBlob, "recording.wav");
  formData.append("model", "whisper-1");
  formData.append("language", "ko");
  const res = await fetch("https://api.openai.com/v1/audio/transcriptions", {
    method: "POST",
    headers: { "Authorization": `Bearer ${apiKey}` },
    body: formData,
  });
  if (!res.ok) return { text: "", success: false, error: res.statusText };
  const data = await res.json();
  return { text: data.text || "", success: true };
} 