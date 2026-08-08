'use client';

import { useSystemListeners } from "@/store/layout/useSystemListener";

export function Providers({ children }: { children: React.ReactNode }) {
  useSystemListeners();
  return <>{children}</>;
}