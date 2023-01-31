import { useState } from "react";
import * as Cookies from "es-cookie";
import PasswordInput from "../PasswordInput/PasswordInput";

export default function NewPasswordCreate() {
  const [input, setInput] = useState({
    password: "",
    verifyPassword: "",
  });

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
        "X-CSRFToken": Cookies.get("csrftoken"),
      },
      credentials: "include",
    });
  }

  return (
    <div className="flex flex-col items-center m-8">
      <h2>Wachtwoord aanmaken</h2>
      <p>Vul hier je nieuwe wachtwoord in en herhaal het wachtwoord.</p>
      <form
        onSubmit={handleSubmit}
        data-testid="create-new-password-form"
        className="flex flex-col w-3/4 md:w-2/3 lg:w-1/3">
        <PasswordInput inputChange={setInput} input={input} />
        <div className="flex justify-end">
          <button type="submit" className="buttonDark mt-8" onClick={handleSubmit}>
            Wachtwoord updaten
          </button>
        </div>
      </form>
    </div>
  );
}
