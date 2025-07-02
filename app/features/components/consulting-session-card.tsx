import { Card, CardHeader, CardContent } from "~/common/components/ui/card";
import { Badge } from "~/common/components/ui/badge";
import type { ConsultingSession } from "~/+types/consulting";

interface ConsultingSessionCardProps {
  session: ConsultingSession;
  sessionNumber: number;
  onClick?: () => void;
}

export function ConsultingSessionCard({ session, sessionNumber, onClick }: ConsultingSessionCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'diagnosis':
        return 'bg-blue-100 text-blue-800';
      case 'analysis':
        return 'bg-yellow-100 text-yellow-800';
      case 'solution':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'diagnosis':
        return '진단';
      case 'analysis':
        return '분석';
      case 'solution':
        return '해결';
      default:
        return status;
    }
  };

  return (
    <Card 
      className={`cursor-pointer hover:shadow-md transition-shadow ${onClick ? 'hover:bg-gray-50' : ''}`}
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg">제 {sessionNumber}회 컨설팅</h3>
          <Badge className={getStatusColor(session.status)}>
            {getStatusText(session.status)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">방문일:</span>
            <span>{new Date(session.visit_date).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">생성일:</span>
            <span>{new Date(session.created_at).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">최종 수정:</span>
            <span>{new Date(session.updated_at).toLocaleDateString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 