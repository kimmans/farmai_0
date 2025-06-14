import { Link } from "react-router";
import { Card, CardHeader } from "~/common/components/ui/card";

interface FarmCardProps {
  id: string;
  name: string;
  location: string;
  ownerName: string;
  lastUpdated: string;
}

export default function FarmCard({ id, name, location, ownerName, lastUpdated }: FarmCardProps) {
  return (
    <Link to={`/farms/consulting/${id}`}>
      <Card className="hover:bg-muted/50 transition-colors">
        <CardHeader>
          <div className="space-y-2">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">{name}</h3>
                <p className="text-sm text-muted-foreground">{location}</p>
              </div>
              <span className="text-sm text-muted-foreground">{lastUpdated}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">소유자:</span>
              <span className="text-sm">{ownerName}</span>
            </div>
          </div>
        </CardHeader>
      </Card>
    </Link>
  );
} 