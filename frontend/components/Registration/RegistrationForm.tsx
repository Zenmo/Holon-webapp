import useUser from "@/utils/useUser"
import React, { useState } from "react"
import { registerUser } from "../../api/auth"
import PasswordInput from "../PasswordInput/PasswordInput"
import SuccessModal from "./SuccessModal"

export default function RegistrationForm() {
    const [userData, setUserData] = useState({
        username: "",
        email: "",
        password: "",
        verifyPassword: "",
    })
    const [showSuccessModal, setShowSuccessModal] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { user } = useUser({ redirectTo: "/profiel", redirectIfFound: true })

    function handleInputChange(e: React.ChangeEvent<HTMLInputElement>): void {
        e.preventDefault()
        setUserData({ ...userData, [e.target.name]: e.target.value })
        setErrorMessage("")
    }

    function handlePasswordChange(
        input: React.SetStateAction<{
            username: string
            email: string
            password: string
            verifyPassword: string
        }>,
    ) {
        setUserData(input)
    }

    function handleErrorMessage(message: React.SetStateAction<string>) {
        setErrorMessage(message)
    }

    async function handleSubmit(e) {
        e.preventDefault()

        registerUser(userData).then(res => {
            if (res.ok) {
                setShowSuccessModal(true)
                setUserData({ username: "", email: "", password: "", verifyPassword: "" })
            } else {
                setErrorMessage("Er is iets fout gegaan met je registratie.")
            }
        })
    }

    return (
        <div className="flex flex-col items-center m-8">
            <h2>Registreer je voor Holons.energy</h2>

            <p className="mt-4 w-3/4 md:w-2/3 lg:w-1/3 text-center">
                Registreer je hier om een account aan te maken op holons.energy. De onderstaande
                velden zijn verplicht om een account aan te maken.{" "}
            </p>

            {showSuccessModal && <SuccessModal onClose={() => setShowSuccessModal(false)} />}

            <form
                onSubmit={handleSubmit}
                data-testid="registration-form"
                className="flex flex-col w-3/4 md:w-2/3 lg:w-1/3"
            >
                <label htmlFor="username" className="labelInputForm">
                    Gebruikersnaam:
                </label>
                <input
                    type="text"
                    id="username"
                    name="username"
                    value={userData.username}
                    onChange={handleInputChange}
                    placeholder="Gebruikersnaam"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                />

                <label htmlFor="email" className="labelInputForm">
                    E-mail:
                </label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={userData.email}
                    onChange={handleInputChange}
                    placeholder="E-mail"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                />

                <PasswordInput
                    inputChange={handlePasswordChange}
                    input={userData}
                    setParentMessage={handleErrorMessage}
                />

                <p className="text-red-700 block m-1">{errorMessage}</p>
                <div className="flex justify-end">
                    <button type="submit" className="buttonDark mt-8">
                        Registreer
                    </button>
                </div>
            </form>
        </div>
    )
}
