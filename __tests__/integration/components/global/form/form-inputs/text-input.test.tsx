import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import TextInput from "@/components/global/form/form-inputs/TextInput";

describe("integration:components/global/form/form-inputs/text-input", () => {
  it("snapshot", () => {
    const tree = render(
      <TextInput label="Name" placeholder="Enter your name" />
    );

    expect(tree.container).toMatchSnapshot();
  });
  it("renders a label and an input field", () => {
    render(<TextInput label="Name" placeholder="Enter your name" />);

    const label = screen.getByText("Name");
    const input = screen.getByPlaceholderText("Enter your name");

    expect(label).toBeInTheDocument();
    expect(input).toBeInTheDocument();
  });

  it("renders a textarea for multiline inputs", () => {
    render(
      <TextInput
        multiline
        label="Description"
        placeholder="Enter a description"
      />
    );

    const textarea = screen.getByRole("textbox"); // Use role for accessibility

    expect(textarea).toBeInTheDocument();
  });

  it("renders an error message if provided", () => {
    render(<TextInput errorMessage="Invalid input" />);

    const errorMessage = screen.getByText("Invalid input");

    expect(errorMessage).toBeInTheDocument();
  });

  it("applies custom className to the container", () => {
    render(<TextInput className="custom-class" />);

    const container = screen.getByTestId("text-input__container"); // Assuming you have a test-id

    expect(container).toHaveClass("custom-class");
  });
});
