import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Page from "@/app/(landing-page)/page";

describe("integration:landing-page/page", () => {
  it("snapshot", () => {
    const tree = render(<Page />);
    expect(tree.container).toMatchSnapshot();
  });
  it("renders the first section's button correctly", () => {
    const tree = render(<Page />);

    //button renders correctly
    expect(screen.getByText("Get Started")).toBeEnabled();

    // button is wrapped up in anchor tag with correct href
    expect(screen.getByText("Get Started").parentElement).toHaveAttribute(
      "href",
      "/generate-variants"
    );
  });
});
