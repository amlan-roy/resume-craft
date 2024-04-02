import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import BoxLoader from "@/components/loading/BoxLoader";

describe("BoxLoader", () => {
  it("renders without crashing", () => {
    const { getByTestId } = render(<BoxLoader />);
    const boxLoaderContainer = getByTestId("box-loader-container");
    const boxLoader = getByTestId("box-loader");
    const boxLoaderInner = getByTestId("box-loader-inner");

    expect(boxLoaderContainer).toBeInTheDocument();
    expect(boxLoader).toBeInTheDocument();
    expect(boxLoaderInner).toBeInTheDocument();
  });

  it("applies the className prop", () => {
    const { getByTestId } = render(<BoxLoader className="test-class" />);

    const boxLoaderContainer = getByTestId("box-loader-container");
    expect(boxLoaderContainer).toHaveClass("test-class");
  });

  it("applies the loaderClassName prop", () => {
    const { getByTestId } = render(
      <BoxLoader loaderClassName="test-loader-class" />
    );

    const boxLoader = getByTestId("box-loader");
    expect(boxLoader).toHaveClass("box-loader test-loader-class", {
      exact: true,
    });
  });

  it("applies the innerClassName prop", () => {
    const { getByTestId } = render(
      <BoxLoader innerClassName="test-inner-class" />
    );

    const boxLoaderInner = getByTestId("box-loader-inner");
    expect(boxLoaderInner).toHaveClass("box-loader-inner test-inner-class", {
      exact: true,
    });
  });
});
