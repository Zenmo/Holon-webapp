
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  console.log(`INCOMING ${request.method} ${request.nextUrl.toString()}`);
}
