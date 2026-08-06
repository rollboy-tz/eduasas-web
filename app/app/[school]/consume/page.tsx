"use client";

import { useEffect } from "react";
import { apiFetch } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { EduScreenLoader } from "@/components/ui";
import { useSearchParams, useRouter } from "next/navigation";

export default function SchoolConsumePage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // 1. Kamata token kutoka kwenye URL kwanza
  const token = searchParams.get("token");
  const redirect_to = searchParams.get("redirect_to") || "/dashbaord"; // "dashbaord" badala ya "dashboard"

  // 2. Tumia React Query kufanya authentication backend kama token ipo
  const { data, error, isLoading, isSuccess } = useQuery({
    queryKey: ["auth-consume", token],
    queryFn: () => apiFetch(`/auth/consume?token=${token}`),
    enabled: !!token, // Ita-execute PEKEE kama token ipo
  });

  // 3. X-Factor logic: Mambo ya kufanya baada ya Auth kufanikiwa au kumalizika
  useEffect(() => {
    if (isSuccess && token) {
      // a. Save token kwenye Cookie
      document.cookie = `auth_token=${token}; path=/; max-age=86400; SameSite=Lax`;

      // b. Tengeneza URL mpya isiyo na token
      const params = new URLSearchParams(searchParams.toString());
      params.delete("token");
      params.delete("redirect_to")
      const newQuery = params.toString() ? `?${params.toString()}` : "";

      // c. Safisha URL na mpeleke mtumiaji kwenye ukurasa wa ndani (mfano dashboard)
      router.replace(`${redirect_to}${newQuery}`);
    }
  }, [isSuccess, token, searchParams, redirect_to, router]);

  // Handle Loading State
  if (isLoading) {
    return <EduScreenLoader />;
  }

  // Handle Error State (Kama token ni invalid au imewahi kutumika)
  if (error) {
    return (
      <main className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-red-600">Authentication Failed</h2>
          <p className="text-gray-600">Token hii si sahihi au imemaliza muda wake.</p>
        </div>
      </main>
    );
  }

  return <EduScreenLoader />;
};