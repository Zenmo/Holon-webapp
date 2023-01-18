import Link from "next/link";

export default function NewPasswordRequest() {
  function handleSubmit(e) {
    console.log(e);
  }

  return (
    <div className="flex flex-col items-center m-8">
      <h2>Wachtwoord vergeten?</h2>
      <p>
        Vul je e-mailadres in en wij sturen je een link waarmee je een nieuw wachtwoord kan
        instellen.
      </p>
      <form
        onSubmit={handleSubmit}
        data-testid="request-new-password"
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

        <button
          type="submit"
          className="border-holon-blue-900  text-white mt-8 bg-holon-blue-900 hover:bg-holon-blue-500 flex flex-row justify-center items-center relative rounded border-2 nowrap px-4 py-3 mb-4 min-w-[8rem] text-center font-medium leading-5 transition enabled:active:translate-x-holon-bh-x enabled:active:translate-y-holon-bh-y disabled:opacity-50">
          Vraag aan
        </button>
      </form>
    </div>
  );
}
