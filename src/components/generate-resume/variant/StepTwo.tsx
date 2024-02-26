import axios from "axios";
import React, { useState } from "react";
import {
  CheckIcon,
  CircleDashedIcon,
  CircleSlashIcon,
  CopyIcon,
} from "lucide-react";
import Image from "next/image";
import { useFormContext } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  formSchema,
  resumeVariantGenerationFormSchema,
} from "@/lib/types/form";
import {
  addBackSensitiveInformation,
  removeSensitiveInformation,
} from "@/lib/utils/data-formatting";
import { mailToLinks } from "@/lib/utils/string-helpers";

const CopyCommandButtonIcon = ({
  state,
}: {
  state?: "neutral" | "in-progress" | "success" | "fail";
}) => {
  switch (state) {
    case "neutral":
      return <CopyIcon className="animate-pop-in" />;
    case "in-progress":
      return <CircleDashedIcon className="animate-spin ease-in" />;
    case "success":
      return <CheckIcon className="animate-pop-in" />;
    case "fail":
      return <CircleSlashIcon className="animate-pop-in" />;
    default:
      return <CopyIcon className="animate-pop-in" />;
  }
};

type StepTwoProps = {
  baseResumeData: string;
  resumeVariantData?: any;
  setResumeVariantData: any;
} & React.HTMLAttributes<HTMLDivElement>;

const StepTwo: React.FC<StepTwoProps> = ({
  baseResumeData,
  resumeVariantData,
  setResumeVariantData,
  ...props
}) => {
  const {
    register,
    formState: { errors },
    trigger,
    getValues,
    setError,
    clearErrors,
  } = useFormContext<z.infer<typeof resumeVariantGenerationFormSchema>>();

  const [commandsState, setCommandsState] = useState<
    {
      state: "neutral" | "in-progress" | "success" | "fail";
      command?: string;
    }[]
  >([{ state: "neutral" }, { state: "neutral" }, { state: "neutral" }]);

  const [enteredDataIsValid, setEnteredDataIsValid] = useState(false);

  const onCopyCommandClick = async (index: number) => {
    try {
      setCommandsState((prev) => {
        const res = [...prev];
        res[index].state = "in-progress";
        return res;
      });

      const validationResult = await trigger("jobDescription", {
        shouldFocus: true,
      });
      if (!validationResult) {
        setCommandsState((prev) => {
          const res = [...prev];
          res[index].state = "fail";
          return res;
        });
        return;
      }
      const jdInputValue = getValues().jobDescription;
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_SITE_URL}/api/ai-prompts?action=getCommand`,
        {
          commandId: index,
          ...(index === 1 && {
            baseResumeData: removeSensitiveInformation(
              JSON.parse(baseResumeData)
            ),
          }),
          ...(!!jdInputValue &&
            index === 2 && { jobDescription: jdInputValue }),
        }
      );
      const command = res.data.command;

      if (!command)
        throw new Error(
          `Command is required in the response, but did not receive it`
        );

      setCommandsState((prev) => {
        const res = [...prev];
        res[index].state = "success";
        res[index].command = command;
        return res;
      });
      navigator.clipboard.writeText(command);
    } catch (e) {
      setCommandsState((prev) => {
        const res = [...prev];
        res[index].state = "fail";
        return res;
      });
    }
  };

  const getButtonLabel = (
    state: "neutral" | "in-progress" | "success" | "fail",
    index: number
  ) => {
    switch (state) {
      case "fail":
        return "Try again...";
      case "in-progress":
        return "copying...";
      case "success":
        return "Copied";
      case "neutral":
        return `Copy command ${index + 1}`;
      default:
        return `Copy command ${index + 1}`;
    }
  };

  return (
    <Card className="w-full" {...props}>
      <CardHeader>
        <h2 className="text-xl font-semibold">
          Step 2: Copy the command for chat GPT and enter it&apos;s response
        </h2>
      </CardHeader>
      <div className="flex gap-9 p-6  lg:flex-row flex-col-reverse items-center">
        <div className="w-auto">
          <p>
            Three custom commands will be generated based on your base resume
            and the entered job description after clicking on the below buttons
            <br />
            <br />
            Copy the commands sequentially and enter them into chat GPT. After
            entering the last command, copy the JSON output from chat GPT and
            paste it below and validate it.
          </p>
        </div>
        <Image
          title="Step 2 Example Video"
          src={"/step-2-guide.gif"}
          width={600}
          height={920}
          alt={"Step 2 Example Video"}
        />
      </div>
      <CardContent>
        <div className="flex gap-10 my-6 flex-wrap">
          {commandsState.map(({ state }, index) => {
            return (
              <div className="flex flex-col gap-3" key={index}>
                <Label>
                  Copy {`${["first", "second", "third"][index]}`} command
                </Label>
                <Button
                  type="button"
                  disabled={state === "in-progress"}
                  className="w-64 justify-start gap-10"
                  onClick={onCopyCommandClick.bind(this, index)}
                >
                  <CopyCommandButtonIcon state={state} />
                  {getButtonLabel(state, index)}
                </Button>
              </div>
            );
          })}
        </div>
        {!!commandsState.find((command) => command.state === "fail") && (
          <p className="text-sm font-medium text-destructive py-6">
            Copying the command has failed. Please verify the inputs and try
            again.
            <br />
            If this issue persists, please report it to us{" "}
            <a href={mailToLinks()} className="font-bold">
              here.
            </a>
          </p>
        )}
        <a href="https://chat.openai.com/" target="_blank">
          <Button type="button" variant={"outline"}>
            Open chat GPT
          </Button>
        </a>
        <div className="mt-12">
          <Label className="text-brand-neutral-11">
            Enter the JSON response generated after entering the last command in
            chatGPT
          </Label>
          <Textarea
            placeholder={
              "Enter the JSON response from chat GPT after entering the last command"
            }
            {...register("modifiedResumeJSON")}
            className={"my-3"}
            onChange={() => {
              setEnteredDataIsValid(false);
            }}
          />
          <Button
            variant={"outline"}
            type="button"
            onClick={() => {
              try {
                const enteredData = getValues().modifiedResumeJSON;
                const enteredDataObjWithSensitiveInfo =
                  enteredData &&
                  addBackSensitiveInformation(
                    JSON.parse(enteredData),
                    JSON.parse(baseResumeData)
                  );
                const isEnteredDataValid = formSchema.safeParse(
                  enteredDataObjWithSensitiveInfo
                ).success;

                setEnteredDataIsValid(isEnteredDataValid);
                if (!isEnteredDataValid) {
                  setError(
                    "modifiedResumeJSON",
                    {
                      message:
                        "The entered data is not in the correct format. Please try entering both the commands in a new chatGPT conversation. If the issue continues, please write to us",
                    },
                    { shouldFocus: true }
                  );
                } else {
                  clearErrors("modifiedResumeJSON");
                  setResumeVariantData(
                    JSON.stringify(enteredDataObjWithSensitiveInfo)
                  );
                }
              } catch (e) {
                setEnteredDataIsValid(false);
                setError(
                  "modifiedResumeJSON",
                  {
                    message:
                      "The entered data is not in the correct format. Please try entering both the commands in a new chatGPT conversation. If the issue continues, please write to us",
                  },
                  { shouldFocus: true }
                );
              }
            }}
          >
            Validate and save the entered data
          </Button>
          {enteredDataIsValid && (
            <p className="text-sm font-medium text-green-400 py-6">
              The entered data is valid 🎉
            </p>
          )}
          {errors.modifiedResumeJSON && (
            <p className="text-sm font-medium text-destructive py-6">
              {errors.modifiedResumeJSON.message?.toString()}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
export default StepTwo;
