import React from "react";
import Logo from "@/components/global/Logo";
import { FaHeart } from "react-icons/fa";
import Link from "next/link";
import { LINKS } from "@/lib/const/components/global/footer";

type FooterProps = {};

const Footer: React.FC<FooterProps> = () => {
  return (
    <footer
      data-testid="global__footer"
      className="md:h-20 bg-brand-primary-green-10 dark:bg-brand-primary-green-9 py-5"
    >
      <div className="flex h-8 justify-between w-full max-w-xl mx-auto px-4">
        <Logo
          linkify
          className="hidden sm:flex"
          imageClassName="w-10 h-10 object-contain"
          textClassName="text-brand-neutral-2"
        />
        <div className="text-brand-neutral-2 flex items-center justify-center text-base w-full flex-wrap ml-4">
          <div className="flex items-center md:text-base text-sm flex-nowrap text-nowrap ">
            <p>{"Made with"}</p>
            <FaHeart className="text-red-500 mx-2" />
            <p>
              {"by Amlan Roy"}
              <span className="ml-3">{"|"}</span>
            </p>
          </div>
          <div className="flex flex-nowrap mx-2 gap-2 justify-around items-center">
            {LINKS.map(({ url, description, icon }, index) => (
              <Link
                href={url}
                target="_blank"
                key={`footer-icons-${index}`}
                aria-label={description}
                className=""
              >
                {icon}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
