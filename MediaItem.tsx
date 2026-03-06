"use client"

import Image from "next/image"

export default function MediaItem({ url }: { url: string }) {

    const videoExtensions = [".mp4", ".webm", ".mov", ".m4v"]

    const isVideo = videoExtensions.some(ext =>
        url.toLowerCase().includes(ext)
    )

    if (isVideo) {
        return (

            <video
                src={url}
                controls
                muted
                playsInline
                preload="metadata"
                className="w-full rounded-lg object-cover"
            />

        )
    }

    return (

        <Image
            src={url}
            alt=""
            width={800}
            height={800}
            loading="lazy"
            className="w-full h-auto rounded-lg object-cover"
        />

    )

}