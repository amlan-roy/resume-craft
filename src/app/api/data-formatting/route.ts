import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { formSchema } from "@/lib/types/form";

export async function POST(req: NextRequest) {
  try {
    const requestUrl = new URL(req.url);

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

    const id = reqBody?.userId;
    const fileName = reqBody?.fileName as string;
    const formId = reqBody?.formId as string;
    const isBase = formId === "base";
    const authToken = headers().get("Authorization");
    const bearerAuthToken =
      authToken &&
      (authToken.startsWith("Bearer ") ? authToken : `Bearer ${authToken}`);

    if (!authToken) {
      return new NextResponse("Authorization is Required", {
        status: 400,
        statusText: "Bad Request",
      });
    }

    if (!id) {
      return new NextResponse("ID is Required", {
        status: 400,
        statusText: "Bad Request",
      });
    }

    if (!fileName) {
      return new NextResponse("File Name is Required", {
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
      return new NextResponse("Resume data is not valid", {
        status: 400,
        statusText: "Bad Request",
      });
    }

    const resp = await fetch(
      `${process.env.FIREBASE_CLOUD_FUNCTION_RESUME_GEN_URL}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(bearerAuthToken && { Authorization: bearerAuthToken }),
        },
        body: JSON.stringify({
          userId: id,
          fileName,
          resumeData,
          formId,
          isBase,
        }),
      }
    );

    if (resp.status.toString().startsWith("2")) {
      const { downloadUrl } = await resp.json();
      return new NextResponse(
        JSON.stringify({
          message: "The resume has been created",
          downloadUrl,
        }),
        {
          status: 200,
          statusText: "Resume Created",
        }
      );
    }

    return new NextResponse(
      "An error occurred while generating the resume. Please try again later",
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

    if (getDownloadLink && id) {
      return new NextResponse(
        "The backend is not supported yet. Please try again later.",
        {
          status: 500,
          statusText: "Internal Server Error",
        }
      );
    }

    return new NextResponse("Bad Request", {
      status: 400,
      statusText: "Bad Request",
    });
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

export async function DELETE(req: NextRequest) {
  try {
    const requestUrl = new URL(req.url);

    const authToken = headers().get("Authorization");
    const bearerAuthToken =
      authToken &&
      (authToken.startsWith("Bearer ") ? authToken : `Bearer ${authToken}`);

    if (!authToken) {
      return new NextResponse("Authorization is Required", {
        status: 400,
        statusText: "Bad Request",
      });
    }

    const searchParams = requestUrl.searchParams;
    const formId = searchParams.get("formId");
    const fileName = searchParams.get("fileName");

    if (!formId) {
      return new NextResponse("The form Id is required to delete the resume", {
        status: 500,
        statusText: "Internal Server Error",
      });
    }

    const deleteReqResponse = await fetch(
      `${process.env.FIREBASE_CLOUD_FUNCTION_RESUME_DEL_FROM_STORAGE_URL}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(bearerAuthToken && { Authorization: bearerAuthToken }),
        },
        body: JSON.stringify({
          formId,
          fileName,
        }),
      }
    );

    if (deleteReqResponse.status.toString().startsWith("2")) {
      return new NextResponse("The resume has been deleted", {
        status: 200,
        statusText: "Resume Deleted",
      });
    }

    return new NextResponse(
      "An error occurred while deleting the resume. Please try again later",
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
