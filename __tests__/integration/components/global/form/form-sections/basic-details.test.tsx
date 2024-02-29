import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import BasicDetails from "@/components/global/form/form-sections/BasicDetails";
import { SECTION } from "@/lib/types/form";

describe("integration:components/global/form/form-sections/basic-details", () => {
  it.skip("snapshot", () => {
    const tree = render(<BasicDetails sectionTitle="Section Title" />);

    expect(tree.container).toMatchSnapshot();
  });

  it.skip("BasicDetails component renders correctly", () => {
    render(
      <BasicDetails
        sectionTitle="Personal Information"
        register={jest.fn()}
        fieldName="basicDetails"
      />
    );
    const card = screen.getByTestId("form-sections__basic-details");
    expect(card).toBeInTheDocument();

    const title = screen.getByText("Personal Information");
    expect(title).toBeInTheDocument();

    const hiddenInput = card.querySelector(
      '[data-testid="hidden-input__container"]'
    );
    expect(hiddenInput).toHaveValue(SECTION.BASIC_DETAILS);

    const inputs = screen.getAllByTestId("text-input__container");

    // testing this way also tests the order of the inputs
    expect(inputs.length).toStrictEqual(9);

    expect(inputs[0].querySelector("label")).toHaveTextContent("Name");
    expect(inputs[0].querySelector("input")).toBeInTheDocument();
    expect(inputs[0].querySelector("p")).not.toBeInTheDocument();

    expect(inputs[1].querySelector("label")).toHaveTextContent("Email");
    expect(inputs[1].querySelector("input")).toBeInTheDocument();
    expect(inputs[1].querySelector("p")).not.toBeInTheDocument();

    expect(inputs[2].querySelector("label")).toHaveTextContent("Phone Number");
    expect(inputs[2].querySelector("input")).toBeInTheDocument();
    expect(inputs[2].querySelector("p")).not.toBeInTheDocument();

    expect(inputs[3].querySelector("label")).toHaveTextContent("Location");
    expect(inputs[3].querySelector("input")).toBeInTheDocument();
    expect(inputs[3].querySelector("p")).not.toBeInTheDocument();

    expect(inputs[4].querySelector("label")).toHaveTextContent("Portfolio Url");
    expect(inputs[4].querySelector("input")).toBeInTheDocument();
    expect(inputs[4].querySelector("p")).not.toBeInTheDocument();

    expect(inputs[5].querySelector("label")).toHaveTextContent("Github Url");
    expect(inputs[5].querySelector("input")).toBeInTheDocument();
    expect(inputs[5].querySelector("p")).not.toBeInTheDocument();

    expect(inputs[6].querySelector("label")).toHaveTextContent("LinkedIn Url");
    expect(inputs[6].querySelector("input")).toBeInTheDocument();
    expect(inputs[6].querySelector("p")).not.toBeInTheDocument();

    expect(inputs[7].querySelector("label")).toHaveTextContent(
      "Stack Overflow Url"
    );
    expect(inputs[7].querySelector("input")).toBeInTheDocument();
    expect(inputs[7].querySelector("p")).not.toBeInTheDocument();

    expect(inputs[8].querySelector("label")).toHaveTextContent("Blog Url");
    expect(inputs[8].querySelector("input")).toBeInTheDocument();
    expect(inputs[8].querySelector("p")).not.toBeInTheDocument();
  });

  // todo: Add tests to test error once user events issue is figured out
});
