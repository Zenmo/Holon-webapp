import { useEffect } from "react";
import Router from "next/router";
import useSWR from "swr";
import TokenService from "@/services/token";

const fetcher = (...args) =>
  fetch("http://localhost:8000/dj-rest-auth/user/", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + TokenService.getAccessToken(),
    },
    credentials: "include",
  }).then(res => res.json());

export default function useUser({ redirectTo = "", redirectIfFound = false } = {}) {
  const { data: user, mutate: mutateUser } = useSWR(
    "http://localhost:8000/dj-rest-auth/user/",
    fetcher
  );

  useEffect(() => {
    // if no redirect needed, just return (example: already on /dashboard)
    // if user data not yet there (fetch in progress, logged in or not) then don't do anything yet
    if (!redirectTo || !user) return;

    if (
      // If redirectTo is set, redirect if the user was not found.
      (redirectTo && !user?.username && !redirectIfFound) ||
      //or if redirect on find is set to true and the user is found
      (redirectIfFound && user?.username)
    ) {
      Router.push(redirectTo);
    }
  }, [user, redirectTo, redirectIfFound]);

  return { user, mutateUser };
}