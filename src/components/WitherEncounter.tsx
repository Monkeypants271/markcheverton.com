"use client";

import { usePathname } from "next/navigation";
import { WitherPeek } from "@/components/WitherPeek";

const WITHER_PATHS = new Set([
  "/",
  "/about",
  "/books",
  "/contact",
  "/fanfic",
  "/minecraft-books",
  "/writing-resources",
]);

export function WitherEncounter() {
  const pathname = usePathname();

  return WITHER_PATHS.has(pathname) ? <WitherPeek key={pathname} /> : null;
}
