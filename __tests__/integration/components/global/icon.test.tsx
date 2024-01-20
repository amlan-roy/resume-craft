import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Logo from "@/components/global/Logo";

describe("integration:components/global/icon", () => {
  it("snapshot", () => {
    const tree = render(<Logo />);
    expect(tree.container).toMatchSnapshot();
  });

  it("Renders the logo with the image and text by default", () => {
    render(<Logo />);

    const logoImage = screen.getByAltText("Resume Craft Icon");
    const resumeText = screen.getByText("RESUME");
    const craftText = screen.getByText("craft");

    expect(logoImage).toBeInTheDocument();
    expect(resumeText).toBeInTheDocument();
    expect(craftText).toBeInTheDocument();
  });

  it("Renders the logo as a link when linkify is true", () => {
    render(<Logo linkify />);

    const linkifiedLogo = screen.getByTestId("global__logo-linkified");

    expect(linkifiedLogo).toBeInTheDocument();
    expect(linkifiedLogo).toHaveAttribute("href", "/");
  });

  it("Does not render the text when hideText is true", () => {
    render(<Logo hideText />);

    const logoImage = screen.getByAltText("Resume Craft Icon");
    const resumeText = screen.queryByText("RESUME");

    expect(logoImage).toBeInTheDocument();
    expect(resumeText).not.toBeInTheDocument();
  });
});
