import { screen, render } from "@testing-library/react";
import Details from "./DetailsModal";
import "intersection-observer";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";

const setup = () => {
  render(<Details show={true} onClose={() => null} />);
};

beforeEach(() => {
  setup();
});

describe("Does it exist?", () => {
  it("renders a logo", () => {
    expect(screen.getByTestId("detailsModalLogo")).toBeInTheDocument();
  });
  it("renders a form", () => {
    expect(screen.getByTestId("detailsModalForm")).toBeInTheDocument();
  });
  it("renders a dialogue", () => {
    expect(screen.getByText("Finish Account Setup")).toBeInTheDocument();
  });
  it("renders a name input", () => {
    expect(screen.getByTestId("nameInput")).toBeInTheDocument();
  });
  it("renders a username input", () => {
    expect(screen.getByTestId("usernameInput")).toBeInTheDocument();
  });
  it("renders a confirm button", () => {
    expect(screen.getByRole("button", { name: "Confirm" })).toBeInTheDocument();
  });
});

describe("Does it function correctly?", () => {
  it("changes name input", async () => {
    const nameInput = screen.getByTestId("nameInput");
    await userEvent.type(nameInput, "Sample Name");
    expect(nameInput).toHaveValue("Sample Name");
  });
  it("changes username input", async () => {
    const usernameInput = screen.getByTestId("usernameInput");
    await userEvent.type(usernameInput, "Sample Username");
    expect(usernameInput).toHaveValue("Sample Username");
  });
  it("submit details", async () => {
    const submitButton = screen.getByRole("button", { name: "Confirm" });
    await userEvent.click(submitButton);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });
});
