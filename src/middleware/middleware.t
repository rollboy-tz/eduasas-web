import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Debugging: Hii itatokea kwenye terminal yako kila request ikipita
  console.log('Middleware Request Path:', request.nextUrl.pathname);

  // Kagua kama request ni static file (CSS, JS, Images)
  if (request.nextUrl.pathname.startsWith('/_next') || 
      request.nextUrl.pathname.startsWith('/api') || 
      request.nextUrl.pathname.match(/\.(.*)$/)) {
    return NextResponse.next();
  }

  // Hapa ndipo unaweka logic yako ya Auth
  return NextResponse.next();
}

// Hii matcher inasema: "Pitia kila kitu isipokuwa static files"
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};