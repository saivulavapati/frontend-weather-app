import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginForm from "../LoginForm";
import { AuthProvider } from "../../context/AuthContext";
import { MemoryRouter } from "react-router-dom";

global.fetch = jest.fn();

describe("LoginForm Component", () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test("renders login form correctly", () => {
    render(
      <AuthProvider>
        <MemoryRouter>
          <LoginForm />
        </MemoryRouter>
      </AuthProvider>
    );

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /log in/i })).toBeInTheDocument();
  });

  test("validates empty fields", async () => {
    render(
      <AuthProvider>
        <MemoryRouter>
          <LoginForm />
        </MemoryRouter>
      </AuthProvider>
    );

    fireEvent.click(screen.getByRole("button", { name: /log in/i }));

    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    });
  });

  test("shows error on invalid email", async () => {
    render(
      <AuthProvider>
        <MemoryRouter>
          <LoginForm />
        </MemoryRouter>
      </AuthProvider>
    );

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "invalid-email" } });
    fireEvent.blur(screen.getByLabelText(/email/i));

    await waitFor(() => {
      expect(screen.getByText(/invalid email address/i)).toBeInTheDocument();
    });
  });

  test("submits form successfully", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: "Login successful" }),
    });

    render(
      <AuthProvider>
        <MemoryRouter>
          <LoginForm />
        </MemoryRouter>
      </AuthProvider>
    );

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "test@example.com" } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "password123" } });
    fireEvent.click(screen.getByRole("button", { name: /log in/i }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(expect.stringContaining("/auth/signin"), expect.any(Object));
    });
  });

  test("displays error message on failed login", async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({ message: "Invalid email or password." }),
    });

    render(
      <AuthProvider>
        <MemoryRouter>
          <LoginForm />
        </MemoryRouter>
      </AuthProvider>
    );

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "wrong@example.com" } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "wrongpass" } });
    fireEvent.click(screen.getByRole("button", { name: /log in/i }));

    await waitFor(() => {
      expect(screen.getByText(/invalid email or password/i)).toBeInTheDocument();
    });
  });
});
