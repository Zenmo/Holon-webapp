import { useState } from "react";
import Link from "next/link";
import TokenService from "@/services/token";
import useUser from "@/utils/useUser";

export default function LoginForm() {
  const [userData, setUserData] = useState({ username: "", password: "" });
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState("Er is iets fout gegaan met het inloggen.");
  const { mutateUser } = useUser({ redirectTo: "/profiel", redirectIfFound: true });

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>): void {
    e.preventDefault();
    setUserData({ ...userData, [e.target.name]: e.target.value });

    if (showErrorMessage == true) {
      setShowErrorMessage(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    mutateUser(
      await fetch("http://localhost:8000/api/token/", {
        method: "POST",
        body: JSON.stringify({
          username: userData.username,
          password: userData.password,
        }),
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      })
        .then(res => {
          if (res.status == 401) {
            setErrorMessage("Uw gebruikersnaam/wachtwoord is niet correct");
          }
          if (!res.ok) {
            const message = `An error has occured: ${res.status}`;
            console.log(message);
            setShowErrorMessage(true);
          } else {
            return res.json();
          }
        })
        .then(data => {
          if (data) {
            console.log("inlog gaat goed");
            setErrorMessage("");
            TokenService.setAccessToken(data.access);
          }
        })
    );
  }

  return (
    <div className="flex flex-col items-center m-8">
      <h2>Log in op Holontool.nl</h2>

      <form
        onSubmit={handleSubmit}
        data-testid="login-form"
        className="flex flex-col  w-3/4 md:w-2/3 lg:w-1/3 m-4">
        <label htmlFor="email" className="labelInputForm">
          Username:
        </label>
        <input
          type="text"
          id="username"
          name="username"
          placeholder="Username"
          className="inputForm"
          onChange={handleInputChange}
          required
        />

        <label htmlFor="password" className="labelInputForm">
          Wachtwoord:
        </label>
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Wachtwoord"
          className="inputForm"
          onChange={handleInputChange}
          required
        />
        {showErrorMessage && <p className="text-red-700 block m-1">{errorMessage}</p>}

        {/* nieuw wachtwoord aanvragen func nog niet geimplementeerd
        <p className="underline mt-8 decoration-holon-blue-900 decoration-2 underline-offset-4 hover:underline hover:decoration-gray-300 hover:decoration-2 hover:underline-offset-4 sm:p-0">
          <Link href="/wachtwoord-aanvragen">Wachtwoord vergeten?</Link>
        </p>
        */}

        <div className="flex justify-between flex-col sm:flex-row">
          <p className="flex flex-row py-3 mt-8">
            Nog geen account? &nbsp;
            <Link href="/registratie">
              <a className="underline decoration-holon-blue-900 decoration-2 underline-offset-4 hover:underline hover:decoration-gray-300 hover:decoration-2 hover:underline-offset-4 sm:p-0">
                Registreer je
              </a>
            </Link>
          </p>
          <button type="submit" className="buttonDark nowrap mt-8">
            Log in
          </button>
        </div>
      </form>
    </div>
  );
}
