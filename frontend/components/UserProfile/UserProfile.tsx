import { useState, useEffect } from "react";
import Router from "next/router";
import UpdatePassword from "./UpdatePassword";
import TokenService from "@/services/token";

export default function UserProfile() {
  const [isDisabled, setIsDisabled] = useState(true);
  const [changePassword, setChangePassword] = useState(false);
  const [user, setUser] = useState({
    first_name: "",
    last_name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    verifyNewPassword: "",
  });

  useEffect(() => {
    getProfile();
  }, []);

  async function getProfile() {
    const result = await fetch("http://localhost:8000/dj-rest-auth/user/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Token " + TokenService.getAccessToken() + "",
      },
      credentials: "include",
    }).then(response => {
      if (response.status >= 400 && response.status < 600) {
        // Router.push("http://localhost:3000");
        // TODO: Wat gaan we doen wanneer je niet bent ingelogd?
        setUser({
          first_name: "",
          last_name: "",
          email: "",
          currentPassword: "",
          newPassword: "",
          verifyNewPassword: "",
        });
      }
      return response;
    });

    const data = await result.json();
    setUser(data);
  }

  function handleInputChange(e) {
    e.preventDefault();
    setUser({ ...user, [e.target.name]: e.target.value });
    if (isDisabled) {
      setIsDisabled(false);
    }
  }

  function handleUpdateProfile(e) {
    e.preventDefault();
    console.log(user);
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

      <div data-testid="user-profile" className="flex flex-col  w-3/4 md:w-2/3 lg:w-1/3 m-8">
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
        </div>

        <div className="flex flex-col xl:flex-row justify-between">
          <button
            onClick={handleRemoveProfile}
            className="border-red-600  text-holon-blue-900 mt-8  hover:bg-red-200 flex flex-row justify-center items-center relative rounded border-2 px-4 py-3 mb-4 min-w-[8rem] text-center font-medium leading-5 transition enabled:active:translate-x-holon-bh-x disabled:opacity-50">
            Profiel verwijderen
          </button>

          {!changePassword && (
            <button onClick={toggleChangePassword} className="buttonDark">
              Wachtwoord wijzigen
            </button>
          )}

          <button type="submit" disabled={isDisabled} className="buttonDark">
            Profiel updaten
          </button>
        </div>

        {changePassword && (
          <UpdatePassword handleChange={handleInputChange} handleSubmit={handleUpdatePassword} />
        )}
      </div>
    </div>
  );
}
