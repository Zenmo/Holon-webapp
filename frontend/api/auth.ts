import * as Cookies from "es-cookie";
import TokenService from "@/services/token";

const API_URL = process.env.NEXT_PUBLIC_BASE_URL || "/wt";

export async function registerUser(userData) {
  TokenService.setCSRFToken();

  const response = await fetch(`${API_URL}/dj-rest-auth/registration/`, {
    method: "POST",
    body: JSON.stringify({
      username: userData.username,
      password1: userData.password,
      password2: userData.verifyPassword,
      email: userData.email,
    }),
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": Cookies.get("csrftoken"),
    },
    credentials: "include",
  });

  return response;
}

export async function logIn(userData) {
  return await fetch(`${API_URL}/api/token/`, {
    method: "POST",
    body: JSON.stringify({
      username: userData.username,
      password: userData.password,
    }),
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
}

export async function updateProfile(userData) {
  const response = await fetch(`${API_URL}/dj-rest-auth/user/`, {
    method: "PATCH",
    body: JSON.stringify({
      first_name: userData.first_name,
      last_name: userData.last_name,
      email: userData.email,
      currentPassword: userData.currentPassword,
      newPassword: userData.password,
      verifyNewPassword: userData.verifyPassword,
    }),
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + TokenService.getAccessToken(),
    },
    credentials: "include",
  });
  return response;
}

export async function updatePassword(userData) {
  const response = await fetch(`${API_URL}/dj-rest-auth/password/change/`, {
    method: "POST",
    body: JSON.stringify({
      old_password: userData.currentPassword,
      new_password1: userData.password,
      new_password2: userData.verifyPassword,
    }),
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + TokenService.getAccessToken(),
    },
    credentials: "include",
  });
  return response;
}

/*deze functie wordt later toegevoegd
  function handleRemoveProfile(e) {
    console.log("profiel verwijderd");
  }
  */
