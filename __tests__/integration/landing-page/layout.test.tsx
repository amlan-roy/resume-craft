import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Layout from "@/app/(landing-page)/layout";

describe("integration:landing-page/layout", () => {
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
