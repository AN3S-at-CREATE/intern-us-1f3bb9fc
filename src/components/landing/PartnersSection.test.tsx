import { render, screen } from "@testing-library/react";
import { PartnersSection } from "./PartnersSection";

describe("PartnersSection", () => {
  it("renders all partner logos with descriptive alt text", () => {
    render(<PartnersSection />);

    const expectedLogos = [
      "University of Cape Town logo",
      "Wits University logo",
      "Stellenbosch University logo",
      "Standard Bank logo",
      "MTN logo",
      "Vodacom logo",
    ];

    expectedLogos.forEach((altText) => {
      expect(screen.getByAltText(altText)).toBeInTheDocument();
    });
  });
});
