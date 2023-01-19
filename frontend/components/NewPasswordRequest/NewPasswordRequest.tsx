import Link from "next/link";

export default function NewPasswordRequest() {
  function handleSubmit(e) {
    e.preventDefault();
    console.log(e.target.email.value);
  }

  return (
    <div className="flex flex-col items-center m-8">
      <h2>Wachtwoord vergeten?</h2>
      <p className=" w-3/4 md:w-2/3 lg:w-1/3 mt-4 text-center">
        Vul je e-mailadres in en wij sturen je een link waarmee je een nieuw wachtwoord kan
        instellen.
      </p>
      <form
        onSubmit={handleSubmit}
        data-testid="request-new-password"
        className="flex flex-col  w-3/4 md:w-2/3 lg:w-1/3">
        <label htmlFor="email" className="block text-gray-700 text-lg font-bold mb-2 mt-8">
          E-mail:
        </label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="E-mail"
          className="inputForm"
          required
        />
        <div className="flex justify-end">
          <button type="submit" className="buttonDark">
            Vraag aan
          </button>
        </div>
      </form>
    </div>
  );
}
