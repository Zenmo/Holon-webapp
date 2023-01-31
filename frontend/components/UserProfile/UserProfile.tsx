import { useState, useEffect } from "react";
import Router from "next/router";
import * as Cookies from "es-cookie";
import UpdatePassword from "./UpdatePassword";
import TokenService from "@/services/token";
import useUser from "@/utils/useUser";

export default function UserProfile() {
  const [isDisabled, setIsDisabled] = useState(true);
  const currentUser = useUser({ redirectTo: "/inloggen" });
  const [user, setUser] = useState(currentUser);
  const [message, setMessage] = useState("");

  console.log(currentUser);
  console.log(user);

  if (!user) return null;

  function handleInputChange(e) {
    e.preventDefault();
    setUser({ ...user, [e.target.name]: e.target.value });
    if (isDisabled) {
      setIsDisabled(false);
    }
  }

  async function handleUpdateProfile(e) {
    e.preventDefault();
    const response = await fetch(`http://localhost:8000/dj-rest-auth/user/`, {
      method: "PATCH",
      body: JSON.stringify({
        first_name: user.first_name,
        last_name: user.last_name,
        currentPassword: user.currentPassword,
        newPassword: user.newPassword,
        verifyNewPassword: user.verifyNewPassword,
        email: user.email,
      }),
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": Cookies.get("csrftoken"),
      },
      credentials: "include",
    });
  }

  function handleUpdatePassword(e) {
    //verify old password is really password
    //verify if new password and new verify password are same
    //if all yes, then send to backend to update

    if (user.newPassword !== user.verifyNewPassword) {
      console.log("wachtwoord komt niet overeen");
    } else {
      console.log("wachtwoord geupdate");
      setChangePassword(!changePassword);
    }
  }

  function toggleChangePassword() {
    setChangePassword(!changePassword);
  }

  function handleRemoveProfile(e) {
    console.log("profiel verwijderd");
  }

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
            <label htmlFor="name" className="labelInputForm">
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
            <label htmlFor="name" className="labelInputForm">
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
          </form>
          <p>{message}</p>
          <div className="flex justify-end">
            <button
              onClick={handleUpdateProfile}
              type="submit"
              disabled={isDisabled}
              className="buttonDark mt-8">
              Profiel updaten
            </button>
          </div>
        </div>

        <div className="flex flex-col mt-4">
          <h3>Wachtwoord wijzigen</h3>
          <UpdatePassword handleChange={handleInputChange} handleSubmit={handleUpdatePassword} />
        </div>

        <div className="flex flex-col items-start mt-8">
          <h3>Profiel verwijderen</h3>
          <button
            onClick={handleRemoveProfile}
            className="border-red-600 mt-8 text-holon-blue-900 hover:bg-red-200 flex flex-row justify-center items-center relative rounded border-2 px-4 py-3 mb-4 min-w-[8rem] text-center font-medium leading-5 transition enabled:active:translate-x-holon-bh-x disabled:opacity-50">
            Profiel verwijderen
          </button>
        </div>
      </div>
    </div>
  );
}
