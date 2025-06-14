import type { LoaderFunctionArgs } from "react-router";
import type { Farm } from "../farm";

export namespace Route {
  export type LoaderArgs = LoaderFunctionArgs;

  export interface LoaderData {
    farms: Farm[];
  }

  export interface ComponentProps {
    loaderData: LoaderData;
  }
} 