import { screen, render } from "@testing-library/react";
import ImageUpload from "./ImageUpload";
import React from "react";
import "@testing-library/jest-dom";

const setup = () => {
  render(
    <ImageUpload
      accept=".png, .jpg, .jpeg, .gif"
      sizeLimit={10 * 1024 * 1024}
      onChangePicture={() => null}
    />
  );
};

beforeEach(() => {
  setup();
});

describe("Does it exist?", () => {
  it("renders an upload button", () => {
    expect(screen.getByRole("button", { name: "Upload" })).toBeInTheDocument();
  });
  it("renders an image input", () => {
    expect(screen.getByTestId("imageInput")).toBeInTheDocument();
  });
});
