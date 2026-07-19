// app/auth/[action]/layout.tsx

import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  authConfig,
  type AuthAction,
} from "./config";

type Props = {
  children: React.ReactNode;

  params: Promise<{
    action: string;
  }>;
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { action } = await params;

  const config = authConfig[action as AuthAction];

  if (!config) {
    return {
      title: "Auth",
    };
  }

  return {
    ...config.metadata,

    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function AuthLayout({
  children,
  params,
}: Props) {
  const { action } = await params;

  if (!authConfig[action as AuthAction]) {
    notFound();
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-background p-4">
      {children}
    </main>
  );
}