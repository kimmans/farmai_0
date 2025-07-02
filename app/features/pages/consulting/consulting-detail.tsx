import type { Route } from "../../../+types/consulting";
import { getFarmById } from "../../../services/farm";
import { getConsultingSessionsByFarmId } from "../../../services/consulting";
import { useNavigate, useParams } from "react-router";
import Navigation from "~/common/components/navagation";
import { Card, CardHeader, CardContent, CardFooter } from "~/common/components/ui/card";
import { Button } from "~/common/components/ui/button";
import { ConsultingSessionCard } from "~/features/components/consulting-session-card";

// 컨설팅 날짜 저장
function saveConsultingDate(farmId: string) {
  if (typeof window === 'undefined') {
    return;
  }
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD 형식
  localStorage.setItem(`consulting_date_${farmId}`, today);
  console.log(`컨설팅 날짜 저장: ${today} (농장 ID: ${farmId})`);
}

// 컨설팅 날짜 불러오기
export function getConsultingDate(farmId: string): string {
  if (typeof window === 'undefined') {
    return new Date().toISOString().split('T')[0];
  }
  const savedDate = localStorage.getItem(`consulting_date_${farmId}`);
  return savedDate || new Date().toISOString().split('T')[0];
}

export async function loader({ params }: Route.LoaderArgs) {
  const farmId = params.farmId ?? "";
  const [farm, consultingSessions] = await Promise.all([
    getFarmById(farmId),
    getConsultingSessionsByFarmId(farmId)
  ]);
  
  return { farm, consultingSessions };
}

export default function ConsultingDetail({ loaderData }: Route.ComponentProps) {
  const { farm, consultingSessions } = loaderData;
  const navigate = useNavigate();
  const { farmId = "" } = useParams();

  // 컨설팅 시작일 불러오기
  const consultingDate = getConsultingDate(farmId);

  const handleStartConsulting = () => {
    // 컨설팅 시작 시 오늘 날짜 저장
    saveConsultingDate(farmId);
    // 다음 단계로 이동
    navigate(`/consulting/${farmId}/data/environment`);
  };

  const handleCreatePlan = () => {
    navigate(`/consulting/${farmId}/plan`);
  };

  const handleStartSessionConsulting = () => {
    saveConsultingDate(farmId);
    navigate(`/consulting/${farmId}/data/environment`);
  };

  const handleCreateFinalReport = () => {
    navigate(`/consulting/${farmId}/final-report`);
  };

  const handleSessionCardClick = (sessionId: string) => {
    navigate(`/consulting/${farmId}/report?session=${sessionId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation isLoggedIn={true} />
      <main className="container mx-auto px-4 pt-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 왼쪽: 농장 정보 */}
          <div>
            <Card>
              <CardHeader>
                <h1 className="text-2xl font-bold">농장 기본정보</h1>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <span className="text-muted-foreground">농장명</span>
                  <span>{farm.name}</span>
                  <span className="text-muted-foreground">농장주</span>
                  <span>{farm.owner_name}</span>
                  <span className="text-muted-foreground">재배작물</span>
                  <span>{farm.crop}</span>
                  <span className="text-muted-foreground">위치</span>
                  <span>{farm.location}</span>
                  <span className="text-muted-foreground">면적</span>
                  <span>{farm.size ?? "-"} ㎡</span>
                  <span className="text-muted-foreground">최근 업데이트</span>
                  <span>{new Date(farm.updated_at).toLocaleDateString()}</span>
                  <span className="text-muted-foreground">컨설팅 시작일</span>
                  <span>{consultingDate || "-"}</span>
                  <span className="text-muted-foreground">농장주 연락처</span>
                  <span>010-****-****</span>
                  <span className="text-muted-foreground">농장 사진</span>
                  <span className="text-muted-foreground">(미구현)</span>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-2">
                <div className="flex gap-2 w-full">
                  <Button 
                    onClick={handleCreatePlan}
                    className="flex-1"
                    variant="outline"
                  >
                    컨설팅 계획서 작성
                  </Button>
                  <Button 
                    onClick={handleStartSessionConsulting}
                    className="flex-1"
                  >
                    회차별 컨설팅 시작
                  </Button>
                </div>
                <Button 
                  onClick={handleCreateFinalReport}
                  className="w-full"
                  variant="secondary"
                >
                  최종 결과보고서 작성
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* 오른쪽: 지난 컨설팅 기록 */}
          <div>
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">지난 컨설팅 기록</h2>
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