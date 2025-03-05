import { render, screen } from "@testing-library/react"
import { act } from "react-dom/test-utils"
import MediaContent from "./MediaContent"

describe("<MediaContent />", () => {
    describe("with video media", () => {
        beforeEach(async () => {
            await act(() => {
                render(
                    <MediaContent
                        media={[
                            {
                                type: "video",
                                value: "/video",
                                id: "",
                            },
                        ]}
                        alt=""
                    />,
                ).container
            })
        })

        it("renders a video player", () => {
            const media = screen.getByTestId("video-player")
            expect(media).toBeInTheDocument()
        })
    })

    describe("with image media", () => {
        beforeEach(async () => {
            await act(() => {
                render(
                    <MediaContent
                        media={[
                            {
                                type: "image",
                                value: {
                                    img: {
                                        src: "http://localhost:3000/video",
                                        width: 1,
                                        height: 1,
                                        alt: "Alt",
                                    },
                                    id: 1,
                                    title: "Some image",
                                },
                            },
                        ]}
                        alt="Some alt text"
                    />,
                ).container
            })
        })

        it("renders an image", () => {
            const media = screen.getByRole("img")

            expect(media).toBeInTheDocument()
        })

        it("renders an image with alt text", () => {
            const media = screen.getByRole("img")

            expect(media).toHaveAttribute("alt", "Some alt text")
        })
    })
})
