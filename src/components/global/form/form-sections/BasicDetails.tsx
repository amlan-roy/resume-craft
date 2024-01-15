import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";
import TextInput from "../form-inputs/TextInput";
import { Control, FieldValues } from "react-hook-form";
import HiddenInput from "../form-inputs/HiddenInput";
import { SECTION } from "@/lib/types/form";

type BasicDetailsProps = {
  sectionTitle?: string;
  control?: Control<FieldValues> | undefined;
};

const BasicDetails: React.FC<BasicDetailsProps> = ({
  sectionTitle = "Basic Details",
  control,
}) => {
  return (
    <Card>
      <HiddenInput
        fieldName={"basicDetails.type"}
        value={SECTION.BASIC_DETAILS}
        control={control}
      />
      <CardHeader className="text-brand-neutral-11 text-3xl md:text-4xl">
        {sectionTitle && <CardTitle>{sectionTitle}</CardTitle>}
      </CardHeader>
      <CardContent className="flex flex-wrap w-full gap-5 justify-between">
        <HiddenInput
          fieldName={"basicDetails.sectionTitle"}
          value={sectionTitle}
          control={control}
        />
        <TextInput
          fieldName={"basicDetails.fields.name"}
          control={control}
          label="Name"
          autoComplete="name"
          placeholder="Stephen Hawwkins"
          className="w-full lg:max-w-[30%] md:max-w-[45%]"
        />
        <TextInput
          fieldName={"basicDetails.fields.email"}
          control={control}
          label="Email"
          autoComplete="email"
          placeholder="little-people@complex-equations.com"
          className="w-full lg:max-w-[30%] md:max-w-[45%]"
        />
        <TextInput
          fieldName={"basicDetails.fields.phone"}
          control={control}
          label="Phone Number"
          autoComplete="tel"
          placeholder="+69 4206996024"
          className="w-full lg:max-w-[30%] md:max-w-[45%]"
        />
        <TextInput
          fieldName={"basicDetails.fields.location"}
          control={control}
          label="Location"
          autoComplete="address-level2"
          placeholder="Epstein Island"
          className="w-full lg:max-w-[30%] md:max-w-[45%]"
        />
        <TextInput
          fieldName={"basicDetails.fields.portfolioUrl"}
          control={control}
          label="Portfolio Url"
          autoComplete="url"
          placeholder="www.tooHighUpChalkboard.com"
          className="w-full lg:max-w-[30%] md:max-w-[45%]"
        />
        <TextInput
          fieldName={"basicDetails.fields.githubUrl"}
          control={control}
          label="Github Url"
          autoComplete="url"
          placeholder="www.github.com/thisIsAShocker"
          className="w-full lg:max-w-[30%] md:max-w-[45%]"
        />
        <TextInput
          fieldName={"basicDetails.fields.linkedinUrl"}
          control={control}
          label="LinkedIn Url"
          autoComplete="url"
          placeholder="www.linkedin.com/narakMeJaega"
          className="w-full lg:max-w-[30%] md:max-w-[45%]"
        />
        <TextInput
          fieldName={"basicDetails.fields.stackoverflowUrl"}
          control={control}
          label="Stack Overflow Url"
          autoComplete="url"
          placeholder="www.stackoverflow.com/iAmOutOfIdeas"
          className="w-full lg:max-w-[30%] md:max-w-[45%]"
        />
        <TextInput
          fieldName={"basicDetails.fields.blogUrl"}
          control={control}
          label="Blog Url"
          autoComplete="url"
          placeholder="www.cantFindFunnyPlaceholders.com"
          className="w-full lg:max-w-[30%] md:max-w-[45%]"
        />
      </CardContent>
    </Card>
  );
};
export default BasicDetails;
