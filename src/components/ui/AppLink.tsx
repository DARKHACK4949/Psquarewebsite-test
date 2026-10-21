import Link from "next/link";
import type { ComponentProps } from "react";
import { isBuilt } from "@/lib/site";

/**
 * next/link that only prefetches pages which exist in this phase. Links to
 * later-phase pages (Work, About, ...) stay plain until those routes ship.
 */
export function AppLink({ prefetch, ...props }: ComponentProps<typeof Link>) {
  const href = typeof props.href === "string" ? props.href : (props.href.pathname ?? "");
  return <Link prefetch={isBuilt(href) ? prefetch : false} {...props} />;
}
