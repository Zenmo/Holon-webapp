export type StoryLineItem = {
    id: number
    title: string
    description: string
    cardColor: string
    slug: string
    role?: [
        {
            name: string
        },
    ]
    informationTypes?: [
        {
            name: string
            icon: string
        },
    ]
    sector: string
    relativeUrl: string
    thumbnail?: {
        url: string
        width: number
        height: number
    }
}
