import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { act } from "react-dom/test-utils";

import Sentiment from ".";

describe("Sentiment", () => {
  it("renders with no option selected", () => {
    render(<Sentiment />);

    const radios = screen.queryAllByRole("radio");

    expect(radios).toHaveLength(4);

    radios.forEach((radio) => {
      expect(radio.getAttribute("aria-checked")).toEqual("false");
    });
  });

  describe("when submitting a sentiment", () => {
    beforeEach(() => {
      fetchMock.mockResponse(JSON.stringify({ id: 1, rating: "HEART" }));
    });

    afterEach(() => {
      fetchMock.mockRestore();
    });

    it("allows selecting an option", async () => {
      const screen = render(<Sentiment />);
      const radios = screen.queryAllByRole("radio");

      await act(async () => {
        return await fireEvent.click(radios[0]);
      });

      await waitFor(() => {
        expect(radios[0].getAttribute("aria-checked")).toEqual("true");
      });
    });

    it("sends data to the API", async () => {
      const screen = render(<Sentiment />);
      const radios = screen.queryAllByRole("radio");

      await act(async () => {
        return await fireEvent.click(radios[1]);
      });

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledTimes(1);
      });

      const sentData = JSON.parse(global.fetch.mock.calls[0][1].body);
      expect(sentData).toEqual({ rating: "THUMBSUP" });
    });
  });
});
