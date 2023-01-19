export default function UpdatePassword({ handleChange, handleSubmit }) {
  return (
    <div className="mt-8">
      <form onSubmit={handleSubmit} data-testid="edit-password" className="flex flex-col">
        <label htmlFor="oldPassword" className="labelInputForm">
          Huidig wachtwoord:
        </label>
        <input
          type="password"
          id="currentPassword"
          name="currentPassword"
          onChange={handleChange}
          placeholder="Oud wachtwoord"
          className="inputForm"
          required
        />

        <label htmlFor="newPassword" className="labelInputForm">
          Nieuw wachtwoord:
        </label>
        <input
          type="password"
          id="newPassword"
          name="newPassword"
          onChange={handleChange}
          placeholder="Nieuw wachtwoord"
          className="inputForm"
          required
        />

        <label htmlFor="verifyNewPassword" className="labelInputForm">
          Bevestig nieuw wachtwoord:
        </label>
        <input
          type="password"
          id="verifyNewPassword"
          name="verifyNewPassword"
          onChange={handleChange}
          placeholder="Bevestig nieuw wachtwoord"
          className="inputForm"
          required
        />
        <div className="flex justify-end">
          <button type="submit" className="buttonDark">
            Wachtwoord updaten
          </button>
        </div>
      </form>
    </div>
  );
}
