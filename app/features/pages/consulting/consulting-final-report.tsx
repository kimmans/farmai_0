import type { Route } from "../../../+types/consulting";
import { getFarmById } from "../../../services/farm";
import { getConsultingSessionsByFarmId } from "../../../services/consulting";
import { useNavigate, useParams } from "react-router";
import Navigation from "~/common/components/navagation";
import { Card, CardHeader, CardContent, CardFooter } from "~/common/components/ui/card";
import { Button } from "~/common/components/ui/button";
import { Textarea } from "~/common/components/ui/textarea";
import { Label } from "~/common/components/ui/label";
import { ConsultingSessionCard } from "../../components/consulting-session-card";
import { useState } from "react";

export async function loader({ params }: Route.LoaderArgs) {
  const farmId = params.farmId ?? "";
  const [farm, consultingSessions] = await Promise.all([
    getFarmById(farmId),
    getConsultingSessionsByFarmId(farmId)
  ]);
  
  return { farm, consultingSessions };
}

export default function ConsultingFinalReport({ loaderData }: Route.ComponentProps) {
  const { farm, consultingSessions } = loaderData;
  const navigate = useNavigate();
  const { farmId = "" } = useParams();

  const [reportData, setReportData] = useState({
    overallSummary: "",
    keyAchievements: "",
    improvements: "",
    challenges: "",
    recommendations: "",
    nextSteps: "",
    conclusion: ""
  });

  const handleSave = () => {
    // TODO: 최종 보고서 저장 로직 구현
    console.log('최종 보고서 저장:', reportData);
    alert('최종 결과보고서가 저장되었습니다.');
    navigate(`/consulting/${farmId}`);
  };

  const handleBack = () => {
    navigate(`/consulting/${farmId}`);
  };

  const handleGenerateAI = () => {
    // TODO: AI 기반 보고서 자동 생성 로직 구현
    alert('AI 기반 보고서 생성 기능은 개발 중입니다.');
  };

  const handleSessionCardClick = (sessionId: string) => {
    navigate(`/consulting/${farmId}/report?session=${sessionId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation isLoggedIn={true} />
      <main className="container mx-auto px-4 pt-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 왼쪽: 최종 보고서 작성 */}
          <div>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-bold">최종 결과보고서</h1>
                  <Button variant="outline" onClick={handleBack}>
                    뒤로가기
                  </Button>
                </div>
                <p className="text-muted-foreground">
                  {farm.name} - {farm.owner_name} 농장 최종 컨설팅 보고서
                </p>
                <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    총 {consultingSessions.length}회의 컨설팅을 종합하여 최종 결과보고서를 작성합니다.
                  </p>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* 전체 요약 */}
                <div>
                  <Label htmlFor="overallSummary" className="block mb-2">전체 컨설팅 요약</Label>
                  <Textarea
                    id="overallSummary"
                    value={reportData.overallSummary}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => 
                      setReportData(prev => ({ ...prev, overallSummary: e.target.value }))}
                    placeholder="전체 컨설팅 과정에서의 주요 활동과 결과를 요약해주세요."
                    rows={4}
                  />
                </div>

                {/* 주요 성과 */}
                <div>
                  <Label htmlFor="keyAchievements" className="block mb-2">주요 성과 및 개선사항</Label>
                  <Textarea
                    id="keyAchievements"
                    value={reportData.keyAchievements}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => 
                      setReportData(prev => ({ ...prev, keyAchievements: e.target.value }))}
                    placeholder="컨설팅을 통해 달성한 주요 성과와 개선된 부분을 작성해주세요."
                    rows={4}
                  />
                </div>

                {/* 개선 영역 */}
                <div>
                  <Label htmlFor="improvements" className="block mb-2">개선된 영역</Label>
                  <Textarea
                    id="improvements"
                    value={reportData.improvements}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => 
                      setReportData(prev => ({ ...prev, improvements: e.target.value }))}
                    placeholder="환경 관리, 관수 관리, 병해충 관리, 생육 관리 등 개선된 영역을 구체적으로 작성해주세요."
                    rows={4}
                  />
                </div>

                {/* 도전 과제 */}
                <div>
                  <Label htmlFor="challenges" className="block mb-2">도전 과제 및 한계점</Label>
                  <Textarea
                    id="challenges"
                    value={reportData.challenges}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => 
                      setReportData(prev => ({ ...prev, challenges: e.target.value }))}
                    placeholder="컨설팅 과정에서 발견된 도전 과제나 한계점을 작성해주세요."
                    rows={3}
                  />
                </div>

                {/* 향후 권장사항 */}
                <div>
                  <Label htmlFor="recommendations" className="block mb-2">향후 권장사항</Label>
                  <Textarea
                    id="recommendations"
                    value={reportData.recommendations}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => 
                      setReportData(prev => ({ ...prev, recommendations: e.target.value }))}
                    placeholder="농장의 지속적인 발전을 위한 향후 권장사항을 작성해주세요."
                    rows={4}
                  />
                </div>

                {/* 다음 단계 */}
                <div>
                  <Label htmlFor="nextSteps" className="block mb-2">다음 단계 및 계획</Label>
                  <Textarea
                    id="nextSteps"
                    value={reportData.nextSteps}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => 
                      setReportData(prev => ({ ...prev, nextSteps: e.target.value }))}
                    placeholder="앞으로의 농장 운영 계획과 다음 단계를 작성해주세요."
                    rows={3}
                  />
                </div>

                {/* 결론 */}
                <div>
                  <Label htmlFor="conclusion" className="block mb-2">결론</Label>
                  <Textarea
                    id="conclusion"
                    value={reportData.conclusion}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => 
                      setReportData(prev => ({ ...prev, conclusion: e.target.value }))}
                    placeholder="전체 컨설팅의 결론과 최종 평가를 작성해주세요."
                    rows={3}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex gap-2 justify-end">
                <Button variant="outline" onClick={handleGenerateAI}>
                  AI 보고서 생성
                </Button>
                <Button variant="outline" onClick={handleBack}>
                  취소
                </Button>
                <Button onClick={handleSave}>
                  보고서 저장
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* 오른쪽: 지난 컨설팅 기록 */}
          <div>
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">지난 컨설팅 기록</h2>
                <p className="text-sm text-muted-foreground">
                  클릭하여 각 회차별 상세 내용을 확인할 수 있습니다.
                </p>
              </CardHeader>
              <CardContent>
                {consultingSessions.length > 0 ? (
                  <div className="space-y-4">
                    {consultingSessions.map((session, index) => (
                      <ConsultingSessionCard
                        key={session.consulting_id}
                        session={session}
                        sessionNumber={consultingSessions.length - index}
                        onClick={() => handleSessionCardClick(session.consulting_id)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>아직 컨설팅 기록이 없습니다.</p>
                    <p className="text-sm mt-2">첫 번째 컨설팅을 시작해보세요!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
} 