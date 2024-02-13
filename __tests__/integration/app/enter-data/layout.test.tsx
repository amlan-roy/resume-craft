import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Layout from "@/app/(landing-page)/layout";

jest.useFakeTimers().setSystemTime(new Date("2020-01-01"));

describe("integration:enter-data/layout", () => {
  it("renders the layout with header, child and footer correctly", () => {
    const tree = render(
      <Layout>
        <div>Child</div>
      </Layout>
    );

    expect(tree.container).toMatchSnapshot();

    expect(screen.getByTestId("landing-page__header")).toBeInTheDocument();
    expect(screen.getByText("Child")).toBeInTheDocument();
    expect(screen.getByTestId("global__footer")).toBeInTheDocument();
  });
});
