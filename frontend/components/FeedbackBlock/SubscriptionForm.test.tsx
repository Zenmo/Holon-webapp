import { render, screen, fireEvent } from "@testing-library/react";
import { act } from "react-dom/test-utils";

import fetchMock from "jest-fetch-mock";

import SubscriptionForm from "./SubscriptionForm";

async function completeForm({
  name,
  email,
  company,
}: {
  name: string;
  email: string;
  company?: string;
}) {
  const nameEl = screen.getByLabelText("Naam");
  const emailEl = screen.getByLabelText("E-mailadres");
  const companyEl = screen.getByLabelText(/Bedrijf/);
  const submitEl = screen.getByRole("button");

  fetchMock.mockResponse(JSON.stringify({ name, company, email }));

  return await act(async () => {
    fireEvent.change(nameEl, { target: { value: name } });
    fireEvent.change(emailEl, { target: { value: email } });
    fireEvent.change(companyEl, { target: { value: company } });

    fireEvent.click(submitEl);
  });
}

describe("SubscriptionForm", () => {
  afterEach(() => {
    fetchMock.mockRestore();
  });

  describe("with a name and e-mail", () => {
    beforeEach(() => {
      render(<SubscriptionForm />);
    });

    it("submits the data to an API endpoint", async () => {
      await completeForm({ name: "John Doe", email: "hello@example.org" });

      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    it("disables the inputs and submit button", async () => {
      await completeForm({ name: "John Doe", email: "hello@example.org" });

      expect(screen.getByLabelText("Naam")).toBeDisabled();
      expect(screen.getByLabelText("E-mailadres")).toBeDisabled();
      expect(screen.getByRole("button")).toBeDisabled();
    });

    it("displays a thank you message", async () => {
      await completeForm({ name: "John Doe", email: "hello@example.org" });

      expect(screen.queryByRole("button", { name: "Bevestig" })).not.toBeInTheDocument();
      expect(screen.queryByRole("button", { name: "Met dank!" })).toBeInTheDocument();
    });
  });

  describe("when the API request fails", () => {
    beforeEach(() => {
      render(<SubscriptionForm />);

      global.fetch = jest.fn(() =>
        Promise.reject({
          json: () => Promise.resolve({}),
        })
      );
    });

    it("submits the data to an API endpoint", async () => {
      await completeForm({ name: "John Doe", email: "hello@example.org" });

      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    it("enables the inputs and submit button", async () => {
      await completeForm({ name: "John Doe", email: "hello@example.org" });

      expect(screen.getByLabelText("Naam")).not.toBeDisabled();
      expect(screen.getByLabelText("E-mailadres")).not.toBeDisabled();
      expect(screen.getByRole("button")).not.toBeDisabled();
    });

    it("reverts the submit button to the original text", async () => {
      await completeForm({ name: "John Doe", email: "hello@example.org" });

      expect(screen.queryByRole("button", { name: "Bevestig" })).toBeInTheDocument();
      expect(screen.queryByRole("button", { name: "Met dank!" })).not.toBeInTheDocument();
    });
  });
});
