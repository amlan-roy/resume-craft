import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import userEvent, { UserEvent } from "@testing-library/user-event";
import { expectError } from "@/lib/utils/test-helpers/console-mocks";
import ResumeCard from "@/components/my-resumes/ResumeCard";

describe("ResumeCard", () => {
  let user: UserEvent | null;
  beforeEach(() => {
    user = userEvent.setup();
  });

  afterEach(() => {
    user = null;
  });

  it("renders without crashing", async () => {
    const { queryByTestId, getByTestId } = render(
      <ResumeCard title="Test Resume" />
    );

    const resumeCard = getByTestId("resume-card");
    const resumeCardTitle = getByTestId("resume-card-title");
    const resumeCardDownloadButton = getByTestId("resume-card-download-button");
    const resumeCardDeleteButton = getByTestId("resume-card-delete-button");
    const resumeCardDescription = queryByTestId("resume-card-description");
    expect(resumeCard).toBeInTheDocument();
    expect(resumeCardTitle).toHaveTextContent("Test Resume");
    expect(resumeCardDownloadButton).toBeInTheDocument();
    expect(resumeCardDeleteButton).toBeInTheDocument();
    expect(resumeCardDescription).toBeNull();
  });

  it("renders default title if no title is provided", () => {
    const { getByTestId } = render(<ResumeCard />);
    expect(getByTestId("resume-card-title")).toHaveTextContent("Resume");
  });

  it("renders subtitle when provided", () => {
    const { getByTestId } = render(
      <ResumeCard title="Test Resume" subtitle="Test Subtitle" />
    );
    expect(getByTestId("resume-card-description")).toHaveTextContent(
      "Test Subtitle"
    );
  });

  it("does not render subtitle when not provided", () => {
    const { queryByTestId } = render(<ResumeCard title="Test Resume" />);
    expect(queryByTestId("resume-card-description")).toBeNull();
  });

  it("calls download callback when download button is clicked", async () => {
    const onDownload = jest.fn();
    const { getByTestId } = render(
      <ResumeCard
        title="Test Resume"
        callbacks={{ download: { onClick: onDownload } }}
      />
    );

    await user?.click(getByTestId("resume-card-download-button"));

    expect(onDownload).toHaveBeenCalled();
  });

  it("calls delete callback when delete button is clicked", async () => {
    const onDelete = jest.fn();
    const { getByTestId } = render(
      <ResumeCard
        title="Test Resume"
        callbacks={{ delete: { onClick: onDelete } }}
      />
    );

    await user?.click(getByTestId("resume-card-delete-button"));

    expect(onDelete).toHaveBeenCalled();
  });

  it("handles download error", async () => {
    const onDownloadError = jest.fn();
    const downloadError = new Error("Download error");

    expectError(downloadError);

    const { getByTestId } = render(
      <ResumeCard
        title="Test Resume"
        callbacks={{
          download: {
            onClick: () => {
              throw downloadError;
            },
            onError: onDownloadError,
          },
        }}
      />
    );

    await user?.click(getByTestId("resume-card-download-button"));

    expect(onDownloadError).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith(downloadError);
  });

  it("handles delete error", async () => {
    const onDeleteError = jest.fn();

    const deleteError = new Error("Delete error");

    expectError(deleteError);

    const { getByTestId } = render(
      <ResumeCard
        title="Test Resume"
        callbacks={{
          delete: {
            onClick: () => {
              throw deleteError;
            },
            onError: onDeleteError,
          },
        }}
      />
    );

    await user?.click(getByTestId("resume-card-delete-button"));

    expect(onDeleteError).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith(deleteError);
  });
});
