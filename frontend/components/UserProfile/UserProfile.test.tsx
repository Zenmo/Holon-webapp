import { render, screen } from "@testing-library/react"
import UserProfile from "./index"

describe("<UserProfile />", () => {
    describe("UserProfile", () => {
        beforeEach(() => {
            render(<UserProfile />)
        })

        it("renders a registration form", () => {
            const profile = screen.getByTestId("user-profile")
            expect(profile).toBeInTheDocument()
        })
    })
})
