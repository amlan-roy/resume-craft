import React from "react";
import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import * as z from "zod";
import { basicDetailsSectionSchema } from "@/lib/types/form";

type HeaderProps = {
  data: z.infer<typeof basicDetailsSectionSchema>;
};

const Header: React.FC<HeaderProps> = ({ data }) => {
  const {
    fields: {
      name,
      email,
      phone,
      location,
      portfolioUrl,
      githubUrl,
      linkedinUrl,
      stackoverflowUrl,
      blogUrl,
    },
  } = data;

  const additionalInfo = [
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
    <View style={styles.container}>
      <Text style={styles.name}>{name}</Text>
      <View style={styles.additionalInfo}>
        {additionalInfo.map((item, index) => {
          let Item = <></>;
          if (item) {
            switch (item) {
              case location:
                Item = (
                  <View
                    key={index}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "2rem",
                    }}
                  >
                    <Text>{location}</Text>
                  </View>
                );
                break;
              case phone:
                Item = (
                  <View
                    key={index}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "2rem",
                    }}
                  >
                    <Text>{phone}</Text>
                  </View>
                );
                break;
              case email:
                Item = (
                  <View
                    key={index}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "2rem",
                      color: "#1D4ED8",
                    }}
                  >
                    <a href={`mailto:${email}`}>{email}</a>
                  </View>
                );
                break;
              case portfolioUrl:
                Item = (
                  <View
                    key={index}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "2rem",
                      color: "#1D4ED8",
                    }}
                  >
                    <a href={portfolioUrl}>{portfolioUrl}</a>
                  </View>
                );
                break;
              case githubUrl:
                Item = (
                  <View
                    key={index}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "2rem",
                      color: "#1D4ED8",
                    }}
                  >
                    <a href={githubUrl}>{githubUrl}</a>
                  </View>
                );
                break;
              case linkedinUrl:
                Item = (
                  <View
                    key={index}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "2rem",
                      color: "#1D4ED8",
                    }}
                  >
                    <a href={linkedinUrl}>{linkedinUrl}</a>
                  </View>
                );
                break;
              case stackoverflowUrl:
                Item = (
                  <View
                    key={index}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "2rem",
                      color: "#1D4ED8",
                    }}
                  >
                    <a href={stackoverflowUrl}>{stackoverflowUrl}</a>
                  </View>
                );
                break;
              case blogUrl:
                Item = (
                  <View
                    key={index}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "2rem",
                      color: "#1D4ED8",
                    }}
                  >
                    <a href={blogUrl}>{blogUrl}</a>
                  </View>
                );
                break;
              default:
                Item = <View key={index}></View>;
                break;
            }
          }
          return (
            <>
              {Item}
              {index < additionalInfo.length - 1 ? <Text>{" | "}</Text> : <></>}
            </>
          );
        })}
      </View>
    </View>
  );
};
export default Header;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#404040",
    textAlign: "center",
    fontFamily: "Helvetica-Bold",
  },
  additionalInfo: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
    fontSize: 11,
  },
});
