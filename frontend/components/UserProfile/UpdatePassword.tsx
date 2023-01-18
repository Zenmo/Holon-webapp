export default function UpdatePassword(onSubmit) {
  return (
    <div className="">
      <form onSubmit={onSubmit} data-testid="edit-password" className="flex flex-col">
        <label htmlFor="oldPassword" className="block text-gray-700 text-lg font-bold mb-2">
          Oud wachtwoord:
        </label>
        <input
          type="text"
          id="oldPassword"
          name="oldPassword"
          placeholder="Oud wachtwoord"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        />

        <label htmlFor="newPassword" className="block text-gray-700 text-lg mt-8 font-bold mb-2">
          Nieuw wachtwoord:
        </label>
        <input
          type="text"
          id="newPassword"
          name="newPassword"
          placeholder="Nieuw wachtwoord"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        />

        <label
          htmlFor="verifyNewPassword"
          className="block text-gray-700 text-lg font-bold mb-2 mt-8">
          Bevestig nieuw wachtwoord:
        </label>
        <input
          type="verifyNewPassword"
          id="verifyNewPassword"
          name="verifyNewPassword"
          placeholder="Bevestig nieuw wachtwoord"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        />

        <button
          type="submit"
          className="border-holon-blue-900  text-white mt-8 bg-holon-blue-900 w-44 hover:bg-holon-blue-500 flex flex-row justify-center items-center relative rounded border-2 nowrap px-4 py-3 mb-4 min-w-[8rem] text-center font-medium leading-5 transition enabled:active:translate-x-holon-bh-x enabled:active:translate-y-holon-bh-y disabled:opacity-50">
          Wachtwoord updaten
        </button>
      </form>
    </div>
  );
}
