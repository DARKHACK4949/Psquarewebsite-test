import type { Region } from "@/lib/region";
import { routesFor } from "@/lib/site";
import { caHome } from "./ca";
import { globalHome } from "./global";
import type { HomeContent } from "./types";

export type { HomeContent, WorkItem } from "./types";

export function homeContent(region: Region): HomeContent {
  const r = routesFor(region);
  return region === "ca" ? caHome(r) : globalHome(r);
}
