import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import Navigation from "~/common/components/navagation";
import { Card, CardHeader, CardContent } from "~/common/components/ui/card";
import { Button } from "~/common/components/ui/button";
import { getFarmById } from "../../../services/farm";
import { generateConsultingReport } from "~/services/consulting";

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

export default function ConsultingReport() {
  const { farmId = "" } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState<ConsultingReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [farmData, setFarmData] = useState<any>(null);

  useEffect(() => {
    const loadReport = async () => {
      try {
        setIsLoading(true);
        const farm = await getFarmById(farmId);
        setFarmData(farm);
        
        // 컨설팅 보고서 생성
        const generatedReport = await generateConsultingReport(farm, farmId);
        setReport(generatedReport);
      } catch (e) {
        console.error("보고서 생성 실패:", e);
        setError("보고서를 생성할 수 없습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    if (farmId) {
      loadReport();
    }
  }, [farmId]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // PDF 다운로드 기능 (추후 구현)
    alert("PDF 다운로드 기능은 추후 구현 예정입니다.");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation isLoggedIn={true} />
        <main className="container mx-auto px-4 pt-32">
          <div className="text-center py-20">
            <div className="text-2xl font-bold mb-4">보고서 생성 중...</div>
            <div className="text-muted-foreground">AI가 컨설팅 보고서를 작성하고 있습니다.</div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation isLoggedIn={true} />
        <main className="container mx-auto px-4 pt-32">
          <div className="text-center py-20">
            <div className="text-2xl font-bold mb-4 text-red-600">오류 발생</div>
            <div className="text-muted-foreground mb-4">{error}</div>
            <Button onClick={() => navigate(`/consulting/${farmId}/interview`)}>
              인터뷰로 돌아가기
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation isLoggedIn={true} />
      <main className="container mx-auto px-4 pt-32 pb-20">
        {/* 인쇄 버튼 */}
        <div className="mb-6 flex gap-2 print:hidden">
          <Button onClick={handlePrint}>🖨️ 인쇄</Button>
          <Button variant="outline" onClick={handleDownload}>📄 PDF 다운로드</Button>
          <Button variant="outline" onClick={() => navigate(`/consulting/${farmId}/interview`)}>
            ← 인터뷰로 돌아가기
          </Button>
        </div>

        {/* A4 보고서 */}
        <div className="max-w-[210mm] mx-auto bg-white shadow-lg print:shadow-none">
          {/* 1페이지: 헤더 + 컨설팅 정보 + 데이터 요약 */}
          <div className="p-8 print:p-0 print:mb-8">
            {/* 헤더 */}
            <div className="text-center mb-8 border-b pb-6">
              <h1 className="text-3xl font-bold mb-2">농업 컨설팅 보고서</h1>
              <p className="text-lg text-muted-foreground">Smart Farm Consulting Report</p>
            </div>

            {/* 1. 컨설팅 정보 */}
            <Card className="mb-8">
              <CardHeader>
                <h2 className="text-xl font-bold">1. 컨설팅 정보</h2>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="font-medium">컨설팅 일자:</span> {report.consultingInfo.date}
                  </div>
                  <div>
                    <span className="font-medium">컨설팅 시간:</span> {report.consultingInfo.time}
                  </div>
                  <div>
                    <span className="font-medium">컨설팅 대상:</span> {report.consultingInfo.target}
                  </div>
                  <div>
                    <span className="font-medium">담당 컨설턴트:</span> {report.consultingInfo.consultant}
                  </div>
                  <div className="col-span-2">
                    <span className="font-medium">장소:</span> {report.consultingInfo.location}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 2. 주요 데이터 요약 */}
            <Card className="mb-8">
              <CardHeader>
                <h2 className="text-xl font-bold">2. 주요 데이터 요약</h2>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">환경 데이터</h3>
                    <ul className="text-sm space-y-1">
                      <li>• 주간 온도: {farmData?.environmentData?.dayTemp || report.dataSummary.environment.dayTemp}</li>
                      <li>• 야간 온도: {farmData?.environmentData?.nightTemp || report.dataSummary.environment.nightTemp}</li>
                      <li>• 습도: {farmData?.environmentData?.humidity || report.dataSummary.environment.humidity}</li>
                      <li>• CO2 농도: {farmData?.environmentData?.co2 || report.dataSummary.environment.co2}</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">관수 데이터</h3>
                    <ul className="text-sm space-y-1">
                      <li>• 공급 EC: {farmData?.irrigationData?.supplyEC || report.dataSummary.irrigation.supplyEC}</li>
                      <li>• 공급 pH: {farmData?.irrigationData?.supplyPH || report.dataSummary.irrigation.supplyPH}</li>
                      <li>• 배액 EC: {farmData?.irrigationData?.drainEC || report.dataSummary.irrigation.drainEC}</li>
                      <li>• 수분 함량: {farmData?.irrigationData?.moisture || report.dataSummary.irrigation.moisture}</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">생육 데이터</h3>
                    <ul className="text-sm space-y-1">
                      <li>• 생육 단계: {farmData?.growthData?.stage || report.dataSummary.growth.stage}</li>
                      <li>• 생산량: {farmData?.managementData?.production || report.dataSummary.growth.production}</li>
                      <li>• 솎음 작업: {farmData?.growthData?.thinning || "정보 없음"}</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">병해충 데이터</h3>
                    <ul className="text-sm space-y-1">
                      <li>• 발생 병해: {farmData?.pestControlData?.diseases || "정보 없음"}</li>
                      <li>• 발생 해충: {farmData?.pestControlData?.pests || "정보 없음"}</li>
                      <li>• 발생 부위: {farmData?.pestControlData?.affectedParts || "정보 없음"}</li>
                      <li>• 방제 방법: {farmData?.pestControlData?.controlMethod || "정보 없음"}</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">경영 데이터</h3>
                    <ul className="text-sm space-y-1">
                      <li>• 판매량: {farmData?.managementData?.sales || report.dataSummary.management.sales}</li>
                      <li>• 판매 금액: {farmData?.managementData?.salesAmount || report.dataSummary.management.salesAmount}</li>
                      <li>• 생산 비용: {farmData?.managementData?.productionCost || report.dataSummary.management.productionCost}</li>
                      <li>• 순이익: {farmData?.managementData?.netProfit || report.dataSummary.management.netProfit}</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 2페이지: 진단 사항 + 요청 사항 */}
          <div className="p-8 print:p-0 print:mb-8">
            {/* 3. 진단 사항 */}
            <Card className="mb-8">
              <CardHeader>
                <h2 className="text-xl font-bold">3. 진단 사항</h2>
                <div className="flex items-center gap-4">
                  <span className="text-2xl font-bold text-blue-600">{report.diagnosis.overallScore}점</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    report.diagnosis.overallStatus === '우수' ? 'bg-green-100 text-green-800' :
                    report.diagnosis.overallStatus === '양호' ? 'bg-blue-100 text-blue-800' :
                    report.diagnosis.overallStatus === '보통' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {report.diagnosis.overallStatus}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {[
                    { title: '환경 관리', data: report.diagnosis.environment },
                    { title: '관수 관리', data: report.diagnosis.irrigation },
                    { title: '생육 관리', data: report.diagnosis.growth },
                    { title: '병해충 관리', data: report.diagnosis.pestControl }
                  ].map((item, idx) => (
                    <div key={idx} className="border rounded p-4">
                      <h3 className="font-semibold mb-2">{item.title}</h3>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg font-bold">{item.data.score}점</span>
                        <span className={`px-2 py-1 rounded text-xs ${
                          item.data.status === '우수' ? 'bg-green-100 text-green-800' :
                          item.data.status === '양호' ? 'bg-blue-100 text-blue-800' :
                          item.data.status === '보통' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {item.data.status}
                        </span>
                      </div>
                      <ul className="text-sm space-y-1">
                        {item.data.issues.map((issue, i) => (
                          <li key={i}>• {issue}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <h3 className="font-semibold mb-2 text-green-700">강점</h3>
                    <ul className="text-sm space-y-1">
                      {report.diagnosis.strengths.map((strength, i) => (
                        <li key={i}>• {strength}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2 text-orange-700">약점</h3>
                    <ul className="text-sm space-y-1">
                      {report.diagnosis.weaknesses.map((weakness, i) => (
                        <li key={i}>• {weakness}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2 text-red-700">위험 요소</h3>
                    <ul className="text-sm space-y-1">
                      {report.diagnosis.risks.map((risk, i) => (
                        <li key={i}>• {risk}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 4. 요청 사항 */}
            <Card className="mb-8">
              <CardHeader>
                <h2 className="text-xl font-bold">4. 요청 사항</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-2">주요 관심사</h3>
                    <ul className="space-y-1">
                      {report.requests.mainConcerns.map((concern, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-blue-600 font-medium">{i + 1}.</span>
                          <span>{concern}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">우선순위 질문</h3>
                    <div className="space-y-3">
                      {report.requests.priorityQuestions.map((q, i) => (
                        <div key={i} className="border rounded p-3">
                          <div className="font-medium mb-1">{q.question}</div>
                          <div className="flex gap-4 text-sm text-muted-foreground">
                            <span>분류: {q.category}</span>
                            <span>우선순위: {q.priority}</span>
                            <span>복잡도: {q.complexity}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">컨설팅 집중 영역</h3>
                    <ul className="space-y-1">
                      {report.requests.focusAreas.map((area, i) => (
                        <li key={i}>• {area}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 3페이지: 조치 사항 + 향후 계획 */}
          <div className="p-8 print:p-0">
            {/* 5. 조치 사항 */}
            <Card className="mb-8">
              <CardHeader>
                <h2 className="text-xl font-bold">5. 조치 사항 (솔루션)</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-3">권장사항</h3>
                    <div className="space-y-4">
                      {report.solutions.recommendations.map((rec, i) => (
                        <div key={i} className="border rounded p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium">{rec.title}</h4>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              rec.priority === '높음' ? 'bg-red-100 text-red-800' :
                              rec.priority === '보통' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {rec.priority}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{rec.description}</p>
                          <div className="flex gap-4 text-xs text-muted-foreground">
                            <span>기간: {rec.timeline}</span>
                            <span>비용: {rec.cost}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">액션 아이템</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2">액션</th>
                            <th className="text-left py-2">담당자</th>
                            <th className="text-left py-2">마감일</th>
                            <th className="text-left py-2">상태</th>
                          </tr>
                        </thead>
                        <tbody>
                          {report.solutions.actionItems.map((item, i) => (
                            <tr key={i} className="border-b">
                              <td className="py-2">{item.action}</td>
                              <td className="py-2">{item.responsible}</td>
                              <td className="py-2">{item.deadline}</td>
                              <td className="py-2">
                                <span className={`px-2 py-1 rounded text-xs ${
                                  item.status === '완료' ? 'bg-green-100 text-green-800' :
                                  item.status === '진행중' ? 'bg-blue-100 text-blue-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {item.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 6. 향후 계획 */}
            <Card>
              <CardHeader>
                <h2 className="text-xl font-bold">6. 향후 계획</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <h3 className="font-semibold mb-2 text-blue-700">단기 계획 (1-3개월)</h3>
                      <ul className="text-sm space-y-1">
                        {report.futurePlans.shortTerm.map((plan, i) => (
                          <li key={i}>• {plan}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2 text-green-700">중기 계획 (3-12개월)</h3>
                      <ul className="text-sm space-y-1">
                        {report.futurePlans.mediumTerm.map((plan, i) => (
                          <li key={i}>• {plan}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2 text-purple-700">장기 계획 (1년 이상)</h3>
                      <ul className="text-sm space-y-1">
                        {report.futurePlans.longTerm.map((plan, i) => (
                          <li key={i}>• {plan}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">주요 마일스톤</h3>
                    <div className="space-y-3">
                      {report.futurePlans.milestones.map((milestone, i) => (
                        <div key={i} className="border rounded p-3">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium">{milestone.milestone}</h4>
                            <span className="text-sm text-muted-foreground">{milestone.targetDate}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{milestone.successCriteria}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
} 