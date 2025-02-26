import { render, screen } from "@testing-library/react"
import { act } from "react-dom/test-utils"
import HeroBlock from "./"

describe("<HeroBlock />", () => {
    describe("with video media", () => {
        beforeEach(async () => {
            await act(() => {
                render(
                    <HeroBlock
                        data={{
                            type: "unknown",
                            value: {
                                backgroundColor: "block__bg-purple",
                                text: "Lorem ipsum",
                                title: "Hello world",
                                media: [
                                    {
                                        type: "video",
                                        value: "/video",
                                        id: "",
                                    },
                                ],
                                alt_text: "Some alt text",
                                buttonBlock: [],
                            },
                            id: "a-hero-block",
                        }}
                    />,
                ).container
            })
        })

        it("renders a header", () => {
            const heading = screen.getByRole("heading")

            expect(heading.tagName).toEqual("H1")
            expect(heading).toBeInTheDocument()
            expect(heading).toHaveTextContent("Hello world")
        })

        it("renders text", () => {
            const heading = screen.getByTestId("content")

            expect(heading).toBeInTheDocument()
            expect(heading).toHaveTextContent("Lorem ipsum")
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
                    <HeroBlock
                        data={{
                            type: "unknown",
                            value: {
                                backgroundColor: "block__bg-purple",
                                text: "Lorem ipsum",
                                title: "Hello world",
                                media: [
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
                                ],
                                altText: "alternative alt text",
                                buttonBlock: [],
                            },
                            id: "a-hero-block",
                        }}
                    />,
                ).container
            })
        })

        it("renders a header", () => {
            const heading = screen.getByRole("heading")

            expect(heading.tagName).toEqual("H1")
            expect(heading).toBeInTheDocument()
            expect(heading).toHaveTextContent("Hello world")
        })

        it("renders text", () => {
            const text = screen.getByTestId("content")

            expect(text).toBeInTheDocument()
            expect(text).toHaveTextContent("Lorem ipsum")
        })

        it("renders an image", () => {
            const media = screen.getByRole("img")
            expect(media).toBeInTheDocument()
        })
    })

    describe("with a link-button", () => {
        beforeEach(async () => {
            await act(() => {
                render(
                    <HeroBlock
                        data={{
                            type: "unknown",
                            value: {
                                backgroundColor: "block__bg-purple",
                                text: "Lorem ipsum",
                                title: "Hello world",
                                media: [
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
                                ],
                                altText: "alternative alt text",
                                buttonBlock: [
                                    {
                                        type: "buttons",
                                        value: {
                                            buttonsAlign: "btn-left",
                                            buttons: [
                                                {
                                                    type: "button",
                                                    value: {
                                                        buttonStyle: "dark",
                                                        buttonText: "xx",
                                                        buttonLink: [
                                                            {
                                                                type: "extern",
                                                                value: "http://www.test.com",
                                                                id: "1",
                                                            },
                                                        ],
                                                    },
                                                    id: "2",
                                                },
                                            ],
                                        },
                                        id: "3",
                                    },
                                ],
                            },
                            id: "a-hero-block",
                        }}
                    />,
                ).container
            })
        })

        it("renders a header", () => {
            const heading = screen.getByRole("heading")

            expect(heading.tagName).toEqual("H1")
            expect(heading).toBeInTheDocument()
            expect(heading).toHaveTextContent("Hello world")
        })

        it("renders text", () => {
            const text = screen.getByTestId("content")

            expect(text).toBeInTheDocument()
            expect(text).toHaveTextContent("Lorem ipsum")
        })

        it("renders an image", () => {
            const media = screen.getByRole("img")
            expect(media).toBeInTheDocument()
        })

        it("renders a link-button", () => {
            const link = screen.getByRole("link")
            expect(link).toBeInTheDocument()
            expect(link).toHaveTextContent("xx")
            expect(link).toHaveAttribute("href", "http://www.test.com")
        })
    })
})
