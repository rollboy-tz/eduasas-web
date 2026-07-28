// app/auth/[action]/page.tsx

import { AuthForm } from "@/components/forms/auth";
import { AuthAction } from "./config";

type Props = {
  params: Promise<{
    action: string;
  }>;
};

export default async function AuthPage({
  params,
}: Props) {
  const { action } = await params;

  return (
    <AuthForm action={ action as AuthAction } />
  );
}