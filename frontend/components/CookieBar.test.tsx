import { render, screen, fireEvent } from "@testing-library/react";

import CookieBar from "./CookieBar";

describe("Cookiebar", () => {
  const onAcceptMock = jest.fn();

  beforeEach(() => {
    render(<CookieBar onAccept={onAcceptMock} />);
  });

  it("is rendered", () => {
    expect(screen.queryByText("Accept cookies")).toBeDefined();
  });

  it("disappears when you click a button", () => {
    fireEvent.click(screen.getByRole("button", { name: /Accept cookies/i }));

    expect(screen.queryByText("Accept cookies")).not.toBeInTheDocument();
    expect(onAcceptMock.mock.calls.length).toBe(1);
  });
});

describe("does not show after choice", () => {
  it("will not show when page is rendered again", () => {
    render(<CookieBar onAccept={() => undefined} />);

    expect(screen.queryByText("Accept cookies")).not.toBeInTheDocument();
  });
});
