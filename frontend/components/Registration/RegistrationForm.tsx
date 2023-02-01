import { useState } from "react";
import { useRouter } from "next/router";
import PasswordInput from "../PasswordInput/PasswordInput";
import SuccessModal from "./SuccessModal";
import * as Cookies from "es-cookie";
import TokenService from "@/services/token";
import useUser from "@/utils/useUser";

export default function RegistrationForm() {
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
    verifyPassword: "",
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  const router = useRouter();
  const currentUser = useUser({});

  async function loggedIn() {
    if (currentUser) {
      router.push("/profiel");
    }
  }

  loggedIn();

  function handleInputChange(e) {
    e.preventDefault();
    setUser({ ...user, [e.target.name]: e.target.value });

    if (showErrorMessage == true) {
      setShowErrorMessage(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    TokenService.setCSRFToken();

    const response = await fetch("http://localhost:8000/dj-rest-auth/registration/", {
      method: "POST",
      body: JSON.stringify({
        username: user.username,
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
    const message = await response;
    if (message.ok) {
      setShowSuccessModal(true);
      setUser({ username: "", email: "", password: "", verifyPassword: "" });
    } else {
      setShowErrorMessage(true);
    }
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

      {showSuccessModal && <SuccessModal onClose={() => setShowSuccessModal(false)} />}

      <form
        onSubmit={handleSubmit}
        data-testid="registration-form"
        className="flex flex-col w-3/4 md:w-2/3 lg:w-1/3">
        <label htmlFor="email" className="labelInputForm">
          Username:
        </label>
        <input
          type="text"
          id="username"
          name="username"
          value={user.username}
          onChange={handleInputChange}
          placeholder="E-mail"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        />

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
        {showErrorMessage && (
          <p className="text-red-700 block m-1">
            Er is iets fout gegaan met je registratie. Probeer het opnieuw.{" "}
          </p>
        )}
        <div className="flex justify-end">
          <button type="submit" className="buttonDark mt-8">
            Registreer
          </button>
        </div>
      </form>
    </div>
  );
}
