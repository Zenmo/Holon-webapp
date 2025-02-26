import { render, screen } from "@testing-library/react"
import { act } from "react-dom/test-utils"
import ButtonsAndMedia from "./ButtonsAndMediaBlock"

describe("<ButtonsAndMedia />", () => {
    describe("with video media", () => {
        beforeEach(async () => {
            await act(() => {
                render(
                    <ButtonsAndMedia
                        data={{
                            type: "buttonsAndMedia",
                            value: {
                                background: {
                                    color: "block__bg-purple",
                                    size: "bg__full",
                                },
                                buttons: [
                                    {
                                        title: "TestCard1",
                                        imageSelector: {
                                            id: 1,
                                            title: "Hello world",
                                            img: {
                                                src: "/image",
                                                width: 1600,
                                                height: 1600,
                                                alt: "",
                                            },
                                        },
                                        cardColor: "card__bg-gray",
                                        itemLink: [
                                            {
                                                type: "intern",
                                                value: "/test",
                                                id: "1",
                                            },
                                        ],
                                    },
                                ],
                                media: [
                                    {
                                        type: "video",
                                        value: "/video",
                                        id: "",
                                    },
                                ],
                                alt_text: "Some alt text",
                            },
                            id: "a-text-and-media-block",
                        }}
                    />,
                ).container
            })
        })

        it("renders a button and media block", () => {
            const block = screen.getByTestId("ButtonsMedia")
            expect(block).toBeInTheDocument()
        })

        it("with a button-card", () => {
            const card = screen.getByText("TestCard1")
            expect(card).toBeInTheDocument()
        })

        it("button-card has an image", () => {
            const media = screen.getByRole("img")
            expect(media).toBeInTheDocument()
        })

        it("button-card has a link", () => {
            const link = screen.getByRole("link")
            expect(link).toBeInTheDocument()
        })

        it("renders a video player", () => {
            const media = screen.getByTestId("video-player")
            expect(media).toBeInTheDocument()
        })

        it("has the chosen backgroundcolor", () => {
            const block = screen.getByTestId("ButtonsMedia")
            expect(block).toHaveClass("block__bg-purple")
        })
    })
})
