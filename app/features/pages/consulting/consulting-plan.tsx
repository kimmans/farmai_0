import type { Route } from "../../../+types/consulting";
import { getFarmById } from "../../../services/farm";
import { getConsultingSessionsByFarmId } from "../../../services/consulting";
import { useNavigate, useParams } from "react-router";
import Navigation from "~/common/components/navagation";
import { Card, CardHeader, CardContent, CardFooter } from "~/common/components/ui/card";
import { Button } from "~/common/components/ui/button";
import { Input } from "~/common/components/ui/input";
import { Label } from "~/common/components/ui/label";
import { Textarea } from "~/common/components/ui/textarea";
import { useState } from "react";

export async function loader({ params }: Route.LoaderArgs) {
  const farmId = params.farmId ?? "";
  const [farm, consultingSessions] = await Promise.all([
    getFarmById(farmId),
    getConsultingSessionsByFarmId(farmId)
  ]);
  
  return { farm, consultingSessions };
}

export default function ConsultingPlan({ loaderData }: Route.ComponentProps) {
  const { farm, consultingSessions } = loaderData;
  const navigate = useNavigate();
  const { farmId = "" } = useParams();

  const [planData, setPlanData] = useState({
    totalSessions: consultingSessions.length + 1,
    startDate: new Date().toISOString().split('T')[0],
    endDate: "",
    objectives: "",
    focusAreas: "",
    schedule: "",
    budget: "",
    notes: ""
  });

  const handleSave = () => {
    // TODO: 계획서 저장 로직 구현
    console.log('컨설팅 계획서 저장:', planData);
    alert('컨설팅 계획서가 저장되었습니다.');
    navigate(`/consulting/${farmId}`);
  };

  const handleBack = () => {
    navigate(`/consulting/${farmId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation isLoggedIn={true} />
      <main className="container mx-auto px-4 pt-32">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">컨설팅 계획서</h1>
                <Button variant="outline" onClick={handleBack}>
                  뒤로가기
                </Button>
              </div>
              <p className="text-muted-foreground">
                {farm.name} - {farm.owner_name} 농장 컨설팅 계획서
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 기본 정보 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="totalSessions">총 컨설팅 회차</Label>
                  <Input
                    id="totalSessions"
                    type="number"
                    value={planData.totalSessions}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPlanData(prev => ({ ...prev, totalSessions: parseInt(e.target.value) }))}
                    min="1"
                  />
                </div>
                <div>
                  <Label htmlFor="startDate">시작일</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={planData.startDate}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPlanData(prev => ({ ...prev, startDate: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="endDate">종료일</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={planData.endDate}
                    onChange={(e) => setPlanData(prev => ({ ...prev, endDate: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="budget">예산 (원)</Label>
                  <Input
                    id="budget"
                    type="number"
                    value={planData.budget}
                    onChange={(e) => setPlanData(prev => ({ ...prev, budget: e.target.value }))}
                    placeholder="예상 비용"
                  />
                </div>
              </div>

              {/* 컨설팅 목표 */}
              <div>
                <Label htmlFor="objectives" className="block mb-2">컨설팅 목표</Label>
                <Textarea
                  id="objectives"
                  value={planData.objectives}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setPlanData(prev => ({ ...prev, objectives: e.target.value }))}
                  placeholder="이번 컨설팅을 통해 달성하고자 하는 목표를 작성해주세요."
                  rows={3}
                />
              </div>

              {/* 중점 영역 */}
              <div>
                <Label htmlFor="focusAreas" className="block mb-2">중점 관리 영역</Label>
                <Textarea
                  id="focusAreas"
                  value={planData.focusAreas}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setPlanData(prev => ({ ...prev, focusAreas: e.target.value }))}
                  placeholder="환경 관리, 관수 관리, 병해충 관리, 생육 관리 등 중점적으로 관리할 영역을 작성해주세요."
                  rows={3}
                />
              </div>

              {/* 일정 */}
              <div>
                <Label htmlFor="schedule" className="block mb-2">컨설팅 일정</Label>
                <Textarea
                  id="schedule"
                  value={planData.schedule}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setPlanData(prev => ({ ...prev, schedule: e.target.value }))}
                  placeholder="각 회차별 예상 일정과 주요 활동을 작성해주세요."
                  rows={8}
                />
              </div>

              {/* 기타 참고사항 */}
              <div>
                <Label htmlFor="notes" className="block mb-2">기타 참고사항</Label>
                <Textarea
                  id="notes"
                  value={planData.notes}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setPlanData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="농장 특성, 특별한 요구사항, 주의사항 등을 작성해주세요."
                  rows={3}
                />
              </div>

              {/* 기존 컨설팅 기록 요약 */}
              {consultingSessions.length > 0 && (
                <div>
                  <Label>기존 컨설팅 기록 요약</Label>
                  <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      총 {consultingSessions.length}회의 컨설팅이 진행되었습니다.
                    </p>
                    <div className="mt-2 space-y-1">
                      {consultingSessions.slice(0, 3).map((session, index) => (
                        <div key={session.consulting_id} className="text-sm">
                          • 제 {consultingSessions.length - index}회: {new Date(session.visit_date).toLocaleDateString()} 
                          ({session.status === 'diagnosis' ? '진단' : session.status === 'analysis' ? '분석' : '해결'})
                        </div>
                      ))}
                      {consultingSessions.length > 3 && (
                        <div className="text-sm text-muted-foreground">
                          ... 외 {consultingSessions.length - 3}회
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex gap-2 justify-end">
              <Button variant="outline" onClick={handleBack}>
                취소
              </Button>
              <Button onClick={handleSave}>
                계획서 저장
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
} 