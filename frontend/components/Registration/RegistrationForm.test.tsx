import { render, screen } from "@testing-library/react"
import RegistrationForm from "./index"

describe("<RegistrationForm />", () => {
    describe("registration form", () => {
        beforeEach(() => {
            render(<RegistrationForm />)
        })

        it("renders a registration form", () => {
            const form = screen.getByTestId("registration-form")
            expect(form).toBeInTheDocument()
        })
    })
})
