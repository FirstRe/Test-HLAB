import UserProfile from "@/app/UserProfile";
import { render, waitFor } from "@testing-library/react";

const mockFetch = jest.fn();

describe("test UserProfile", () => {
  beforeEach(() => {
    global.fetch = mockFetch;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("display loading", () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(),
      })
    ) as jest.Mock;

    const renderer = render(<UserProfile userId="1" />);
    expect(renderer.getByText(/Loading.../i)).toBeInTheDocument();
  });

  test("display User data", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({ name: "John Doe", email: "john@example.com" }),
      })
    ) as jest.Mock;

    const renderer = render(<UserProfile userId="1" />);

    await waitFor(() => {
      expect(renderer.getByText("John Doe")).toBeInTheDocument();
      expect(renderer.getByText("john@example.com")).toBeInTheDocument();
    });
  });

  test("displays error when fetch got error", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => new Error("Failed to fetch data"),
      })
    ) as jest.Mock;

    const renderer = render(<UserProfile userId="1" />);

    await waitFor(() => {
      expect(renderer.getByText("Failed to fetch data")).toBeInTheDocument();
    });
  });
});
