import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import WeatherData from "../WeatherData";;

global.fetch = jest.fn();
global.alert = jest.fn();

const mockWeatherResponse = {
  name: "Hyderabad",
  sys: { country: "IN", sunrise: 1700000000, sunset: 1700050000 },
  main: { temp_max: 30, temp_min: 20, feels_like: 25, humidity: 60, pressure: 1012 },
  weather: [{ description: "Clear sky", icon: "01d" }],
  visibility: 10000,
  wind: { speed: 2 },
  clouds: { all: 10 },
  coord: { lat: 17.385, lon: 78.486 },
  dt: 1700000000
};

const mockWishlistResponse = [{ cityName: "Hyderabad" }];

describe("WeatherData Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders loading state initially", async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ data: JSON.stringify(mockWeatherResponse) }) });
    
    render(<WeatherData city="Hyderabad" />);
    
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  test("displays weather data after fetching", async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ data: JSON.stringify(mockWeatherResponse) }) })
         .mockResolvedValueOnce({ ok: true, json: async () => mockWishlistResponse });

    render(<WeatherData city="Hyderabad" />);

    await waitFor(() => {
        expect(screen.getByText(/Hyderabad/i)).toBeInTheDocument();
      });

  });


  test("handles errors correctly", async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Something went wrong. Please try again." }),
    });
    render(<WeatherData city="InvalidCity" />);
    await waitFor(() => {
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    });
})
  

  test("toggles hourly weather display", async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ data: JSON.stringify(mockWeatherResponse) }) })
         .mockResolvedValueOnce({ ok: true, json: async () => mockWishlistResponse });

    render(<WeatherData city="Hyderabad" />);

    const toggleButton = await screen.findByText("Show Hourly");
    fireEvent.click(toggleButton);
    expect(await screen.findByText("Hide Hourly")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Hide Hourly"));
    expect(await screen.findByText("Show Hourly")).toBeInTheDocument();
  });
});
