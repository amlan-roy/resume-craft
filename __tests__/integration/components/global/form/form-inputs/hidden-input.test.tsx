import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import HiddenInput from "@/components/global/form/form-inputs/HiddenInput";

describe("integration:components/global/form/form-inputs/hidden-input", () => {
  it("snapshot", () => {
    const tree = render(<HiddenInput value={"someValue"} />);

    expect(tree.container).toMatchSnapshot();
  });
  it("renders a hidden input with the given value", () => {
    const value = "testValue";
    render(<HiddenInput value={value} />);

    const hiddenInput = screen.getByTestId("hidden-input__container");
    expect(hiddenInput).toHaveValue(value);
  });
});
