import React from "react";

export default function RegistrationForm() {
  function handleSubmit(e) {
    console.log(e);
  }

  return (
    <div className="flex flex-col items-center m-8">
      <h2>Registreer je voor Holontool.nl</h2>
      <form
        onSubmit={handleSubmit}
        data-testid="registration-form"
        className="flex flex-col w-3/4 md:w-2/3 lg:w-1/3 m-8">
        <label htmlFor="name" className="block text-gray-700 text-lg font-bold mb-2">
          Naam*:
        </label>
        <input
          type="text"
          id="name"
          name="name"
          placeholder="Naam"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        />

        <label htmlFor="email" className="block text-gray-700 text-lg font-bold mb-2 mt-8">
          E-mail*:
        </label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="E-mail"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        />

        <label htmlFor="password" className="block text-gray-700 text-lg font-bold mb-2 mt-8">
          Wachtwoord*:
        </label>
        <input
          type="text"
          id="password"
          name="password"
          placeholder="Wachtwoord"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        />

        <label
          htmlFor="confirmPassword"
          className="block text-gray-700 text-lg font-bold mb-2 mt-8">
          Wachtwoord bevestigen*:
        </label>
        <input
          type="text"
          id="confirmPassword"
          name="confirmPassword"
          placeholder="Wachtwoord bevestigen"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
        <p className="text-gray-600 text-xs italic mt-4">* is verplicht</p>

        <div className="flex justify-center">
          <button
            type="submit"
            className="border-holon-blue-900  text-white mt-8 bg-holon-blue-900 hover:bg-holon-blue-500 flex flex-row justify-center items-center relative rounded border-2 nowrap px-4 py-3 mb-4 min-w-[8rem] text-center font-medium leading-5 transition enabled:active:translate-x-holon-bh-x enabled:active:translate-y-holon-bh-y disabled:opacity-50">
            Registreer
          </button>
        </div>
      </form>
    </div>
  );
}
