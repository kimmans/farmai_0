import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("common/pages/home.tsx"),
  route("farms/myfarms", "features/pages/farms/myfarms.tsx"),
  route("farms/consulting/:farmId", "common/pages/consulting.tsx"),
] satisfies RouteConfig;
