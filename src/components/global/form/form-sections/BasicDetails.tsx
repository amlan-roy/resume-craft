import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import HiddenInput from "@/components/global/form/form-inputs/HiddenInput";
import TextInput from "@/components/global/form/form-inputs/TextInput";
import { SECTION, formType } from "@/lib/types/form";
import { useFormContext } from "react-hook-form";

type BasicDetailsProps = {
  sectionTitle?: string;
  fieldName?: keyof formType;
};

const fieldName = "basicDetails";

/**
 * This is a compoenet used to render the Basic Details section in the resume data input form.
 * This is tightly coupled with the formSchema from zod, and any changes there might requrie changes here as well
 * (especially in the fieldName and error messages)
 */
const BasicDetails: React.FC<BasicDetailsProps> = ({
  sectionTitle = "Basic Details",
}) => {
  const {
    register,
    formState: { errors },
  } = useFormContext<formType>();

  return (
    <Card data-testid="form-sections__basic-details">
      <HiddenInput
        fieldName={fieldName && `${fieldName}.type`}
        value={SECTION.BASIC_DETAILS}
        register={register}
      />
      <CardHeader className="text-brand-neutral-11 text-3xl md:text-4xl">
        {sectionTitle && <CardTitle>{sectionTitle}</CardTitle>}
      </CardHeader>
      <CardContent className="flex flex-wrap w-full gap-5 justify-between">
        <HiddenInput
          fieldName={fieldName && `${fieldName}.sectionTitle`}
          value={sectionTitle}
          register={register}
        />
        <TextInput
          fieldName={fieldName && `${fieldName}.fields.name`}
          register={register}
          label="Name"
          autoComplete="name"
          placeholder="Stephen Hawwkins"
          className="w-full lg:max-w-[30%] md:max-w-[45%]"
          errorMessage={errors?.[fieldName]?.fields?.name?.message}
        />
        <TextInput
          fieldName={fieldName && `${fieldName}.fields.email`}
          register={register}
          label="Email"
          autoComplete="email"
          placeholder="little-people@complex-equations.com"
          className="w-full lg:max-w-[30%] md:max-w-[45%]"
          errorMessage={errors?.[fieldName]?.fields?.email?.message}
        />
        <TextInput
          fieldName={fieldName && `${fieldName}.fields.phone`}
          register={register}
          label="Phone Number"
          autoComplete="tel"
          placeholder="+69 4206996024"
          className="w-full lg:max-w-[30%] md:max-w-[45%]"
          errorMessage={errors?.[fieldName]?.fields?.phone?.message}
        />
        <TextInput
          fieldName={fieldName && `${fieldName}.fields.location`}
          register={register}
          label="Location"
          autoComplete="address-level2"
          placeholder="Epstein Island"
          className="w-full lg:max-w-[30%] md:max-w-[45%]"
          errorMessage={errors?.[fieldName]?.fields?.location?.message}
        />
        <TextInput
          fieldName={fieldName && `${fieldName}.fields.portfolioUrl`}
          register={register}
          label="Portfolio Url"
          autoComplete="url"
          placeholder="www.tooHighUpChalkboard.com"
          className="w-full lg:max-w-[30%] md:max-w-[45%]"
          errorMessage={errors?.[fieldName]?.fields?.portfolioUrl?.message}
        />
        <TextInput
          fieldName={fieldName && `${fieldName}.fields.githubUrl`}
          register={register}
          label="Github Url"
          autoComplete="url"
          placeholder="www.github.com/thisIsAShocker"
          className="w-full lg:max-w-[30%] md:max-w-[45%]"
          errorMessage={errors?.[fieldName]?.fields?.githubUrl?.message}
        />
        <TextInput
          fieldName={fieldName && `${fieldName}.fields.linkedinUrl`}
          register={register}
          label="LinkedIn Url"
          autoComplete="url"
          placeholder="www.linkedin.com/narakMeJaega"
          className="w-full lg:max-w-[30%] md:max-w-[45%]"
          errorMessage={errors?.[fieldName]?.fields?.linkedinUrl?.message}
        />
        <TextInput
          fieldName={fieldName && `${fieldName}.fields.stackoverflowUrl`}
          register={register}
          label="Stack Overflow Url"
          autoComplete="url"
          placeholder="www.stackoverflow.com/iAmOutOfIdeas"
          className="w-full lg:max-w-[30%] md:max-w-[45%]"
          errorMessage={errors?.[fieldName]?.fields?.stackoverflowUrl?.message}
        />
        <TextInput
          fieldName={fieldName && `${fieldName}.fields.blogUrl`}
          register={register}
          label="Blog Url"
          autoComplete="url"
          placeholder="www.cantFindFunnyPlaceholders.com"
          className="w-full lg:max-w-[30%] md:max-w-[45%]"
          errorMessage={errors?.[fieldName]?.fields?.blogUrl?.message}
        />
      </CardContent>
    </Card>
  );
};
export default BasicDetails;
