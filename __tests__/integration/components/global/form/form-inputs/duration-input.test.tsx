import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import DurationInput from "@/components/global/form/form-inputs/DurationInput";

describe("integration:components/global/form/form-inputs/duration-input", () => {
  it("snapshot", () => {
    const tree = render(<DurationInput fieldName="test" />);
    expect(tree.container).toMatchSnapshot();
  });
});
