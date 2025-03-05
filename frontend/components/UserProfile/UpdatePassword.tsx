import PasswordInput from "../PasswordInput/PasswordInput"

type Props = {
    handleChange: React.Dispatch<React.SetStateAction<object>>
    handleSubmit: React.FormEventHandler<HTMLFormElement>
    input: object
    setMessage: React.Dispatch<React.SetStateAction<string>>
    message: {
        color: string
        message: string
    }
}

export default function UpdatePassword({
    handleChange,
    handleSubmit,
    input,
    setMessage,
    message,
}: Props) {
    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        e.preventDefault()
        handleChange({ ...input, [e.target.name]: e.target.value })
        setMessage("")
    }

    return (
        <div className="">
            <form onSubmit={handleSubmit} data-testid="edit-password" className="flex flex-col">
                <label htmlFor="oldPassword" className="labelInputForm">
                    Huidig wachtwoord:
                </label>
                <input
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    onChange={onInputChange}
                    placeholder="Oud wachtwoord"
                    value={input.currentPassword}
                    minLength={6}
                    className="inputForm"
                    required
                />

                <PasswordInput
                    inputChange={handleChange}
                    input={input}
                    setParentMessage={setMessage}
                />

                <div className="flex flex-col">
                    <p className={`${message.color} mt-2`}>{message.message}</p>
                    <div className="flex justify-end">
                        <button type="submit" className="buttonDark mt-6">
                            Wachtwoord updaten
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}
