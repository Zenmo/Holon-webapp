/* global module */

import React from "react"
import RegistrationPage from "./RegistrationPage"
import data from "./RegistrationPage.data"

export default {
    title: "Components/RegistrationPage",
    component: RegistrationPage,
}

export const RegistrationPageWithoutData = () => <RegistrationPage />
export const RegistrationPageWithData = () => <RegistrationPage {...data} />
