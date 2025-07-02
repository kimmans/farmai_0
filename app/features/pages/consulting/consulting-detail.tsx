import type { Route } from "../../../+types/consulting";
import { getFarmById } from "../../../services/farm";
import { useNavigate, useParams } from "react-router";
import Navigation from "~/common/components/navagation";
import { Card, CardHeader, CardContent, CardFooter } from "~/common/components/ui/card";
import { Button } from "~/common/components/ui/button";

// 컨설팅 날짜 저장
function saveConsultingDate(farmId: string) {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD 형식
  localStorage.setItem(`consulting_date_${farmId}`, today);
  console.log(`컨설팅 날짜 저장: ${today} (농장 ID: ${farmId})`);
}

// 컨설팅 날짜 불러오기
export function getConsultingDate(farmId: string): string {
  const savedDate = localStorage.getItem(`consulting_date_${farmId}`);
  return savedDate || new Date().toISOString().split('T')[0];
}

export async function loader({ params }: Route.LoaderArgs) {
  const farm = await getFarmById(params.farmId ?? "");
  return { farm };
}

export default function ConsultingDetail({ loaderData }: Route.ComponentProps) {
  const { farm } = loaderData;
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

  return (
    <div className="min-h-screen bg-background">
      <Navigation isLoggedIn={true} />
      <main className="container mx-auto px-4 pt-32 flex flex-col items-center">
        <div className="w-full max-w-xl">
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
            <CardFooter className="flex gap-2 justify-end">
              <Button onClick={handleStartConsulting}>
                컨설팅 시작하기
              </Button>
              <Button variant="outline" onClick={() => navigate(`/consulting/${farmId}/report`)}>
                컨설팅 기록 보기
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
} 