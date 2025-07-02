import type { LoaderFunctionArgs } from "react-router";
import type { Farm } from "./farm";

export interface ConsultingSession {
  consulting_id: string;
  farm_id: string;
  consultant_id: string | null;
  visit_date: string;
  status: 'diagnosis' | 'analysis' | 'solution';
  created_at: string;
  updated_at: string;
}

export namespace Route {
  export type LoaderArgs = LoaderFunctionArgs;

  export interface LoaderData {
    farm: Farm;
    consultingSessions: ConsultingSession[];
  }

  export interface ComponentProps {
    loaderData: LoaderData;
  }
} 