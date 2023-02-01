import PasswordInput from "../PasswordInput/PasswordInput";

export default function UpdatePassword({ handleChange, handleSubmit, input }) {
  const onInputChange = (e: React.FormEvent<HTMLInputElement>): void => {
    e.preventDefault();
    handleChange({ ...input, [e.target.name]: e.target.value });
    setMessage("");
  };

  return (
    <div className="">
      <form onSubmit={handleSubmit} data-testid="edit-password" className="flex flex-col">
        <label htmlFor="oldPassword" className="labelInputForm">
          Huidig wachtwoord:
        </label>
        <input
          type="password"
          id="currentPassword"
          name="currentPassword"
          onChange={onInputChange}
          placeholder="Oud wachtwoord"
          minLength={6}
          className="inputForm"
          required
        />

        <PasswordInput inputChange={handleChange} input={input} />

        <div className="flex justify-end">
          <button type="submit" className="buttonDark mt-8" onClick={handleSubmit}>
            Wachtwoord updaten
          </button>
        </div>
      </form>
    </div>
  );
}
