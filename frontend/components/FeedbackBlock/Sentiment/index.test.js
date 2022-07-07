import { render, screen, fireEvent, prettyDOM } from "@testing-library/react";

import Sentiment from ".";

describe("Sentiment", () => {
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({}),
      })
    );
  });

  afterEach(jest.restoreAllMocks);

  it("renders with no option selected", () => {
    render(<Sentiment />);

    const radios = screen.queryAllByRole("radio");

    expect(radios).toHaveLength(4);

    radios.forEach((radio) => {
      expect(radio.getAttribute("aria-checked")).toEqual("false");
    });
  });

  it("allows selecting an option", () => {
    const screen = render(<Sentiment />);
    const radios = screen.queryAllByRole("radio");

    fireEvent.click(radios[0]);

    expect(radios).toHaveLength(4);
    expect(radios[0].getAttribute("aria-checked")).toEqual("true");
  });

  describe("when submitting a sentiment", () => {
    it("sends data to the API", () => {
      render(<Sentiment />);

      fireEvent.click(screen.getAllByRole("radio")[0]);

      expect(global.fetch).toHaveBeenCalledTimes(1);

      const sentData = JSON.parse(global.fetch.mock.calls[0][1].body);
      expect(sentData).toEqual({ rating: "HEART" });
    });
  });
});
