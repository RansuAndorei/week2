import { screen, render } from "@testing-library/react";
import { Star } from "./Star";
import React from "react";
import "@testing-library/jest-dom";

const setup = () => {
  render(<Star rating={3} size={15} />);
};

describe("Does it exist?", () => {
  it("renders a rating", () => {
    setup();
    expect(screen.getByTestId("ratings")).toBeInTheDocument();
  });
});

describe("Does it function correctly?", () => {
  it("renders a correct number of solid", () => {
    setup();
    expect(screen.getByTestId("solidStar3")).toBeInTheDocument();
  });
  it("renders a correct number of outline", () => {
    setup();
    expect(screen.getByTestId("outlineStar2")).toBeInTheDocument();
  });
});
