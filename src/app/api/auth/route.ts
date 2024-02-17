import {
  GOOGLE_ACCESS_TOKEN_COOKIE_LABEL,
  GOOGLE_ACCESS_TOKEN_EXPIRATION_COOKIE_LABEL,
  GOOGLE_AUTHORIZATION_CODE_COOKIE_LABEL,
  GOOGLE_REFRESH_TOKEN_COOKIE_LABEL,
} from "@/lib/const/auth/auth-constants";
import { formSchema } from "@/lib/types/form";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const requestUrl = new URL(req.url);

    const action = requestUrl.searchParams.get("action");
    if (action !== "getAccessToken") {
      return new NextResponse("Invalid action passed", {
        status: 400,
        statusText: "Bad Request",
      });
    }

    let refreshToken, accessToken;

    const googleUserAccessToken = req.cookies.get(
      GOOGLE_ACCESS_TOKEN_COOKIE_LABEL
    );
    const googleUserAccessTokenExpiry = req.cookies.get(
      GOOGLE_ACCESS_TOKEN_EXPIRATION_COOKIE_LABEL
    );

    if (
      googleUserAccessToken &&
      googleUserAccessToken.value &&
      googleUserAccessTokenExpiry &&
      (Date.now() -
        new Date(parseInt(googleUserAccessTokenExpiry.value)).getTime()) /
        1000 >
        360
    ) {
      return new NextResponse("Valid data already exists. Successful", {
        status: 200,
        statusText: "OK",
      });
    }
    refreshToken = req.cookies.get(GOOGLE_REFRESH_TOKEN_COOKIE_LABEL)?.value;
    if (refreshToken) {
      const { access_token, expires_in } =
        (await getNewAccessToken(refreshToken)) || {};
      console.log("newAccessToken:", access_token);
      console.log("expires_in:", expires_in);
      if (!(access_token && expires_in)) {
        return new NextResponse("User is not authorized", {
          status: 401,
          statusText: "Unauthorized",
        });
      }
      const resp = new NextResponse("Success", {});
      resp.cookies.set(
        GOOGLE_ACCESS_TOKEN_COOKIE_LABEL,
        `${access_token}; HttpOnly; Path=/generate-resume; SameSite=Strict;`
      );

      resp.cookies.set(
        GOOGLE_ACCESS_TOKEN_EXPIRATION_COOKIE_LABEL,
        `${Date.now() + expires_in * 1000}; Path=/generate-resume; SameSite=Strict;`
      );

      return resp;
    }

    const googleUserAuthCode = req.cookies.get(
      GOOGLE_AUTHORIZATION_CODE_COOKIE_LABEL
    );

    if (!googleUserAuthCode?.value) {
      return new NextResponse("User is not authorized", {
        status: 401,
        statusText: "Unauthorized",
      });
    }

    const refreshTokenRes = await getRefreshToken(googleUserAuthCode.value);

    if (!refreshTokenRes) {
      return new NextResponse("User is not authorized", {
        status: 401,
        statusText: "Unauthorized",
      });
    }

    refreshToken = refreshTokenRes.refresh_token;
    accessToken = refreshTokenRes.access_token;

    if (!(refreshTokenRes && accessToken && refreshTokenRes.expires_in)) {
      return new NextResponse("Authorization Error", {
        status: 401,
        statusText: "Unauthorized",
      });
    }

    const { access_token: nat, expires_in: nei } =
      (await getNewAccessToken(refreshToken as string)) || {};
    console.log("newAccessToken:", nat);
    console.log("expires_in:", nat);

    console.log("jabba");
    console.log("newAccessToken:", accessToken);
    console.log("expires_in:", refreshTokenRes.expires_in);

    const respon = new NextResponse("Success", {
      status: 200,
      statusText: "OK",
    });

    respon.cookies.set(
      GOOGLE_REFRESH_TOKEN_COOKIE_LABEL,
      `${refreshToken}; HttpOnly; Path=/generate-resume; SameSite=Strict;`
    );
    respon.cookies.set(
      GOOGLE_ACCESS_TOKEN_COOKIE_LABEL,
      `${nat}; HttpOnly; Path=/generate-resume; SameSite=Strict;`
    );
    respon.cookies.set(
      GOOGLE_ACCESS_TOKEN_EXPIRATION_COOKIE_LABEL,
      `${Date.now() + nei * 1000}; Path=/generate-resume; SameSite=Strict;`
    );

    if (!refreshToken) {
      return new NextResponse("Authorization Error", {
        status: 401,
        statusText: "Unauthorized",
      });
    }
    const newAccessToken = await getNewAccessToken(refreshToken);
    accessToken = newAccessToken.access_token;
    const resp = new NextResponse("Success", {
      status: 200,
      statusText: "OK",
    });
    resp.cookies.set(
      GOOGLE_ACCESS_TOKEN_COOKIE_LABEL,
      `${accessToken}; HttpOnly; Path=/generate-resume; SameSite=Strict;`
    );
    resp.cookies.set(
      GOOGLE_ACCESS_TOKEN_EXPIRATION_COOKIE_LABEL,
      `${Date.now() + newAccessToken.expires_in * 1000}; Path=/generate-resume; SameSite=Strict;`
    );

    return resp;
  } catch (err: unknown) {
    console.error(err);

    return new NextResponse(
      "An error occurred while generating the resume. Please try again later",
      {
        status: 500,
        statusText: "Internal Server Error",
      }
    );
  }
}

const getRefreshToken = async (authCode: string) => {
  try {
    // get refresh token using authorization code
    let payload = {
      grant_type: "authorization_code",
      code: authCode,
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: process.env.NEXT_PUBLIC_SITE_URL,
    };

    //Todo: Verify the response type
    const res = await axios.post(
      `https://oauth2.googleapis.com/token`,
      payload,
      {
        headers: {
          "Content-Type": "application/json;",
        },
      }
    );

    console.log(res);
    const {
      data,
    }: {
      data: {
        access_token: string;
        expires_in: number;
        refresh_token?: string;
        scope: string;
        token_type: string;
        id_token: string;
      };
    } = res;

    // Sample response
    // {
    //   access_token: "",
    //   expires_in: "",
    //   refresh_token: "",
    //   scope: "",
    //   token_type: "",
    //   id_token: "",
    // }
    return data;
  } catch (e) {
    console.error(e);
    throw new Error("Error occurred while getting refresh token");
  }
};

const getNewAccessToken = async (refresh_token: string) => {
  try {
    // get new access token using refresh token
    let payloadForAccessToken = {
      grant_type: "refresh_token",
      refresh_token: refresh_token,
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
    };

    //Todo: Verify the response type
    const res = await axios.post(
      `https://oauth2.googleapis.com/token`,
      payloadForAccessToken,
      {
        headers: {
          "Content-Type": "application/json;",
        },
      }
    );

    const {
      data,
    }: {
      data: {
        access_token: string;
        expires_in: number;
        scope: string;
        token_type: string;
        id_token: string;
      };
    } = res;

    // sample data response
    // {
    //   access_token: "********KAjJZmv4xLvbAIHey",
    //   expires_in: 3599,
    //   scope: "https://www.googleapis.com/auth/gmail.readonly openid
    //           .....
    //           .....
    //           https://mail.google.com/",
    //   token_type: "Bearer",
    //   id_token: "***************VeM7cfmgbvVIg",
    // }
    return data;
  } catch (e) {
    throw new Error("Error occurred while getting new access token");
  }
};
