import Image from "next/image";
import React from "react";
import Icon from "../../../public/icon.png";
import Link from "next/link";
import { cn } from "@/lib/utils";

type LogoProps = {
  linkify?: boolean;
  hideText?: boolean;
  className?: string;
  imageClassName?: string;
  textClassName?: string;
};

const LogoContainer: React.FC<{
  linkify?: boolean;
  children?: React.ReactNode;
  className?: string;
}> = ({ linkify, children, className }) => {
  return linkify ? (
    <Link
    data-testid="global__logo-linkified"
      href={"/"}
      className={cn(["flex justify-center items-center", className])}
    >
      {children}
    </Link>
  ) : (
    <div data-testid="global__logo" className={cn(["flex justify-center items-center", className])}>
      {children}
    </div>
  );
};

const Logo: React.FC<LogoProps> = ({
  linkify,
  hideText,
  className,
  imageClassName,
  textClassName,
}) => {
  return (
    <LogoContainer linkify={linkify} className={className}>
      <Image
        src={"/icon.png"}
        alt={"Resume Craft Icon"}
        width={36}
        height={36}
        className={cn(["w-9 h-9 sm:w-full sm:h-full", imageClassName])}
      />
      {!hideText && (
        <div
          className={cn([
            "flex flex-col text-brand-neutral-12 mx-3 justify-center items-center",
            textClassName,
          ])}
        >
          <p className="text-base sm:text-xl font-extrabold leading-none sm:leading-none">
            RESUME
          </p>
          <p className="text-base sm:text-xl leading-none sm:leading-none ">
            <span className="font-light"> - </span>craft
            <span className="font-light"> - </span>
          </p>
        </div>
      )}
    </LogoContainer>
  );
};
export default Logo;
