import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PopupDialog from "@/components/global/dialog/PopupDialog";

describe("integration:components/global/PopupDialog", () => {
  it("snapshot", () => {
    const tree = render(
      <PopupDialog
        open
        title="Tu Tu hai wahi dil ne jise apna kaha"
        description="Tu hai jaha mai hu waha ab yeh jeena tere bin hai saza"
      />
    );
    expect(tree.container).toMatchSnapshot();
  });

  it("Passed in text copies render correctly", () => {
    const tree = render(
      <PopupDialog
        title="Tu Tu hai wahi dil ne jise apna kaha"
        description="Tu hai jaha mai hu waha ab yeh jeena tere bin hai saza"
        cancelText="Ho mil jaayein is tarah"
        confirmText="do leharein jis tarah"
        open
      />
    );
    expect(
      screen.getByText("Tu Tu hai wahi dil ne jise apna kaha")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Tu hai jaha mai hu waha ab yeh jeena tere bin hai saza")
    ).toBeInTheDocument();
    expect(screen.getByText("Ho mil jaayein is tarah")).toBeInTheDocument();
    expect(screen.getByText("do leharein jis tarah")).toBeInTheDocument();

    expect(tree.container).toMatchSnapshot();
  });

  it("Does not render when open prop is not provided", () => {
    const tree = render(
      <PopupDialog
        title="Tu Tu hai wahi dil ne jise apna kaha"
        description="Tu hai jaha mai hu waha ab yeh jeena tere bin hai saza"
        cancelText="Ho mil jaayein is tarah"
        confirmText="do leharein jis tarah"
      />
    );
    expect(
      screen.queryByText("Tu Tu hai wahi dil ne jise apna kaha")
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(
        "Tu hai jaha mai hu waha ab yeh jeena tere bin hai saza"
      )
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText("Ho mil jaayein is tarah")
    ).not.toBeInTheDocument();
    expect(screen.queryByText("do leharein jis tarah")).not.toBeInTheDocument();

    expect(tree.container).toMatchSnapshot();
  });

  it("Calls the passed onCancel callback on click of the cancel button", async () => {
    const onCancel = jest.fn();
    const user = userEvent.setup();
    render(
      <PopupDialog
        open
        onCancel={onCancel}
        title="Tu Tu hai wahi dil ne jise apna kaha"
        description="Tu hai jaha mai hu waha ab yeh jeena tere bin hai saza"
      />
    );
    await user.click(screen.getByRole("button", { name: /Cancel/i }));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it("Calls the passed onConfirm callback on click of the cancel button", async () => {
    const onConfirm = jest.fn();
    const user = userEvent.setup();
    render(
      <PopupDialog
        open
        onConfirm={onConfirm}
        title="Tu Tu hai wahi dil ne jise apna kaha"
        description="Tu hai jaha mai hu waha ab yeh jeena tere bin hai saza"
      />
    );
    await user.click(screen.getByRole("button", { name: /Continue/i }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });
});
