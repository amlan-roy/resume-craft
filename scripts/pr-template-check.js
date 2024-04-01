const { context } = require("@actions/github");

async function run() {
  try {
    const description = context.payload.pull_request.body.replace(
      /(?:\\[rn]|[\r\n]+)+/g,
      ""
    );

    if (!description || description === "") {
      core.setFailed("PR Description is empty, please provide one.");
    }

    const hasSummary = description.includes("## Summary");
    const summaryIndex = hasSummary && description.indexOf("## Summary");
    const hasTesting = description.includes("## Testing done");
    const testingIndex = hasTesting && description.indexOf("## Testing done");

    if (hasSummary && hasTesting) {
      const summaryToTesting = description.substring(
        summaryIndex,
        testingIndex
      );
      const summaryLines = summaryToTesting.split("\n");
      const filteredSummaryLines = summaryLines
        .map((line) => line.trim())
        .join("");
      if (filteredSummaryLines.length < 5) {
        core.setFailed("Summary section does not have minimum 5 characters.");
        return;
      }

      const testingToEnd = description.substring(testingIndex);
      const testingLines = testingToEnd.split("\n");
      const filteredTestingLines = testingLines
        .map((line) => line.trim())
        .join("");
      if (filteredTestingLines.length < 5) {
        core.setFailed(
          "Testing done section does not have minimum 5 characters."
        );
        return;
      }
    } else {
      core.setFailed(
        "Either ## Summary or ## Testing done is missing in the PR description."
      );
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}
run();
