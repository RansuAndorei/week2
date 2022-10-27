import { screen, render } from "@testing-library/react";
import Grid from "./Grid";
import React from "react";
import "@testing-library/jest-dom";

const mockFoods = [
  {
    id: 1,
    image:
      "https://cmxohivoakygaalicrhd.supabase.in/storage/v1/object/public/favoritefoods/VOeLEgpf1An_l0pK_JXDY.jpeg",
    title: "Adobo",
    description: "Lorem Ipsum Adobo",
    rating: 5,
  },
  {
    id: 2,
    image:
      "https://cmxohivoakygaalicrhd.supabase.in/storage/v1/object/public/favoritefoods/LB6POpbyhYcUwAEHTbW0h.jpeg",
    title: "Inasal",
    description: "Lorem Ipsum Inasal",
    rating: 3,
  },
];

const mockSession = {
  user: {
    id: 1,
    name: "Lance Juat",
  },
};

const setup = (food) => {
  render(<Grid foods={food} session={mockSession} />);
};

describe("Does it exist?", () => {
  it("renders empty food list", () => {
    setup([]);
    expect(
      screen.getByText(/Unfortunately, there is nothing to display yet./i)
    ).toBeInTheDocument();
  });
  it("renders a food list", () => {
    setup(mockFoods);
    expect(screen.getByText(/Adobo/i)).toBeInTheDocument();
    expect(screen.getByText(/Inasal/i)).toBeInTheDocument();
  });
});
