"use client";

import React from "react";
import { PDFViewer } from "@react-pdf/renderer";
import { MOCK_RESUME_DATA } from "@/lib/const/temp";
import { formType } from "@/lib/types/form";
import Resume from "@/components/resume/Resume";

// Font size from google sheet * 2  = Font size here in pixel

type PageProps = {};

const TitleSection = ({ data }) => {
  const {
    name,
    email,
    phone,
    location,
    portfolioUrl,
    githubUrl,
    linkedinUrl,
    stackoverflowUrl,
    blogUrl,
  } = data;

  const secondRow = [
    location,
    phone,
    email,
    portfolioUrl,
    githubUrl,
    linkedinUrl,
    stackoverflowUrl,
    blogUrl,
  ].filter((item) => item);
  return (
    <div style={{ width: "100%", justifyContent: "center" }}>
      <h1
        style={{
          fontSize: "32px",
          fontWeight: "bold",
          color: "#404040",
          textAlign: "center",
        }}
      >
        {name}
      </h1>
      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          width: "100%",
          justifyContent: "center",
          fontSize: "21px",
        }}
      >
        {secondRow.map((item, index) => {
          let Item = <></>;
          if (item) {
            switch (item) {
              case location:
                Item = (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "2rem",
                    }}
                  >
                    <span>{location}</span>
                  </div>
                );
                break;
              case phone:
                Item = (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "2rem",
                    }}
                  >
                    <span>{phone}</span>
                  </div>
                );
                break;
              case email:
                Item = (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "2rem",
                      color: "#1D4ED8",
                    }}
                  >
                    <a href={`mailto:${email}`}>{email}</a>
                  </div>
                );
                break;
              case portfolioUrl:
                Item = (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "2rem",
                      color: "#1D4ED8",
                    }}
                  >
                    <a href={portfolioUrl}>{portfolioUrl}</a>
                  </div>
                );
                break;
              case githubUrl:
                Item = (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "2rem",
                      color: "#1D4ED8",
                    }}
                  >
                    <a href={githubUrl}>{githubUrl}</a>
                  </div>
                );
                break;
              case linkedinUrl:
                Item = (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "2rem",
                      color: "#1D4ED8",
                    }}
                  >
                    <a href={linkedinUrl}>{linkedinUrl}</a>
                  </div>
                );
                break;
              case stackoverflowUrl:
                Item = (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "2rem",
                      color: "#1D4ED8",
                    }}
                  >
                    <a href={stackoverflowUrl}>{stackoverflowUrl}</a>
                  </div>
                );
                break;
              case blogUrl:
                Item = (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "2rem",
                      color: "#1D4ED8",
                    }}
                  >
                    <a href={blogUrl}>{blogUrl}</a>
                  </div>
                );
                break;
              default:
                Item = <div key={index}></div>;
                break;
            }
          }
          return (
            <>
              {Item} {index < secondRow.length - 1 ? "|" : <></>}
            </>
          );
        })}
      </div>
    </div>
  );
};

const Page: React.FC<PageProps> = () => {
  const data = MOCK_RESUME_DATA as formType;
  return (
    <div>
      {/* <div className="w-[1240px] h-[1754px] bg-slate-300 p-5 text-black flex"> */}
      {/* <TitleSection data={MOCK_RESUME_DATA.basicDetails.fields} /> */}
      <PDFViewer width={"100%"} height={"500vh"}>
        <Resume data={data} />
      </PDFViewer>
      {/* </div> */}
    </div>
  );
};
export default Page;
