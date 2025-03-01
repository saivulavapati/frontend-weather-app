import { render, screen, waitFor } from "@testing-library/react";
import WeatherHourly from "../WeatherHourly";

describe("WeatherHourly Component", () => {
  beforeEach(() => {
    jest.spyOn(global, "fetch");
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("displays loading spinner while fetching data", () => {
    fetch.mockResolvedValueOnce(
      new Promise(() => {})
    );
    render(<WeatherHourly lat={17.385} lon={78.4867} />);
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  test("displays hourly forecast after successful API call", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        data: JSON.stringify({
          list: [
            {
              dt: 1708978800,
              dt_txt: "2025-02-27 12:00:00",
              main: { temp: 30, humidity: 60 },
              weather: [{ icon: "10d", description: "clear sky" }],
              wind: { speed: 5 },
            },
          ],
        }),
      }),
    });

    render(<WeatherHourly lat={17.385} lon={78.4867} />);

    await waitFor(() => {
        expect(
            screen.getByText((content) => content.includes("12:00"))
          ).toBeInTheDocument();
          screen.getByText((content) => content.includes("clear sky"))
          .toBeInTheDocument();
    });
  });

//   test("shows error message when API request fails", async () => {
//     fetch.mockResolvedValueOnce({
//       ok: false,
//       json: async () => ({ error: "Failed to load hourly forecast." }),
//     });

//     render(<WeatherHourly lat={17.385} lon={78.4867} />);

//     await waitFor(() => {
//         expect(
//           screen.getByText((content) => content.includes("Failed to load hourly forecast"))
//         ).toBeInTheDocument();
//       });
//   });

  test("handles case where no forecast is available", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        data: JSON.stringify({ list: [] }),
      }),
    });

    render(<WeatherHourly lat={17.385} lon={78.4867} />);

    await waitFor(() => {
      expect(
        screen.getByText("No forecast available for today.")
      ).toBeInTheDocument();
    });
  });
});
