import React, { useState } from "react";
import Navigation from "~/common/components/navagation";
import { Card, CardHeader, CardContent, CardFooter } from "~/common/components/ui/card";
import { Button } from "~/common/components/ui/button";
import { Input } from "~/common/components/ui/input";
import { Label } from "~/common/components/ui/label";
import { useNavigate, useParams } from "react-router";

// 진단 항목 및 점수 구조 정의
const DIAGNOSIS_ITEMS = [
  {
    category: "시설 및 자동화",
    items: [
      { key: "축고", label: "축고", weight: 5 },
      { key: "보온및가온시설", label: "보온 및 가온시설", weight: 5 },
      { key: "양액공급시스템", label: "양액공급 시스템", weight: 5 },
      { key: "환경자동화", label: "환경 자동화", weight: 5 },
      { key: "농작업생력화", label: "농작업 생력화", weight: 5 },
    ],
  },
  {
    category: "환경관리",
    items: [
      { key: "광관리", label: "광관리", weight: 4 },
      { key: "보온개시시기", label: "보온개시 시기", weight: 4 },
      { key: "하우스온습도관리", label: "하우스 온·습도 관리", weight: 4 },
      { key: "탄산가스사용", label: "탄산가스 사용", weight: 4 },
      { key: "베드소독", label: "베드(배지) 소독", weight: 4 },
      { key: "관수", label: "관수", weight: 4 },
      { key: "배양액관리", label: "배양액 관리", weight: 4 },
      { key: "배지상토", label: "배지(상토)", weight: 3 },
    ],
  },
  {
    category: "작물관리",
    items: [
      { key: "정식시기", label: "정식시기", weight: 5 },
      { key: "활착관리", label: "활착관리", weight: 5 },
      { key: "수정", label: "수정", weight: 5 },
      { key: "병해충방제", label: "병해충 방제", weight: 5 },
      { key: "적과적화", label: "적과·적화", weight: 5 },
    ],
  },
  {
    category: "경영관리",
    items: [
      { key: "선별", label: "선별", weight: 4 },
      { key: "품질인증", label: "품질인증", weight: 4 },
      { key: "협업경영", label: "협업경영", weight: 3 },
      { key: "경영기록분석", label: "경영기록 및 분석", weight: 3 },
      { key: "자금관리", label: "자금관리", weight: 3 },
      { key: "농업정보활용", label: "농업정보 활용", weight: 3 },
    ],
  },
];

const SCORE_LEVELS = [
  { label: "I", value: 1, score: 1.0 },
  { label: "II", value: 2, score: 2.0 },
  { label: "III", value: 3, score: 3.0 },
  { label: "IV", value: 4, score: 4.0 },
  { label: "V", value: 5, score: 5.0 },
];

const initialFarmInfo = {
  dateYear: '',
  dateMonth: '',
  dateDay: '',
  round: '',
  ownArea: '',
  rentArea: '',
  fogSystem: '',
  sorter: '',
  sprayer: '',
  tractor: '',
  manager: '',
  coldStorage: '',
  freezer: '',
  annualProduction: '',
  incomeStrawberry: '',
  incomeOther: '',
};

const initialPerformance = {
  yield: '',
  yieldLevel: 0,
  price: '',
  priceLevel: 0,
  scale: '',
  scaleLevel: 0,
};

const initialAutomation = {
  heightLevel: 0,
  heatingLevel: 0,
  nutrientLevel: 0,
  envAutoLevel: 0,
  laborLevel: 0,
};

const automationOptions = {
  height: [
    '1.2m 미만',
    '1.2~1.4m',
    '1.4~1.6m',
    '1.6~1.8m',
    '1.8m 이상',
  ],
  heating: [
    '삼중하우스',
    '이중하우스+수막',
    '삼중하우스+수막',
    '삼중하우스+수막+보조난방',
    '삼중하우스+다겹커튼+수막+보조난방',
  ],
  nutrient: [
    '시간제 양액공급 + 배액관리',
    '시간제 양액공급 + 급액관리',
    '유량제 양액공급 + 배액관리',
    '유량제 양액공급 + 급액관리',
    '유량제 양액공급 + 급액 및 배액관리',
  ],
  envAuto: [
    '인력 수동식',
    '인력 권취기',
    '이동식 전동 권취기',
    '반자동(전동), 센서, 타이머',
    '완전 자동',
  ],
  labor: [
    '운반시설 없음 + 수동방제기',
    '운반대 + 수동방제기',
    '밀차(운반차) + 자동방제기',
    '행거식 운반대 + 자동방제기',
    '행거식 운반대 + 무인방제시설',
  ],
};

const initialEnv = {
  lightLevel: 0,
  heatingStartLevel: 0,
  tempHumidLevel: 0,
  co2Level: 0,
  bedDisinfectLevel: 0,
  waterLevel: 0,
  nutrientLevel: 0,
  soilLevel: 0,
};

const envOptions = {
  light: [
    '외피 3년 / 내피 2년 갱신',
    '외피 3년 / 내피 1년 갱신',
    '외피 PO필름 / 내피 1년 / 차광제',
    '외피 PO필름 / 내피 1년 / 차광스크린',
    '외피 PO필름 / 내피 1년 / 차광스크린 / 보광등',
  ],
  heatingStart: [
    '예년과 같은 시기',
    '인근 농가 따라감',
    '자가 기록 기반 분석',
    '기상청 예보 5℃ 이하 시',
    '기상청 예보 10℃ 이하 시',
  ],
  tempHumid: [
    '관리 안함',
    '품종 적절 온습도 모름',
    '품종에 맞게 관리',
    '상황에 따라 관리',
    '품종+상황 모두 반영 관리',
  ],
  co2: [
    '사용 안함',
    '볏짚 활용',
    '연소탄산가스(시간조절)',
    '액화탄산가스(시간조절)',
    '액화탄산가스(시간+농도조절)',
  ],
  bedDisinfect: [
    '안함',
    '비닐덮고 태양열 10일 이상',
    '일반약제 + 태양열 10일 이상',
    '가스소독제 + 태양열 5일 이상',
    '가스소독제 + 태양열 10일 이상',
  ],
  water: [
    '주기적으로 일정량',
    '생육단계별 일정량',
    '생육+작물상태 감안',
    '생육+작물상태+일기 감안',
    '생육+작물+일기+센서 기반 조절',
  ],
  nutrient: [
    '안함',
    '식물 크기 따라',
    '생육단계 따라',
    '생육단계+시기 따라',
    '생육단계+시기+계절까지 고려',
  ],
  soil: [
    '특성 모름',
    '특성 인지',
    '특성+적정 배양액 농도',
    '특성+농도+급액방법',
    '특성+농도+급액+장치 달리함',
  ],
};

const initialCrop = {
  plantingLevel: 0,
  rootingLevel: 0,
  pollinationLevel: 0,
  pestLevel: 0,
  thinningLevel: 0,
};

const cropOptions = {
  planting: [
    '예년 기준',
    '감으로 묘상태 고려',
    '묘상태+묘령',
    '묘상태+묘령+기상',
    '화아분화 확인 후 정식',
  ],
  rooting: [
    '스프링클러 관수',
    '스프링클러 + 차광',
    '점적관수 + 차광',
    '점적관수 + 차광 + 예방 약제',
    '위 + 활착 후 차광망 제거',
  ],
  pollination: [
    '꿀벌 부족',
    '꿀벌 충분',
    '꿀벌 충분 + 주의사항 인지',
    '위 + 기상불량 시 호박벌',
    '위 + 온습도 제어',
  ],
  pest: [
    '병해충 발생 후 농약 사용',
    '예방방제 + 기준 모름',
    '예방방제 + 기준 준수',
    '개화 전 예방, 개화 후 환경방제',
    '천적 및 재배환경 개선',
  ],
  thinning: [
    '방임',
    '적과 위주',
    '적화 위주',
    '적과 + 수확 후 화방 제거',
    '적화 + 수확 후 화방 제거',
  ],
};

const initialManagement = {
  selectionLevel: 0,
  qualityLevel: 0,
  cooperationLevel: 0,
  recordLevel: 0,
  fundLevel: 0,
  infoLevel: 0,
};

const managementOptions = {
  selection: [
    '무선별 개인기준',
    '작목반 규격 (개별 선별)',
    '지역 공동규격 (개별 선별)',
    '지역 공동규격 (공동 선별)',
    '지역 공동규격 (공동 선별)',
  ],
  quality: [
    '일반 재배',
    'GAP / 무농약 전환기',
    '유기농',
    '유기재배 인증',
    '유기재배 인증',
  ],
  cooperation: [
    '공동 없음',
    '구입/판매/작업/시설 중 1가지 공동',
    '위 중 2가지 공동',
    '위 중 3가지 공동',
    '모두 공동',
  ],
  record: [
    '없음',
    '항목 중 1개',
    '항목 중 2개',
    '항목 중 3개',
    '4가지 이상',
  ],
  fund: [
    '신경 쓰지 않음',
    '대략적 계획',
    '연간 수익 기반 계획 수립',
    '장기 계획 기반 연차별 운영',
    '장기 계획 + 월간 흐름까지 관리',
  ],
  info: [
    '관심 없음',
    'TV, 신문',
    '농업 전문지',
    '전문지 + 기관정보 활용',
    '컴퓨터로 종합 정보 수집',
  ],
};

// 종합평가 진단표 항목 정의
const summaryTable = [
  { category: '경영성과 지표', items: [
    { key: 'yieldLevel', label: '10a당 수량', get: (state: any) => state.performance.yieldLevel },
    { key: 'priceLevel', label: '수취가격', get: (state: any) => state.performance.priceLevel },
    { key: 'scaleLevel', label: '경영규모', get: (state: any) => state.performance.scaleLevel },
  ]},
  { category: '시설 및 자동화', items: [
    { key: 'heightLevel', label: '측고', get: (state: any) => state.automation.heightLevel },
    { key: 'heatingLevel', label: '보온 및 가온시설', get: (state: any) => state.automation.heatingLevel },
    { key: 'nutrientLevel', label: '양액공급 시스템', get: (state: any) => state.automation.nutrientLevel },
    { key: 'envAutoLevel', label: '환경 자동화', get: (state: any) => state.automation.envAutoLevel },
    { key: 'laborLevel', label: '농작업 생력화', get: (state: any) => state.automation.laborLevel },
  ]},
  { category: '환경관리', items: [
    { key: 'lightLevel', label: '광관리', get: (state: any) => state.env.lightLevel },
    { key: 'heatingStartLevel', label: '보온개시 시기', get: (state: any) => state.env.heatingStartLevel },
    { key: 'tempHumidLevel', label: '온·습도 관리', get: (state: any) => state.env.tempHumidLevel },
    { key: 'co2Level', label: '탄산가스 시용', get: (state: any) => state.env.co2Level },
    { key: 'bedDisinfectLevel', label: '베드(배지) 소독', get: (state: any) => state.env.bedDisinfectLevel },
    { key: 'waterLevel', label: '관수', get: (state: any) => state.env.waterLevel },
    { key: 'nutrientLevel', label: '배양액 관리', get: (state: any) => state.env.nutrientLevel },
    { key: 'soilLevel', label: '배지(상토)', get: (state: any) => state.env.soilLevel },
  ]},
  { category: '작물관리', items: [
    { key: 'plantingLevel', label: '정식시기', get: (state: any) => state.crop.plantingLevel },
    { key: 'rootingLevel', label: '활착관리', get: (state: any) => state.crop.rootingLevel },
    { key: 'pollinationLevel', label: '수정', get: (state: any) => state.crop.pollinationLevel },
    { key: 'pestLevel', label: '병해충 방제', get: (state: any) => state.crop.pestLevel },
    { key: 'thinningLevel', label: '적과·적화', get: (state: any) => state.crop.thinningLevel },
  ]},
  { category: '경영관리', items: [
    { key: 'selectionLevel', label: '선별', get: (state: any) => state.management.selectionLevel },
    { key: 'qualityLevel', label: '품질인증', get: (state: any) => state.management.qualityLevel },
    { key: 'cooperationLevel', label: '협업경영', get: (state: any) => state.management.cooperationLevel },
    { key: 'recordLevel', label: '경영기록 및 분석', get: (state: any) => state.management.recordLevel },
    { key: 'fundLevel', label: '자금관리', get: (state: any) => state.management.fundLevel },
    { key: 'infoLevel', label: '농업정보 활용', get: (state: any) => state.management.infoLevel },
  ]},
];

const LEVEL_LABELS = ['I', 'II', 'III', 'IV', 'V'];

export default function ConsultingDiagnosis() {
  const { farmId = "" } = useParams();
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [farmInfo, setFarmInfo] = useState(initialFarmInfo);
  const [performance, setPerformance] = useState(initialPerformance);
  const [automation, setAutomation] = useState(initialAutomation);
  const [env, setEnv] = useState(initialEnv);
  const [crop, setCrop] = useState(initialCrop);
  const [management, setManagement] = useState(initialManagement);

  // 점수 계산
  const totalScore = DIAGNOSIS_ITEMS.reduce((sum, cat) =>
    sum + cat.items.reduce((catSum, item) => {
      const level = answers[item.key] || 1;
      // weight * (level별 점수/5)
      return catSum + item.weight * (level / 5);
    }, 0), 0
  );

  const handleChange = (key: string, value: number) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
  };

  const handleFarmInfoChange = (name: string, value: string) => {
    setFarmInfo(prev => ({ ...prev, [name]: value }));
  };

  const handlePerformanceChange = (name: string, value: string | number) => {
    setPerformance(prev => ({ ...prev, [name]: value }));
  };

  const handleAutomationChange = (name: keyof typeof initialAutomation, value: number) => {
    setAutomation(prev => ({ ...prev, [name]: value }));
  };

  const handleEnvChange = (name: keyof typeof initialEnv, value: number) => {
    setEnv(prev => ({ ...prev, [name]: value }));
  };

  const handleCropChange = (name: keyof typeof initialCrop, value: number) => {
    setCrop(prev => ({ ...prev, [name]: value }));
  };

  const handleManagementChange = (name: keyof typeof initialManagement, value: number) => {
    setManagement(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    // TODO: 진단지 및 농가 일반현황 저장 로직
    alert("진단지가 저장되었습니다.");
    navigate(`/consulting/${farmId}/interview`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation isLoggedIn={true} />
      <main className="container mx-auto px-4 pt-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 좌측: 진단지 문항 */}
          <div>
            <Card>
              <CardHeader>
                <h1 className="text-2xl font-bold">진단지 작성</h1>
                <p className="text-muted-foreground text-sm mt-2">각 항목별로 해당하는 등급을 선택하세요.</p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* 농가 일반현황 입력 */}
                <div className="mb-8 p-4 bg-gray-50 rounded-lg border">
                  <h2 className="font-semibold text-lg mb-4">1. 농가 일반현황</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
                    <div>
                      <Label>진단일자</Label>
                      <div className="flex gap-2">
                        <Input type="number" min="2020" max="2100" placeholder="년" value={farmInfo.dateYear} onChange={e => handleFarmInfoChange('dateYear', e.target.value)} />
                        <Input type="number" min="1" max="12" placeholder="월" value={farmInfo.dateMonth} onChange={e => handleFarmInfoChange('dateMonth', e.target.value)} />
                        <Input type="number" min="1" max="31" placeholder="일" value={farmInfo.dateDay} onChange={e => handleFarmInfoChange('dateDay', e.target.value)} />
                      </div>
                    </div>
                    <div>
                      <Label>진단회수</Label>
                      <Input type="number" min="1" placeholder="번째" value={farmInfo.round} onChange={e => handleFarmInfoChange('round', e.target.value)} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                    <div>
                      <Label>경영규모 - 소유(㎡)</Label>
                      <Input type="number" min="0" value={farmInfo.ownArea} onChange={e => handleFarmInfoChange('ownArea', e.target.value)} />
                    </div>
                    <div>
                      <Label>경영규모 - 임차(㎡)</Label>
                      <Input type="number" min="0" value={farmInfo.rentArea} onChange={e => handleFarmInfoChange('rentArea', e.target.value)} />
                    </div>
                  </div>
                  <div className="mb-2">
                    <Label>주요 농기계 보유현황</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-1">
                      <Input type="number" min="0" placeholder="포그시스템(대)" value={farmInfo.fogSystem} onChange={e => handleFarmInfoChange('fogSystem', e.target.value)} />
                      <Input type="number" min="0" placeholder="선별기(대)" value={farmInfo.sorter} onChange={e => handleFarmInfoChange('sorter', e.target.value)} />
                      <Input type="number" min="0" placeholder="방제기(대)" value={farmInfo.sprayer} onChange={e => handleFarmInfoChange('sprayer', e.target.value)} />
                      <Input type="number" min="0" placeholder="트랙터(대)" value={farmInfo.tractor} onChange={e => handleFarmInfoChange('tractor', e.target.value)} />
                      <Input type="number" min="0" placeholder="관리기(대)" value={farmInfo.manager} onChange={e => handleFarmInfoChange('manager', e.target.value)} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                    <div>
                      <Label>저온저장고(㎡)</Label>
                      <Input type="number" min="0" value={farmInfo.coldStorage} onChange={e => handleFarmInfoChange('coldStorage', e.target.value)} />
                    </div>
                    <div>
                      <Label>냉동저장고(㎡)</Label>
                      <Input type="number" min="0" value={farmInfo.freezer} onChange={e => handleFarmInfoChange('freezer', e.target.value)} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>연간 시설딸기 생산량(㎏)</Label>
                      <Input type="number" min="0" value={farmInfo.annualProduction} onChange={e => handleFarmInfoChange('annualProduction', e.target.value)} />
                    </div>
                    <div>
                      <Label>연간 추정 소득 - 딸기(만원)</Label>
                      <Input type="number" min="0" value={farmInfo.incomeStrawberry} onChange={e => handleFarmInfoChange('incomeStrawberry', e.target.value)} />
                    </div>
                    <div>
                      <Label>연간 추정 소득 - 기타(만원)</Label>
                      <Input type="number" min="0" value={farmInfo.incomeOther} onChange={e => handleFarmInfoChange('incomeOther', e.target.value)} />
                    </div>
                  </div>
                </div>

                {/* 경영성과 지표 */}
                <div className="mb-8 p-4 bg-gray-50 rounded-lg border">
                  <h2 className="font-semibold text-lg mb-4">2. 경영성과 지표</h2>
                  {/* 10a당 수량 */}
                  <div className="mb-4">
                    <Label>10a당 수량 (㎏)</Label>
                    <div className="flex gap-2 items-center mb-2">
                      <Input type="number" min="0" value={performance.yield} onChange={e => handlePerformanceChange('yield', e.target.value)} className="w-32" />
                      <span className="text-sm text-muted-foreground">㎏</span>
                    </div>
                    <div className="flex gap-4 flex-wrap">
                      {[1,2,3,4,5].map(level => (
                        <label key={level} className="flex items-center gap-1 cursor-pointer">
                          <input
                            type="radio"
                            name="yieldLevel"
                            value={level}
                            checked={performance.yieldLevel === level}
                            onChange={() => handlePerformanceChange('yieldLevel', level)}
                          />
                          <span className="text-xs">
                            {level === 1 && '2,000㎏ 미만'}
                            {level === 2 && '2,000~3,000㎏'}
                            {level === 3 && '3,000~4,000㎏'}
                            {level === 4 && '4,000~5,000㎏'}
                            {level === 5 && '5,000㎏ 이상'}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                  {/* 수취가격 */}
                  <div className="mb-4">
                    <Label>수취가격 (원/kg)</Label>
                    <div className="flex gap-2 items-center mb-2">
                      <Input type="number" min="0" value={performance.price} onChange={e => handlePerformanceChange('price', e.target.value)} className="w-32" />
                      <span className="text-sm text-muted-foreground">원/kg</span>
                    </div>
                    <div className="flex gap-4 flex-wrap">
                      {[1,2,3,4,5].map(level => (
                        <label key={level} className="flex items-center gap-1 cursor-pointer">
                          <input
                            type="radio"
                            name="priceLevel"
                            value={level}
                            checked={performance.priceLevel === level}
                            onChange={() => handlePerformanceChange('priceLevel', level)}
                          />
                          <span className="text-xs">
                            {level === 1 && '상품가격의 60% 미만'}
                            {level === 2 && '60~70%'}
                            {level === 3 && '70~80%'}
                            {level === 4 && '80~90%'}
                            {level === 5 && '90% 이상'}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                  {/* 경영규모 */}
                  <div className="mb-2">
                    <Label>경영규모 (㎡)</Label>
                    <div className="flex gap-2 items-center mb-2">
                      <Input type="number" min="0" value={performance.scale} onChange={e => handlePerformanceChange('scale', e.target.value)} className="w-32" />
                      <span className="text-sm text-muted-foreground">㎡</span>
                    </div>
                    <div className="flex gap-4 flex-wrap">
                      {[1,2,3,4,5].map(level => (
                        <label key={level} className="flex items-center gap-1 cursor-pointer">
                          <input
                            type="radio"
                            name="scaleLevel"
                            value={level}
                            checked={performance.scaleLevel === level}
                            onChange={() => handlePerformanceChange('scaleLevel', level)}
                          />
                          <span className="text-xs">
                            {level === 1 && '1,000㎡ 미만'}
                            {level === 2 && '1,000~3,000㎡'}
                            {level === 3 && '3,000~5,000㎡'}
                            {level === 4 && '5,000~10,000㎡'}
                            {level === 5 && '10,000㎡ 이상'}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 시설 및 자동화 */}
                <div className="mb-8 p-4 bg-gray-50 rounded-lg border">
                  <h2 className="font-semibold text-lg mb-4">3. 시설 및 자동화</h2>
                  {/* 측고 */}
                  <div className="mb-4">
                    <Label>① 측고</Label>
                    <div className="flex gap-4 flex-wrap mt-2">
                      {[1,2,3,4,5].map(level => (
                        <label key={level} className="flex items-center gap-1 cursor-pointer">
                          <input
                            type="radio"
                            name="heightLevel"
                            value={level}
                            checked={automation.heightLevel === level}
                            onChange={() => handleAutomationChange('heightLevel', level)}
                          />
                          <span className="text-xs">{automationOptions.height[level-1]}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  {/* 보온 및 가온시설 */}
                  <div className="mb-4">
                    <Label>② 보온 및 가온시설</Label>
                    <div className="flex gap-4 flex-wrap mt-2">
                      {[1,2,3,4,5].map(level => (
                        <label key={level} className="flex items-center gap-1 cursor-pointer">
                          <input
                            type="radio"
                            name="heatingLevel"
                            value={level}
                            checked={automation.heatingLevel === level}
                            onChange={() => handleAutomationChange('heatingLevel', level)}
                          />
                          <span className="text-xs">{automationOptions.heating[level-1]}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  {/* 양액공급시스템 */}
                  <div className="mb-4">
                    <Label>③ 양액공급시스템</Label>
                    <div className="flex gap-4 flex-wrap mt-2">
                      {[1,2,3,4,5].map(level => (
                        <label key={level} className="flex items-center gap-1 cursor-pointer">
                          <input
                            type="radio"
                            name="nutrientLevel"
                            value={level}
                            checked={automation.nutrientLevel === level}
                            onChange={() => handleAutomationChange('nutrientLevel', level)}
                          />
                          <span className="text-xs">{automationOptions.nutrient[level-1]}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  {/* 환경 자동화 */}
                  <div className="mb-4">
                    <Label>④ 환경 자동화</Label>
                    <div className="flex gap-4 flex-wrap mt-2">
                      {[1,2,3,4,5].map(level => (
                        <label key={level} className="flex items-center gap-1 cursor-pointer">
                          <input
                            type="radio"
                            name="envAutoLevel"
                            value={level}
                            checked={automation.envAutoLevel === level}
                            onChange={() => handleAutomationChange('envAutoLevel', level)}
                          />
                          <span className="text-xs">{automationOptions.envAuto[level-1]}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  {/* 농작업 생력화 */}
                  <div className="mb-2">
                    <Label>⑤ 농작업 생력화</Label>
                    <div className="flex gap-4 flex-wrap mt-2">
                      {[1,2,3,4,5].map(level => (
                        <label key={level} className="flex items-center gap-1 cursor-pointer">
                          <input
                            type="radio"
                            name="laborLevel"
                            value={level}
                            checked={automation.laborLevel === level}
                            onChange={() => handleAutomationChange('laborLevel', level)}
                          />
                          <span className="text-xs">{automationOptions.labor[level-1]}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 환경관리 */}
                <div className="mb-8 p-4 bg-gray-50 rounded-lg border">
                  <h2 className="font-semibold text-lg mb-4">4. 환경관리</h2>
                  {/* 광관리 */}
                  <div className="mb-4">
                    <Label>① 광관리</Label>
                    <div className="flex gap-4 flex-wrap mt-2">
                      {[1,2,3,4,5].map(level => (
                        <label key={level} className="flex items-center gap-1 cursor-pointer">
                          <input
                            type="radio"
                            name="lightLevel"
                            value={level}
                            checked={env.lightLevel === level}
                            onChange={() => handleEnvChange('lightLevel', level)}
                          />
                          <span className="text-xs">{envOptions.light[level-1]}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  {/* 보온개시 시기 */}
                  <div className="mb-4">
                    <Label>② 보온개시 시기</Label>
                    <div className="flex gap-4 flex-wrap mt-2">
                      {[1,2,3,4,5].map(level => (
                        <label key={level} className="flex items-center gap-1 cursor-pointer">
                          <input
                            type="radio"
                            name="heatingStartLevel"
                            value={level}
                            checked={env.heatingStartLevel === level}
                            onChange={() => handleEnvChange('heatingStartLevel', level)}
                          />
                          <span className="text-xs">{envOptions.heatingStart[level-1]}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  {/* 온·습도 관리 */}
                  <div className="mb-4">
                    <Label>③ 온·습도 관리</Label>
                    <div className="flex gap-4 flex-wrap mt-2">
                      {[1,2,3,4,5].map(level => (
                        <label key={level} className="flex items-center gap-1 cursor-pointer">
                          <input
                            type="radio"
                            name="tempHumidLevel"
                            value={level}
                            checked={env.tempHumidLevel === level}
                            onChange={() => handleEnvChange('tempHumidLevel', level)}
                          />
                          <span className="text-xs">{envOptions.tempHumid[level-1]}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  {/* 탄산가스 시용 */}
                  <div className="mb-4">
                    <Label>④ 탄산가스 시용</Label>
                    <div className="flex gap-4 flex-wrap mt-2">
                      {[1,2,3,4,5].map(level => (
                        <label key={level} className="flex items-center gap-1 cursor-pointer">
                          <input
                            type="radio"
                            name="co2Level"
                            value={level}
                            checked={env.co2Level === level}
                            onChange={() => handleEnvChange('co2Level', level)}
                          />
                          <span className="text-xs">{envOptions.co2[level-1]}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  {/* 베드(배지) 소독 */}
                  <div className="mb-4">
                    <Label>⑤ 베드(배지) 소독</Label>
                    <div className="flex gap-4 flex-wrap mt-2">
                      {[1,2,3,4,5].map(level => (
                        <label key={level} className="flex items-center gap-1 cursor-pointer">
                          <input
                            type="radio"
                            name="bedDisinfectLevel"
                            value={level}
                            checked={env.bedDisinfectLevel === level}
                            onChange={() => handleEnvChange('bedDisinfectLevel', level)}
                          />
                          <span className="text-xs">{envOptions.bedDisinfect[level-1]}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  {/* 관수 */}
                  <div className="mb-4">
                    <Label>⑥ 관수</Label>
                    <div className="flex gap-4 flex-wrap mt-2">
                      {[1,2,3,4,5].map(level => (
                        <label key={level} className="flex items-center gap-1 cursor-pointer">
                          <input
                            type="radio"
                            name="waterLevel"
                            value={level}
                            checked={env.waterLevel === level}
                            onChange={() => handleEnvChange('waterLevel', level)}
                          />
                          <span className="text-xs">{envOptions.water[level-1]}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  {/* 배양액 관리 */}
                  <div className="mb-4">
                    <Label>⑦ 배양액 관리</Label>
                    <div className="flex gap-4 flex-wrap mt-2">
                      {[1,2,3,4,5].map(level => (
                        <label key={level} className="flex items-center gap-1 cursor-pointer">
                          <input
                            type="radio"
                            name="nutrientLevel"
                            value={level}
                            checked={env.nutrientLevel === level}
                            onChange={() => handleEnvChange('nutrientLevel', level)}
                          />
                          <span className="text-xs">{envOptions.nutrient[level-1]}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  {/* 배지(상토) */}
                  <div className="mb-2">
                    <Label>⑧ 배지(상토)</Label>
                    <div className="flex gap-4 flex-wrap mt-2">
                      {[1,2,3,4,5].map(level => (
                        <label key={level} className="flex items-center gap-1 cursor-pointer">
                          <input
                            type="radio"
                            name="soilLevel"
                            value={level}
                            checked={env.soilLevel === level}
                            onChange={() => handleEnvChange('soilLevel', level)}
                          />
                          <span className="text-xs">{envOptions.soil[level-1]}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 작물관리 */}
                <div className="mb-8 p-4 bg-gray-50 rounded-lg border">
                  <h2 className="font-semibold text-lg mb-4">5. 작물관리</h2>
                  {/* 정식시기 */}
                  <div className="mb-4">
                    <Label>① 정식시기</Label>
                    <div className="flex gap-4 flex-wrap mt-2">
                      {[1,2,3,4,5].map(level => (
                        <label key={level} className="flex items-center gap-1 cursor-pointer">
                          <input
                            type="radio"
                            name="plantingLevel"
                            value={level}
                            checked={crop.plantingLevel === level}
                            onChange={() => handleCropChange('plantingLevel', level)}
                          />
                          <span className="text-xs">{cropOptions.planting[level-1]}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  {/* 활착관리 */}
                  <div className="mb-4">
                    <Label>② 활착관리</Label>
                    <div className="flex gap-4 flex-wrap mt-2">
                      {[1,2,3,4,5].map(level => (
                        <label key={level} className="flex items-center gap-1 cursor-pointer">
                          <input
                            type="radio"
                            name="rootingLevel"
                            value={level}
                            checked={crop.rootingLevel === level}
                            onChange={() => handleCropChange('rootingLevel', level)}
                          />
                          <span className="text-xs">{cropOptions.rooting[level-1]}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  {/* 수정 */}
                  <div className="mb-4">
                    <Label>③ 수정</Label>
                    <div className="flex gap-4 flex-wrap mt-2">
                      {[1,2,3,4,5].map(level => (
                        <label key={level} className="flex items-center gap-1 cursor-pointer">
                          <input
                            type="radio"
                            name="pollinationLevel"
                            value={level}
                            checked={crop.pollinationLevel === level}
                            onChange={() => handleCropChange('pollinationLevel', level)}
                          />
                          <span className="text-xs">{cropOptions.pollination[level-1]}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  {/* 병해충 방제 */}
                  <div className="mb-4">
                    <Label>④ 병해충 방제</Label>
                    <div className="flex gap-4 flex-wrap mt-2">
                      {[1,2,3,4,5].map(level => (
                        <label key={level} className="flex items-center gap-1 cursor-pointer">
                          <input
                            type="radio"
                            name="pestLevel"
                            value={level}
                            checked={crop.pestLevel === level}
                            onChange={() => handleCropChange('pestLevel', level)}
                          />
                          <span className="text-xs">{cropOptions.pest[level-1]}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  {/* 적과·적화 */}
                  <div className="mb-2">
                    <Label>⑤ 적과·적화</Label>
                    <div className="flex gap-4 flex-wrap mt-2">
                      {[1,2,3,4,5].map(level => (
                        <label key={level} className="flex items-center gap-1 cursor-pointer">
                          <input
                            type="radio"
                            name="thinningLevel"
                            value={level}
                            checked={crop.thinningLevel === level}
                            onChange={() => handleCropChange('thinningLevel', level)}
                          />
                          <span className="text-xs">{cropOptions.thinning[level-1]}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 경영관리 */}
                <div className="mb-8 p-4 bg-gray-50 rounded-lg border">
                  <h2 className="font-semibold text-lg mb-4">6. 경영관리</h2>
                  {/* 선별 */}
                  <div className="mb-4">
                    <Label>① 선별</Label>
                    <div className="flex gap-4 flex-wrap mt-2">
                      {[1,2,3,4,5].map(level => (
                        <label key={level} className="flex items-center gap-1 cursor-pointer">
                          <input
                            type="radio"
                            name="selectionLevel"
                            value={level}
                            checked={management.selectionLevel === level}
                            onChange={() => handleManagementChange('selectionLevel', level)}
                          />
                          <span className="text-xs">{managementOptions.selection[level-1]}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  {/* 품질인증 */}
                  <div className="mb-4">
                    <Label>② 품질인증</Label>
                    <div className="flex gap-4 flex-wrap mt-2">
                      {[1,2,3,4,5].map(level => (
                        <label key={level} className="flex items-center gap-1 cursor-pointer">
                          <input
                            type="radio"
                            name="qualityLevel"
                            value={level}
                            checked={management.qualityLevel === level}
                            onChange={() => handleManagementChange('qualityLevel', level)}
                          />
                          <span className="text-xs">{managementOptions.quality[level-1]}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  {/* 협업경영 */}
                  <div className="mb-4">
                    <Label>③ 협업경영</Label>
                    <div className="flex gap-4 flex-wrap mt-2">
                      {[1,2,3,4,5].map(level => (
                        <label key={level} className="flex items-center gap-1 cursor-pointer">
                          <input
                            type="radio"
                            name="cooperationLevel"
                            value={level}
                            checked={management.cooperationLevel === level}
                            onChange={() => handleManagementChange('cooperationLevel', level)}
                          />
                          <span className="text-xs">{managementOptions.cooperation[level-1]}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  {/* 경영기록 및 분석 */}
                  <div className="mb-4">
                    <Label>④ 경영기록 및 분석</Label>
                    <div className="flex gap-4 flex-wrap mt-2">
                      {[1,2,3,4,5].map(level => (
                        <label key={level} className="flex items-center gap-1 cursor-pointer">
                          <input
                            type="radio"
                            name="recordLevel"
                            value={level}
                            checked={management.recordLevel === level}
                            onChange={() => handleManagementChange('recordLevel', level)}
                          />
                          <span className="text-xs">{managementOptions.record[level-1]}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  {/* 자금관리 */}
                  <div className="mb-4">
                    <Label>⑤ 자금관리</Label>
                    <div className="flex gap-4 flex-wrap mt-2">
                      {[1,2,3,4,5].map(level => (
                        <label key={level} className="flex items-center gap-1 cursor-pointer">
                          <input
                            type="radio"
                            name="fundLevel"
                            value={level}
                            checked={management.fundLevel === level}
                            onChange={() => handleManagementChange('fundLevel', level)}
                          />
                          <span className="text-xs">{managementOptions.fund[level-1]}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  {/* 농업정보 활용 */}
                  <div className="mb-2">
                    <Label>⑥ 농업정보 활용</Label>
                    <div className="flex gap-4 flex-wrap mt-2">
                      {[1,2,3,4,5].map(level => (
                        <label key={level} className="flex items-center gap-1 cursor-pointer">
                          <input
                            type="radio"
                            name="infoLevel"
                            value={level}
                            checked={management.infoLevel === level}
                            onChange={() => handleManagementChange('infoLevel', level)}
                          />
                          <span className="text-xs">{managementOptions.info[level-1]}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={handleSave}>저장 & 다음</Button>
              </CardFooter>
            </Card>
          </div>

          {/* 우측: 종합평가 진단표 */}
          <div>
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">종합평가 진단표</h2>
              </CardHeader>
              <CardContent>
                <table className="w-full text-center border">
                  <thead>
                    <tr>
                      <th className="border p-1">세부요소</th>
                      <th className="border p-1">선택등급</th>
                      <th className="border p-1">점수</th>
                    </tr>
                  </thead>
                  <tbody>
                    {summaryTable.map(cat => (
                      <React.Fragment key={cat.category}>
                        <tr className="bg-gray-100 font-semibold">
                          <td className="border p-1 text-left" colSpan={3}>{cat.category}</td>
                        </tr>
                        {cat.items.map(item => {
                          const state = { performance, automation, env, crop, management };
                          const level = item.get(state) || 0;
                          return (
                            <tr key={item.key}>
                              <td className="border p-1 text-left">{item.label}</td>
                              <td className="border p-1">{level > 0 ? LEVEL_LABELS[level-1] : '-'}</td>
                              <td className="border p-1">{level > 0 ? level : '-'}</td>
                            </tr>
                          );
                        })}
                      </React.Fragment>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="font-bold">
                      <td className="border p-1 text-right" colSpan={2}>합계</td>
                      <td className="border p-1">
                        {summaryTable.reduce((sum, cat) => sum + cat.items.reduce((catSum, item) => {
                          const state = { performance, automation, env, crop, management };
                          return catSum + (item.get(state) || 0);
                        }, 0), 0)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
} 