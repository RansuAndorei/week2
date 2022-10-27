import { screen, render } from "@testing-library/react";
import Input from "./Input";
import React from "react";
import "@testing-library/jest-dom";

interface Props {
  type: string;
  label: string;
  className: string;
}

const fieldMock = {};
const metaMock = {};
const helperMock = {};

jest.mock("formik", () => ({
  ...jest.requireActual("formik"),
  useField: jest.fn(() => {
    return [fieldMock, metaMock, helperMock];
  }),
}));

const setup = ({ type = "", label = "", className = "" }: Props) => {
  render(<Input type={type} label={label} className={className} />);
};

describe("Does it exist?", () => {
  it("renders a text input", () => {
    setup("text", "textInput");
    expect(screen.getByRole("textbox", { type: "text" })).toBeInTheDocument();
  });
  it("renders a password input", () => {
    setup("password", "passwordInput");
    expect(
      screen.getByRole("textbox", { type: "password" })
    ).toBeInTheDocument();
  });
  it("renders an email input", () => {
    setup("email", "emailInput");
    expect(screen.getByRole("textbox", { type: "email" })).toBeInTheDocument();
  });
  it("renders a checkbox input", () => {
    setup("checkbox", "checkboxInput");
    expect(
      screen.getByRole("textbox", { type: "checkbox" })
    ).toBeInTheDocument();
  });
  it("renders a date input", () => {
    setup("date", "dateInput");
    expect(screen.getByRole("textbox", { type: "date" })).toBeInTheDocument();
  });
  it("renders a textarea input", () => {
    setup("textarea", "teaxtareaInput");
    expect(
      screen.getByRole("textbox", { type: "textarea" })
    ).toBeInTheDocument();
  });
  it("renders an image input", () => {
    setup("image", "imageInput");
    expect(screen.getByRole("textbox", { type: "image" })).toBeInTheDocument();
  });
});
