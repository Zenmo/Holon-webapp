import { render, screen } from "@testing-library/react"
import Card from "./Card"

describe("<Card />", () => {
    describe("with all content", () => {
        beforeEach(() => {
            render(
                <Card
                    cardItem={{
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
                        description: "TestText1",
                        cardColor: "card__bg-gray",
                        itemLink: [
                            {
                                type: "extern",
                                value: "http://www.link.com",
                                id: "1",
                            },
                        ],
                    }}
                    cardType="cardBlockCard"
                />,
            )
        })

        it("renders a card", () => {
            const card = screen.getByText("TestCard1")
            expect(card).toBeInTheDocument()
        })

        it("renders a text", () => {
            const text = screen.getByText("TestText1")
            expect(text).toBeInTheDocument()
        })

        it("renders an image", () => {
            const media = screen.getByRole("img")
            expect(media).toBeInTheDocument()
        })

        it("renders a link", () => {
            const link = screen.getByRole("link")
            expect(link).toBeInTheDocument()
        })

        it("renders an external link with the correct attributes", () => {
            const link = screen.getByRole("link")
            expect(link).toHaveAttribute("href", "http://www.link.com")
            expect(link).toHaveAttribute("rel", "noopener noreferrer")
        })
    })

    describe("with correct general styling", () => {
        beforeEach(() => {
            render(
                <Card
                    cardItem={{
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
                        description: "TestText1",
                        cardColor: "card__bg-gray",
                        itemLink: [
                            {
                                type: "intern",
                                value: "/test",
                                id: "1",
                            },
                        ],
                    }}
                    cardType="cardBlockCard"
                />,
            )
        })

        it("has background color", () => {
            const element = screen.getByTestId("TestCard1")

            expect(element).toHaveClass("card__bg-gray")
        })

        it("renders a stetched link", () => {
            const link = screen.getByRole("link")
            expect(link).toHaveClass("stretched-link")
        })

        it("renders an internal link with the correct attributes", () => {
            const link = screen.getByRole("link")
            expect(link).toHaveAttribute("href", "/test")
            expect(link).not.toHaveAttribute("rel", "noopener noreferrer")
        })
    })

    describe("buttonCardwith correct styling", () => {
        beforeEach(() => {
            render(
                <Card
                    cardItem={{
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
                        description: "TestText1",
                        cardColor: "card__bg-gray",
                        itemLink: [
                            {
                                type: "intern",
                                value: "/test",
                                id: "1",
                            },
                        ],
                    }}
                    cardType="buttonCard"
                />,
            )
        })

        it("renders an arrow icon", () => {
            const arrow = screen.getByTestId("arrow")
            expect(arrow).toBeInTheDocument()
        })

        it("shows cards as buttons", () => {
            const card = screen.getByTestId("TestCard1")
            expect(card).toHaveClass("flex-row")
        })

        it("renders an image", () => {
            const media = screen.getByRole("img")
            expect(media).toBeInTheDocument()
        })

        it("renders a link", () => {
            const link = screen.getByRole("link")
            expect(link).toBeInTheDocument()
        })
    })

    describe("renders storyline overview card with correct styling", () => {
        beforeEach(() => {
            render(
                <Card
                    cardItem={{
                        title: "TestCard1",
                        description: "TestText1",
                        slug: "test",
                        cardColor: "card__bg-gray",
                        informationTypes: [{ name: "test", icon: "bell" }],
                        thumbnail: {
                            url: "/test",
                            width: 1,
                            height: 1,
                        },
                    }}
                    cardType="storylineCard"
                />,
            )
        })

        it("renders a label", () => {
            const label = screen.getByText("test")
            expect(label).toBeInTheDocument()
        })

        it("renders an image", () => {
            const media = screen.getByRole("img")
            expect(media).toBeInTheDocument()
        })

        it("renders a link", () => {
            const link = screen.getByRole("link")
            expect(link).toBeInTheDocument()
        })
    })
})
