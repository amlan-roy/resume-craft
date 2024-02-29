/**
 * A function that creates a mailto link based on the provided values
 */
export const mailToLinks = (options?: {
  to?: string;
  cc?: string;
  bcc?: string;
  subject?: string;
  content?: string;
  systemInfo?: {
    browser?: string;
    OS?: string;
    time?: string;
    device?: string;
  };
}) => {
  const {
    to = "amlanroy2500+resumeCraftBugReport@gmail.com",
    cc,
    bcc,
    subject = "Bug Report: Resume Craft",
    content = "A bug occured in resume craft. Reporting the bug.",
    systemInfo,
  } = options || {};

  const body = `${content} ${systemInfo ? "\n System Info:\n \tbrowser: " + systemInfo.browser + "\n \tOS: " + systemInfo.OS + "\n \ttime: " + systemInfo.time + "\n \tdevice:" + systemInfo.device : ""}`;
  return (
    "mailto:" +
    `?to=${to}${cc ? `&cc=${cc}` : ""}${bcc ? `&bcc=${bcc}` : ""}&subject=${subject}&body=${body}`
  );
};
