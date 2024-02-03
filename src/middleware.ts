import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  if (req.nextUrl.pathname.endsWith("/generate-resume")) {
    return NextResponse.redirect(new URL("/generate-resume/base", req.url));
  }

  return res;
}
