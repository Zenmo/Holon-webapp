import { render, screen } from "@testing-library/react"
import exampleData from "./exampleData"
import KPIDashboard from "./KPIDashboard"

describe("<KPIDashboard", () => {
    describe("renders a KPIDashboard", () => {
        beforeEach(() => {
            render(
                <KPIDashboard
                    data={exampleData.one}
                    loading={false}
                    dashboardId="1"
                ></KPIDashboard>,
            )
        })

        it("renders a KPIDashboard", () => {
            const dashboard = screen.getByTestId("KPIDashboard")
            expect(dashboard).toBeInTheDocument()
        })
    })
})
