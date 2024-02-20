import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import AuthenticatedHeader from "@/components/global/AuthenticatedHeader";

describe("integration:components/global/header", () => {
  it("snapshot", () => {
    const tree = render(<AuthenticatedHeader />);
    expect(tree.container).toMatchSnapshot();
  });

  //Todo: Had issue mocking the next themes and working with ThemeProvider here. Add proper tests later
  it("AuthenticatedHeader renders initial theme correctly", () => {
    render(<AuthenticatedHeader />);
    expect(screen.getByTestId("global__header")).toBeInTheDocument();
    expect(screen.getByLabelText("Dark Mode")).toBeInTheDocument();
    expect(
      screen.getByRole("switch", { name: /Dark Mode/i })
    ).not.toBeChecked();
  });
});
