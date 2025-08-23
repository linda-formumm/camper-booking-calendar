import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Layout from "../components/Layout";

describe("Layout", () => {
  it("renders navigation links", () => {
    render(
      <MemoryRouter>
        <Layout />
      </MemoryRouter>
    );

    expect(screen.getByText("Calendar")).toBeInTheDocument();
    expect(screen.getByRole("banner")).toBeInTheDocument();
  });

  it("has dark mode toggle button", () => {
    render(
      <MemoryRouter>
        <Layout />
      </MemoryRouter>
    );

    const toggleButton = screen.getByRole("button");
    expect(toggleButton).toBeInTheDocument();
  });
});
