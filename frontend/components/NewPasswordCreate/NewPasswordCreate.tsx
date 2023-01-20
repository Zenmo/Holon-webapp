import { useState } from "react";
import PasswordInput from "../PasswordInput/PasswordInput";

export default function NewPasswordCreate() {
  const [input, setInput] = useState({
    password: "",
    verifyPassword: "",
  });

  function handleSubmit() {
    console.log("wachtwoord geupdate");
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
          <button type="submit" className="buttonDark">
            Wachtwoord updaten
          </button>
        </div>
      </form>
    </div>
  );
}
