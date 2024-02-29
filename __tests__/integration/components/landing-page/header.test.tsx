import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Header from "@/components/landing-page/Header";

jest.useFakeTimers().setSystemTime(new Date("2020-01-01"));

describe("integration:components/landing-page/header", () => {
  it("snapshot", () => {
    const tree = render(<Header />);
    expect(tree.container).toMatchSnapshot();
  });

  //Todo: Had issue mocking the next themes and working with ThemeProvider here. Add proper tests later
  it("Header renders initial theme correctly", () => {
    render(<Header />);
    expect(screen.getByTestId("landing-page__header")).toBeInTheDocument();
    expect(screen.getByLabelText("Dark Mode")).toBeInTheDocument();
    expect(
      screen.getByRole("switch", { name: /Dark Mode/i })
    ).not.toBeChecked();
  });
});
