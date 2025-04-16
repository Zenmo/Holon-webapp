import React, { useState, useEffect } from "react"
import ReactPlayer from "react-player/lazy"
import { StaticImage } from "../ImageSelector/types"

interface Props {
    media: MediaDetails
    alt: string
    caption?: string
}

type MediaDetails = Array<{
    type: "video"
    id: string
    value: string
} | {
    type: "image"
    value: StaticImage
}>

export default function MediaContent({ media, alt, caption }: Props) {
    const [hasWindow, setHasWindow] = useState(false)

    // UseEffect used for Hydration Error fix. Keep it
    useEffect(() => {
        if (typeof window !== "undefined") {
            setHasWindow(true)
        }
    }, [])
    if (!hasWindow) {
        // Returns null on first render, so the client and server match
        return null
    }

    function showMedia(mediaDetail: MediaDetails[0]) {
        switch (mediaDetail.type) {
            case "video":
                return mediaDetail.value && hasWindow ?
                        <ReactPlayer
                            width="100%"
                            height="440px"
                            key={mediaDetail.id}
                            url={mediaDetail.value}
                            controls={true}
                            data-testid="video-player"
                        />
                    :   null
            case "image":
                return mediaDetail.value ?
                        /* eslint-disable @next/next/no-img-element */
                        <img
                            src={mediaDetail.value.img.src}
                            alt={alt}
                            className="image"
                            width="1600"
                            height="auto"
                        />
                    :   ""
            default:
                return null
        }
    }

    if (caption) {
        return (
            <div style={{
                display: "flex",
                flexDirection: "column",
            }}>
                {showMedia(media[0])}
                <p style={{
                    fontSize: ".9rem",
                    textAlign: "center",
                }}>{caption}</p>
            </div>
        )
    } else {
        return showMedia(media[0])
    }
}
