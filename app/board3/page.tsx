// "use client"

// import { useEffect, useState } from "react"
// import Image from "next/image"
// import Link from "next/link"
// import { createClient } from "@/lib/supabase/client"

// export default function Board3() {

//     const supabase = createClient()

//     const [albums, setAlbums] = useState<any[]>([])
//     const [loading, setLoading] = useState(true)

//     useEffect(() => {
//         loadAlbums()
//     }, [])

//     const loadAlbums = async () => {

//         try {

//             // 1️⃣ 모든 태그 가져오기
//             const { data: tags } = await supabase
//                 .from("tags")
//                 .select("*")

//             if (!tags) {
//                 setAlbums([])
//                 setLoading(false)
//                 return
//             }

//             const result: any[] = []

//             for (const tag of tags) {

//                 // 2️⃣ 태그에 연결된 이미지 id
//                 const { data: imageTags } = await supabase
//                     .from("image_tags")
//                     .select("image_id")
//                     .eq("tag_id", tag.id)

//                 if (!imageTags || imageTags.length === 0) {
//                     continue
//                 }

//                 const ids = imageTags.map(i => i.image_id)

//                 // 3️⃣ 대표 이미지
//                 const { data: images } = await supabase
//                     .from("images")
//                     .select("*")
//                     .in("id", ids)
//                     .order("created_at", { ascending: false })
//                     .limit(1)

//                 if (!images || images.length === 0) {
//                     continue
//                 }

//                 result.push({
//                     tag: tag.tag_text,
//                     cover: images[0].image_url,
//                     count: ids.length
//                 })

//             }

//             setAlbums(result)
//             setLoading(false)

//         } catch (err) {

//             console.log(err)
//             setLoading(false)

//         }

//     }

//     if (loading) {
//         return <div className="p-8">loading...</div>
//     }

//     return (

//         <div className="p-8 space-y-6">

//             <h1 className="text-2xl font-bold">
//                 Tag Albums
//             </h1>

//             <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">

//                 {albums.map(album => (

//                     <Link key={album.tag} href={`/board3/${album.tag}`}>

//                         <div className="relative cursor-pointer">

//                             <Image
//                                 src={album.cover}
//                                 alt=""
//                                 width={400}
//                                 height={400}
//                                 className="w-full h-[200px] object-cover rounded-lg"
//                             />

//                             <div className="absolute bottom-2 left-2 bg-black/70 text-white text-sm px-2 py-1 rounded">

//                                 #{album.tag} ({album.count})

//                             </div>

//                         </div>

//                     </Link>

//                 ))}

//             </div>

//         </div>

//     )

// }


// "use client"

// import { useEffect, useState } from "react"
// import Image from "next/image"
// import Link from "next/link"
// import { createClient } from "@/lib/supabase/client"

// export default function Board3() {

//     const supabase = createClient()

//     const [albums, setAlbums] = useState([])

//     useEffect(() => {
//         loadAlbums()
//     }, [])

//     const loadAlbums = async () => {

//         const { data } = await supabase
//             .from("image_tags")
//             .select(`
//     tag_id,
//     tags(tag_text),
//     images(image_url)
//   `)
//             .order("tag_id")
//             .range(0, 2000)

//         const map = new Map()

//         data?.forEach((row: any) => {

//             const tag = row.tags?.tag_text
//             const img = row.images?.image_url

//             if (!tag || !img) return

//             if (!map.has(tag)) {
//                 map.set(tag, {
//                     tag,
//                     cover: img,
//                     count: 1
//                 })
//             } else {
//                 map.get(tag).count++
//             }

//         })

//         setAlbums(Array.from(map.values()))

//     }

//     return (

//         <div className="p-8">

//             <h1 className="text-2xl font-bold mb-6">
//                 Tag Albums
//             </h1>

//             <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">

//                 {albums.map((album: any) => (
//                     <Link key={album.tag} href={`/board3/${album.tag}`}>

//                         <div className="relative">

//                             <Image
//                                 src={album.cover}
//                                 alt=""
//                                 width={400}
//                                 height={400}
//                                 className="w-full h-[200px] object-cover rounded"
//                             />

//                             <div className="absolute bottom-2 left-2 bg-black/70 text-white text-sm px-2 py-1 rounded">

//                                 #{album.tag} ({album.count})

//                             </div>

//                         </div>

//                     </Link>
//                 ))}

//             </div>

//         </div>

//     )

// }


"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
export const dynamic = "force-dynamic"

export default function Board3() {

    const supabase = createClient()


    // const [supabase, setSupabase] = useState<any>(null)

    // useEffect(() => {
    //     setSupabase(createClient())
    // }, [])

    // if (!supabase) return null

    const [albums, setAlbums] = useState([])

    useEffect(() => {
        loadAlbums()
    }, [])

    const loadAlbums = async () => {

        // const { data } = await supabase
        //     .from("tag_albums")
        //     .select("*")

        // setAlbums(data || [])
        const { data } = await supabase
            .from("tag_albums")
            .select("*")

        const sorted = (data || []).sort((a: any, b: any) =>
            a.tag_text.localeCompare(b.tag_text, "ko")
        )

        setAlbums(sorted)        

    }

    return (

        <div className="p-8">

            <h1 className="text-2xl font-bold mb-6">
                Tag Albums
            </h1>

            {/* <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">

                {albums.map((album: any) => (

                    <Link key={album.tag_id} href={`/board3/${album.tag_text}`}>

                        <div className="relative">

                            <Image
                                src={album.cover_image}
                                alt=""
                                width={400}
                                height={400}
                                className="w-full h-[200px] object-cover rounded"
                            />

                            <div className="absolute bottom-2 left-2 bg-black/70 text-white text-sm px-2 py-1 rounded">

                                #{album.tag_text} ({album.image_count})

                            </div>

                        </div>

                    </Link>

                ))}

            </div> */}

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-2">

                {albums.map((album: any) => (

                    <Link key={album.tag_id} href={`/board3/${album.tag_text}`}>

                        {/* <div className="relative aspect-square overflow-hidden rounded"> */}

                        <div className="relative aspect-square overflow-hidden rounded group">

                            {/* <Image
                                src={album.cover_image}
                                alt=""
                                fill
                                className="object-cover"
                            /> */}

                            <Image
                                src={album.cover_image}
                                alt=""
                                fill
                                className="object-cover group-hover:scale-110 transition"
                            />

                            <div className="absolute bottom-1 left-1 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">

                                #{album.tag_text} ({album.image_count})

                            </div>

                        </div>

                    </Link>

                ))}

            </div>

        </div>

    )

}