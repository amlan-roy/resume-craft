import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Header from "@/components/global/Header";

describe("integration:components/global/header", () => {
  it("snapshot", () => {
    const tree = render(<Header />);
    expect(tree.container).toMatchSnapshot();
  });

  //Todo: Had issue mocking the next themes and working with ThemeProvider here. Add proper tests later
  it("Header renders initial theme correctly", () => {
    render(<Header />);
    expect(screen.getByTestId("global__header")).toBeInTheDocument();
    expect(screen.getByLabelText("Dark Mode")).toBeInTheDocument();
    expect(
      screen.getByRole("switch", { name: /Dark Mode/i })
    ).not.toBeChecked();
  });
});
