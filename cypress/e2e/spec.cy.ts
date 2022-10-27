/// <reference types="cypress" />

describe("Functionality", () => {
  it("Login through user and password", () => {
    cy.visit("localhost:3000/");
    cy.get("#loginButton").click();
    cy.get("#changeToLogin").click();
    cy.get("#usernameInput").type("lanceandrei.juat@tup.edu.ph");
    cy.get("#passwordInput").type("lancetup");
    cy.get("#signInButton").click();
  });
  it("Add Food", () => {
    cy.pause();
    cy.get("#addFoodButton").click();

    // cy.visit("localhost:3000/create");
    cy.get("input[name=title]").type("Sample Food");
    cy.get("#descriptionInput").type("Lorem Ipsum Doloret");
    cy.get("input[name=rating]").type("{backspace}5");
    cy.get("#addNewFoodButton").click();
  });
  it("Logout", () => {
    cy.get("#dropdown").click();
    cy.get("#Logout").click();
    cy.visit("localhost:3000/");
  });
});
