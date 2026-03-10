"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Masonry from "react-masonry-css"
import { useParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import MediaItem from "@/components/MediaItem"
export const dynamic = "force-dynamic"

export default function TagPage() {

    const supabase = createClient()

    const setCover = async (imageId: string) => {

        const { error } = await supabase
            .from("tags")
            .update({
                cover_image_id: imageId
            })
            .eq("tag_text", tag)

        if (error) {
            console.log(error)
            alert("대표이미지 설정 실패")
            return
        }

        alert("대표이미지 설정 완료")
    }


    // const [supabase, setSupabase] = useState<any>(null)

    // useEffect(() => {
    //     setSupabase(createClient())
    // }, [])

    // if (!supabase) return null

    const params = useParams()
    const tag = decodeURIComponent((params.tag as string) || "")
    const [images, setImages] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadImages()
    }, [tag])

    const loadImages = async () => {

        const { data: tagRow } = await supabase
            .from("tags")
            .select("id")
            .eq("tag_text", tag)
            .single()

        if (!tagRow) {
            setImages([])
            setLoading(false)
            return
        }

        const { data: imageTags } = await supabase
            .from("image_tags")
            .select("image_id")
            .eq("tag_id", tagRow.id)

        const ids = (imageTags || []).map(i => i.image_id)

        if (ids.length === 0) {
            setImages([])
            setLoading(false)
            return
        }

        const { data: imgs } = await supabase
            .from("images")
            .select("*")
            .in("id", ids)
            .order("created_at", { ascending: false })

        setImages(imgs || [])
        setLoading(false)
    }
    // const loadImages = async () => {

    //     try {

    //         // 1️⃣ tag_id 찾기
    //         const { data: tagRow } = await supabase
    //             .from("tags")
    //             .select("id")
    //             .eq("tag_text", tag)
    //             .single()

    //         if (!tagRow) {
    //             setImages([])
    //             setLoading(false)
    //             return
    //         }

    //         // 2️⃣ image_tags
    //         const { data: imageTags } = await supabase
    //             .from("image_tags")
    //             .select("image_id")
    //             .eq("tag_id", tagRow.id)

    //         if (!imageTags || imageTags.length === 0) {
    //             setImages([])
    //             setLoading(false)
    //             return
    //         }

    //         const ids = imageTags.map(i => i.image_id)

    //         // 3️⃣ images
    //         const { data: imgs } = await supabase
    //             .from("images")
    //             .select("*")
    //             .in("id", ids)
    //             .order("created_at", { ascending: false })

    //         setImages(imgs || [])
    //         setLoading(false)

    //     } catch (err) {

    //         console.log(err)
    //         setLoading(false)

    //     }

    // }

    const breakpointColumns = {
        default: 4,
        1200: 3,
        800: 2,
        500: 1
    }

    if (loading) {
        return <div className="p-8">loading...</div>
    }

    return (

        // <div className="p-8 space-y-6">

        //     <h1 className="text-2xl font-bold">

        //         #{tag}

        //     </h1>

        //     <Masonry
        //         breakpointCols={breakpointColumns}
        //         className="flex gap-4"
        //         columnClassName="space-y-4"
        //     >

        //         {
        //             images.map((img) => {
        //                 return (
        //                     <MediaItem
        //                         key={img.id}
        //                         url={img.image_url}
        //                     />
        //                 )
        //             })
        //         }

        //     </Masonry>

        // </div>

        <div className="p-8 space-y-6">

            <h1 className="text-2xl font-bold">
                #{tag}
            </h1>

            <Masonry
                breakpointCols={breakpointColumns}
                className="flex gap-4"
                columnClassName="space-y-4"
            >

                {images.map((img) => {

                    return (

                        <div key={img.id} className="relative group">

                            <MediaItem
                                url={img.image_url}
                            />

                            <button
                                onClick={() => setCover(img.id)}
                                className="
                        absolute top-2 right-2
                        bg-black/70 text-white text-xs
                        px-2 py-1 rounded
                        opacity-0 group-hover:opacity-100
                        transition
                        "
                            >
                                앨범커버로 설정
                            </button>

                        </div>

                    )

                })}

            </Masonry>

        </div>
    )

}