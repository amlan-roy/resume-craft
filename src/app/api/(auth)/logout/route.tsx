import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

/**
 * Handles the POST request for logging out the user.
 * Removes the value and expires the session cookie.
 *
 * @param request - The NextRequest object representing the incoming request.
 * @returns A NextResponse object with a JSON body and a status code of 200.
 */
export async function POST(request: NextRequest) {
  //Remove the value and expire the cookie
  const options = {
    name: "session",
    value: "",
    maxAge: -1,
  };

  cookies().set(options);
  return NextResponse.json({}, { status: 200 });
}
