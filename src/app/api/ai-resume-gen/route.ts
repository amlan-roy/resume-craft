import { NextRequest, NextResponse } from "next/server";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";
import axios from "axios";
import { ConversationChain } from "langchain/chains";
import { BufferMemory } from "langchain/memory";
import { extractJson } from "@/lib/utils/data-formatting";

export async function POST(req: NextRequest) {
  try {
    const reqBody = await req.json();
    const { baseResumeData, jobDescription } = reqBody || {};

    if (!baseResumeData) {
      return new NextResponse("Base Resume Data is required", {
        status: 400,
        statusText: "Bad Request",
      });
    }
    if (!jobDescription) {
      return new NextResponse("Job Description is required", {
        status: 400,
        statusText: "Bad Request",
      });
    }

    const command0 = await axios.post(
      `${process.env.NEXT_PUBLIC_SITE_URL}/api/ai-prompts?action=getCommand`,
      {
        commandId: 0,
      },
      {
        withCredentials: true,
      }
    );
    const command1 = await axios.post(
      `${process.env.NEXT_PUBLIC_SITE_URL}/api/ai-prompts?action=getCommand`,
      {
        commandId: 1,
        baseResumeData: baseResumeData,
      }
    );
    const command2 = await axios.post(
      `${process.env.NEXT_PUBLIC_SITE_URL}/api/ai-prompts?action=getCommand`,
      {
        commandId: 2,
        jobDescription: jobDescription,
      }
    );

    // Custtom error code for command not found in the api response: ERR_CNF_001
    if (
      !command0?.data?.command ||
      !command1?.data?.command ||
      !command2?.data?.command
    ) {
      return new NextResponse(
        "An error occurred while generating the resume. Please try again later. Err code: ERR_CNF_001",
        {
          status: 500,
          statusText: "Internal Server Error",
        }
      );
    }

    const commandsContainingData = [
      command1.data.command,
      command2.data.command,
    ];

    if (commandsContainingData.length) {
      const model = new ChatOpenAI({
        openAIApiKey: process.env.OPENAI_API_KEY,
        model: "gpt-4o",
        maxRetries: 5,
        temperature: 0.3,
      });

      const bufferMemory = new BufferMemory({
        returnMessages: true,
        memoryKey: "resume-gen",
      });

      const chatPrompt = ChatPromptTemplate.fromMessages([
        ["system", command0.data.command],
        new MessagesPlaceholder("resume-gen"),
        ["human", "{input}"],
      ]);

      const chain = new ConversationChain({
        memory: bufferMemory,
        prompt: chatPrompt,
        llm: model,
      });

      let lastResponse = "";

      const commandsText = commandsContainingData.join("\n");

      const response = await chain.call({ input: commandsText });
      lastResponse = response.response;
      console.log(`Prompt: ${commandsText}`);
      console.log(`Response: ${lastResponse}`);

      return NextResponse.json({
        response: extractJson(lastResponse),
      });
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
