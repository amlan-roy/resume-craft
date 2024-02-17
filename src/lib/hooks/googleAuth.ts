import { useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import Cookies from "js-cookie";
import {
  GOOGLE_ACCESS_TOKEN_COOKIE_LABEL,
  GOOGLE_AUTHORIZATION_CODE_COOKIE_LABEL,
  GOOGLE_REFRESH_TOKEN_COOKIE_LABEL,
  USER_SCOPES,
} from "@/lib/const/auth/auth-constants";
import axios from "axios";

type AuthState = "idle" | "successful" | "unsuccessful" | "initiated";

const useGoogleAuth = (): [triggerAuth: () => void, authState: AuthState] => {
  const [authState, setAuthState] = useState<AuthState>("idle");

  const signIn = useGoogleLogin({
    flow: "auth-code",
    onSuccess: async (response) => {
      try {
        if (!response.code) {
          setAuthState("unsuccessful");
          return;
        }
        setSecureCookie("authCode", response.code);
        await axios.get(`/api/auth?action=getAccessToken`);
        setAuthState("successful");
      } catch (e) {
        console.error(e);
        setAuthState("unsuccessful");
      }
    },
    onError: () => {
      setAuthState("unsuccessful");
    },
    scope: USER_SCOPES.join(" "),
  });

  const triggerAuth = () => {
    setAuthState("initiated");
    signIn();
  };

  return [triggerAuth, authState];
};

export default useGoogleAuth;

/**
 * Sets a secure cookie with the specified cookie type, value, and options.
 *
 * @param cookieType - The type of the cookie. Valid values are "authCode", "accessToken", and "refreshToken".
 * @param cookieValue - The value of the cookie.
 * @param options - Additional options for the cookie.
 * @throws Error - If an invalid cookie type is provided.
 */
const setSecureCookie = (
  cookieType: "authCode" | "accessToken" | "refreshToken",
  cookieValue: string,
  options?: object
) => {
  let cookieLabel = "";

  switch (cookieType) {
    case "authCode":
      cookieLabel = GOOGLE_AUTHORIZATION_CODE_COOKIE_LABEL;
      break;
    case "accessToken":
      cookieLabel = GOOGLE_ACCESS_TOKEN_COOKIE_LABEL;
      break;
    case "refreshToken":
      cookieLabel = GOOGLE_REFRESH_TOKEN_COOKIE_LABEL;
      break;
    default:
      throw new Error("Invalid cookie type");
  }
  Cookies.set(cookieLabel, cookieValue, {
    ...options,
  });
};

// const getRefreshToken = async (authCode, setEmailUser) => {
//   // get refresh token using authorization code
//   let payload = {
//     grant_type: "authorization_code",
//     code: authCode,
//     client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
//     client_secret: "adfadfasdad",
//     redirect_uri: "http://localhost:3000",
//   };

//   axios
//     .post(`https://oauth2.googleapis.com/token`, payload, {
//       headers: {
//         "Content-Type": "application/json;",
//       },
//     })
//     .then((res: any) => {
//       return res.data;
//     })
//     .then((response: any) => {
//       debugger;
//       //   setEmailUser(response);
//       response.refresh_token &&
//         Cookies.set(TokenCookieLabel, response.refresh_token, {
//           secure: true,
//         });
//       console.log(response);
//     })
//     .catch((err) => console.log("err: ", err));
// };

// const getNewAccessToken = async (refresh_token: string, client_id: string, client_secret: string = "Afasfasdasda") => {
//   // get new access token using refresh token
//   let payloadForAccessToken = {
//     grant_type: "refresh_token",
//     refresh_token,
//     client_id,
//     client_secret,
//   };

//   const res = await axios
//     .post(`https://oauth2.googleapis.com/token`, payloadForAccessToken, {
//       headers: {
//         "Content-Type": "application/json;",
//       },
//     })

// const
//     .then((res: any) => {
//       return res.data;
//     })
//     .then((res) => {
//       debugger;
//       console.log("new token response: ", res);
//       console.log(res);
//       res.access_token && saveAuthCookie(res.access_token, "authorization-token", {expires: res.expires_in, secure: true, });
//     })
//     .catch((err) => console.log("err: ", err));
// };
