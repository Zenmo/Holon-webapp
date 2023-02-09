import { useState } from "react";
import TokenService from "@/services/token";
import PasswordInput from "../PasswordInput/PasswordInput";

export default function NewPasswordCreate() {
  const [input, setInput] = useState({
    password: "",
    verifyPassword: "",
  });
  const [feedbackMessage, setFeedbackMessage] = useState("");

  function handlePasswordChange(password) {
    setInput(password);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const response = await fetch(`http://localhost:8000/dj-rest-auth/password/change/`, {
      method: "POST",
      body: JSON.stringify({
        new_password1: input.password,
        new_password2: input.verifyPassword,
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + TokenService.getAccessToken(),
      },
      credentials: "include",
    });
    if (response.ok) {
      setFeedbackMessage("Je wachtwoord is succesvol geupdate.");
    } else {
      setFeedbackMessage("Er is iets mis gegaan bij het updaten van je wachtwoord.");
    }
  }

  return (
    <div className="flex flex-col items-center m-8">
      <h2>Wachtwoord aanmaken</h2>
      <p>Vul hier je nieuwe wachtwoord in en herhaal het wachtwoord.</p>
      <form
        onSubmit={handleSubmit}
        data-testid="create-new-password-form"
        className="flex flex-col w-3/4 md:w-2/3 lg:w-1/3">
        <PasswordInput
          inputChange={handlePasswordChange}
          input={input}
          setParentMessage={setFeedbackMessage}
        />
        <p>{feedbackMessage}</p>
        <div className="flex justify-end">
          <button type="submit" className="buttonDark mt-8" onClick={handleSubmit}>
            Wachtwoord updaten
          </button>
        </div>
      </form>
    </div>
  );
}
