/* global module */

import React from "react"
import UserProfilePage from "./UserProfilePage"
import data from "./UserProfilePage.data"

export default {
    title: "Components/UserProfilePage",
    component: UserProfilePage,
}

export const UserProfilePageWithoutData = () => <UserProfilePage />
export const UserProfilePageWithData = () => <UserProfilePage {...data} />
