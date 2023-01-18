import { useState } from "react";
import Link from "next/link";
import { PencilSquareIcon } from "@heroicons/react/24/outline";

import UserProfileEdit from "./UserProfileEdit";
import UserProfileShow from "./UserProfileShow";
import UpdatePassword from "./UpdatePassword";

export default function UserProfile() {
  const [editMode, setEditMode] = useState(false);
  const [changePassword, setChangePassword] = useState(false);
  const [name, email, password, verifyPassword] = ["maria", "e", "f", "g"];

  function handleUpdateProfile(e) {
    e.preventDefault();
    console.log(e.target[0].value);
    setEditMode(!editMode);
  }

  function handleUpdatePassword() {
    //verify old password is really password
    //verify if new password and new verify password are same
    //if all yes, then send to backend to update
    console.log("wachtwoord geupdate");
    setChangePassword(!changePassword);
  }

  function toggleEditMode() {
    setEditMode(!editMode);
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
        {!editMode && (
          <div>
            <button
              onClick={toggleEditMode}
              title="edit profiel"
              className="w-12 h-12 mb-4 absolute p-2 hover:scale-125">
              <PencilSquareIcon />
            </button>
          </div>
        )}
      </div>

      <div data-testid="user-profile" className="flex flex-col  w-3/4 md:w-2/3 lg:w-1/3 m-8">
        {editMode ? (
          <UserProfileEdit handleSubmit={handleUpdateProfile} name={name} email={email} />
        ) : (
          <UserProfileShow name={name} email={email} />
        )}

        <div>
          {changePassword ? (
            <UpdatePassword onSubmit={handleUpdatePassword} />
          ) : (
            <button
              onClick={toggleChangePassword}
              className="border-holon-blue-900 w-44 text-white mt-8 bg-holon-blue-900 hover:bg-holon-blue-500 flex flex-row justify-center items-center relative rounded border-2 nowrap px-4 py-3 mb-4 text-center font-medium leading-5 transition enabled:active:translate-x-holon-bh-x enabled:active:translate-y-holon-bh-y disabled:opacity-50">
              Wachtwoord wijzigen
            </button>
          )}

          <button
            onClick={handleRemoveProfile}
            className="border-red-700  text-white bg-red-700 hover:bg-red-500 flex flex-row justify-center items-center relative rounded border-2 nowrap px-4 py-3 mb-4 w-44 text-center font-medium leading-5 transition enabled:active:translate-x-holon-bh-x enabled:active:translate-y-holon-bh-y disabled:opacity-50">
            Profiel verwijderen
          </button>
        </div>
      </div>
    </div>
  );
}
