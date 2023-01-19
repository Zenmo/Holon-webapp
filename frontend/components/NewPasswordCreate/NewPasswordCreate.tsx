import { useState } from "react";

export default function NewPasswordCreate() {
  const [input, setInput] = useState({
    newPassword: "",
    verifyNewPassword: "",
  });

  const [error, setError] = useState({
    newPassword: "",
    verifyNewPassword: "",
  });

  const onInputChange = (e: React.FormEvent<HTMLInputElement>): void => {
    e.preventDefault();
    setInput({ ...input, [e.target.name]: e.target.value });
    validateInput(e);
  };

  const validateInput = e => {
    const { name, value } = e.target;
    setError(prev => {
      const stateObj = { ...prev, [name]: "" };

      switch (name) {
        case "newPassword":
          if (!value) {
            stateObj[name] = "Vul hier je nieuwe wachtwoord in.";
          } else if (input.verifyNewPassword && value !== input.verifyNewPassword) {
            stateObj["verifyNewPassword"] =
              "Wachtwoord en bevestiging wachtwoord komen niet overeen.";
          } else {
            stateObj["verifyNewPassword"] = input.verifyNewPassword ? "" : error.verifyNewPassword;
          }
          break;

        case "verifyNewPassword":
          if (!value) {
            stateObj[name] = "Bevestig hier je nieuwe wachtwoord.";
          } else if (input.newPassword && value !== input.newPassword) {
            stateObj[name] = "Wachtwoord en bevestiging wachtwoord komen niet overeen.";
          }
          break;

        default:
          break;
      }

      return stateObj;
    });
  };

  function handleSubmit() {
    if (input.newPassword !== input.verifyNewPassword) {
      console.log("wachtwoord komt niet overeen");
    } else {
      console.log("wachtwoord geupdate");
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
        <label htmlFor="newPassword" className="labelInputForm">
          Nieuw wachtwoord:
        </label>
        <input
          type="password"
          id="newPassword"
          name="newPassword"
          value={input.newPassword}
          onChange={onInputChange}
          onBlur={validateInput}
          placeholder="Nieuw wachtwoord"
          className="inputForm"
          required
        />
        {error.newPassword && <span className="text-red-700 mt-0.5">{error.newPassword}</span>}

        <label htmlFor="verifyNewPassword" className="labelInputForm">
          Bevestig nieuw wachtwoord:
        </label>
        <input
          type="password"
          id="verifyNewPassword"
          name="verifyNewPassword"
          value={input.verifyNewPassword}
          onChange={onInputChange}
          onBlur={validateInput}
          placeholder="Bevestig nieuw wachtwoord"
          className="inputForm"
          required
        />
        {error.verifyNewPassword && (
          <span className="text-red-700 mt-0.5">{error.verifyNewPassword}</span>
        )}

        <div className="flex justify-end">
          <button type="submit" className="buttonDark">
            Wachtwoord updaten
          </button>
        </div>
      </form>
    </div>
  );
}
