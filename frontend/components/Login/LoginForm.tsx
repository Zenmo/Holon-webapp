import Link from "next/link";

export default function LoginForm() {
  function handleSubmit(e) {
    console.log(e);
  }

  return (
    <div className="flex flex-col items-center m-8">
      <h2>Log in op Holontool.nl</h2>
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
          type="password"
          id="password"
          name="password"
          placeholder="Wachtwoord"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        />

        <p className="underline mt-8 decoration-holon-blue-900 decoration-2 underline-offset-4 hover:underline hover:decoration-gray-300 hover:decoration-2 hover:underline-offset-4 sm:p-0">
          <Link href="/requestPasswordReset">Wachtwoord vergeten?</Link>
        </p>

        <div className="flex justify-between">
          <p className="flex flex-row py-3 mt-8">
            Nog geen account?
            <Link href="/registratie">
              <a className="underline decoration-holon-blue-900 decoration-2 underline-offset-4 hover:underline hover:decoration-gray-300 hover:decoration-2 hover:underline-offset-4 sm:p-0">
                Registreer je
              </a>
            </Link>
          </p>
          <button
            type="submit"
            className="border-holon-blue-900  text-white mt-8 bg-holon-blue-900 hover:bg-holon-blue-500 flex flex-row justify-center items-center relative rounded border-2 nowrap px-4 py-3 mb-4 min-w-[8rem] text-center font-medium leading-5 transition enabled:active:translate-x-holon-bh-x enabled:active:translate-y-holon-bh-y disabled:opacity-50">
            Log in
          </button>
        </div>
      </form>
    </div>
  );
}
