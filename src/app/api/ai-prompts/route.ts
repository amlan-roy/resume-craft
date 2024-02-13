import { formSchema } from "@/lib/types/form";
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
    if (action !== "getCommand") {
      if (!action) {
        return new NextResponse("Invalid action passed", {
          status: 400,
          statusText: "Bad Request",
        });
      }
    }

    const reqBody = await req.json();
    // {
    //   commandId: 1/2/3,
    //   baseResumeData: {}
    //   jobDescription: {}
    // }

    const commandId = reqBody?.commandId;

    if ([undefined, null].includes(commandId)) {
      return new NextResponse("Command ID is Required", {
        status: 400,
        statusText: "Bad Request",
      });
    }

    if (`${commandId}` === "0") {
      return new NextResponse(
        JSON.stringify({
          command: process.env.COMMAND_1,
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
          status: 200,
          statusText: "OK",
        }
      );
    }
    if (`${commandId}` === "1") {
      const baseResumeDataString = JSON.stringify(reqBody?.baseResumeData);
      if (!baseResumeDataString) {
        return new NextResponse("Resume Data is required", {
          status: 400,
          statusText: "Bad Request",
        });
      }

      return new NextResponse(
        JSON.stringify({
          command: `RESUME_START\n${baseResumeDataString}\nRESUME_END`,
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
          status: 200,
          statusText: "OK",
        }
      );
    }
    if (`${commandId}` === "2") {
      const jobDescriptionString = reqBody?.jobDescription;
      if (!jobDescriptionString) {
        return new NextResponse("Job Description is required", {
          status: 400,
          statusText: "Bad Request",
        });
      }

      return new NextResponse(
        JSON.stringify({
          command: `JOB_DESCRIPTION_START\n${jobDescriptionString}\nJOB_DESCRIPTION_END`,
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
          status: 200,
          statusText: "OK",
        }
      );
    }

    return new NextResponse("Invalid Request", {
      status: 400,
      statusText: "Invalid Request",
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
