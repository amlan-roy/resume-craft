import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  if (req.nextUrl.pathname.endsWith("/generate-resume")) {
    return NextResponse.redirect(new URL("/generate-resume/base", req.url));
  }

  if (req.nextUrl.pathname.endsWith("/enter-data")) {
    if (!req.nextUrl.searchParams.get("id")) {
      // redirect to '/enter-data' route with all the params passed to the request, and for id query param, add/replace it with id = base
      const newUrl = new URL("/enter-data", req.url);
      // set the id query param to 'base'
      newUrl.searchParams.set("id", "base");
      return NextResponse.redirect(newUrl);
    }
  }

  return res;
}
