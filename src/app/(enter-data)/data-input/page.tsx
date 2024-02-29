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

  const addSection = () => {
    append({
      sectionTitle: "a",
      type: SECTION.PROFESSIONAL_SUMMARY,
      fields: {
        value: "",
      },
    });
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
          refer this
          <a
            target="_blank"
            href="https://cdn-careerservices.fas.harvard.edu/wp-content/uploads/sites/161/2023/08/College-resume-and-cover-letter-4.pdf"
            aria-label="Visit the external link to harvard resume guide"
          >
            {" Harvard Resume Guide "}
          </a>
          and google X-Y-Z format for reference.
        </p>
      </section>
      <div className="max-w-screen-xl overflow-hidden px-4 sm:px-6 mt-10 mx-auto mb-28">
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
                        index={index}
                      />
                    );
                }
              })}
            </section>
            <Button variant={"outline"} onClick={addSection}>
              Add Section
            </Button>
            <button type="submit">Submit</button>
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
