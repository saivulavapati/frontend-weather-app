import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import RegistrationForm from "../RegistrationForm";
import { act } from "@testing-library/react";

jest.mock("../../utils/config", () => ({
  API_BASE_URL: "http://mock-api.com",
}));

global.fetch = jest.fn();


describe("RegistrationForm", () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test("shows validation errors", async () => {
    render(
      <MemoryRouter>
        <RegistrationForm />
      </MemoryRouter>
    );
  
    fireEvent.click(screen.getByText("Register"));
  
    expect(await screen.findByText("First name is required")).toBeInTheDocument();
    expect(await screen.findByText("Last name is required")).toBeInTheDocument();
    expect(await screen.findByText("Email is required")).toBeInTheDocument();
    expect(await screen.findByText("Date of birth is required")).toBeInTheDocument();
    expect(await screen.findByText("Password is required")).toBeInTheDocument();
    expect(await screen.findByText("Confirm password is required")).toBeInTheDocument();
  });
  
  

  test("registers successfully", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    });

    render(
      <MemoryRouter>
        <RegistrationForm />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText("First Name"), { target: { value: "John" } });
    fireEvent.change(screen.getByLabelText("Last Name"), { target: { value: "Doe" } });
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "test@example.com" } });
    fireEvent.change(screen.getByLabelText("Date of Birth"), { target: { value: "2000-01-01" } }); // Fix missing field
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "Password123" } });
    fireEvent.change(screen.getByLabelText("Confirm Password"), { target: { value: "Password123" } });

    await act(async () => {
      fireEvent.click(screen.getByText("Register"));
    });

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(fetch).toHaveBeenCalledWith("http://mock-api.com/users/register", expect.any(Object)));
  });

});
