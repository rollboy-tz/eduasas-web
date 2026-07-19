// src/app/auth/oauth/google/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const stateEncoded = searchParams.get("state") || "{}";

  // 1. Kuchambua State mapema ili kujua backUrl
  let backUrl = "/auth/sign-in"; // Default yetu
  try {
    const state = JSON.parse(decodeURIComponent(stateEncoded));
    // Kama backUrl ipo kwenye state (mfano: "sign-up"), itumie hio
    if (state.backUrl) {
      backUrl = state.backUrl.startsWith("/") ? state.backUrl : `/auth/${state.backUrl}`;
    }
  } catch (e) {
    console.error("❌ Failed to decode state: ", e);
  }

  // 2. Kama mtumiaji kaghairi (Hakuna Code)
  if (!code) {
    // Badala ya kumpeleka sign-in tu, tunatumia backUrl iliyokuja na state
    return NextResponse.redirect(new URL(`${backUrl}?error=access_denied`, origin));
  }

  // 3. Kama kila kitu kiko sawa, nenda kwenye Callback Page
  // Tunapitisha code na state nzima ili callback iwe na kila kitu
  const callbackUrl = new URL("/auth/oauth/callback", origin);
  callbackUrl.searchParams.set("code", code);
  callbackUrl.searchParams.set("state", stateEncoded);

  return NextResponse.redirect(callbackUrl);
}