import { GOOGLE_ACCESS_TOKEN_COOKIE_LABEL } from "@/lib/const/auth/auth-constants";
import { formSchema } from "@/lib/types/form";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const requestUrl = new URL(req.url);

    // const genResume = requestUrl.searchParams.get("generate-resume");
    const action = requestUrl.searchParams.get("action");
    if (!action) {
      return new NextResponse("Action is Required", {
        status: 400,
        statusText: "Bad Request",
      });
    }
    if (action !== "generateResume") {
      if (!action) {
        return new NextResponse("Invalid action passed", {
          status: 400,
          statusText: "Bad Request",
        });
      }
    }

    const reqBody = await req.json();

    const id = reqBody?.id;

    if (!id) {
      return new NextResponse("ID is Required", {
        status: 400,
        statusText: "Bad Request",
      });
    }

    const resumeData = JSON.parse(reqBody?.resumeData || "");
    if (!resumeData || Object.keys(resumeData).length === 0) {
      return new NextResponse("Resume Data is required", {
        status: 400,
        statusText: "Bad Request",
      });
    }

    const mockTrue = requestUrl.searchParams.get("mockTrue");
    if (mockTrue) {
      return new NextResponse("The resume has been created", {
        status: 200,
        statusText: "Resume Created",
      });
    }

    const r = formSchema.safeParse(resumeData);
    if (!r.success) {
      console.log(r.error);
      return new NextResponse("Resume data is not valid", {
        status: 400,
        statusText: "Bad Request",
      });
    }

    return new NextResponse(
      "The backend is not supported yet. Please try again later.",
      {
        status: 500,
        statusText: "Internal Server Error",
      }
    );
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
export async function GET(req: NextRequest) {
  try {
    const requestUrl = new URL(req.url);

    const searchParams = requestUrl.searchParams;
    const getDownloadLink = searchParams.get("action") === "getDownloadLink";
    const id = searchParams.get("id");
    const downloadAsPdf = searchParams.get("downloadAsPdf");

    if (getDownloadLink && id) {
      return new NextResponse(
        "The backend is not supported yet. Please try again later.",
        {
          status: 500,
          statusText: "Internal Server Error",
        }
      );
    }

    const mockTrue = requestUrl.searchParams.get("mockTrue");

    if (mockTrue === "true") {
      return new NextResponse(
        JSON.stringify({
          downloadUrl:
            "https://cdn-careerservices.fas.harvard.edu/wp-content/uploads/sites/161/2023/08/College-resume-and-cover-letter-4.pdf",
        }),
        {
          status: 200,
          statusText: "Success",
        }
      );
    }
    const authToken = req.cookies.get(GOOGLE_ACCESS_TOKEN_COOKIE_LABEL);
    console.log("id", id);
    console.log("authToken", authToken);
    if (getDownloadLink && id && authToken) {
      const url = process.env.GOOGLE_APP_SCRIPT_TEST_DEPLOYMENT_URL || "";
      console.log("url", url);

<<<<<<< Updated upstream
=======
      const resp = await axios.post(
        "<Script URL>",
        {
          function: "testFunction",
          parameters: ["val1", "val2"],
          devMode: true,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken.value}`,
          },
        }
      );
      // const respon = await fetch(
      //   "Script Url",
      //   {
      //     method: "POST",
      //     headers: {
      //       Authorization: authToken,
      //     },
      //     body: JSON.stringify({
      //       function: "testFunction",
      //     }),
      //   }
      // );

      console.log(resp.data);
      console.log(resp.status);
      console.log(resp.statusText);

      // return resp;
      return new NextResponse(JSON.stringify({ resBody: resp.data }), {
        status: 200,
        statusText: "Iasdasdasd",
      });
    }

>>>>>>> Stashed changes
    return new NextResponse("Bad Request", {
      status: 400,
      statusText: "Bad Request",
    });
  } catch (err: unknown) {
    const a = await err;
    console.log(a.response);
    return new NextResponse(
      "An error occurred while generating the resume. Please try again later",
      {
        status: 500,
        statusText: "Internal Server Error",
      }
    );
  }
}
