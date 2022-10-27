import { screen, render, waitFor } from "@testing-library/react";
import AuthModal from "./AuthModal";
import React from "react";
import "intersection-observer";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

const setup = () => {
  render(<AuthModal show={true} onClose={() => null} />);
};

beforeEach(() => {
  setup();
});

describe("Does it exist?", () => {
  it("renders a logo", () => {
    expect(screen.getByTestId("favoriteFoodsLogo")).toBeInTheDocument();
  });
  it("renders the sign up with google button", () => {
    expect(screen.getByTestId("google")).toBeInTheDocument();
  });
  it("renders the email input", () => {
    expect(screen.getByTestId("emailInput")).toBeInTheDocument();
  });
  it("renders the sign in with google", async () => {
    await userEvent.click(screen.getByRole("button", { name: /log in/i }));
    await waitFor(() =>
      expect(screen.getByTestId("google")).toBeInTheDocument()
    );
  });
  it("renders the sign up with email", async () => {
    await userEvent.click(screen.getByRole("button", { name: /log in/i }));
    await waitFor(() =>
      expect(screen.getByTestId("emailInput")).toBeInTheDocument()
    );
  });
  it("renders the sign up with username", async () => {
    await userEvent.click(screen.getByRole("button", { name: /log in/i }));
    await waitFor(() =>
      expect(screen.getByTestId("usernameInput")).toBeInTheDocument()
    );
  });
  it("renders the sign up with password", async () => {
    await userEvent.click(screen.getByRole("button", { name: /log in/i }));
    await waitFor(() =>
      expect(screen.getByTestId("passwordInput")).toBeInTheDocument()
    );
  });
});

describe("Does it function correctly?", () => {
  it("shows email field error", async () => {
    await userEvent.click(screen.getByRole("button", { name: /send email/i }));
    await waitFor(() =>
      expect(screen.getByText(/this field is required/i)).toBeInTheDocument()
    );
  });
  it("changes email input", async () => {
    const emailInput = screen.getByTestId(/emailInput/i);
    await userEvent.type(emailInput, "lancejuat26@gmail.com");
    expect(
      screen.getByDisplayValue(/lancejuat26@gmail.com/i)
    ).toBeInTheDocument();
  });
  it("sends magic link", async () => {
    const emailInput = screen.getByTestId("emailInput");
    await userEvent.type(emailInput, "lancejuat26@gmail.com");
    // await userEvent.click(screen.getByTestId("sendEmailButton"));
  });
  it("shows username field error", async () => {
    await userEvent.click(screen.getByRole("button", { name: /log in/i }));
    await waitFor(() =>
      expect(screen.getByTestId("usernameInput")).toBeInTheDocument()
    );
    await userEvent.click(screen.getByTestId(/signInButton/i));
    await waitFor(() =>
      expect(screen.getByText(/username is required/i)).toBeInTheDocument()
    );
  });
  it("shows password field error", async () => {
    await userEvent.click(screen.getByRole("button", { name: /log in/i }));
    await waitFor(() =>
      expect(screen.getByTestId("passwordInput")).toBeInTheDocument()
    );
    await userEvent.click(screen.getByTestId(/signInButton/i));
    await waitFor(() =>
      expect(screen.getByText(/password is required/i)).toBeInTheDocument()
    );
  });
  it("sign in using username and password", async () => {
    await userEvent.click(screen.getByRole("button", { name: /log in/i }));
    await waitFor(() =>
      expect(screen.getByTestId("passwordInput")).toBeInTheDocument()
    );
    const emailInput = screen.getByTestId("usernameInput");
    const passwordInput = screen.getByTestId("passwordInput");
    await userEvent.type(emailInput, "LanceJuat");
    await userEvent.type(passwordInput, "lancejuat");
    await userEvent.click(screen.getByTestId(/signInButton/i));
  });
});
