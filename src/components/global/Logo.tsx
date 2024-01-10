import Image from "next/image";
import React from "react";
import Icon from "../../../public/icon.png";
import Link from "next/link";

type LogoProps = {
  linkify?: boolean;
  hideText?: boolean;
};

const LogoContainer: React.FC<{
  linkify?: boolean;
  children?: React.ReactNode;
}> = ({ linkify, children }) => {
  return linkify ? (
    <Link href={"/"} className="flex justify-center items-center">
      {children}
    </Link>
  ) : (
    <div className="flex justify-center items-center">{children}</div>
  );
};

const Logo: React.FC<LogoProps> = ({ linkify, hideText }) => {
  return (
    <LogoContainer linkify={linkify}>
      <Image
        src={"/icon.png"}
        alt={"Resume Craft Icon"}
        width={36}
        height={36}
        className="w-9 h-9 sm:w-full sm:h-full "
      />
      {!hideText && (
        <div className="flex flex-col text-brand-neutral-12 mx-3 justify-center items-center">
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
