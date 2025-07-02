import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("common/pages/home.tsx"),
  route("farms/myfarms", "features/pages/farms/myfarms.tsx"),
  route("consulting/:farmId", "features/pages/consulting/consulting-detail.tsx"),
  route("consulting/:farmId/data/:dataType", "features/pages/consulting/consulting-data.tsx"),
  route("consulting/:farmId/interview", "features/pages/consulting/consulting-interview.tsx"),
  route("consulting/:farmId/report", "features/pages/consulting/consulting-report.tsx"),
] satisfies RouteConfig;
