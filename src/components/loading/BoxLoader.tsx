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
    <div className={className} data-testid="box-loader-container">
      <span
        data-testid="box-loader"
        className={cn(["box-loader", loaderClassName])}
      >
        <span
          data-testid="box-loader-inner"
          className={cn(["box-loader-inner", innerClassName])}
          {...rest}
        ></span>
      </span>
    </div>
  );
};
export default BoxLoader;
