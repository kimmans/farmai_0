// 딸기 매뉴얼 YAML 로드
export async function loadStrawberryManualYaml(): Promise<string> {
  // 실제로는 서버/DB에서 불러오거나, 임시로 하드코딩
  return `
# 딸기 재배 매뉴얼
환경: 온도 20~25도, 습도 60~80% ...
관수: EC 1.2~1.8, pH 5.8~6.2 ...
병해충: 진딧물, 응애, 곰팡이 ...
경영: 수확량, 판매량, 비용 ...
`;
}

// 기존 컨설팅 기록 로드
export async function loadPreviousConsultingReports(farmId: string): Promise<string[]> {
  // 실제로는 DB에서 불러오거나, 임시로 하드코딩
  return [
    "2024-05-01: 환경 관리 개선 필요",
    "2024-04-10: 관수 시스템 점검 권장",
    "2024-03-15: 병해충 방제 강화"
  ];
} 