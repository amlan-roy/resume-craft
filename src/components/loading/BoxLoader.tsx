import React from "react";
import { cn } from "@/lib/utils";

type LoaderProps = {
  className?: string;
  loaderClassName?: string;
  innerClassName?: string;
} & React.HTMLAttributes<HTMLDivElement>;

const BoxLoader: React.FC<LoaderProps> = ({
  className,
  loaderClassName,
  innerClassName,
  ...rest
}) => {
  return (
    <div className={className}>
      <span className={cn(["box-loader", loaderClassName])}>
        <span
          className={cn(["box-loader-inner", innerClassName])}
          {...rest}
        ></span>
      </span>
    </div>
  );
};
export default BoxLoader;
