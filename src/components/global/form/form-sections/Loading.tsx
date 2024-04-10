import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type LoadingProps = {};

const TEXT_COPIES = {
  loading: "Loading...",
};

/**
 * This is a compoenet used to render the Loading section in the resume data input form.
 */
const Loading: React.FC<LoadingProps> = ({}) => {
  return (
    <Card
      data-testid="form-sections__loading"
      className="bg-brand-secondary-blue-1"
    >
      <CardHeader>
        <CardTitle className="animate-pulse text-brand-neutral-5">
          {TEXT_COPIES.loading}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Card className="w-full mb-4">
          <CardHeader>
            <CardTitle className="animate-pulse text-brand-neutral-5 text-xl">
              {TEXT_COPIES.loading}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="animate-pulse bg-brand-neutral-3 w-full h-12 mb-4"></div>
            <div className="animate-pulse bg-brand-neutral-3 w-full h-12"></div>
          </CardContent>
        </Card>
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="animate-pulse text-brand-neutral-5 text-xl">
              {TEXT_COPIES.loading}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap w-full gap-5 justify-between">
            <div className="animate-pulse bg-brand-neutral-3 w-full h-12"></div>
            <div className="animate-pulse bg-brand-neutral-3 w-full h-12"></div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};
export default Loading;
