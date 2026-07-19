import { NextRequest, NextResponse } from 'next/server';


/**
 * Handles routing based on the subdomain of the incoming request.
 * 
 * @param req - The incoming NextRequest object.
 * @returns A NextResponse object that rewrites the request to the appropriate subdomain folder, or null if no subdomain is detected.
 */
export async function handleRouting(req: NextRequest) {
  const url = req.nextUrl;
  const hostname = req.headers.get('host') || '';
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'eduasas.co.tz';

  // Tunatenganisha subdomain kwa kuondoa rootDomain
  let currentHost = hostname.replace(`.${rootDomain}`, '').replace(`${rootDomain}`, '');

  // Kama ni staging, tunaitoa ili tubaki na jina la subdomain halisi (mfano: portal)
  // Hii inaruhusu 'portal.staging' iweze kuelekezwa kwenye folder la 'portal'
  if (currentHost.endsWith('.staging')) {
    currentHost = currentHost.replace('.staging', '');
  }

  if (!currentHost || currentHost === 'localhost' || currentHost === 'www') {
    return null; 
  }

  console.log(`Host: ${hostname}, Detected Subdomain: ${currentHost}`);
  return NextResponse.rewrite(new URL(`/${currentHost}${url.pathname}`, req.url));
}