import { NextRequest, NextResponse } from "next/server";

const authenticatedRoutes = [
  "/generate-resume",
  "/enter-data",
  "/home",
  "/api/ai-prompts",
  "/api/data-formatting",
];

const authRoutes = ["/login", "/signup", "/reset-password"];

/**
 * Middleware function to handle authentication and routing logic.
 * - For authenticated routes, it checks if the user is authenticated and redirects to the login page if not.
 * - For auth routes, it checks if the user is already authenticated and redirects to the home page if so.
 * - For generate-resume route, it redirects to the base route if no id subroute is provided.
 * - For enter-data route, it redirects to the base route if no id query param is provided.
 *
 * @param req - The NextRequest object representing the incoming request.
 * @returns A NextResponse object representing the response to be sent.
 */
export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  const session = req.cookies.get("session");
  if (authenticatedRoutes.includes(req.nextUrl.pathname)) {
    if (!session) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    const responseAPI = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL}/api/login`,
      {
        headers: {
          Cookie: `session=${session?.value}`,
        },
      }
    );
    if (responseAPI.status !== 200) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  if (authRoutes.includes(req.nextUrl.pathname)) {
    if (session) {
      const responseAPI = await fetch(
        `${process.env.NEXT_PUBLIC_SITE_URL}/api/login`,
        {
          headers: {
            Cookie: `session=${session?.value}`,
          },
        }
      );
      if (responseAPI.status === 200) {
        return NextResponse.redirect(new URL("/home", req.url));
      }
    }
  }

  if (req.nextUrl.pathname.endsWith("/generate-resume")) {
    return NextResponse.redirect(new URL("/generate-resume/base", req.url));
  }

  if (req.nextUrl.pathname.endsWith("/generate-resume/variant")) {
    const randomFormId = getUniqueHashId(8);
    return NextResponse.redirect(
      new URL(`/generate-resume/${randomFormId}`, req.url)
    );
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

/**
 * Generates a unique hash id with the given length. Minimum length is 8.
 * Use the additional length to add more characters to the hash id.
 *
 * @param additionalLength - The additional length to be added to the hash id.
 * @returns A unique hash id.
 */
export function getUniqueHashId(additionalLength: number): string {
  const idChars: string = "ABCDEFGHJKMNPQRSTUVWXYZ";
  const now: Date = new Date();
  let id = now.getTime().toString().slice(-8);
  for (let i = 0; i < additionalLength; i++)
    id += idChars[Math.floor(Math.random() * idChars.length)];
  return id;
}
