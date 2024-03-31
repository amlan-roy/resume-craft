import "@testing-library/jest-dom";
import { render, renderHook, screen } from "@testing-library/react";
import { useForm } from "react-hook-form";
import { SECTION } from "@/lib/types/form";
import { Form } from "@/components/ui/form";
import ProfessionalSummary from "@/components/global/form/form-sections/ProfessionalSummary";

describe("integration:components/global/form/form-sections/professional-summary", () => {
  beforeEach(() => {});

  it.skip("snapshot", () => {
    const {
      result: { current },
    } = renderHook(() => useForm());

    const tree = render(
      <Form {...current}>
        <ProfessionalSummary
          sectionTitle="Professional Summary"
          deleteSection={() => {}}
        />
      </Form>
    );

    expect(tree.container).toMatchSnapshot();
  });

  it.skip("ProfessionalSummary component renders correctly", () => {
    render(<ProfessionalSummary deleteSection={() => {}} />);
    const card = screen.getByTestId("form-sections__professional-summary");
    expect(card).toBeInTheDocument();

    const hiddenInput = card.querySelector(
      '[data-testid="hidden-input__container"]'
    );
    expect(hiddenInput).toHaveValue(SECTION.PROFESSIONAL_SUMMARY);

    const deleteButton = screen.getByTestId("form-sections__delete-icon");
    expect(deleteButton).toBeInTheDocument();

    const inputs = screen.getAllByTestId("text-input__container");

    expect(inputs.length).toStrictEqual(2);

    expect(inputs[0].querySelector("label")).not.toBeInTheDocument();
    expect(inputs[0].querySelector("input")).toBeInTheDocument();
    expect(inputs[0].querySelector("p")).not.toBeInTheDocument();

    expect(inputs[1].querySelector("label")).not.toBeInTheDocument();
    expect(inputs[1].querySelector("textarea")).toBeInTheDocument();
    expect(inputs[1].querySelector("p")).not.toBeInTheDocument();
  });

  // todo: Add tests to test error once user events issue is figured out
});
