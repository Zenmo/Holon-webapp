import React, { useState, useEffect } from "react";
import UpdatePassword from "./UpdatePassword";
import useUser from "@/utils/useUser";
import TokenService from "@/services/token";

type User = {
  first_name: string;
  last_name: string;
  currentPassword: string;
  password: string;
  verifyPassword: string;
  email: string;
};

export default function UserProfile() {
  const [isDisabled, setIsDisabled] = useState(true);
  const currentUser = useUser({ redirectTo: "/inloggen" });
  const [user, setUser] = useState({
    first_name: "",
    last_name: "",
    currentPassword: "",
    password: "",
    verifyPassword: "",
    email: "",
  });
  const [messageProfileUpdate, setMessageProfileUpdate] = useState("");
  const [messagePasswordUpdate, setMessagePasswordUpdate] = useState("");

  useEffect(() => {
    currentUser &&
      setUser({
        ...user,
        first_name: currentUser.first_name,
        last_name: currentUser.last_name,
        email: currentUser.email,
      });
  }, [currentUser, user]);

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>): void {
    e.preventDefault();
    setUser({ ...user, [e.target.name]: e.target.value });
    if (isDisabled) {
      setIsDisabled(false);
    }
    setMessageProfileUpdate("");
  }

  async function handleUpdateProfile(e: React.SyntheticEvent<HTMLInputElement, SubmitEvent>) {
    e.preventDefault();
    const response = await fetch(`http://localhost:8000/dj-rest-auth/user/`, {
      method: "PATCH",
      body: JSON.stringify({
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        currentPassword: user.currentPassword,
        newPassword: user.password,
        verifyNewPassword: user.verifyPassword,
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + TokenService.getAccessToken(),
      },
      credentials: "include",
    });

    const message = await response;
    if (message.ok) {
      setMessageProfileUpdate("Je profiel is succesvol geupdate");
      setIsDisabled(true);
    } else {
      setMessageProfileUpdate("Er is iets mis gegaan met het updaten van je profiel");
    }
  }

  function handlePasswordChange(input: User) {
    setUser(input);
  }

  async function handleUpdatePassword(e: React.SyntheticEvent<HTMLInputElement, SubmitEvent>) {
    e.preventDefault();

    const response = await fetch(`http://localhost:8000/dj-rest-auth/password/change/`, {
      method: "POST",
      body: JSON.stringify({
        old_password: user.currentPassword,
        new_password1: user.password,
        new_password2: user.verifyPassword,
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + TokenService.getAccessToken(),
      },
      credentials: "include",
    });
    const res = await response;
    const message = await response.json();

    if (message.old_password) {
      if (message.old_password[0].includes("incorrectly")) {
        setMessagePasswordUpdate(
          "Je huidige wachtwoord is niet correct. Hierdoor kunnen we geen nieuw wachtwoord aanmaken."
        );
      }
    } else if (res.ok) {
      setMessagePasswordUpdate("Je nieuwe wachtwoord is succesvol aangemaakt.");
      setUser({ ...user, currentPassword: "", password: "", verifyPassword: "" });
    } else {
      setMessagePasswordUpdate("Er is iets mis gegaan met het updaten van je wachtwoord");
    }
  }

  /*deze functie wordt later toegevoegd
  function handleRemoveProfile(e) {
    console.log("profiel verwijderd");
  }
  */

  return (
    <div className="flex flex-col items-center m-8">
      <div className="flex flex-row justify-between w-3/4 md:w-2/3 lg:w-1/3">
        <h2>Profiel</h2>
      </div>

      <div data-testid="user-profile" className="flex flex-col  w-3/4 md:w-2/3 lg:w-1/3">
        <div className="">
          <form
            onSubmit={handleUpdateProfile}
            data-testid="edit-profile-form"
            className="flex flex-col">
            <label htmlFor="first_name" className="labelInputForm">
              Voornaam:
            </label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              value={user.first_name}
              onChange={handleInputChange}
              placeholder="Voornaam"
              className="inputForm"
              required
            />
            <label htmlFor="last_name" className="labelInputForm">
              Achternaam:
            </label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              value={user.last_name}
              onChange={handleInputChange}
              placeholder="Achternaam"
              className="inputForm"
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
              className="inputForm"
              required
            />
            <p>{messageProfileUpdate}</p>
            <div className="flex justify-end">
              <button type="submit" disabled={isDisabled} className="buttonDark mt-8">
                Profiel updaten
              </button>
            </div>
          </form>
        </div>

        <div className="flex flex-col mt-4">
          <h3>Wachtwoord wijzigen</h3>
          <UpdatePassword
            handleChange={handlePasswordChange}
            handleSubmit={handleUpdatePassword}
            input={user}
            setMessage={setMessagePasswordUpdate}
          />
          <p>{messagePasswordUpdate}</p>
        </div>

        {/*}
        <div className="flex flex-col items-start mt-8">
          <h3>Profiel verwijderen</h3>
          <button
            onClick={handleRemoveProfile}
            className="border-red-600 mt-8 text-holon-blue-900 hover:bg-red-200 flex flex-row justify-center items-center relative rounded border-2 px-4 py-3 mb-4 min-w-[8rem] text-center font-medium leading-5 transition enabled:active:translate-x-holon-bh-x disabled:opacity-50">
            Profiel verwijderen
          </button>
        </div>
  */}
      </div>
    </div>
  );
}
