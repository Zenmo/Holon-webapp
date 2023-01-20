import { useState } from "react";

export default function PasswordInput({ inputChange, input }) {
  const [error, setError] = useState({
    password: "",
    verifyPassword: "",
  });

  const onInputChange = (e: React.FormEvent<HTMLInputElement>): void => {
    e.preventDefault();
    inputChange({ ...input, [e.target.name]: e.target.value });
    validateInput(e);
  };

  const validateInput = e => {
    const { name, value } = e.target;
    setError(prev => {
      const stateObj = { ...prev, [name]: "" };

      switch (name) {
        case "password":
          if (!value) {
            stateObj[name] = "Vul hier je wachtwoord in.";
          } else if (input.verifyPassword && value !== input.verifyPassword) {
            stateObj["verifyPassword"] = "Wachtwoord en bevestiging wachtwoord komen niet overeen.";
          } else {
            stateObj["verifyPassword"] = input.verifyPassword ? "" : error.verifyPassword;
          }
          break;

        case "verifyPassword":
          if (!value) {
            stateObj[name] = "Bevestig hier je wachtwoord.";
          } else if (input.password && value !== input.password) {
            stateObj[name] = "Wachtwoord en bevestiging wachtwoord komen niet overeen.";
          }
          break;

        default:
          break;
      }

      return stateObj;
    });
  };
  return (
    <div>
      <label htmlFor="password" className="labelInputForm">
        Nieuw wachtwoord:
      </label>
      <input
        type="password"
        id="password"
        name="password"
        value={input.password}
        onChange={onInputChange}
        onBlur={validateInput}
        placeholder="Nieuw wachtwoord"
        className="inputForm"
        required
      />
      {error.password && <span className="text-red-700 block m-1">{error.password}</span>}

      <label htmlFor="verifyNewPassword" className="labelInputForm">
        Bevestig nieuw wachtwoord:
      </label>
      <input
        type="password"
        id="verifyPassword"
        name="verifyPassword"
        value={input.verifyPassword}
        onChange={onInputChange}
        onBlur={validateInput}
        placeholder="Bevestig nieuw wachtwoord"
        className="inputForm"
        required
      />
      {error.verifyPassword && (
        <span className="text-red-700 block m-1">{error.verifyPassword}</span>
      )}
    </div>
  );
}
