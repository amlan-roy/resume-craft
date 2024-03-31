import { cookies, headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "firebase-admin";
import { customInitApp } from "@/lib/utils/firebase/firebase-admin-config";

// Init the Firebase SDK every time the server is called
customInitApp();

/**
 * Handle the POST request to login the user. Set the session cookie if the user is authenticated.
 * - If the authorization header is present, it will validate the token and create a session cookie.
 * - If the created session cookie is valid, it will return a 200 status code and set the status cookie in the response.
 * - Else, it will return 200 status code with an empty response, and will not set the session cookie.
 *
 * @param request The incoming next request
 * @param response The outgoing next response
 * @returns The response with the session cookie
 */
export async function POST(request: NextRequest, response: NextResponse) {
  const authorization = headers().get("Authorization");
  if (authorization?.startsWith("Bearer ")) {
    const idToken = authorization.split("Bearer ")[1];
    const decodedToken = await auth().verifyIdToken(idToken);

    if (decodedToken) {
      //Generate session cookie
      const expiresIn = 60 * 60 * 24 * 5 * 1000;
      const sessionCookie = await auth().createSessionCookie(idToken, {
        expiresIn,
      });
      const options = {
        name: "session",
        value: sessionCookie,
        maxAge: expiresIn,
        httpOnly: true,
        secure: true,
      };

      //Add the cookie to the browser
      cookies().set(options);
    }
  }

  return NextResponse.json({}, { status: 200 });
}

/**
 * Handle the GET request to validate if the user is logged in. If the session cookie is valid, the user is logged in.
 * - If the session cookie is present and valid, it will return a 200 status code with the user status.
 * - Else, it will return a 401 status code with the user status.
 *
 * @param request The incoming next request
 * @returns The response with the user status
 */
export async function GET(request: NextRequest) {
  const session = cookies().get("session")?.value || "";

  //Validate if the cookie exist in the request
  if (!session) {
    return NextResponse.json({ isLogged: false }, { status: 401 });
  }

  //Use Firebase Admin to validate the session cookie
  const decodedClaims = await auth().verifySessionCookie(session, true);

  if (!decodedClaims) {
    return NextResponse.json({ isLogged: false }, { status: 401 });
  }

  return NextResponse.json({ isLogged: true }, { status: 200 });
}
