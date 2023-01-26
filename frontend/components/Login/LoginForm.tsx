import Link from "next/link";
import { useState, useEffect } from "react";
import * as Cookies from "es-cookie";
import TokenService from "@/services/token";

export default function LoginForm() {
  const [user, setUser] = useState({ email: "", password: "" });

  useEffect(() => {
    if (!Cookies.get("csrftoken")) {
      fetch("http://localhost:8000/wt/csrf", {
        method: "GET",
      })
        .then(response => response.json())
        .then(json => Cookies.set("csrftoken", json.token));
    }
  }, []);

  function handleInputChange(e) {
    e.preventDefault();
    setUser({ ...user, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const result = await fetch("http://localhost:8000/dj-rest-auth/login/", {
      method: "POST",
      body: JSON.stringify({
        username: user.email,
        password: user.password,
      }),
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": Cookies.get("csrftoken"),
      },
      credentials: "include",
    });

    const data = await result.json();
    TokenService.setAccessToken(data.key);
  }

  return (
    <div className="flex flex-col items-center m-8">
      <h2>Log in op Holontool.nl</h2>

      <form
        onSubmit={handleSubmit}
        data-testid="login-form"
        className="flex flex-col  w-3/4 md:w-2/3 lg:w-1/3 m-4">
        <label htmlFor="email" className="labelInputForm">
          E-mail:
        </label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="E-mail"
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

        <p className="underline mt-8 decoration-holon-blue-900 decoration-2 underline-offset-4 hover:underline hover:decoration-gray-300 hover:decoration-2 hover:underline-offset-4 sm:p-0">
          <Link href="/wachtwoord-aanvragen">Wachtwoord vergeten?</Link>
        </p>

        <div className="flex justify-between">
          <p className="flex flex-row py-3 mt-8">
            Nog geen account? &nbsp;
            <Link href="/registratie">
              <a className="underline decoration-holon-blue-900 decoration-2 underline-offset-4 hover:underline hover:decoration-gray-300 hover:decoration-2 hover:underline-offset-4 sm:p-0">
                Registreer je
              </a>
            </Link>
          </p>
          <button type="submit" className="buttonDark nowrap">
            Log in
          </button>
        </div>
      </form>
    </div>
  );
}
