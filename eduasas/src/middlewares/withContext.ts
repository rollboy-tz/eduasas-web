// path: src/middlewares/withContext.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * PRO SCHOOL CONTEXT MIDDLEWARE
 * Kazi: Kuhakikisha URL Code na Session ya API zinasoma shule moja.
 */
export const withContext = async (request: NextRequest) => {
  const { pathname } = request.nextUrl;

  // 1. FILTER: Tunashughulika na URL za shule pekee (/s/[code])
  if (pathname.startsWith('/s/')) {
    const segments = pathname.split('/');
    const schoolCodeFromUrl = segments[2]; // Mfano: "568900"

    // Kama tuko kwenye mzizi wa /s tayari, ruka (avoid loop)
    if (segments.length === 3 && segments[2] === '') return null;

    const authToken = request.cookies.get('auth_token')?.value;
    if (!authToken) return null;

    try {
      // 2. API VALIDATION: Uliza API shule gani iko active kwenye session
      // Tunatumia fetch kwa sababu tuko kwenye Edge Runtime
      const apiRes = await fetch(`${process.env.PUBLIC_API_URL}/school/context`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'x-refresh-token': request.cookies.get('refresh_token')?.value || '',
          'Content-Type': 'application/json',
        },
        // Muhimu: Zuia caching ili tupate data fresh kila wakati
        cache: 'no-store',
      });

      if (!apiRes.ok) {
        // Ikitokea session ni mbovu, mrudishe user kwenye list ya shule
        console.warn("[Context] API returned error, redirecting to school list.");
        return NextResponse.redirect(new URL('/s', request.url));
      }

      const { data } = await apiRes.json();
      const activeSchoolId = data?.schoolId; // Mfano: "SCH-568900"

      // 3. LOGIC CHECK: Je, namba za mwisho za ID zinafanana na URL?
      const isCorrectContext = activeSchoolId && activeSchoolId.endsWith(schoolCodeFromUrl);

      if (!isCorrectContext) {
        console.info(`[Context Mismatch] URL: ${schoolCodeFromUrl} != Session: ${activeSchoolId}`);

        // 4. AUTO-SYNC REDIRECT
        // Tunampeleka kwenye Switcher akiwa na schoolId kamili
        const switcherUrl = new URL('/s', request.url);
        
        // Tunatengeneza UID ya shule kitalamu (Prefix + URL Code)
        const targetSchoolUid = `SCH-${schoolCodeFromUrl}`;
        
        switcherUrl.searchParams.set('schoolId', targetSchoolUid);
        switcherUrl.searchParams.set('callback', pathname);

        return NextResponse.redirect(switcherUrl);
      }

      // Kila kitu kiko sawa (Context is Valid)
      return null;

    } catch (error) {
      console.error("[Context Proxy] Critical Connection Error:", error);
      // Ikitokea dharura, mruhusu apite au mpeleke error page kulingana na sera yako
      return null; 
    }
  }

  return null;
};