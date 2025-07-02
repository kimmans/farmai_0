import { CONSULTING_PROMPTS } from "~/common/prompts/consul_prompt";
import { loadStrawberryManualYaml, loadPreviousConsultingReports } from "../lib/yaml-loader";
import { getConsultingDate } from "../features/pages/consulting/consulting-detail";

interface ConsultingReport {
  consultingInfo: {
    date: string;
    time: string;
    target: string;
    consultant: string;
    location: string;
  };
  dataSummary: {
    environment: any;
    irrigation: any;
    growth: any;
    pestControl: any;
    management: any;
  };
  diagnosis: {
    overallScore: number;
    overallStatus: string;
    environment: { score: number; status: string; issues: string[] };
    irrigation: { score: number; status: string; issues: string[] };
    growth: { score: number; status: string; issues: string[] };
    pestControl: { score: number; status: string; issues: string[] };
    strengths: string[];
    weaknesses: string[];
    risks: string[];
  };
  requests: {
    mainConcerns: string[];
    requirements: string[];
    priorityQuestions: Array<{
      question: string;
      category: string;
      priority: string;
      complexity: string;
    }>;
    potentialNeeds: string[];
    focusAreas: string[];
  };
  solutions: {
    recommendations: Array<{
      title: string;
      description: string;
      priority: string;
      timeline: string;
      cost: string;
    }>;
    actionItems: Array<{
      action: string;
      responsible: string;
      deadline: string;
      status: string;
    }>;
  };
  futurePlans: {
    shortTerm: string[];
    mediumTerm: string[];
    longTerm: string[];
    milestones: Array<{
      milestone: string;
      targetDate: string;
      successCriteria: string;
    }>;
  };
}

// 인터뷰 데이터 저장 (실제로는 DB에 저장)
export async function saveInterviewData(farmId: string, interviews: { question: string; answer: string }[]) {
  // TODO: 실제 DB 저장 로직 구현
  localStorage.setItem(`interview_${farmId}`, JSON.stringify(interviews));
}

// 인터뷰 데이터 불러오기
export async function loadInterviewData(farmId: string): Promise<{ question: string; answer: string }[]> {
  // TODO: 실제 DB에서 불러오기 로직 구현
  const saved = localStorage.getItem(`interview_${farmId}`);
  return saved ? JSON.parse(saved) : [];
}

// 컨설팅 보고서 생성
export async function generateConsultingReport(farmData: any, farmId: string): Promise<ConsultingReport> {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  
  if (!apiKey) {
    console.warn("OpenAI API 키가 없어서 기본 보고서를 반환합니다.");
    return generateDefaultReport(farmData);
  }

  try {
    // 모든 관련 데이터 수집
    const [yaml, previousReports, interviews] = await Promise.all([
      loadStrawberryManualYaml(),
      loadPreviousConsultingReports(farmId),
      loadInterviewData(farmId)
    ]);

    // 디버깅을 위한 로그
    console.log("=== 보고서 생성 데이터 ===");
    console.log("농장 데이터:", farmData);
    console.log("인터뷰 데이터:", interviews);
    console.log("YAML 매뉴얼:", yaml);
    console.log("기존 기록:", previousReports);

    const prompt = `당신은 농업 전문 컨설턴트입니다. 다음 모든 정보를 종합하여 상세한 컨설팅 보고서를 작성해주세요.

**농장 기본 정보:**
- 농장명: ${farmData?.name || '정보 없음'}
- 농장주: ${farmData?.owner_name || '정보 없음'}
- 위치: ${farmData?.location || '정보 없음'}
- 면적: ${farmData?.size ? `${farmData.size}㎡` : '정보 없음'}
- 재배작물: ${farmData?.crop || '딸기'}

**실제 농장 데이터:**

환경 데이터:
- 주간 온도: ${farmData?.environmentData?.dayTemp || '정보 없음'}
- 야간 온도: ${farmData?.environmentData?.nightTemp || '정보 없음'}
- 습도: ${farmData?.environmentData?.humidity || '정보 없음'}
- CO2 농도: ${farmData?.environmentData?.co2 || '정보 없음'}
- 조도: ${farmData?.environmentData?.light || '정보 없음'}
- 외부 온도: ${farmData?.environmentData?.externalTemp || '정보 없음'}
- 날씨: ${farmData?.environmentData?.weather || '정보 없음'}

관수 데이터:
- 공급 EC: ${farmData?.irrigationData?.supplyEC || '정보 없음'}
- 공급 pH: ${farmData?.irrigationData?.supplyPH || '정보 없음'}
- 배액 EC: ${farmData?.irrigationData?.drainEC || '정보 없음'}
- 배액 pH: ${farmData?.irrigationData?.drainPH || '정보 없음'}
- 수분 함량: ${farmData?.irrigationData?.moisture || '정보 없음'}
- 공급량: ${farmData?.irrigationData?.supplyAmount || '정보 없음'}
- 배액량: ${farmData?.irrigationData?.drainAmount || '정보 없음'}

생육 데이터:
- 생육 단계: ${farmData?.growthData?.stage || '정보 없음'}
- 솎음 작업: ${farmData?.growthData?.thinning || '정보 없음'}

병해충 데이터:
- 발생 병해: ${farmData?.pestControlData?.diseases || '정보 없음'}
- 발생 해충: ${farmData?.pestControlData?.pests || '정보 없음'}
- 발생 부위: ${farmData?.pestControlData?.affectedParts || '정보 없음'}
- 발생 정도: ${farmData?.pestControlData?.severity || '정보 없음'}
- 방제 방법: ${farmData?.pestControlData?.controlMethod || '정보 없음'}
- 방제 결과: ${farmData?.pestControlData?.controlResult || '정보 없음'}

경영 데이터:
- 생산량: ${farmData?.managementData?.production || '정보 없음'}
- 판매량: ${farmData?.managementData?.sales || '정보 없음'}
- 판매 금액: ${farmData?.managementData?.salesAmount || '정보 없음'}
- 생산 비용: ${farmData?.managementData?.productionCost || '정보 없음'}
- 순이익: ${farmData?.managementData?.netProfit || '정보 없음'}

**딸기 재배 매뉴얼:**
${yaml}

**기존 컨설팅 기록:**
${previousReports.join("\n")}

**실제 인터뷰 내용:**
${interviews.length > 0 ? interviews.map((iv, idx) => `Q${idx + 1}. ${iv.question}\nA${idx + 1}. ${iv.answer}`).join("\n\n") : "인터뷰 내용이 없습니다."}

위의 모든 실제 데이터와 인터뷰 내용을 종합하여 다음 JSON 형식으로 정확히 답변해주세요. 실제 데이터 값을 그대로 사용하고, 인터뷰 내용을 바탕으로 구체적이고 실용적인 보고서를 작성해주세요:

{
  "consultingInfo": {
    "date": "${getConsultingDate(farmId)}",
    "time": "14:00-16:00",
    "target": "${farmData?.name || '농장'} - ${farmData?.owner_name || '농장주'}",
    "consultant": "AI 농업 컨설턴트",
    "location": "${farmData?.location || '농장 위치'}"
  },
  "dataSummary": {
    "environment": {
      "dayTemp": "${farmData?.environmentData?.dayTemp || '정보 없음'}",
      "nightTemp": "${farmData?.environmentData?.nightTemp || '정보 없음'}", 
      "humidity": "${farmData?.environmentData?.humidity || '정보 없음'}",
      "co2": "${farmData?.environmentData?.co2 || '정보 없음'}"
    },
    "irrigation": {
      "supplyEC": "${farmData?.irrigationData?.supplyEC || '정보 없음'}",
      "supplyPH": "${farmData?.irrigationData?.supplyPH || '정보 없음'}",
      "drainEC": "${farmData?.irrigationData?.drainEC || '정보 없음'}",
      "moisture": "${farmData?.irrigationData?.moisture || '정보 없음'}"
    },
    "growth": {
      "stage": "${farmData?.growthData?.stage || '정보 없음'}",
      "production": "${farmData?.managementData?.production || '정보 없음'}",
      "qualityIndex": "85점"
    },
    "pestControl": {
      "diseases": "${farmData?.pestControlData?.diseases || '정보 없음'}",
      "pests": "${farmData?.pestControlData?.pests || '정보 없음'}",
      "controlMethod": "${farmData?.pestControlData?.controlMethod || '정보 없음'}"
    },
    "management": {
      "sales": "${farmData?.managementData?.sales || '정보 없음'}",
      "salesAmount": "${farmData?.managementData?.salesAmount || '정보 없음'}",
      "productionCost": "${farmData?.managementData?.productionCost || '정보 없음'}",
      "netProfit": "${farmData?.managementData?.netProfit || '정보 없음'}"
    }
  },
  "diagnosis": {
    "overallScore": 0-100 사이 점수,
    "overallStatus": "우수/양호/보통/주의/위험",
    "environment": {
      "score": 0-100 사이 점수,
      "status": "우수/양호/보통/주의/위험",
      "issues": ["실제 데이터 기반 구체적 문제점들"]
    },
    "irrigation": {
      "score": 0-100 사이 점수,
      "status": "우수/양호/보통/주의/위험",
      "issues": ["실제 데이터 기반 구체적 문제점들"]
    },
    "growth": {
      "score": 0-100 사이 점수,
      "status": "우수/양호/보통/주의/위험",
      "issues": ["실제 데이터 기반 구체적 문제점들"]
    },
    "pestControl": {
      "score": 0-100 사이 점수,
      "status": "우수/양호/보통/주의/위험",
      "issues": ["실제 데이터 기반 구체적 문제점들"]
    },
    "strengths": ["실제 데이터와 인터뷰에서 발견된 강점들"],
    "weaknesses": ["실제 데이터와 인터뷰에서 발견된 약점들"],
    "risks": ["실제 데이터와 인터뷰에서 발견된 위험요소들"]
  },
  "requests": {
    "mainConcerns": ["인터뷰에서 파악된 주요 관심사들"],
    "requirements": ["인터뷰에서 파악된 요구사항들"],
    "priorityQuestions": [
      {
        "question": "인터뷰에서 나온 실제 질문",
        "category": "환경관리/관수관리/생육관리/병해충관리/경영관리",
        "priority": "높음/보통/낮음",
        "complexity": "단순/복합"
      }
    ],
    "potentialNeeds": ["인터뷰에서 유추된 잠재적 요구사항들"],
    "focusAreas": ["이번 컨설팅에서 집중해야 할 영역들"]
  },
  "solutions": {
    "recommendations": [
      {
        "title": "구체적인 권장사항 제목",
        "description": "실제 데이터와 인터뷰를 바탕으로 한 구체적 설명",
        "priority": "높음/보통/낮음",
        "timeline": "구체적 기간",
        "cost": "예상 비용"
      }
    ],
    "actionItems": [
      {
        "action": "구체적 실행 항목",
        "responsible": "담당자",
        "deadline": "구체적 마감일",
        "status": "계획/진행중/완료"
      }
    ]
  },
  "futurePlans": {
    "shortTerm": ["1-3개월 내 실행 계획들"],
    "mediumTerm": ["3-12개월 내 실행 계획들"],
    "longTerm": ["1년 이상 장기 계획들"],
    "milestones": [
      {
        "milestone": "구체적 마일스톤",
        "targetDate": "목표 날짜",
        "successCriteria": "성공 기준"
      }
    ]
  }
}`;

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
            content: "당신은 농업 전문 컨설턴트입니다. 제공된 모든 데이터와 인터뷰 내용을 종합하여 실용적이고 구체적인 컨설팅 보고서를 작성해주세요. 요청된 JSON 형식으로만 답변하세요." 
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 3000,
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

    console.log("=== GPT 프롬프트 ===");
    console.log(prompt);
    console.log("=== GPT 응답 ===");
    console.log(content);

    // JSON 파싱 시도
    let parsedReport;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedReport = JSON.parse(jsonMatch[0]);
      } else {
        parsedReport = JSON.parse(content);
      }
    } catch (parseError) {
      console.error("JSON 파싱 실패:", parseError);
      console.log("파싱 실패한 내용:", content);
      throw new Error("GPT 응답을 파싱할 수 없습니다.");
    }

    return parsedReport as ConsultingReport;

  } catch (error) {
    console.error("보고서 생성 중 오류:", error);
    // 에러 발생 시 기본 보고서 반환
    return generateDefaultReport(farmData);
  }
}

// 기본 보고서 생성 (API 키가 없거나 에러 발생 시)
function generateDefaultReport(farmData: any): ConsultingReport {
  const now = new Date();
  
  return {
    consultingInfo: {
      date: now.toISOString().split('T')[0],
      time: "14:00-16:00",
      target: `${farmData?.name || '농장'} - ${farmData?.owner_name || '농장주'}`,
      consultant: "AI 농업 컨설턴트",
      location: farmData?.location || "농장 위치",
    },
    dataSummary: {
      environment: {
        dayTemp: "25°C",
        nightTemp: "18°C",
        humidity: "65%",
        co2: "800 ppm"
      },
      irrigation: {
        supplyEC: "2.5 mS/cm",
        supplyPH: "6.2",
        drainEC: "2.8 mS/cm",
        moisture: "35%"
      },
      growth: {
        stage: "개화기",
        production: "1,200kg",
        qualityIndex: "85점"
      },
      pestControl: {
        diseases: "흰가루병",
        pests: "진딧물",
        controlMethod: "유기농 살충제"
      },
      management: {
        sales: "1,000kg",
        salesAmount: "8,000,000원",
        productionCost: "3,500,000원",
        netProfit: "4,500,000원"
      }
    },
    diagnosis: {
      overallScore: 78,
      overallStatus: "양호",
      environment: {
        score: 82,
        status: "양호",
        issues: ["야간 온도가 다소 낮음", "CO2 농도 최적화 필요"]
      },
      irrigation: {
        score: 75,
        status: "보통",
        issues: ["배액 EC가 높음", "pH 조정 필요"]
      },
      growth: {
        score: 85,
        status: "우수",
        issues: ["과실 품질 우수", "생산량 안정적"]
      },
      pestControl: {
        score: 70,
        status: "보통",
        issues: ["병해충 발생 감지", "예방 관리 강화 필요"]
      },
      strengths: ["생육 상태 양호", "품질 관리 우수", "경영 효율성 높음"],
      weaknesses: ["환경 제어 최적화 필요", "병해충 예방 관리 부족"],
      risks: ["계절 변화에 따른 환경 변화", "병해충 확산 위험"]
    },
    requests: {
      mainConcerns: ["환경 관리 최적화", "병해충 예방 강화", "생산성 향상"],
      requirements: ["자동화 시스템 도입", "예방 관리 체계 구축", "품질 관리 강화"],
      priorityQuestions: [
        {
          question: "환경 제어 시스템 개선 방안은?",
          category: "환경관리",
          priority: "높음",
          complexity: "복합"
        },
        {
          question: "병해충 예방 관리 체계는?",
          category: "병해충관리",
          priority: "높음",
          complexity: "복합"
        },
        {
          question: "생산성 향상을 위한 방안은?",
          category: "생육관리",
          priority: "보통",
          complexity: "복합"
        }
      ],
      potentialNeeds: ["스마트팜 시스템 확장", "데이터 분석 도구"],
      focusAreas: ["환경 제어 최적화", "병해충 예방 관리", "경영 효율성 증대"]
    },
    solutions: {
      recommendations: [
        {
          title: "환경 제어 시스템 개선",
          description: "자동화된 온도 및 습도 제어 시스템을 도입하여 최적 환경을 유지합니다.",
          priority: "높음",
          timeline: "2-3개월",
          cost: "500만원"
        },
        {
          title: "병해충 예방 관리 체계 구축",
          description: "정기적인 모니터링과 예방적 방제 체계를 구축합니다.",
          priority: "높음",
          timeline: "1-2개월",
          cost: "200만원"
        },
        {
          title: "데이터 분석 시스템 도입",
          description: "생산 데이터를 분석하여 의사결정을 지원하는 시스템을 도입합니다.",
          priority: "보통",
          timeline: "3-4개월",
          cost: "300만원"
        }
      ],
      actionItems: [
        {
          action: "환경 모니터링 시스템 설치",
          responsible: "농장주",
          deadline: "2024-03-31",
          status: "계획"
        },
        {
          action: "병해충 예방 관리 교육",
          responsible: "농장주",
          deadline: "2024-02-28",
          status: "계획"
        },
        {
          action: "데이터 수집 체계 구축",
          responsible: "농장주",
          deadline: "2024-04-30",
          status: "계획"
        }
      ]
    },
    futurePlans: {
      shortTerm: ["환경 제어 시스템 개선", "병해충 예방 관리 강화", "데이터 수집 체계 구축"],
      mediumTerm: ["스마트팜 시스템 확장", "품질 관리 체계 구축", "자동화 시스템 도입"],
      longTerm: ["완전 자동화 시스템 구축", "데이터 기반 의사결정 체계", "지속가능한 농업 모델 확립"],
      milestones: [
        {
          milestone: "환경 제어 시스템 완료",
          targetDate: "2024-06-30",
          successCriteria: "온도/습도 자동 제어 구현"
        },
        {
          milestone: "병해충 예방 체계 구축",
          targetDate: "2024-05-31",
          successCriteria: "정기 모니터링 및 예방 관리 체계 완성"
        },
        {
          milestone: "데이터 분석 시스템 구축",
          targetDate: "2024-08-31",
          successCriteria: "생산 데이터 분석 및 리포트 생성 시스템 완성"
        }
      ]
    }
  };
} 