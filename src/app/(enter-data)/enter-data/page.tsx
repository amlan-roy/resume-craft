"use client";

import React, { useState } from "react";
import * as z from "zod";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { SECTION, formSchema } from "@/lib/types/form";
import BasicDetails from "@/components/global/form/form-sections/BasicDetails";
import ProfessionalSummary from "@/components/global/form/form-sections/ProfessionalSummary";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type EnterDataPageProps = {};

const EnterDataPage: React.FC<EnterDataPageProps> = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      basicDetails: {
        type: SECTION.BASIC_DETAILS,
        sectionTitle: "Basic Details",
        fields: {},
      },
      optionalSections: [
        {
          type: SECTION.PROFESSIONAL_SUMMARY,
          sectionTitle: "Professional Summary",
          fields: {
            value: "",
          },
        },
      ],
    },
  });

  const { control, handleSubmit } = form;

  const [alertDialogState, setAlertDialogState] = useState<{
    open: boolean;
    index?: number;
  }>({
    open: false,
    index: undefined,
  });

  const {
    fields,
    append,
    remove: deleteSection,
    update,
  } = useFieldArray({
    control,
    name: "optionalSections", // unique name for your Field Array
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
  };

  const submitHandler = handleSubmit(onSubmit);

  const addSection = (sectionType: SECTION) => {
    switch (sectionType) {
      case SECTION.PROFESSIONAL_SUMMARY:
        append({
          sectionTitle: "a",
          type: SECTION.PROFESSIONAL_SUMMARY,
          fields: {
            value: "",
          },
        });
    }
  };

  return (
    <>
      <section className="max-w-screen-xl overflow-hidden px-4 sm:px-6 mt-10 mx-auto mb-28">
        <h1 className="text-brand-neutral-12 text-center text-6xl font-bold">
          Enter Your Data
        </h1>
        <p className="text-brand-neutral-10 text-center text-2xl mt-11">
          This data will be used to generate the customised resume for different
          job types. Fill in this detail as accurately as possible. You can
          refer this{" "}
          <Link
            href={
              "https://cdn-careerservices.fas.harvard.edu/wp-content/uploads/sites/161/2023/08/College-resume-and-cover-letter.pdf"
            }
            target="_blank"
            aria-label="Visit the external link to harvard resume guide"
            className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600"
          >
            {"Harvard Resume Guide"}
          </Link>{" "}
          and{" "}
          <HoverCard>
            <HoverCardTrigger asChild>
              <Button
                variant="link"
                className="text-brand-neutral-10 text-center text-2xl m-0 px-0"
              >
                Google&apos;s X-Y-Z format
              </Button>
            </HoverCardTrigger>
            <HoverCardContent className="w-96">
              <div className="flex justify-between space-x-4">
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold">
                    Google&apos;s X-Y-Z format
                  </h4>
                  <p className="text-sm">
                    The Google resume x y z format is a way of writing your
                    resume that emphasizes your accomplishments and skills using
                    a simple formula.
                    <br />
                    <br />
                    The formula is: “Accomplished [X] as measured by [Y], by
                    doing [Z].”
                    <br />
                    <br />
                    For example, “Managed a community support program (X) that
                    saved $2 million (Y), by designing a streamlined customer
                    service portal (Z).”
                    <br />
                    <br />
                    This format helps you showcase your achievements and how
                    they relate to the job you are applying for. It also makes
                    it easier for recruiters to understand your value and
                    potential.
                  </p>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>{" "}
          for reference.
        </p>
      </section>
      <div className="max-w-screen-xl overflow-hidden p-4 sm:px-6 mt-10 mx-auto mb-28">
        <Form {...form}>
          <form
            onSubmit={(e) => {
              console.log(form.getValues());
              submitHandler(e);
            }}
            className="space-y-8"
          >
            <section className="w-full flex flex-col gap-8">
              {/* Todo: Fix This Later */}
              {/* @ts-ignore */}
              <BasicDetails control={control} />
              {fields.map((field, index) => {
                switch (field.type) {
                  case SECTION.PROFESSIONAL_SUMMARY:
                    return (
                      <ProfessionalSummary
                        key={field.id}
                        // Todo: Fix This Later
                        // @ts-ignore
                        control={control}
                        deleteSection={() =>
                          setAlertDialogState({ index, open: true })
                        }
                        index={index.toString()}
                      />
                    );
                }
              })}
            </section>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant={"outline"} className="m-4">
                  Add Section
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Select section to add</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  data-add-section-menu-item="PROFESSIONAL_SUMMARY"
                  onSelect={() => {
                    addSection(SECTION.PROFESSIONAL_SUMMARY);
                  }}
                >
                  Professional Summary
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </div>
      <AlertDialog open={alertDialogState.open}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Do you want to delete this section?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently the data that
              you have entered for this section.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setAlertDialogState({ open: false, index: undefined });
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                deleteSection(alertDialogState.index);
                setAlertDialogState({ open: false, index: undefined });
              }}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
export default EnterDataPage;
