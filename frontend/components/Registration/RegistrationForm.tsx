import { useState } from "react";
import PasswordInput from "../PasswordInput/PasswordInput";
import SuccessModal from "./SuccessModal";
import * as Cookies from "es-cookie";
import TokenService from "@/services/token";

export default function RegistrationForm() {
  const [user, setUser] = useState({ email: "", password: "", verifyPassword: "" });
  const [showModal, setShowModal] = useState(false);

  function handleInputChange(e) {
    e.preventDefault();
    setUser({ ...user, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (user.password !== user.verifyPassword) {
      console.log("wachtwoord moet hetzelfde zijn");
    }

    await fetch("http://localhost:8000/dj-rest-auth/registration/", {
      method: "POST",
      body: JSON.stringify({
        username: user.email,
        password1: user.password,
        password2: user.verifyPassword,
        email: user.email,
      }),
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": Cookies.get("csrftoken"),
      },
      credentials: "include",
    });

    setShowModal(true);
  }

  function logout() {
    fetch("http://localhost:8000/dj-rest-auth/logout/", {
      method: "POST",
    });
  }

  return (
    <div className="flex flex-col items-center m-8">
      <h2>Registreer je voor Holontool.nl</h2>

      <p className="mt-4 w-3/4 md:w-2/3 lg:w-1/3 text-center">
        Registreer je hier om een account aan te maken op holontool.nl. De onderstaande velden zijn
        verplicht om een account aan te maken.{" "}
      </p>

      {showModal && <SuccessModal onClose={() => setShowModal(false)} />}

      <form
        onSubmit={handleSubmit}
        data-testid="registration-form"
        className="flex flex-col w-3/4 md:w-2/3 lg:w-1/3">
        <label htmlFor="name" className="labelInputForm">
          Naam:
        </label>
        <label htmlFor="email" className="labelInputForm">
          E-mail:
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={user.email}
          onChange={handleInputChange}
          placeholder="E-mail"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        />

        <PasswordInput inputChange={setUser} input={user} />

        <div className="flex justify-end">
          <button type="submit" className="buttonDark">
            Registreer
          </button>
        </div>
      </form>
    </div>
  );
}
