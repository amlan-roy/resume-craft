import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Footer from "@/components/global/Footer";
import { LINKS } from "@/lib/const/components/global/footer";

describe("integration:components/global/footer", () => {
  it("snapshot", () => {
    const tree = render(<Footer />);
    expect(tree.container).toMatchSnapshot();
  });

  it("renders the footer with all expected elements", () => {
    const tree = render(<Footer />);

    const footer = screen.getByTestId("global__footer");
    const logo = screen.getByTestId("global__logo-linkified");
    const authorText = screen.getByText(/Made with/i);
    const heartIcon = tree.baseElement.querySelector("svg");
    const authorName = screen.getByText(/Amlan Roy/i);
    const socialLinks = screen
      .getAllByRole("link")
      .filter((element) => element.getAttribute("href") !== "/");

    expect(footer).toBeInTheDocument();
    expect(logo).toBeInTheDocument();
    expect(authorText).toBeInTheDocument();
    expect(heartIcon).toBeInTheDocument();
    expect(authorName).toBeInTheDocument();
    expect(socialLinks).toHaveLength(4);
  });

  it("renders the footer with all expected elements", () => {
    render(<Footer />);

    const links = screen
      .getAllByRole("link")
      .filter((element) => element.getAttribute("href") !== "/");

    links.forEach((linkElement, index) => {
      const expectedUrl = LINKS[index].url;
      expect(linkElement.getAttribute("href")).toStrictEqual(expectedUrl);
    });
  });
});
