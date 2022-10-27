import { screen, render } from "@testing-library/react";
import ListingForm from "./ListingForm";
import React from "react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";

const setup = () => {
  render(<ListingForm />);
};

describe("Does it exist?", () => {
  beforeEach(() => {
    setup();
  });
  it("renders a title input", () => {
    expect(screen.getByTestId("titleInput")).toBeInTheDocument();
  });
  it("renders a description input", () => {
    expect(screen.getByTestId("descriptionInput")).toBeInTheDocument();
  });
  it("renders a rating input", () => {
    expect(screen.getByRole("spinbutton")).toBeInTheDocument();
  });
  it("renders an isPublic checkbox", () => {
    expect(
      screen.getByRole("checkbox", { name: /public food/i })
    ).toBeInTheDocument();
  });
  it("renders an upload button", () => {
    expect(screen.getByRole("button", { name: /upload/i })).toBeInTheDocument();
  });
  it("renders a submit button", () => {
    expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument();
  });
});

describe("Does it function correctly?", () => {
  it("renders an initial value", () => {
    render(
      <ListingForm
        initialValues={{
          title: "Adobo",
          description: "Lorem Ipsum",
          rating: 5,
          is_public: true,
        }}
      />
    );
    expect(screen.getByTestId("titleInput")).toHaveValue("Adobo");
    expect(screen.getByTestId("descriptionInput")).toHaveValue("Lorem Ipsum");
    expect(screen.getByRole("spinbutton")).toHaveValue(5);
    expect(
      screen.getByRole("checkbox", { name: /public food/i })
    ).toBeChecked();
  });
  it("changes title input", async () => {
    setup();
    const titleInput = screen.getByTestId("titleInput");
    await userEvent.type(titleInput, "Sinigang");
    expect(titleInput).toHaveValue("Sinigang");
  });
  it("changes description input", async () => {
    setup();
    const descriptionInput = screen.getByTestId("descriptionInput");
    await userEvent.type(descriptionInput, "Sample Description");
    expect(descriptionInput).toHaveValue("Sample Description");
  });
  it("changes rating input", async () => {
    setup();
    const ratingInput = screen.getByRole("spinbutton");
    await userEvent.type(ratingInput, "{backspace}3");
    expect(ratingInput).toHaveValue(3);
  });
  it("changes isPublic checkbox", async () => {
    setup();
    const checkbox = screen.getByRole("checkbox", { name: /public food/i });
    await userEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });
  it("submit details", async () => {
    setup();

    await userEvent.click(screen.getByRole("button", { name: /submit/i }));
    expect(
      screen.getByRole("button", {
        name: /submitting.../i,
      })
    ).toBeInTheDocument();
  });
});
