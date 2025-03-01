import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import WeatherApp from "../WeatherApp";
import { useAuth } from "../../context/AuthContext";

jest.mock("../../context/AuthContext", () => ({
  useAuth: jest.fn(),
}));

global.fetch = jest.fn();

describe("WeatherApp Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAuth.mockReturnValue({ setUser: jest.fn() });
    global.alert = jest.fn();
  });

  test("renders WeatherApp and search form", () => {
    render(
      <MemoryRouter>
        <WeatherApp />
      </MemoryRouter>
    );

    expect(screen.getByPlaceholderText("Search City")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /search/i })).toBeInTheDocument();
  });

  test("shows alert when submitting empty city", () => {
    render(
      <MemoryRouter>
        <WeatherApp />
      </MemoryRouter>
    );

    fireEvent.submit(screen.getByRole("button", { name: /search/i }));

    expect(global.alert).toHaveBeenCalledWith("City cannot be Empty..");
  });
});
