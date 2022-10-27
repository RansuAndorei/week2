import { screen, render } from "@testing-library/react";
import Card from "./Card";
import React from "react";
import "@testing-library/jest-dom";

const setup = () => {
  render(<Card title={"Adobo"} rating={5} image="/vercel.svg" id={5} />);
};

describe("Does it exist?", () => {
  it("renders a food title", () => {
    setup();
    expect(screen.getByTestId("cardTitle")).toBeInTheDocument();
  });
  it("renders a food image", () => {
    setup();
    expect(screen.getByRole("img", { name: /Adobo/i })).toBeInTheDocument();
  });
});
