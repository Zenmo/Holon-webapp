import Link from "next/link";
import { PencilSquareIcon } from "@heroicons/react/24/outline";

export default function UserProfile() {
  function handleSubmit(e) {
    console.log(e);
  }

  function handleRemoveProfile(e) {
    console.log("profiel verwijderd");
  }

  return (
    <div className="flex flex-col items-center m-8">
      <div className="flex flex-row justify-between w-3/4 md:w-2/3 lg:w-1/3">
        <h2>Profiel</h2>
        <button className="w-12 h-12 mb-4 absolute p-2 hover:bg-holon-purple-200">
          <PencilSquareIcon />
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        data-testid="login-form"
        className="flex flex-col  w-3/4 md:w-2/3 lg:w-1/3 m-8">
        <label htmlFor="email" className="block text-gray-700 text-lg font-bold mb-2 mt-8">
          E-mail:
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
          Wachtwoord:
        </label>
        <input
          type="text"
          id="password"
          name="password"
          placeholder="Wachtwoord"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        />

        <p className="underline mt-8 decoration-holon-blue-900 decoration-2 underline-offset-4 hover:underline hover:decoration-gray-300 hover:decoration-2 hover:underline-offset-4 sm:p-0">
          <Link href="/requestPasswordReset">Wachtwoord wijzigen</Link>
        </p>

        <div className="flex justify-between">
          <button
            onClick={handleRemoveProfile}
            className="border-holon-blue-900  text-white mt-8 bg-holon-blue-900 hover:bg-holon-blue-500 flex flex-row justify-center items-center relative rounded border-2 nowrap px-4 py-3 mb-4 min-w-[8rem] text-center font-medium leading-5 transition enabled:active:translate-x-holon-bh-x enabled:active:translate-y-holon-bh-y disabled:opacity-50">
            Profiel verwijderen
          </button>
          <button
            onClick={handleRemoveProfile}
            className="border-holon-blue-900  text-white mt-8 bg-holon-blue-900 hover:bg-holon-blue-500 flex flex-row justify-center items-center relative rounded border-2 nowrap px-4 py-3 mb-4 min-w-[8rem] text-center font-medium leading-5 transition enabled:active:translate-x-holon-bh-x enabled:active:translate-y-holon-bh-y disabled:opacity-50">
            Profiel verwijderen
          </button>
        </div>
      </form>
    </div>
  );
}
