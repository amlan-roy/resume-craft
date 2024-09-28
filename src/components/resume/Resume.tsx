import React from "react";
import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import { formType } from "@/lib/types/form";
import Header from "@/components/resume/sections/Header";

type ResumeProps = {
  data: formType;
};

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#b73720",
    padding: 16,
  },
});

const Resume: React.FC<ResumeProps> = ({ data }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Header data={data.basicDetails} />
      </Page>
    </Document>
  );
};

export default Resume;
