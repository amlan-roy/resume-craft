import React, { useState } from "react";
import { DownloadIcon, TrashIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";

type ResumeCardProps = {
  title?: string;
  subtitle?: string;
  callbacks?: {
    download?: {
      onClick?: Function;
      onError?: Function;
    };
    delete?: {
      onClick?: Function;
      onError?: Function;
    };
  };
};

const ResumeCard: React.FC<ResumeCardProps> = ({
  title = "Resume",
  subtitle,
  callbacks,
}) => {
  const [loadingState, setLoadingState] = useState(false);
  const { download: downloadCallbacks, delete: deleteCallbacks } =
    callbacks || {};

  const { onClick: onDownload, onError: onDownloadError } =
    downloadCallbacks || {};

  const { onClick: onDelete, onError: onDeleteError } = deleteCallbacks || {};

  return (
    <Card
      className="w-full max-w-xl bg-brand-secondary-green-1 rounded-lg p-4"
      data-testid="resume-card"
    >
      <CardTitle
        className="text-2xl font-bold text-brand-neutral-11 break-words"
        data-testid="resume-card-title"
      >
        {title}
      </CardTitle>
      {subtitle && (
        <CardDescription
          className="text-base text-brand-neutral-8 break-words"
          data-testid="resume-card-description"
        >
          {subtitle}
        </CardDescription>
      )}
      <CardFooter
        className="w-full justify-end mt-4 flex-wrap px-6 py-0"
        data-testid="resume-card-footer"
      >
        <Button
          variant={"ghost"}
          type="button"
          title="Download the resume"
          aria-label="Download the resume"
          disabled={loadingState}
          onClick={async () => {
            try {
              setLoadingState(() => true);
              !loadingState && (await onDownload?.());
              setLoadingState(() => false);
            } catch (e) {
              console.error(e);
              onDownloadError?.(e);
              setLoadingState(() => false);
            }
          }}
          data-testid="resume-card-download-button"
        >
          <DownloadIcon size={24} />
        </Button>
        <Button
          variant={"ghost"}
          type="button"
          title="Delete the resume"
          disabled={loadingState}
          aria-label="Delete the resume"
          onClick={async () => {
            try {
              setLoadingState(() => true);
              !loadingState && (await onDelete?.());
              setLoadingState(() => false);
            } catch (e) {
              console.error(e);
              onDeleteError?.(e);
              setLoadingState(() => false);
            }
          }}
          data-testid="resume-card-delete-button"
        >
          <TrashIcon size={24} />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ResumeCard;
