import { fireEvent, render, screen } from "@testing-library/react"
import { act } from "react-dom/test-utils"

import InteractiveImage from "./InteractiveImage"

describe("Interactive Image", () => {
    beforeEach(() => {
        render(<InteractiveImage />)
    })

    it("contains the expected image elements", () => {
        expect(screen.getByTestId<HTMLElement>("background")).toBeInTheDocument()
        expect(screen.getByTestId<HTMLElement>("solarpanel1")).toBeInTheDocument()
        expect(screen.getByTestId<HTMLElement>("windmills1")).toBeInTheDocument()
    })

    it("shows no solar panels when image is rendered first time", () => {
        expect(screen.getByTestId<HTMLInputElement>("solarpanelSlider").value).toBe("0")
    })

    it("shows no wind mills when image is rendered first time", () => {
        expect(screen.getByTestId<HTMLInputElement>("windmillSlider").value).toBe("0")
    })

    it("windforce is set to 3", () => {
        expect(screen.getByTestId<HTMLInputElement>("windforceSlider").value).toBe("1")
    })
})

describe("slider changes image", () => {
    beforeEach(() => {
        render(<InteractiveImage />)
    })

    it("adds a solarpanel when slider is moved right", async () => {
        await act(async () => {
            fireEvent.change(screen.getByTestId("solarpanelSlider"), { target: { value: 2 } })
        })
        expect(document.getElementById("dataDiv")).toHaveAttribute("data-solarpanels", "2")
    })

    it("removes a solarpanel when slider is moved left", async () => {
        await act(async () => {
            fireEvent.change(screen.getByTestId("solarpanelSlider"), { target: { value: 0 } })
        })
        expect(document.getElementById("dataDiv")).toHaveAttribute("data-solarpanels", "0")
    })

    it("adds a windmill when slider is moved right", async () => {
        await act(async () => {
            fireEvent.change(screen.getByTestId("windmillSlider"), { target: { value: 2 } })
        })
        expect(document.getElementById("dataDiv")).toHaveAttribute("data-windmills", "2")
    })

    it("removes a windmill when slider is moved left", async () => {
        await act(async () => {
            fireEvent.change(screen.getByTestId("windmillSlider"), { target: { value: 0 } })
        })
        expect(document.getElementById("dataDiv")).toHaveAttribute("data-windmills", "0")
    })

    it("windmills will speed up when slider is moved right", async () => {
        await act(async () => {
            fireEvent.change(screen.getByTestId("windforceSlider"), { target: { value: 4 } })
        })
        expect(document.getElementById("dataDiv")).toHaveAttribute("data-windforce", "12")
    })

    it("windmills will slow down when slider is moved left", async () => {
        await act(async () => {
            fireEvent.change(screen.getByTestId("windforceSlider"), { target: { value: 3 } })
        })
        expect(document.getElementById("dataDiv")).toHaveAttribute("data-windforce", "9")
    })
})
