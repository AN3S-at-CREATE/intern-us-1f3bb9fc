import { describe, it, expect } from 'vitest';
import { render, screen } from "@testing-library/react";
import { PartnersSection } from "./PartnersSection";

describe("PartnersSection", () => {
  it("renders all partner logos with descriptive alt text", () => {
    render(<PartnersSection />);

    const expectedLogos = [
      "University of Cape Town partnership placeholder",
      "University of the Witwatersrand partnership placeholder",
      "Stellenbosch University partnership placeholder",
      "Standard Bank partnership placeholder",
      "MTN Group partnership placeholder",
      "Vodacom partnership placeholder",
    ];

    expectedLogos.forEach((altText) => {
      expect(screen.getByAltText(altText)).toBeInTheDocument();
    });
  });
});
