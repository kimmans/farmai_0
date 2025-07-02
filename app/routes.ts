import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("common/pages/home.tsx"),
  route("farms/myfarms", "features/pages/farms/myfarms.tsx"),
  route("consulting/:farmId", "features/pages/consulting/consulting-detail.tsx"),
  route("consulting/:farmId/data/:dataType", "features/pages/consulting/consulting-data.tsx"),
  route("consulting/:farmId/diagnosis", "features/pages/consulting/consulting-diagnosis.tsx"),
  route("consulting/:farmId/interview", "features/pages/consulting/consulting-interview.tsx"),
  route("consulting/:farmId/report", "features/pages/consulting/consulting-report.tsx"),
  route("consulting/:farmId/plan", "features/pages/consulting/consulting-plan.tsx"),
  route("consulting/:farmId/final-report", "features/pages/consulting/consulting-final-report.tsx"),
] satisfies RouteConfig;
